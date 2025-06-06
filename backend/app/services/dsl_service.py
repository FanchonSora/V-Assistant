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

        # error input
        if not isinstance(result, dict) or "action" not in result:
            return {"error": "Error input! Please check your input again."}

        return result
