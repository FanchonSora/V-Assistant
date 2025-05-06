# notification_service.py

import aiosmtplib
from email.message import EmailMessage
from fastapi import background

from app.core.config import settings

async def send_email(
    recipient: str,
    subject: str,
    body: str
) -> None:
    """
    Gửi email async qua SMTP.
    """
    msg = EmailMessage()
    msg["From"]    = settings.SMTP_FROM
    msg["To"]      = recipient
    msg["Subject"] = subject
    msg.set_content(body)

    smtp = aiosmtplib.SMTP(
        hostname=settings.SMTP_HOST,
        port=settings.SMTP_PORT,
        start_tls=True
    )
    await smtp.connect()
    await smtp.login(settings.SMTP_USER, settings.SMTP_PASS)
    await smtp.send_message(msg)
    await smtp.quit()
