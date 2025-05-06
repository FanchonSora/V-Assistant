import pytest
from app.services.notification_service import send_email

@pytest.mark.asyncio
async def test_send_email(monkeypatch):
    class DummySMTP:
        async def connect(self): pass
        async def login(self,u,p): pass
        async def send_message(self,msg): pass
        async def quit(self): pass
    monkeypatch.setattr('aiosmtplib.SMTP', lambda **kw: DummySMTP())
    # should not raise
    await send_email('to@test','subj','body')