# app/services/task_service.py
from datetime import datetime

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.task import Task
from app.schemas.task import (TaskCreate, TaskRead, TaskUpdate, Status)
from app.core.db import get_session
from app.core.security import get_current_user
from app.services.scheduler_service import schedule_task_reminder

from datetime import date
from typing import List

class TaskService:
    @staticmethod
    async def create(data: TaskCreate,
                     users,
                     session: AsyncSession
                     ) -> TaskRead:
        task = Task(
            owner_id=users.id,
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

        return TaskRead.model_validate(task)

    @staticmethod
    async def list(date: str | None,
                   users,
                   session: AsyncSession
                   ) -> List[TaskRead]:
        stmt = select(Task).where(Task.owner_id == users.id)
        if date:
            target = datetime.fromisoformat(date)
            stmt = stmt.where(Task.task_date == target.date())
        rows = await session.scalars(stmt)
        return [TaskRead.model_validate(t) for t in rows]

    @staticmethod
    async def update(task_id: str, data: TaskUpdate,
                     users,
                     session: AsyncSession
                     ) -> TaskRead:
        task = await session.get(Task, task_id)
        if not task or task.owner_id != users.id:
            raise HTTPException(status_code=404, detail="Task not found")

        for k, v in data.model_dump(exclude_unset=True).items():
            setattr(task, k, v)
        await session.commit()
        await session.refresh(task)

        return TaskRead.model_validate(task)

    @staticmethod
    async def delete(task_id: str,
                     users,
                     session: AsyncSession
                     ) -> None:
        task = await session.get(Task, task_id)
        if not task or task.owner_id != users.id:
            raise HTTPException(status_code=404, detail="Task not found")
        await session.delete(task)
        await session.commit()
    @staticmethod
    async def get_by_ref(ref: str,
                        users,
                        session: AsyncSession
                        ) -> Task | None:
        # Thử theo id trước
        task = await session.get(Task, ref)
        if task and task.owner_id == users.id:
            return task
        # Nếu không phải id hợp lệ, tìm theo tiêu đề
        stmt = select(Task).where(Task.owner_id == users.id,
                                func.lower(Task.title) == ref.lower())
        row = await session.scalars(stmt)
        return row.first()
    @staticmethod
    async def list_by_range(start_date: str,
                            end_date: str,
                            users,
                            session: AsyncSession
                            ) -> List[TaskRead]:
        try:
            start = date.fromisoformat(start_date)
            end = date.fromisoformat(end_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format, expected YYYY-MM-DD")

        stmt = select(Task).where(
            Task.owner_id == users.id,
            Task.task_date >= start,
            Task.task_date <= end
        )
        rows = await session.scalars(stmt)
        return [TaskRead.model_validate(t) for t in rows]