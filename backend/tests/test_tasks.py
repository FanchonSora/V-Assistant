import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_task_crud():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # assume login obtains token
        r0 = await ac.post('/auth/register', json={'username':'u2','password':'p2'})
        r1 = await ac.post('/auth/token', data={'username':'u2','password':'p2'})
        token = r1.json()['access_token']
        headers = {'Authorization': f'Bearer {token}'}
        # create
        r1 = await ac.post('/tasks/', json={'title':'T1'}, headers=headers)
        assert r1.status_code == 200
        task_id = r1.json()['id']
        # read
        r2 = await ac.get('/tasks/', headers=headers)
        assert any(t['id']==task_id for t in r2.json())
        # update
        r3 = await ac.patch(f'/tasks/{task_id}', json={'status':'done'}, headers=headers)
        assert r3.json()['status']=='done'
        # delete
        r4 = await ac.delete(f'/tasks/{task_id}', headers=headers)
        assert r4.status_code == 200