# app/services/dsl_service.py
"""
Real life: generate Lexer/Parser with ANTLR and walk the AST.
Here we stub it so /dsl/parse works and tests can evolve.
"""
import re
from datetime import datetime, timedelta

class DSLService:
    @staticmethod
    async def parse(text: str) -> dict:
        """
        Very simple grammar:
        “remind me to <title> in <N> minutes”
        returns {"title":…, "due": …}
        """
        m = re.fullmatch(r"remind me to (.+) in (\d+) minutes", text.strip(), re.I)
        if not m:
            return {"error": "cannot_parse"}
        title, mins = m.groups()
        return {
            "title": title,
            "due": (datetime.utcnow() + timedelta(minutes=int(mins))).isoformat()
        }
