from fastapi import APIRouter, Depends
from app.core.security import get_current_user

router = APIRouter()

@router.get("/protected")
async def protected_route(user=Depends(get_current_user)):
    return {"message": f"Hello, {user.username}!"}