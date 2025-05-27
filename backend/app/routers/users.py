from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import get_current_user
from app.core.db import get_session
from app.models.user import User
from app.schemas.user import UserRead, UserUpdate

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/me", response_model=UserRead)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    return UserRead.model_validate(current_user)

@router.put("/me", response_model=UserRead)
async def update_current_user_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session)
):
    # Update user fields
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    await session.commit()
    await session.refresh(current_user)
    return UserRead.model_validate(current_user) 