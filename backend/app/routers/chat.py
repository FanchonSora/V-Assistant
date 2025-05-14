# app/routers/chat.py
from fastapi import APIRouter, Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest,
               svc: ChatService = Depends(ChatService)):
    return await svc.handle(req)
