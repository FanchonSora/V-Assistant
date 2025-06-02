# app/services/task_service.py
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import select, func, extract
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.task import Task
from app.schemas.task import (TaskCreate, TaskRead, TaskUpdate, Status)
from app.services.scheduler_service import schedule_task_reminder

from datetime import date
from typing import List
from app.services.notification_service import send_email  

class TaskService:
    @staticmethod
    async def create(data: TaskCreate, user, session: AsyncSession) -> TaskRead:
        task = Task(
            owner_id=user.id,
            title=data.title,
            task_date=data.task_date,
            task_time=data.task_time,
            rrule=data.rrule,
            status=Status.pending
        )
        session.add(task)
        await session.commit()
        await session.refresh(task)
        if task.task_date and task.task_time:
            await schedule_task_reminder(task)
        # Prepare a due date string if available.
        # due_str = (
        #     f"{task.task_time.strftime('%H:%M')} {task.task_date.strftime('%d/%m/%Y')}"
        #     if task.task_date and task.task_time else "no due date"
        # )
        # Send a notification email to the task owner using the user's email.
        # email_body = f'New task created: "{task.title}" – due {due_str}.'
        # await send_email(
        #     recipient=user.email, 
        #     subject="New Task Notification",
        #     body=email_body
        # )
        return TaskRead.model_validate(task)

    @staticmethod
    async def list(date: str | None, user, session) -> List[TaskRead]:
        stmt = select(Task).where(Task.owner_id == user.id)
        if date:
            try:
                # If date parsing succeeds, filter by date.
                target = datetime.fromisoformat(date)
                stmt = stmt.where(Task.task_date == target.date())
            except ValueError:
                # If parsing fails, ignore the date filter.
                pass
        rows = await session.scalars(stmt)
        return [TaskRead.model_validate(t) for t in rows]

    @staticmethod
    async def update(task_id: str, data: TaskUpdate,
                     user,
                     session: AsyncSession
                     ) -> TaskRead:
        task = await session.get(Task, task_id)
        if not task or task.owner_id != user.id:
            raise HTTPException(status_code=404, detail="Task not found")

        for k, v in data.model_dump(exclude_unset=True).items():
            setattr(task, k, v)
        await session.commit()
        await session.refresh(task)

        return TaskRead.model_validate(task)

    @staticmethod
    async def delete(task_id: str,
                     user,
                     session: AsyncSession
                     ) -> None:
        task = await session.get(Task, task_id)
        if not task or task.owner_id != user.id:
            raise HTTPException(status_code=404, detail="Task not found")
        await session.delete(task)
        await session.commit()
    @staticmethod
    async def get_by_ref(ref: str,
                        user,
                        session: AsyncSession,
                        task_date=None,
                        task_time=None
                        ) -> Task | None:
        # Thử theo id trước
        task = await session.get(Task, ref)
        if task and task.owner_id == user.id:
            return task
        # Nếu không phải id hợp lệ, tìm theo tiêu đề
        stmt = select(Task).where(Task.owner_id == user.id,
                                func.lower(Task.title) == ref.lower())
        if task_date:
            stmt = stmt.where(Task.task_date == task_date)
        if task_time:
            truncated_time = task_time.replace(second=0, microsecond=0)
            stmt = stmt.where(
                extract('hour', Task.task_time) == truncated_time.hour,
                extract('minute', Task.task_time) == truncated_time.minute
            )
        row = await session.scalars(stmt)
        return row.first()
    @staticmethod
    async def list_by_range(start_date: str,
                            end_date: str,
                            user,
                            session: AsyncSession
                            ) -> List[TaskRead]:
        try:
            start = date.fromisoformat(start_date)
            end = date.fromisoformat(end_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format, expected YYYY-MM-DD")

        stmt = select(Task).where(
            Task.owner_id == user.id,
            Task.task_date >= start,
            Task.task_date <= end
        )
        rows = await session.scalars(stmt)
        return [TaskRead.model_validate(t) for t in rows]
    
    @staticmethod
    async def list_by_title(title, user, session, task_date=None, task_time=None):
        stmt = select(Task).where(
            Task.owner_id == user.id,
            func.lower(Task.title) == func.lower(title)
        )
        if task_date:
            stmt = stmt.where(Task.task_date == task_date)
        if task_time:
            stmt = stmt.where(Task.task_time == task_time)
        rows = await session.scalars(stmt)
        return list(rows)