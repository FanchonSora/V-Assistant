# app/routers/tasks.py
from fastapi import APIRouter, Depends, Query
from typing import List
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services.task_service import TaskService

router = APIRouter()

@router.post('/', response_model=TaskRead)
async def create_task(data: TaskCreate, service: TaskService = Depends(TaskService)):
    return await service.create(data)

@router.get('/', response_model=List[TaskRead])
async def list_tasks(date: str = Query(None)):
    return await TaskService.list(date)

@router.patch('/{task_id}', response_model=TaskRead)
async def update_task(task_id: str, data: TaskUpdate):
    return await TaskService.update(task_id, data)

@router.delete('/{task_id}', status_code=204)
async def delete_task(task_id: str):
    await TaskService.delete(task_id)
    return {'detail': 'Deleted'}