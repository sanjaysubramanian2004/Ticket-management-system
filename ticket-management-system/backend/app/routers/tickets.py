from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.auth.security import get_current_user
from app.database.session import get_db
from app.models.models import Role, Ticket, TicketStatus, User
from app.schemas.schemas import TicketCreate, TicketOut, TicketUpdate
from app.services.ticket_service import get_ticket_or_error, to_out

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.post("", response_model=TicketOut, status_code=201)
def create_ticket(data: TicketCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ticket = Ticket(title=data.title, description=data.description, status=TicketStatus.OPEN, user_id=user.id)
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return to_out(ticket)


@router.get("", response_model=list[TicketOut])
def list_tickets(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = select(Ticket).options(joinedload(Ticket.owner)).order_by(Ticket.id.desc())
    if user.role != Role.ADMIN:
        q = q.where(Ticket.user_id == user.id)
    return [to_out(t) for t in db.scalars(q).all()]


@router.get("/{ticket_id}", response_model=TicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return to_out(get_ticket_or_error(db, ticket_id, user))


@router.put("/{ticket_id}", response_model=TicketOut)
def update_ticket(ticket_id: int, data: TicketUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ticket = get_ticket_or_error(db, ticket_id, user)
    ticket.title = data.title
    ticket.description = data.description
    if data.status is not None:
        ticket.status = data.status
    db.commit()
    db.refresh(ticket)
    return to_out(ticket)


@router.delete("/{ticket_id}", status_code=204)
def delete_ticket(ticket_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    ticket = get_ticket_or_error(db, ticket_id, user)
    db.delete(ticket)
    db.commit()
