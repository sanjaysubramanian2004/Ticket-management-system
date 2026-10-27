# Ticket Management System

A full-stack support ticket management application developed as part of a Full-Stack Developer Technical Assignment. Users can manage their own support tickets, while administrators can manage tickets across the application and view registered users. An optional Groq AI assistant summarizes tickets, suggests priorities, and drafts replies.

## 1. Technology Stack

**Frontend**
- React 18
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
- JWT-based authentication using PyJWT
- bcrypt password hashing
- Role-based authorization

**AI Integration**
- Groq API for ticket summaries, priority suggestions, and suggested replies

## 2. Application Features

### User
- Register and log in.
- Create, view, edit, and delete their own support tickets.
- Track ticket status.
- Log out.

### Administrator
- View, create, edit, and delete tickets across the application.
- View ticket details.
- Access the registered users list.

### Ticket Management

Each ticket contains a title, description, status, creator reference, creation timestamp, and last-updated timestamp.

Supported statuses:
- `OPEN`
- `IN_PROGRESS`
- `CLOSED`

New tickets always start as `OPEN`. Regular users can access only their own tickets, while administrators can manage tickets across the application.

## 3. Prerequisites

| Tool | Version |
|---|---|
| Python | 3.10 or newer |
| Node.js and npm | Node.js 18 or newer |
| PostgreSQL | 13 or newer |
| Git | Required to clone the repository |

## 4. Project Setup

### Step 1: Get the project

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

Replace the placeholders with your actual repository URL and project directory name.

If you received the project as a ZIP file, extract it and open the extracted folder.

### Step 2: Create the PostgreSQL database

Create a database named `ticket_db` using pgAdmin or the PostgreSQL command line.

Using the command line:

```bash
psql -U postgres -c "CREATE DATABASE ticket_db;"
```

The backend creates tables automatically when it starts. If the project includes `database/schema.sql`, you can also run:

```bash
psql -U postgres -d ticket_db -f database/schema.sql
```

### Step 3: Configure environment variables

Copy `.env.example` to `backend/.env` and update the configuration.

On Windows PowerShell, if `.env.example` is in the project root:

```powershell
Copy-Item .env.example backend/.env
```

Example configuration:

```env
DATABASE_URL=postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/ticket_db
JWT_SECRET_KEY=PASTE_A_GENERATED_SECRET_HERE
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeThisAdmin@123

GROQ_API_KEY=
GROQ_MODEL=openai/gpt-oss-120b
```

Use the exact variable names expected by your backend configuration. Set `GROQ_API_KEY` if you want to use the AI assistant.

Generate a secure JWT secret with:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy the generated value into `JWT_SECRET_KEY`.

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET_KEY` | Secret used to sign JWT tokens |
| `JWT_ALGORITHM` | JWT signing algorithm; normally `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time |
| `CORS_ORIGINS` | Allowed frontend origins |
| `ADMIN_NAME` | Administrator display name |
| `ADMIN_EMAIL` | Administrator login email |
| `ADMIN_PASSWORD` | Administrator password used when creating the account |
| `GROQ_API_KEY` | Optional API key for AI features |
| `GROQ_MODEL` | Groq model used for AI requests |

**Security:** Keep real credentials and API keys in `backend/.env`. Never commit `.env` files or secrets to GitHub. Use `.env.example` for placeholder values.

Changing the administrator password in `.env` does not automatically update an administrator account that already exists in the database.

### Step 4: Run the backend

Open a terminal at the project root.

**Windows PowerShell**

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

If PowerShell blocks virtual environment activation, run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

Then activate the environment again.

**macOS / Linux**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

The backend is ready when the terminal indicates that application startup is complete.

- Backend API: `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

Keep the backend terminal running.

### Step 5: Run the frontend

Open a second terminal at the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown by Vite, normally:

`http://localhost:5173`

If the backend runs at a different address, configure the frontend API URL using the variable defined in `frontend/.env.example`, then restart the Vite server.

