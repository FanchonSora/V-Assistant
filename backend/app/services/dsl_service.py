# backend/app/services/dsl_service.py

from app.gen.dsl_parser import parse as antlr_parse

class DSLService:
    @staticmethod
    async def parse(text: str) -> dict:
        """
        Wrapper xung quanh antlr_parse để luôn trả về
        {'error': 'cannot_parse'} chứ không ném.
        """
        try:
            result = antlr_parse(text)
        except Exception:
            # bất cứ lỗi gì trong parser hay visitor
            return {"error": "cannot_parse"}
        # nếu parser trả None hoặc dict không có key 'title'
        if not isinstance(result, dict) or "title" not in result:
            return {"error": "cannot_parse"}
        return result
