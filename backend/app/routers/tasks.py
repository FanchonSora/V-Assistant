# app/routers/tasks.py
from fastapi import APIRouter, Depends, Query
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services.task_service import TaskService
from app.core.security import get_current_user
from app.core.db import get_session

router = APIRouter()

@router.post('/', response_model=TaskRead)
async def create_task(data: TaskCreate, service: TaskService = Depends(TaskService)):
    return await service.create(data)

@router.get('/', response_model=List[TaskRead])
async def list_tasks(
    date: str = Query(None),
    current_user = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    return await TaskService.list(date, current_user, session)

@router.get("/range", response_model=list[TaskRead])
async def get_tasks_by_range(start_date: str, end_date: str, 
                             current_user=Depends(get_current_user), 
                             session: AsyncSession = Depends(get_session)
):
    return await TaskService.list_by_range(start_date, end_date, current_user, session)

@router.patch('/{task_id}', response_model=TaskRead)
async def update_task(task_id: str, data: TaskUpdate):
    return await TaskService.update(task_id, data)

@router.delete('/{task_id}', status_code=204)
async def delete_task(task_id: str):
    await TaskService.delete(task_id)
    return {'detail': 'Deleted'}