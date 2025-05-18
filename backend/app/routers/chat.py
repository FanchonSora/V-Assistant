# app/routers/chat.py
from fastapi import APIRouter, Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService
from app.core.security import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat(
    req: ChatRequest,
    user=Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    svc = ChatService()
    return await svc.handle(req, user=user, session=session)
