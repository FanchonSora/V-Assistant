# app/gen/dsl_parser.py
from antlr4 import InputStream, CommonTokenStream
from datetime import datetime, timedelta

from .assistantdsl.AssistantDSLLexer import AssistantDSLLexer
from .assistantdsl.AssistantDSLParser import AssistantDSLParser
from .assistantdsl.AssistantDSLVisitor import AssistantDSLVisitor  # make empty visitor

class _Visitor(AssistantDSLVisitor):
    def visitSentence(self, ctx):
        title = ctx.TITLE().getText().strip()
        mins  = int(ctx.INT().getText())
        due   = datetime.utcnow() + timedelta(minutes=mins)
        return {"title": title, "due": due}

    def visitProgram(self, ctx):
        return self.visit(ctx.sentence())

def parse(text: str) -> dict:
    stream  = InputStream(text)
    lexer   = AssistantDSLLexer(stream)
    parser  = AssistantDSLParser(CommonTokenStream(lexer))
    tree    = parser.program()
    return _Visitor().visit(tree) or {"error": "cannot_parse"}
