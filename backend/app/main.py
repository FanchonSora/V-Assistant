# app/main.py
from fastapi import FastAPI
from app.routers import auth, tasks, dsl
from app.core.config import settings
from app.core.db import init_db
from app.services.scheduler_service import init_scheduler

app = FastAPI(title=settings.PROJECT_NAME)

# Database
init_db()

# Scheduler
scheduler = init_scheduler()

# Routers
app.include_router(auth.router)
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(dsl.router, prefix="/dsl", tags=["DSL"])

@app.on_event("startup")
async def on_startup():
    await init_db()
    init_scheduler()  