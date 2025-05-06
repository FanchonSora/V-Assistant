import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_register_and_login():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        r1 = await ac.post('/auth/register', json={'username':'u1','password':'p1'})
        assert r1.status_code == 200
        r2 = await ac.post('/auth/token', data={'username':'u1','password':'p1'})
        assert 'access_token' in r2.json()