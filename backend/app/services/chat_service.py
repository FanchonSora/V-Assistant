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
            print("Received instruction request")
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
                    "action": "create", 
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
                users=user, session=session
            )
            due_str = f"{task.task_time.strftime('%H:%M')} {task.task_date.strftime('%d/%m')}" if task.task_date and task.task_time else "không có hạn"
            return ChatResponse(reply=f"✅ Đã tạo nhắc việc “{task.title}” – hạn {due_str}.")

        # ------------------------ confirm ---------------------------
        if action == "confirm":
            if uid not in _PENDING_CREATE:
                return ChatResponse(reply="⚠️ Không có tác vụ nào đang chờ xác nhận.")
            data = _PENDING_CREATE.pop(uid)
            if data["action"] == "delete":
                # Delete all tasks with the same title
                tasks = await TaskService.list_by_title(data["title"], user, session)
                for task in tasks:
                    await TaskService.delete(task.id, session=session, users=user)
                return ChatResponse(reply="🗑️ Đã xóa tất cả các task cùng tên.")
            elif data["action"] == "update":
                # Update all tasks with the same title
                tasks = await TaskService.list_by_title(data["title"], user, session)
                updated_infos = []
                for task in tasks:
                    await TaskService.update(task.id, TaskUpdate(**data["updates"]), session=session, users=user)
                    updated_infos.append((task.id, tuple(sorted(data["updates"].items()))))
    
                # Remove duplicates
                if len(set(updated_infos)) == 1:
                    for task in tasks[1:]:
                        await TaskService.delete(task.id, session=session, user=user)
                    return ChatResponse(reply="✏️ Đã cập nhật và loại bỏ các task trùng lặp.")
                return ChatResponse(reply="✏️ Đã cập nhật tất cả các task cùng tên.")
            elif data["action"] == "create":
                # Create the task with pending data
                task = await TaskService.create(
                    TaskCreate(
                        title=data["title"],
                        task_date=data["task_date"],
                        task_time=data["task_time"],
                        rrule=data["rrule"]
                    ),
                    users=user,
                    session=session
                )
                due_str = f"{task.task_time.strftime('%H:%M')} {task.task_date.strftime('%d/%m')}" if task.task_date and task.task_time else "không có hạn"
                return ChatResponse(reply=f"✅ Đã tạo nhắc việc “{task.title}” – hạn {due_str}.")
            else:
                return ChatResponse(reply="⚠️ Không xác định được hành động.")
        # -------------------------- delete ---------------------------
        if action == "delete":
            title = parsed.get("title")
            task_date = parsed.get("task_date")
            task_time = parsed.get("task_time")
            missing = []
            if not (task_date or task_time):
                _PENDING_CREATE[uid] = {
                    "action": "delete",
                    "title": title,
                    "task_date": task_date,
                    "task_time": task_time,
                }
                missing = [
                    label for cond, label in ((task_date, "ngày"), (task_time, "giờ")) if not cond
                ]
                msg_missing = ", ".join(missing)
                return ChatResponse(
                    reply=f"Bạn chưa cung cấp: {msg_missing}. Bạn có chắc muốn tạo task “{title}” không? (Yes/No)"
                )
            
            task = await TaskService.get_by_ref(
                title,
                session=session, 
                users=user,
                task_date=task_date,
                task_time=task_time
            )
            if not task:
                return ChatResponse(reply="⚠️ Không tìm thấy task đó.")
            await TaskService.delete(task.id, session=session, users=user)
            return ChatResponse(reply="🗑️ Đã xóa task.")

        # -------------------------- update ---------------------------
        if action == "update":
            title = parsed.get("title")
            task_date = parsed.get("task_date")
            task_time = parsed.get("task_time")
            updates = parsed.get("updates")  # add updates from DSL parse
            missing = []
            if not (task_date or task_time):
                _PENDING_CREATE[uid] = {
                    "action": "update",
                    "title": title,
                    "task_date": task_date,
                    "task_time": task_time,
                    "updates": updates,  # store updates so confirm branch can use it
                }
                missing = [
                    label for cond, label in ((task_date, "ngày"), (task_time, "giờ")) if not cond
                ]
                msg_missing = ", ".join(missing)
                return ChatResponse(
                    reply=f"Bạn chưa cung cấp: {msg_missing}. Bạn có chắc muốn tạo task “{title}” không? (Yes/No)"
                )

            task = await TaskService.get_by_ref(
                title,
                session=session, 
                users=user,
                task_date=task_date,
                task_time=task_time
            )
            if not task:
                return ChatResponse(reply="⚠️ Không tìm thấy task đó.")
            data = TaskUpdate(**updates)
            await TaskService.update(task.id, data, session=session, users=user)
            return ChatResponse(reply="✏️ Đã cập‑nhật task.")

        # --------------------------- view ---------------------------
        if action == "view":
            tasks = await TaskService.list(parsed.get("date"), session=session, users=user)
            if not tasks:
                return ChatResponse(reply="📭 Bạn chưa có task nào.")

            from PIL import Image, ImageDraw, ImageFont
            import io, base64

            # Prepare table data.
            columns = ["Title", "Status", "Deadline"]
            rows = [columns]
            for t in tasks:
                if t.task_date and t.task_time:
                    due = f"{t.task_date.strftime('%d/%m/%Y')} {t.task_time.strftime('%H:%M')}"
                else:
                    due = "Don't have deadline"
                rows.append([t.title, t.status, due])

            # Use a monospaced font (fallback to default).
            font = ImageFont.load_default()
            cell_padding = 10
            border_width = 1

            # Calculate maximum width of each column.
            num_cols = len(columns)
            col_widths = [0] * num_cols
            for row in rows:
                for i, cell in enumerate(row):
                    bbox = font.getbbox(cell)
                    cell_width = bbox[2] - bbox[0]
                    if cell_width > col_widths[i]:
                        col_widths[i] = cell_width

            # Calculate row heights (same for all rows using font height) and table dimensions.
            row_height = (font.getbbox("Ag")[3] - font.getbbox("Ag")[1]) + cell_padding * 2
            table_width = sum(col_widths) + cell_padding * 2 * num_cols + border_width * (num_cols + 1)
            table_height = row_height * len(rows) + border_width * (len(rows) + 1)

            # Create a new image for the table.
            image = Image.new("RGB", (table_width, table_height), "white")
            draw = ImageDraw.Draw(image)

            # Draw table grid and text.
            y_offset = border_width
            for row in rows:
                x_offset = border_width
                for i, cell in enumerate(row):
                    cell_width = col_widths[i] + cell_padding * 2
                    # Draw cell border.
                    draw.rectangle([x_offset, y_offset, x_offset + cell_width, y_offset + row_height], outline="black", width=border_width)
                    # Calculate text position (centered vertically, left padded).
                    bbox = font.getbbox(cell)
                    text_width = bbox[2] - bbox[0]
                    text_height = bbox[3] - bbox[1]
                    text_x = x_offset + cell_padding
                    text_y = y_offset + (row_height - text_height) // 2
                    draw.text((text_x, text_y), cell, fill="black", font=font)
                    x_offset += cell_width + border_width
                y_offset += row_height + border_width

            # Save image to an in-memory buffer and prepare a Base64 data URL.
            buf = io.BytesIO()
            image.save(buf, format="PNG")
            buf.seek(0)
            img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
            data_url = f"data:image/png;base64,{img_base64}"
            # Return HTML img tag to display the image directly in chat.
            return ChatResponse(reply=f'<img src="{data_url}" alt="Tasks info" />')
        
        # ------------------------- fallback -------------------------
        return ChatResponse(reply="❓ Sorry, I don't have this response yet.")
