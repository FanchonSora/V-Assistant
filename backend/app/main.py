import logging
import os
import sys

# 1) Sinh ANTLR parser từ grammar (.g4)
from app.utils.antlr_gen import generate as gen_antlr

try:
    gen_antlr()
except Exception as e:
    logging.error("ANTLR parser generation failed: %s", e)
    sys.exit(1)

# 2) Tiếp tục cấu hình FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, tasks, dsl, speech, chat
from app.core.config import settings
from app.core.db import init_db
from app.services.scheduler_service import init_scheduler

app = FastAPI(title=settings.PROJECT_NAME)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(dsl.router, prefix="/dsl", tags=["DSL"])
app.include_router(speech.router, prefix="/speech", tags=["Speech"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

# Startup event: initialize DB & scheduler
@app.on_event("startup")
async def on_startup():
    # Tạo bảng nếu chưa có
    await init_db()
    # Khởi chạy scheduler (ví dụ APScheduler hoặc Celery beat)
    init_scheduler()