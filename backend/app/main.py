# app/main.py
from fastapi import FastAPI
from app.routers import auth, tasks, dsl, speech
from app.core.config import settings
from app.core.db import init_db
from app.services.scheduler_service import init_scheduler

app = FastAPI(title=settings.PROJECT_NAME)

# Routers
app.include_router(auth.router)
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(dsl.router, prefix="/dsl", tags=["DSL"])
app.include_router(speech.router, prefix="/speech", tags=["Speech"])

@app.on_event("startup")
async def on_startup():
    # khởi tạo DB
    await init_db()
    # khởi chạy scheduler (sync)
    init_scheduler()