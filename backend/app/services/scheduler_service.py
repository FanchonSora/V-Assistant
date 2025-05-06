# app/services/scheduler_service.py
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import timedelta
from app.services.notification_service import send_email
from app.core.config import settings

scheduler = AsyncIOScheduler(timezone="UTC")


def init_scheduler() -> AsyncIOScheduler:
    if not scheduler.running:
        scheduler.start()
    return scheduler


async def schedule_task_reminder(task):
    """
    Create a one‑shot APScheduler job that sends an email 10 minutes before due.
    (Very naïve; ignores RRULE etc. – extend as needed.)
    """
    if not task.due:
        return
    run_at = task.due - timedelta(minutes=10)
    if run_at < task.due:
        scheduler.add_job(
            send_email,
            trigger=DateTrigger(run_date=run_at),
            kwargs=dict(
                recipient=task.owner_id,  # replace by real email if available
                subject=f"[Reminder] {task.title}",
                body=f"Remember to finish “{task.title}” before {task.due}"
            ),
            id=f"reminder-{task.id}",
            replace_existing=True
        )
