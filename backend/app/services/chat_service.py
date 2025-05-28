from __future__ import annotations

from typing import Dict, Any, List

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.task import TaskCreate, TaskUpdate
from app.services.dsl_service import DSLService  # wraps our DSL parser
from app.services.task_service import TaskService
from app.core.security import get_current_user
from app.core.db import get_session

# In‑memory store for pending confirmations
_PENDING: Dict[Any, Dict[str, Any]] = {}

# ────────────────────────── helpers ───────────────────────────
from PIL import Image, ImageDraw, ImageFont  # used only for table rendering
import io, base64

def _table_to_img(rows: List[List[str]], max_width: int = 1000) -> str:
    try:
        font = ImageFont.truetype("arial.ttf", 11)
    except IOError:
        font = ImageFont.load_default()
    pad, border = 8, 1
    # Tính chiều rộng từng cột
    col_w = [0] * len(rows[0])
    for row in rows:
        for i, cell in enumerate(row):
            bbox = font.getbbox(cell)
            w = bbox[2] - bbox[0]
            col_w[i] = max(col_w[i], w)

    row_h = (font.getbbox("Ag")[3] - font.getbbox("Ag")[1]) + pad * 2
    tbl_w = sum(col_w) + pad * 2 * len(col_w) + border * (len(col_w) + 1)
    tbl_h = row_h * len(rows) + border * (len(rows) + 1)
    # Vẽ bảng lên ảnh gốc
    img = Image.new("RGB", (tbl_w, tbl_h), "white")
    draw = ImageDraw.Draw(img)
    y = border
    for row in rows:
        x = border
        for i, cell in enumerate(row):
            cw = col_w[i] + pad * 2
            draw.rectangle([x, y, x + cw, y + row_h], outline="black", width=border)
            text_bbox = font.getbbox(cell)
            text_w = text_bbox[2] - text_bbox[0]
            text_h = text_bbox[3] - text_bbox[1]
            tx = x + pad
            ty = y + (row_h - text_h) // 2
            draw.text((tx, ty), cell, fill="black", font=font)
            x += cw + border
        y += row_h + border
    # Nếu quá rộng, thu nhỏ xuống max_width
    if tbl_w > max_width:
        scale = max_width / tbl_w
        new_size = (int(tbl_w * scale), int(tbl_h * scale))
        img = img.resize(new_size, Image.LANCZOS)
    # Xuất ra data-URL
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f'<img src="data:image/png;base64,{b64}" alt="table" />'

def _build_instruction_rows(topic: str) -> List[List[str]]:
    """Return table rows with command names, descriptions, and examples for a given support topic."""
    if topic == "tasks":
        return [
            ["Command", "Description", "Example"],
            [
                "remind me to <title> at <YYYY-MM-DD HH:MM>",
                "Create reminder on a specific date/time",
                "remind me to submit report at 2025-06-01 09:00",
            ],
            [
                "remind me to <title> in <N> minute(s)/hour(s)/day(s)",
                "Create reminder triggers after specified time",
                "remind to call customer in 30 minutes",
            ],
            [
                "remind me to <title> in <N> days repeat every <M> days",
                "Create a recurring reminder",
                "remind fix bug in 2 days repeat every 7 days as pending",
            ],
            [
                "show tasks",
                "List all tasks regardless date",
                "show tasks",
            ],
            [
                "show tasks on <YYYY-MM-DD>",
                "List tasks scheduled for specific date",
                "show tasks on 2025-06-01",
            ],
            [
                "update task <title> set <field>=<value>",
                "Update task field(s)",
                "update task submit report set status=done, title=report",
            ],
            [
                "delete task <title>",
                "Delete task by title",
                "delete task submit report at 2025-06-01 09:00",
            ],
            [
                "cancel task <title>",
                "Mark a task as cancelled",
                "cancel task submit report",
            ],
            [
                "yes / no",
                "Confirm or cancel a pending action",
                "yes",
            ],
        ]
    if topic == "greetings":
        return [
            ["Command", "Description", "Example"],
            [
                "hi / hello / hey",
                "Greet the bot",
                "hi",
            ],
            [
                "hi my name is <Name>",
                "Introduce yourself to the bot",
                "hi my name is John",
            ],
            [
                "what is your name?",
                "Ask the bot to introduce itself",
                "what is your name?",
            ],
            [
                "how are you?",
                "Friendly chitchat with the bot",
                "how are you?",
            ],
        ]
    if topic == "info":
        return [
            ["Command", "Description", "Example"],
            [
                "list tasks instructions",
                "Show a cheat‑sheet for task commands",
                "list tasks instructions",
            ],
            [
                "list greeting instructions",
                "Show a cheat‑sheet for greeting commands",
                "list greeting instructions",
            ],
            [
                "list bot information",
                "Show information about the bot",
                "list bot information",
            ],
        ]
    # default
    return [["Command", "Description", "Example"], ["help", "Show help tables", "help"]]

async def _apply_pending(uid, positive: bool, session: AsyncSession, user) -> str:
    if uid not in _PENDING:
        return "⚠️ Nothing pending"
    data = _PENDING.pop(uid)
    action = data["action"]
    if not positive:
        return "❌ Okay, I’ve cancelled that request"
    # CREATE -------------------------------------------------------------------
    if action == "create":
        payload: dict[str, Any] = data["payload"]
        task = await TaskService.create(TaskCreate(**payload), session=session, user=user)
        due_str = (
            f"{task.task_time.strftime('%H:%M')} {task.task_date.strftime('%d/%m/%Y')}"
            if task.task_date and task.task_time else "no due date"
        )
        return f"✅ Created reminder \"{task.title}\" – due {due_str}"
    # DELETE -------------------------------------------------------------------
    if action == "delete":
        await TaskService.delete(data["task_id"], session=session, users=user)
        return "🗑️ Task deleted"
    # UPDATE -------------------------------------------------------------------
    if action == "update":
        await TaskService.update(task_id=data["task_id"], data=TaskUpdate(**data["updates"]), session=session, users=user)
        return "✏️ Task updated"
    return "⚠️ Unsupported pending action"


