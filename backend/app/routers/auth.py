# app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.user import Token, UserCreate, UserRead
from app.services.auth_service import AuthService

router = APIRouter()

@router.post('/auth/register', response_model=UserRead)
async def register(data: UserCreate):
    return await AuthService.register(data)

@router.post('/auth/token', response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    token = await AuthService.login(form_data.username, form_data.password)
    return token