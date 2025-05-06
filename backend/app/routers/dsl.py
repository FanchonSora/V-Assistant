# app/routers/dsl.py
from fastapi import APIRouter
from app.services.dsl_service import DSLService

router = APIRouter()

@router.post('/parse')
async def parse_command(text: str):
    return await DSLService.parse(text)