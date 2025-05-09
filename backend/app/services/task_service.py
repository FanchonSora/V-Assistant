# app/services/task_service.py
from datetime import datetime

from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, Depends

from app.models.task import Task
from app.schemas.task import (TaskCreate, TaskRead, TaskUpdate, Status)
from app.core.db import get_session
from app.core.security import get_current_user
from app.services.scheduler_service import schedule_task_reminder


class TaskService:
    @staticmethod
    async def create(data: TaskCreate,
                     session: AsyncSession = Depends(get_session),
                     user=Depends(get_current_user)) -> TaskRead:
        task = Task(owner_id=user.id,
                    title=data.title,
                    due=data.due,
                    rrule=data.rrule,
                    status=Status.pending)
        session.add(task)
        await session.commit()
        await session.refresh(task)

        if task.due:  # schedule email
            await schedule_task_reminder(task)

        return TaskRead.model_validate(task)

    @staticmethod
    async def list(date: str | None,
                   session: AsyncSession = Depends(get_session),
                   user=Depends(get_current_user)) -> list[TaskRead]:
        stmt = select(Task).where(Task.owner_id == user.id)
        if date:
            target = datetime.fromisoformat(date)
            stmt = stmt.where(func.date(Task.due) == target.date())
        rows = await session.scalars(stmt)
        return [TaskRead.model_validate(t) for t in rows]

    @staticmethod
    async def update(task_id: str, data: TaskUpdate,
                     session: AsyncSession = Depends(get_session),
                     user=Depends(get_current_user)) -> TaskRead:
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
                     session: AsyncSession = Depends(get_session),
                     user=Depends(get_current_user)) -> None:
        task = await session.get(Task, task_id)
        if not task or task.owner_id != user.id:
            raise HTTPException(status_code=404, detail="Task not found")
        await session.delete(task)
        await session.commit()
