# app/schemas/user.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

    model_config = {
        "from_attributes": True
    }

class UserRead(BaseModel):
    id: str
    username: str
    email: str
    
    model_config = {
        "from_attributes": True
    }

class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None

    model_config = {
        "from_attributes": True
    }

class Token(BaseModel):
    access_token: str
    token_type: str