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

def _table_to_img(rows: List[List[str]]) -> str:
    """Render a 2‑D list as a PNG table and return an <img> data‑URL."""
    font = ImageFont.load_default()
    pad, border = 8, 1
    # column widths
    col_w = [0] * len(rows[0])
    for row in rows:
        for i, cell in enumerate(row):
            w = font.getbbox(cell)[2] - font.getbbox(cell)[0]
            col_w[i] = max(col_w[i], w)
    row_h = (font.getbbox("Ag")[3] - font.getbbox("Ag")[1]) + pad * 2
    tbl_w = sum(col_w) + pad * 2 * len(col_w) + border * (len(col_w) + 1)
    tbl_h = row_h * len(rows) + border * (len(rows) + 1)
    img = Image.new("RGB", (tbl_w, tbl_h), "white")
    draw = ImageDraw.Draw(img)
    y = border
    for row in rows:
        x = border
        for i, cell in enumerate(row):
            cw = col_w[i] + pad * 2
            draw.rectangle([x, y, x + cw, y + row_h], outline="black", width=border)
            tx = x + pad
            ty = y + (row_h - (font.getbbox(cell)[3] - font.getbbox(cell)[1])) // 2
            draw.text((tx, ty), cell, fill="black", font=font)
            x += cw + border
        y += row_h + border
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode()
    return f'<img src="data:image/png;base64,{b64}" alt="table" />'


def _build_instruction_rows(topic: str) -> List[List[str]]:
    """Return table rows for a given *support* topic defined in AssistantDSL."""
    if topic == "tasks":
        return [
            ["Command", "Description"],
            ["remind me to <title> at <YYYY-MM-DD HH:MM>", "Create one‑off reminder on a precise date/time"],
            ["remind me to <title> in <N> (minute|hour|day)", "Create relative reminder N units from now"],
            ["remind me to <title> in <N> days repeat every <M> days", "Create recurring reminder"],
            ["show tasks", "List all tasks"],
            ["show tasks on <YYYY-MM-DD>", "List tasks for a specific date"],
            ["update task <title> set status=pending|done", "Change task status"],
            ["delete task <title>", "Delete task"],
            ["cancel task <title>", "Mark task as cancelled"],
            ["yes / no", "Confirm or cancel pending action"],
        ]
    if topic == "greetings":
        return [
            ["Command", "Description"],
            ["hi / hello / hey", "Greet the bot"],
            ["hi my name is <Name>", "Introduce yourself"],
            ["what is your name?", "Ask the bot to introduce itself"],
            ["how are you?", "Friendly chitchat"],
        ]
    if topic == "info":
        return [
            ["Command", "Description"],
            ["list tasks instructions", "Show task‑related cheat‑sheet"],
            ["list greeting instructions", "Show greeting cheat‑sheet"],
            ["list bot information", "Show this table"],
        ]
    # default fallback
    return [["Command", "Description"], ["help", "Show help tables"]]


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
        task = await TaskService.create(TaskCreate(**payload), session=session, users=user)
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
        await TaskService.update(task_id=data["task_id"], data=TaskUpdate(**data["updates"]),
                                 session=session, users=user)
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
            tasks = await TaskService.list(parsed.get("date"), session=session, users=user)
            if not tasks:
                return ChatResponse(reply="📭 You have no tasks")
            rows: List[List[str]] = [["Title", "Status", "Deadline"]]
            for t in tasks:
                due = (
                    f"{t.task_date.strftime('%d/%m/%Y')} {t.task_time.strftime('%H:%M')}"
                    if t.task_date and t.task_time else "No deadline"
                )
                rows.append([t.title, t.status, due])
            return ChatResponse(reply=_table_to_img(rows))

        # 🔟 Confirm ------------------------------------------------------------
        if action == "confirm":
            positive: bool = parsed["value"]
            msg = await _apply_pending(uid, positive, session, user)
            return ChatResponse(reply=msg)

        # Fallback -------------------------------------------------------------
        return ChatResponse(reply="❓ Sorry, I don't have a response for that yet")
