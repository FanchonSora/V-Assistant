# app/services/auth_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate, Token, UserRead
from app.core.db import get_session
from app.core.security import hash_password, verify_password, create_access_token


class AuthService:
    @staticmethod
    async def register(data: UserCreate,
                       session: AsyncSession = None) -> UserRead:
        if session is None:  # allow manual injection for tests
            async for session in get_session():
                break

        existing_user = await session.scalar(
            select(User).where(
                or_(
                    User.username == data.username,
                    User.email == data.email
                )
            )
        )

        if existing_user:
            errors = []
            if existing_user.username == data.username:
                errors.append("username")
            if existing_user.email == data.email:
                errors.append("email")
            joined = " and ".join(errors)
            raise HTTPException(status_code=409, detail=f"{joined.capitalize()} taken")

        user = User(username=data.username,
                    email=data.email,
                    hashed_password=hash_password(data.password))
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return UserRead.model_validate(user)

    @staticmethod
    async def login(username: str, password: str,
                    session: AsyncSession = None) -> Token:
        if session is None:
            async for session in get_session():
                break
        user: User | None = await session.scalar(
            select(User).where(User.username == username)
        )
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Bad credentials")
        token = create_access_token({"sub": user.id})
        return Token(access_token=token, token_type="bearer")