# ────────────────────────── ChatService ───────────────────────────
class ChatService:
    async def handle(
        self,
        req: ChatRequest,
        user = Depends(get_current_user),
        session: AsyncSession = Depends(get_session),
    ) -> ChatResponse:
        """Main entry – parse DSL then route to business logic."""
        parsed = await DSLService.parse(req.text)

        # 1️⃣ Parse errors ------------------------------------------------------
        if "error" in parsed:
            return ChatResponse(reply=parsed["error"])

        action = parsed["action"]
        uid = getattr(user, "id", None)

        # 2️⃣ Greetings ---------------------------------------------------------
        if action == "greet":
            name = parsed.get("name")
            return ChatResponse(reply=f"Hello {name + ' ' if name else ''}👋 What can I do for you ?")

        # 3️⃣ Introduce ---------------------------------------------------------
        if action == "introduce":
            return ChatResponse(reply="My name is HAF. How can I assist you ?")

        # 3.1️⃣ Ask -------------------------------------------------------------
        if action == "ask":
            question = parsed.get("question", "")
            return ChatResponse(reply=f"That's an interesting question: '{question}'. 🤖")

        # 4️⃣ Instructions ------------------------------------------------------
        if action.startswith("instruction"):
            # Example actions produced by DSL visitor:
            #   instruction_tasks / instruction_greetings / instruction_infor
            topic = action.split("_", 1)[-1] if "_" in action else "tasks"
            if topic == "infor":
                topic = "info"  # nicer alias
            rows = _build_instruction_rows(topic)
            return ChatResponse(reply=_table_to_img(rows))

        # 5️⃣ Create ------------------------------------------------------------
        if action == "create":
            payload = {
                "title": parsed.get("title"),
                "task_date": parsed.get("task_date"),
                "task_time": parsed.get("task_time"),
                "rrule": parsed.get("repeat"),
                "status": parsed.get("status") or "pending",
            }
            missing: List[str] = [
                label for cond, label in (
                    (payload["task_date"], "date"),
                    (payload["task_time"], "time"),
                    (payload["rrule"],    "recurrence rule"),
                ) if cond is None
            ]
            if missing:
                _PENDING[uid] = {"action": "create", "payload": payload}
                parts = ", ".join(missing)
                return ChatResponse(reply=(f"You didn't specify {parts}. Create reminder \"{payload['title']}\" anyway? (Yes/No)"))
            task = await TaskService.create(TaskCreate(**payload), session=session, users=user)
            due_str = (
                f"{task.task_time.strftime('%H:%M')} {task.task_date.strftime('%d/%m/%Y')}"
                if task.task_date and task.task_time else "no due date"
            )
            return ChatResponse(reply=f"✅ Created reminder \"{task.title}\" – due {due_str}")

        # 6️⃣ Delete ------------------------------------------------------------
        if action == "delete":
            task = await TaskService.get_by_ref(
                parsed.get("title"),
                task_date=parsed.get("task_date"),
                task_time=parsed.get("task_time"),
                session=session, users=user,
            )
            if not task:
                return ChatResponse(reply="⚠️ Task not found")
            _PENDING[uid] = {"action": "delete", "task_id": task.id}
            return ChatResponse(reply=f"Delete task \"{task.title}\" ? (Yes/No)")

        # 7️⃣ Update ------------------------------------------------------------
        if action == "update":
            task = await TaskService.get_by_ref(
                parsed.get("title"),
                task_date=parsed.get("task_date"),
                task_time=parsed.get("task_time"),
                session=session, users=user,
            )
            if not task:
                return ChatResponse(reply="⚠️ Task not found")
            _PENDING[uid] = {
                "action": "update",
                "task_id": task.id,
                "updates": parsed.get("updates", {})
            }
            return ChatResponse(reply=f"Update task \"{task.title}\" ? (Yes/No)")

        # 8️⃣ Cancel ------------------------------------------------------------
        if action == "cancel":
            ok = await TaskService.cancel_by_ref(parsed["title"], session=session, users=user)
            return ChatResponse(reply="🚫 Task cancelled." if ok else "⚠️ Task not found")

                # 9️⃣ View --------------------------------------------------------------
        if action == "view":
            # Ignore any date filter to list all tasks
            tasks = await TaskService.list(None, session=session, users=user)
            if not tasks:
                return ChatResponse(reply="📭 You have no tasks")
            # Build table with detailed task info: Title, Status, Date, Time, Recurrence
            rows: List[List[str]] = [["Title", "Status", "Date", "Time", "Recurrence"]]
            for t in tasks:
                date_str = t.task_date.strftime('%d/%m/%Y') if t.task_date else "N/A"
                time_str = t.task_time.strftime('%H:%M') if t.task_time else "N/A"
                recurrence = t.rrule if getattr(t, "rrule", None) else ""
                rows.append([t.title, t.status, date_str, time_str, recurrence])
            return ChatResponse(reply=_table_to_img(rows))

        # 🔟 Confirm ------------------------------------------------------------
        if action == "confirm":
            positive: bool = parsed["value"]
            msg = await _apply_pending(uid, positive, session, user)
            return ChatResponse(reply=msg)

        # Fallback -------------------------------------------------------------
        return ChatResponse(reply="❓ Sorry, I don't have a response for that yet")
