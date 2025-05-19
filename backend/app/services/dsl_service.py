# app/services/dsl_service.py

from app.gen.dsl_parser import parse as antlr_parse

class DSLService:
    @staticmethod
    async def parse(text: str) -> dict:
        try:
            result = antlr_parse(text)
        except Exception as e:
            print("Parser error:", e)
            return {"error": "cannot_parse"}

        # Chỉ require có "action"
        if not isinstance(result, dict) or "action" not in result:
            return {"error": "cannot_parse Chỉ require có action"}

        return result