from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from app import config
from app.auth.security import hash_password
from app.database.session import Base, SessionLocal, engine
from app.models.models import Role, User
from app.routers import ai, auth, tickets, users


def seed_admin():
    with SessionLocal() as db:
        if not db.scalar(select(User).where(User.email == config.ADMIN_EMAIL.lower())):
            db.add(User(name=config.ADMIN_NAME, email=config.ADMIN_EMAIL.lower(),
                        password_hash=hash_password(config.ADMIN_PASSWORD), role=Role.ADMIN))
            db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_admin()
    yield


app = FastAPI(title="Ticket Management System", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=config.CORS_ORIGINS, allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router)
app.include_router(tickets.router)
app.include_router(users.router)
app.include_router(ai.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
