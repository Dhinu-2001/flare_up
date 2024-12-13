from fpdf import FPDF
import os
import cloudinary.uploader
from asgiref.sync import sync_to_async
from PIL import Image, ImageDraw, ImageFont
import zipfile
from io import BytesIO
from channels.db import database_sync_to_async
from participant_app.models import TicketDetails

def upload_to_cloudinary(file_path, id, folder="tickets"):
    
    response = cloudinary.uploader.upload(file_path, folder=folder, resource_type="raw",public_id=f"tickets_{id}", use_filename=True,
        format="zip")
   
    print('Cloudinary response',response)
    return response['secure_url']

@sync_to_async
class TicketPDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, 'Event Ticket', border=0, ln=1, align='C')

@sync_to_async
def generate_ticket_pdf(event_obj, ticket_number, user_id, output_file="ticket.pdf"):
    ticket_width = 1200
    ticket_height = 400
    ticket = Image.new('RGB', (ticket_width, ticket_height), color=(22, 24, 29))

    draw = ImageDraw.Draw(ticket)

    # Load fonts (ensure you have these fonts in your working directory or update the path)
    font_title = ImageFont.truetype("arialbd.ttf", 50)  # Bold font for title
    font_subtitle = ImageFont.truetype("arial.ttf", 40)
    font_text = ImageFont.truetype("arial.ttf", 30)
    font_small = ImageFont.truetype("arial.ttf", 25)

    # Left section (Ticket Number)
    draw.rectangle([(0, 0), (200, ticket_height)], fill=(30, 32, 40))
    
    temp_image = Image.new('RGBA', (ticket_height, ticket_width), (255, 0, 0, 0))  # Transparent background
    temp_draw = ImageDraw.Draw(temp_image)

    # Add ticket number to the temporary image
    temp_draw.text((150, 0), "Ticket Number:", font=font_text, fill=(255, 255, 255))
    temp_draw.text((150, 70), ticket_number, font=font_text, fill=(255, 255, 255))

    # Rotate the temporary image
    rotated_temp_image = temp_image.rotate(90, expand=True)

    ticket.paste(rotated_temp_image, (50, 120), rotated_temp_image)


    # Center section (Event Details)
    draw.text((240, 40), event_obj.title, font=font_title, fill=(255, 255, 255))
    draw.text((240, 120), event_obj.category.name, font=font_subtitle, fill=(255, 255, 255))
    # draw.text((240, 180), event_obj.address_line_1, font=font_text, fill=(200, 200, 200))
    draw.text((240, 240), f"Date: {event_obj.start_date_time}", font=font_text, fill=(200, 200, 200))
    draw.text((240, 300), f"Time: time", font=font_text, fill=(200, 200, 200))
    
    # Add QR Code
    from segno import make
    qr = make(f"Title: {event_obj.title}\nTicket Number: {ticket_number}\nUser ID: {user_id}")
    qr_image_path  = "qr_code.png"
    qr.save(qr_image_path , scale=5)

    # Open the QR code image as an Image object
    qr_image = Image.open(qr_image_path )

    # Paste the QR code image
    ticket.paste(qr_image, (800, 120))
    # draw.text((800, 400), "Scan Here!", font=font_small, fill=(255, 255, 255))
    qr_image.close()  # Close the file before removing it
    os.remove(qr_image_path )  # Clean up
    
    ticket.save(output_file)
    
    print('ticket_url',output_file)
    return output_file
    


async def generate_tickets_zip(event_obj, user_id, event_ticket_name, ticket_quantity, ticket_registration_obj):
    # Create an in-memory ZIP file
    zip_buffer = BytesIO()
    
    # CREATE TICKET NUMBER RANGE
    current_participants_count = event_obj.current_participants_count
    ticket_range = current_participants_count + ticket_quantity 
    print('BEFORE TICET NUMBER OBJ')
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        for number in range(current_participants_count, ticket_range):
            ticket_number = f"{event_ticket_name}_{event_obj.id}_00{number}"
            output_file = f"{ticket_number}.pdf"
            
            output_file = await generate_ticket_pdf(event_obj, ticket_number, user_id, output_file)
            zipf.write(output_file, os.path.basename(output_file))
            os.remove(output_file)  # Clean up individual ticket files
            
            await database_sync_to_async(TicketDetails.objects.create)(ticket_registration_id=ticket_registration_obj, ticket_number=ticket_number)
            event_obj.current_participants_count += 1
            await database_sync_to_async(event_obj.save)()

    zip_buffer.seek(0)
    # Upload ZIP file to Cloudinary
    zip_url = upload_to_cloudinary(zip_buffer, ticket_registration_obj.id)

    return zip_url