# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Virtual Assistant"
    DATABASE_URL: str
    REDIS_URL: str
    JWT_SECRET: str
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASS: str
    SMTP_FROM: str

    class Config:
        env_file = "app/.env"
        env_file_encoding = "utf-8"

settings = Settings()