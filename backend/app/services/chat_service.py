from fastapi import Depends
from typing import Dict, Any

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.dsl_service import DSLService
from app.services.task_service import TaskService
from app.schemas.task import TaskCreate, TaskUpdate
from app.core.security import get_current_user

_PENDING_CREATE: Dict[Any, Dict[str, Any]] = {}

class ChatService:
    """Service chịu trách nhiệm xử lý hội thoại dựa trên DSL."""
    async def handle(self, req: ChatRequest, user, session) -> ChatResponse:
        """Nhận ChatRequest, parse DSL, điều phối sang TaskService."""

        parsed = await DSLService.parse(req.text)

        # -------------------------- lỗi DSL ---------------------------
        if "error" in parsed:
            return ChatResponse(reply=parsed["error"])

        action = parsed["action"]
        uid = getattr(user, "id", None)  # fallback None nếu user chưa login

        # --------------------------- greet ----------------------------
        if action == "greet":
            name = parsed.get("name")
            msg = f"Chào {name}! 👋 What can I do for you?" if name else "Chào bạn! 👋 What can I do for you?"
            return ChatResponse(reply=msg)

        # ------------------------ introduce ---------------------------
        if action == "introduce":
            return ChatResponse(reply="My name is Fanchon, what can I do for you?")

        # ---------------------- instructions -------------------------
        if action == "instruction":
            instructions = parsed.get("instructions") or (
                "I can help you manage your tasks: you can create, update, delete, and view tasks."
            )
            return ChatResponse(reply=instructions)

        # -------------------------- create ---------------------------
        if action == "create":
            title   = parsed.get("title")
            task_date = parsed.get("task_date")
            task_time = parsed.get("task_time")
            rrule   = parsed.get("repeat")
            status  = parsed.get("status")

            if not (task_date and task_time and rrule and status):
                # ghi vào store để chờ xác nhận
                _PENDING_CREATE[uid] = {
                    "title":  title,
                    "task_date": task_date,
                    "task_time": task_time,
                    "rrule":  rrule,
                    "status": status,
                }
                missing = [
                    label for cond, label in ((task_date, "ngày"), (task_time, "giờ"), (rrule, "lịch lặp lại"), (status, "trạng thái")) if not cond
                ]
                msg_missing = ", ".join(missing)
                return ChatResponse(
                    reply=f"Bạn chưa cung cấp: {msg_missing}. Bạn có chắc muốn tạo task “{title}” không? (Yes/No)"
                )

            # đủ dữ liệu → tạo luôn
            task = await TaskService.create(
                TaskCreate(title=title, task_date=task_date, task_time=task_time, rrule=rrule),
                user=user, session=session
            )
            due_str = f"{task.task_time.strftime('%H:%M')} {task.task_date.strftime('%d/%m')}" if task.task_date and task.task_time else "không có hạn"
            return ChatResponse(reply=f"✅ Đã tạo nhắc việc “{task.title}” – hạn {due_str}.")

        # ------------------------ confirm ---------------------------
        if action == "confirm":
            if uid not in _PENDING_CREATE:
                return ChatResponse(reply="⚠️ Không có tác vụ nào đang chờ xác nhận.")

            if parsed["value"]:  # Yes
                data = _PENDING_CREATE.pop(uid)
                task = await TaskService.create(TaskCreate(**data), users=user, session=session)
                due_str = f"{task.task_time.strftime('%H:%M')} {task.task_date.strftime('%d/%m')}" if task.task_date and task.task_time else "không có hạn"
                return ChatResponse(reply=f"✅ Đã tạo nhắc việc “{task.title}” – hạn {due_str}.")

            # No
            _PENDING_CREATE.pop(uid, None)
            return ChatResponse(reply="👌 Không tạo task nữa.")

        # -------------------------- delete ---------------------------
        if action == "delete":
            task = await TaskService.get_by_ref(parsed["task_ref"], session=session, user=user)
            if not task:
                return ChatResponse(reply="⚠️ Không tìm thấy task đó.")
            await TaskService.delete(task.id, session=session, user=user)
            return ChatResponse(reply="🗑️ Đã xóa task.")

        # -------------------------- update ---------------------------
        if action == "update":
            task = await TaskService.get_by_ref(parsed["task_ref"], session=session, user=user)
            if not task:
                return ChatResponse(reply="⚠️ Không tìm thấy task đó.")
            data = TaskUpdate(**parsed["updates"])
            await TaskService.update(task.id, data, session=session, user=user)
            return ChatResponse(reply="✏️ Đã cập‑nhật task.")

        # --------------------------- view ---------------------------
        if action == "view":
            tasks = await TaskService.list(parsed.get("date"), session=session, user=user)
            if not tasks:
                return ChatResponse(reply="📭 Bạn chưa có task nào.")
            lines = [

                f"• {t.title} – {t.status} – {t.task_date:%d/%m} {t.task_time:%H:%M}" if t.task_date and t.task_time else f"• {t.title} – {t.status}"
                for t in tasks
            ]
            return ChatResponse(reply="\n".join(lines))

        # ------------------------- fallback -------------------------

        return ChatResponse(reply="❓ Sorry, I don't have this response yet.")
