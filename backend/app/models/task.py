# app/models/task.py
import uuid
from sqlalchemy import Column, String, Date, Time, Enum, ForeignKey, Float
from app.core.db import Base
from app.schemas.task import Status

class Task(Base):
    __tablename__ = 'tasks'

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), ForeignKey('users.id'))
    title = Column(String(255), nullable=False)
    task_date = Column(Date)
    task_time = Column(Time)
    rrule = Column(String(255))
    status = Column(Enum(Status), default=Status.pending)