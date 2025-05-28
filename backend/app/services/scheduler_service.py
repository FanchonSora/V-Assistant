from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.date import DateTrigger
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta

from app.services.notification_service import send_email
from app.core.config import settings

scheduler = AsyncIOScheduler(timezone="UTC")

def init_scheduler() -> AsyncIOScheduler:
    if not scheduler.running:
        scheduler.start()
    return scheduler

async def schedule_task_reminder(task):
    # Must have both date and time to schedule
    if not task.task_date or not task.task_time:
        return
    task_datetime = datetime.combine(task.task_date, task.task_time)
    print(f"Scheduling reminder for task {task.id} at {task_datetime}")
    # Calculate the run time: 10 minutes before the task's due time
    run_at = task_datetime - timedelta(minutes=10)
    # If the scheduled run time is in the past, skip scheduling
    if run_at < datetime.utcnow():
        print("Reminder run time already passed; no job scheduled")
        return
    # Determine the trigger based on recurrence rule (if provided)
    if task.rrule:
        rrule_lower = task.rrule.lower().strip()
        if rrule_lower in ["daily", "day"]:
            # Every day at run_at's hour and minute
            trigger = CronTrigger(hour=run_at.hour, minute=run_at.minute)
        elif rrule_lower in ["weekly", "week"]:
            # Weekly on the same weekday as the task's date
            trigger = CronTrigger(day_of_week=task_datetime.weekday(), hour=run_at.hour, minute=run_at.minute)
        else:
            # Fallback to one-shot if the rrule isn't explicitly supported
            trigger = DateTrigger(run_date=run_at)
    else:
        trigger = DateTrigger(run_date=run_at)
    scheduler.add_job(
        send_email,
        trigger=trigger,
        kwargs=dict(
            recipient=task.owner_id,  
            subject=f"[Reminder] {task.title}",
            body=f"Remember to finish “{task.title}” before {task_datetime.strftime('%H:%M %d/%m/%Y')}"
        ),
        id=f"reminder-{task.id}",
        replace_existing=True
    )