## 5. Test Login Credentials

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@example.com` | `ChangeThisAdmin@123` |
| Regular user | Register through the **Register** page | Your chosen password |

The administrator credentials must match the account configured in your running application. The administrator is created from the environment configuration when the account does not already exist.

Regular users can register through the application.

## 6. API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Authenticate and receive a JWT |
| GET | `/api/auth/me` | Authenticated | Get current user details |
| POST | `/api/tickets` | Authenticated | Create a ticket |
| GET | `/api/tickets` | Authenticated | List accessible tickets |
| GET | `/api/tickets/{ticket_id}` | Owner or admin | Get ticket details |
| PUT | `/api/tickets/{ticket_id}` | Owner or admin | Update a ticket |
| DELETE | `/api/tickets/{ticket_id}` | Owner or admin | Delete a ticket |
| GET | `/api/users` | Admin only | List registered users |
| POST | `/api/ai/tickets/{ticket_id}/assist` | Owner or admin | Generate AI assistance |
| GET | `/api/health` | Public | Check backend health |

Protected endpoints require a valid JWT access token in the request header:

```http
Authorization: Bearer <token>
```

Refer to `/docs` for the request and response schemas.

## 7. Database Design

The application uses PostgreSQL with SQLAlchemy models.

### Users table

- `id` G�� Primary key
- `name` G�� User's name
- `email` G�� Unique email address
- `password_hash` G�� Hashed password
- `role` G�� `USER` or `ADMIN`
- `created_at` G�� Account creation timestamp

### Tickets table

- `id` G�� Primary key
- `title` G�� Ticket title
- `description` G�� Ticket description
- `status` G�� `OPEN`, `IN_PROGRESS`, or `CLOSED`
- `user_id` G�� Foreign key referencing the ticket creator
- `created_at` G�� Creation timestamp
- `updated_at` G�� Last-updated timestamp

The relationship between users and tickets supports ticket ownership and access control.

## 8. AI-Assisted Ticket Support

The application integrates the Groq API to provide optional AI assistance.

On the Ticket Details page, use **Generate insights** to obtain:
- A short ticket summary
- A priority suggestion (`LOW`, `MEDIUM`, or `HIGH`)
- A suggested reply to the ticket author

### Configuration

1. Obtain an API key from [Groq Console](https://console.groq.com/keys).
2. Set `GROQ_API_KEY` in `backend/.env`.
3. Configure `GROQ_MODEL` if needed.
4. Restart the backend.

### How it works

- The frontend calls the application's backend AI endpoint.
- The backend sends the ticket title, status, and description to Groq.
- The API key remains on the backend and is not exposed to the browser.
- The AI response is validated before being displayed.
- AI service errors are handled with user-friendly messages.
- AI-generated suggestions are not stored in the database and should be reviewed before use.

The AI assistant requires a valid API key, an available model, and network connectivity. The core ticket management features can operate independently of the AI integration.

## 9. Authentication and Authorization

- Passwords are stored as bcrypt hashes.
- Login returns a JWT access token.
- Protected endpoints require valid authentication.
- Tokens must be valid and unexpired.
- Newly registered users receive the `USER` role.
- The administrator is configured through environment variables.
- Regular users cannot access or modify other users' tickets.
- Administrator-only endpoints enforce role-based access on the backend.
- CORS is configured using the allowed origins in the environment configuration.

## 10. Validation and Error Handling

- Required fields and supported ticket statuses are validated.
- Invalid email addresses and duplicate registrations are handled.
- Authentication failures and expired sessions are handled.
- Missing tickets and unauthorized access return appropriate errors.
- Database, network, and AI service failures are handled.
- The frontend displays loading indicators, success notifications, and readable error messages.

## 11. Project Structure

ticket-management-system/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── auth/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   ├── requirements.txt
│   └── requirements-dev.txt
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
├── database/
│   └── schema.sql
├── .gitignore
├── .env.example
└── README.md

This structure describes the expected organization; adjust it if your actual repository differs.


## 12. Troubleshooting

| Problem | Possible solution |
|---|---|
| Missing environment settings | Create `backend/.env` and configure required values |
| Invalid JWT secret | Generate a sufficiently long random secret |
| Database connection failure | Check PostgreSQL status, database name, port, username, and password |
| Frontend cannot reach backend | Confirm the backend is running and the API URL is correct |
| CORS error | Add the frontend origin to `CORS_ORIGINS` and restart the backend |
| AI assistant unavailable | Configure `GROQ_API_KEY` and restart the backend |
| AI model unavailable | Configure a supported Groq model |

## 13. Assumptions and Known Limitations

- New tickets always start with `OPEN` status.
- Users cannot register themselves as administrators.
- Database tables are created automatically at startup if the application uses SQLAlchemy `create_all`.
- The application is designed for local development and technical demonstration.
- Additional production hardening may be needed before public deployment.
