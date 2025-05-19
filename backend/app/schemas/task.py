# app/schemas/task.py
from datetime import datetime
from enum import Enum
from pydantic import BaseModel

class Status(str, Enum):
    pending = 'pending'
    done = 'done'

class TaskBase(BaseModel):
    title: str
    start_date: datetime | None = None
    rrule: str | None = None

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: str
    status: Status

class TaskUpdate(BaseModel):
    title: str | None = None
    start_date: datetime | None = None
    status: Status | None = None