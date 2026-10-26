# Ticket Management System

A full-stack support ticket management application built as a Full-Stack Developer Technical Assignment. Users can manage their own support tickets, while administrators can manage tickets across the application.

## Technology Stack

**Frontend**
- React
- TypeScript (TSX)
- Material UI (MUI)
- React Router
- Vite

**Backend**
- Python
- FastAPI
- SQLAlchemy

**Database**
- PostgreSQL

**Authentication**
- JWT
- PyJWT
- bcrypt password hashing

## Prerequisites

Install the following before running the project:

- Python 3.10 or a compatible version
- Node.js and npm
- PostgreSQL
- Git

## Project Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

Replace the placeholders with your actual GitHub repository URL and project folder name.

### 2. Create the database

Create a PostgreSQL database named `ticket_db` using pgAdmin or your PostgreSQL command-line tools.

Ensure the database credentials in your backend environment configuration match your local PostgreSQL setup.

### 3. Configure environment variables

Create `backend/.env` using the environment variables required by the backend.

Example configuration:

```env
DATABASE_URL=
JWT_SECRET_KEY=
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=
```

Fill in the values locally. Use a strong, unique JWT secret and a strong administrator password.

**Security:** Never commit `.env` files, database passwords, JWT secrets or real credentials to GitHub. Use `.env.example` to document variable names without exposing secrets.

### 4. Run the backend

Open a terminal in the project root:

```powershell
cd backend
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies and start FastAPI:

```powershell
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

API documentation, when the backend is running:

http://localhost:8000/docs

Keep this terminal open while using the application.

### 5. Run the frontend

Open a second terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL shown by Vite, normally:

http://localhost:5173

If the frontend requires an API URL environment variable, configure it using the variable name documented in the frontend environment example, then restart the Vite development server.

## Application Features

The assignment requires the following capabilities:

- User registration and login
- JWT-based authentication
- User and administrator roles
- Ticket creation, listing, viewing, editing and deletion
- Ticket statuses: `OPEN`, `IN_PROGRESS` and `CLOSED`
- Users restricted to their own tickets
- Administrators able to manage all tickets
- Administrator access to the user list
- Frontend and backend input validation
- PostgreSQL storage

Verify each feature in the implementation before treating it as complete.

## API Endpoints

The assignment specifies these minimum endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets` | List tickets allowed for the current user |
| GET | `/api/tickets/{id}` | Retrieve ticket details |
| PUT | `/api/tickets/{id}` | Update a ticket |
| DELETE | `/api/tickets/{id}` | Delete a ticket |
| GET | `/api/users` | List users for administrators |

The actual implementation determines which endpoints are available. Check the live API documentation at `/docs` before relying on this list.

## Database

The application uses PostgreSQL. The current local database includes `users` and `tickets` tables.

Ticket records should contain a title, description, status, creator reference, creation timestamp and update timestamp. User records should include a unique email, role and securely hashed password.

## Project Structure

```text
ticket-management-system/
├── backend/
│   ├── app/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── .gitignore
├── .env.example
└── README.md
```

This is a simplified overview. Update it to reflect the actual files in the repository.

## Testing

Before submission, verify:

- Registration and login work.
- Passwords are stored as hashes.
- Authenticated requests use a valid JWT.
- Users cannot access or modify another user's tickets.
- Administrators can manage all tickets and view users.
- Ticket validation and status values work correctly.
- The frontend displays useful errors for failed requests.

## Limitations

- The application is designed for local development and demonstration.
- Automated tests are not included, if none have been implemented.
- Production deployment and additional security hardening are outside the current scope.