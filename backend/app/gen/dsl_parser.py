# app/gen/dsl_parser.py
from antlr4 import InputStream, CommonTokenStream
from datetime import datetime, timedelta

from .assistantdsl.AssistantDSLLexer import AssistantDSLLexer
from .assistantdsl.AssistantDSLParser import AssistantDSLParser
from .assistantdsl.AssistantDSLVisitor import AssistantDSLVisitor  # make empty visitor

class _Visitor(AssistantDSLVisitor):
    def visitReminder(self, ctx):          # remind me to X in Y minutes
        title = ctx.TITLE().getText().strip()
        mins  = int(ctx.INT().getText())
        due   = datetime.utcnow() + timedelta(minutes=mins)
        return {"title": title, "due": due}

def parse(text: str) -> dict:
    stream  = InputStream(text)
    lexer   = AssistantDSLLexer(stream)
    parser  = AssistantDSLParser(CommonTokenStream(lexer))
    tree    = parser.command()
    return _Visitor().visit(tree) or {"error": "cannot_parse"}
