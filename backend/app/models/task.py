# app/models/task.py
import uuid
from sqlalchemy import Column, String, DateTime, Enum, ForeignKey
from app.core.db import Base
from app.schemas.task import Status

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey('users.id'))
    title = Column(String, nullable=False)
    due = Column(DateTime)
    rrule = Column(String)
    status = Column(Enum(Status), default=Status.pending)