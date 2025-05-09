from fastapi import APIRouter
from app.services.speech_service import SpeechService

router = APIRouter()

@router.get("/listen")
async def listen():
    svc = SpeechService(lang="vi-VN")
    text = svc.listen_and_transcribe()
    return {"text": text}
