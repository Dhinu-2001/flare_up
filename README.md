# Event Hosting & Ticket Booking Platform

This project enables users to host events, which are displayed on a world map. Others can easily find nearby or desired events and book tickets. Additionally, the website provides analytics tools for both event hosts and participants to track their event activities.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS, ShadCN UI
- **Backend:** Python Django, PostgreSQL
- **Authentication:** JWT, Google OAuth
- **Architecture:** Microservices

## Features
- User authentication (register, login, logout) with secure access control
- Google OAuth integration
- Event management: Create, update, and delete events of various categories (music, education, e-gaming, sports, etc.)
- Display a list of events with pagination
- Interactive world map to locate and book events
- Chat functionality for users to inquire about events
- Analytics tools for event hosts and participants

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js (for frontend)
- Python 3 & Django
- PostgreSQL (for database)
- Docker (optional, for containerized setup)

### Backend Setup (Django & PostgreSQL)
1. Clone the repository:
   ```sh
   git clone https://github.com/Dhinu-2001/flare_up.git
   cd flare_up/backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Configure database settings in `settings.py`:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'yourdbname',
           'USER': 'yourdbuser',
           'PASSWORD': 'yourdbpassword',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```
5. Apply migrations and start the server:
   ```sh
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup (React.js)
1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React development server:
   ```sh
   npm run dev
   ```

### Running with Docker (Optional)
1. Ensure Docker is installed and running.
2. Use the provided `docker-compose.yml` file to spin up the services:
   ```sh
   docker-compose up --build
   ```

### Environment Variables
Create a `.env` file in `frontend/` and for each services directories and specify necessary environment variables:

#### Backend `.env`
```
SECRET_KEY=your_django_secret_key
DEBUG=True
ALLOWED_HOSTS=localhost
DATABASE_URL=postgres://yourdbuser:yourdbpassword@localhost:5432/yourdbname
JWT_SECRET=your_jwt_secret
USER_SVC_ADDRESS=localhost:****
EVENT_SVC_ADDRESS=localhost:****
REGISTRATION_SVC_ADDRESS=localhost:****
NOTIFICATION_SVC_ADDRESS=localhost:****
```

#### Frontend `.env`
```
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
```

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request.


