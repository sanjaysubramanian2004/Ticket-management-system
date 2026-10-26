from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.models import Role, Ticket, User


def to_out(t: Ticket) -> dict:
    return {
        "id": t.id, "title": t.title, "description": t.description, "status": t.status,
        "user_id": t.user_id, "created_by": t.owner.name,
        "created_at": t.created_at, "updated_at": t.updated_at,
    }


def get_ticket_or_error(db: Session, ticket_id: int, user: User) -> Ticket:
    ticket = db.get(Ticket, ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if user.role != Role.ADMIN and ticket.user_id != user.id:
        raise HTTPException(status_code=403, detail="You do not have access to this ticket")
    return ticket
