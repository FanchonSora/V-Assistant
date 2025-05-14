from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # Use FastAPI's CORS middleware
from app.routers import auth, tasks, dsl, speech, chat
from app.core.config import settings
from app.core.db import init_db
from app.services.scheduler_service import init_scheduler

app = FastAPI(title=settings.PROJECT_NAME)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace "*" with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Routers
#app.include_router(auth.router)
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])
app.include_router(dsl.router, prefix="/dsl", tags=["DSL"])
app.include_router(speech.router, prefix="/speech", tags=["Speech"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])

@app.on_event("startup")
async def on_startup():
    # Initialize DB
    await init_db()
    # Start scheduler (sync)
    init_scheduler()