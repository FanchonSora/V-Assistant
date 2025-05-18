# app/services/chat_service.py
from fastapi import Depends
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.dsl_service import DSLService
from app.services.task_service import TaskService
from app.schemas.task import TaskCreate, TaskUpdate
from app.core.security import get_current_user

class ChatService:
    async def handle(self, req: ChatRequest, user, session) -> ChatResponse:
        parsed = await DSLService.parse(req.text)

        if "error" in parsed:
            #return ChatResponse(reply="❓ Xin lỗi, mình chưa hiểu yêu cầu đó.")
            return ChatResponse(reply=parsed["error"])

        action = parsed["action"]

        # -------- greeting --------
        if action == "greet":
            name = parsed.get("name")
            reply = f"Chào {name}! 👋" if name else "Chào bạn! 👋"
            return ChatResponse(reply=reply)

        # -------- create --------
        if action == "create":
            data = TaskCreate(title=parsed["title"], due=parsed.get("due"))
            task = await TaskService.create(data, user=user, session=session)
            return ChatResponse(
                reply=f"✅ Đã tạo nhắc việc “{task.title}” – hạn {task.due:%H:%M %d/%m}."
            )

        # -------- delete --------
        if action == "delete":
            task = await TaskService.get_by_ref(parsed["task_ref"], session=session, user=user)
            if not task:
                return ChatResponse(reply="⚠️ Không tìm thấy task đó.")
            await TaskService.delete(task.id, session=session, user=user)
            return ChatResponse(reply="🗑️ Đã xóa task.")

        # -------- update --------
        if action == "update":
            task = await TaskService.get_by_ref(parsed["task_ref"], session=session, user=user)
            if not task:
                return ChatResponse(reply="⚠️ Không tìm thấy task đó.")
            data = TaskUpdate(**parsed["updates"])          # <<< thay dòng này
            await TaskService.update(task.id, data, session=session, user=user)
            return ChatResponse(reply="✏️ Đã cập-nhật task.")

        # -------- view --------
        if action == "view":
            tasks = await TaskService.list(parsed.get("date"), session=session, user=user)
            if not tasks:
                return ChatResponse(reply="📭 Bạn chưa có task nào.")
            lines = [f"• {t.title} – {t.status} – {t.due:%d/%m %H:%M}" if t.due else f"• {t.title} – {t.status}"
                     for t in tasks]
            return ChatResponse(reply="\n".join(lines))

        # fallback
        return ChatResponse(reply="❓ Xin lỗi, mình chưa hiểu yêu cầu đó.")

