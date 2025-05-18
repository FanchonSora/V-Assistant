# app/schemas/user.py
from pydantic import BaseModel

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

class Token(BaseModel):
    access_token: str
    token_type: str