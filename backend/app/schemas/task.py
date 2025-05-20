# app/schemas/task.py
from datetime import date, time
from enum import Enum
from pydantic import BaseModel

class Status(str, Enum):
    pending = 'pending'
    done = 'done'

class TaskBase(BaseModel):
    title: str
    task_date: date | None = None
    task_time: time | None = None
    rrule: str | None = None

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: str
    status: Status

    model_config = {
        "from_attributes": True
    }

class TaskUpdate(BaseModel):
    title: str | None = None
    task_date: date | None = None
    task_time: time | None = None
    status: Status | None = None