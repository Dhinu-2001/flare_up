FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

# Install necessary packages
RUN apt-get update && apt-get install -y \
    libpq-dev gcc fontconfig

# Create the directory for fonts inside the container
RUN mkdir -p /usr/share/fonts/truetype/custom
# RUN echo "Checking build context..."
# RUN ls -l ./resources/fonts/

# Copy font files from resources/fonts to the container
COPY ARIAL.TTF /usr/share/fonts/truetype/custom/
COPY ARIALBD.TTF /usr/share/fonts/truetype/custom/

# Refresh font cache
RUN ls -l /usr/share/fonts/truetype/custom/
RUN fc-cache -f -v
RUN ls -l /usr/share/fonts/truetype/custom/

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 8082

# Run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8082"]
