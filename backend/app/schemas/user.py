# app/schemas/user.py
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: str
    username: str

class Token(BaseModel):
    access_token: str
    token_type: str