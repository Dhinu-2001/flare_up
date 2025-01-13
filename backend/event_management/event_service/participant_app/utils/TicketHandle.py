import os
import zipfile
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from segno import make
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from participant_app.models import TicketDetails
import cloudinary.uploader

FONT_DIR = "/usr/share/fonts/truetype/custom"

def upload_to_cloudinary(file_buffer, id, folder="tickets"):
    """Uploads the ZIP file to Cloudinary."""
    try:
        response = cloudinary.uploader.upload(
            file_buffer,
            folder=folder,
            resource_type="raw",
            public_id=f"tickets_{id}",
            use_filename=True,
            format="zip"
        )
        print(f"Cloudinary upload response: {response}")
        return response
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        raise

@sync_to_async
def generate_ticket_pdf(event_obj, ticket_number, user_id, output_file="ticket.pdf"):
    """Generates a ticket PDF for the given event and ticket details."""
    try:
        print(f"Generating ticket for Event: {event_obj.title}, Ticket Number: {ticket_number}, User ID: {user_id}")
        
        # Ticket canvas
        ticket_width, ticket_height = 1200, 400
        ticket = Image.new('RGB', (ticket_width, ticket_height), color=(22, 24, 29))
        draw = ImageDraw.Draw(ticket)

        # Load fonts
        try:
            font_title = ImageFont.truetype(os.path.join(FONT_DIR, "ARIAL.TTF"), 50)
            font_subtitle = ImageFont.truetype(os.path.join(FONT_DIR, "ARIAL.TTF"), 40)
            font_text = ImageFont.truetype(os.path.join(FONT_DIR, "ARIAL.TTF"), 30)
        except Exception as e:
            print(f"Font loading failed: {e}")
            raise
        
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

        # Ticket layout
        draw.text((240, 40), event_obj.title, font=font_title, fill=(255, 255, 255))
        draw.text((240, 120), event_obj.category.name, font=font_subtitle, fill=(255, 255, 255))
        draw.text((240, 240), f"Date: {event_obj.start_date_time}", font=font_text, fill=(200, 200, 200))
        
        # QR Code
        qr = make(f"Event: {event_obj.title}\nTicket Number: {ticket_number}\nUser ID: {user_id}")
        qr_image_path = "qr_code.png"
        qr.save(qr_image_path, scale=5)

        # Add QR code to ticket
        qr_image = Image.open(qr_image_path)
        ticket.paste(qr_image, (800, 120))
        qr_image.close()
        os.remove(qr_image_path)

        # Save ticket
        ticket.save(output_file)
        print(f"Ticket saved: {output_file}")
        return output_file
    except Exception as e:
        print(f"Error in generating ticket PDF: {e}")
        raise

async def generate_tickets_zip(event_obj, user_id, event_ticket_name, ticket_quantity, ticket_registration_obj):
    """Generates tickets, compresses them into a ZIP file, and uploads to Cloudinary."""
    try:
        # Initialize in-memory ZIP file
        zip_buffer = BytesIO()
        current_participants_count = event_obj.current_participants_count
        ticket_range = current_participants_count + ticket_quantity

        print(f"Generating tickets for range: {current_participants_count} to {ticket_range}")

        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
            for number in range(current_participants_count, ticket_range):
                ticket_number = f"{event_ticket_name}_{event_obj.id}_00{number}"
                output_file = f"{ticket_number}.pdf"

                try:
                    output_file = await generate_ticket_pdf(event_obj, ticket_number, user_id, output_file)
                    zipf.write(output_file, os.path.basename(output_file))
                    os.remove(output_file)
                except Exception as e:
                    print(f"Error processing ticket {ticket_number}: {e}")
                    continue

                # Update database and event count
                await database_sync_to_async(TicketDetails.objects.create)(
                    ticket_registration_id=ticket_registration_obj,
                    ticket_number=ticket_number
                )
                event_obj.current_participants_count += 1
                await database_sync_to_async(event_obj.save)()

        zip_buffer.seek(0)

        # Upload ZIP to Cloudinary
        response = upload_to_cloudinary(zip_buffer, ticket_registration_obj.id)
        return response
    except Exception as e:
        print(f"Error in generating tickets ZIP: {e}")
        raise
