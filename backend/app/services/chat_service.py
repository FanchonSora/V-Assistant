# app/services/chat_service.py
from fastapi import Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.dsl_service import DSLService
from app.services.task_service import TaskService
from app.schemas.task import TaskCreate
from app.core.security import get_current_user

class ChatService:
    async def handle(self,
                     req: ChatRequest,
                     user = Depends(get_current_user)) -> ChatResponse:
        parsed = await DSLService.parse(req.text)

        # Nếu DSL hiểu → tạo task
        if "error" not in parsed:
            task = await TaskService.create(
                TaskCreate(**parsed),
            )
            reply = (f"✅ Đã tạo nhắc việc “{task.title}” – "
                     f"hạn {task.due:%H:%M %d/%m}.")
        else:
            reply = "❓ Xin lỗi, mình chưa hiểu yêu cầu đó."
        return ChatResponse(reply=reply)
