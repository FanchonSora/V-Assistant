from antlr4 import InputStream, CommonTokenStream
from datetime import datetime, timedelta

from .assistantdsl.AssistantDSLLexer import AssistantDSLLexer
from .assistantdsl.AssistantDSLParser import AssistantDSLParser
from .assistantdsl.AssistantDSLVisitor import AssistantDSLVisitor


class _Visitor(AssistantDSLVisitor):
    def visitProgram(self, ctx):
        return self.visit(ctx.command())

    # greeting -------------------------------------------------------
    def visitGreeting(self, ctx):
        # ctx.Name() tồn tại khi user ghi "my name is ..."
        name = ctx.Name().getText() if ctx.Name() else None
        return {"action": "greet", "name": name}

    # create / remind -----------------------------------------------
    def visitCreateAction(self, ctx):
        title = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())

        due = None
        if ctx.dueSpec():
            amount = int(ctx.dueSpec().INT().getText())
            unit_text = ctx.dueSpec().timeUnit().getText().lower()  # 👈 quét chuỗi

            if unit_text.startswith("minute"):
                due = datetime.utcnow() + timedelta(minutes=amount)
            elif unit_text.startswith("hour"):
                due = datetime.utcnow() + timedelta(hours=amount)
            elif unit_text.startswith("day"):
                due = datetime.utcnow() + timedelta(days=amount)

        return {"action": "create", "title": title, "due": due}
    
    # ───────────────────────────── view ────────────────────────────────
    def visitViewAction(self, ctx):
        # rule: (SHOW|LIST|VIEW) TASKS
        return {"action": "view"}

    # ───────────────────────────── delete ──────────────────────────────
    def visitDeleteAction(self, ctx):
        # rule: (DELETE|REMOVE) TASK taskTitle
        ref = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())
        return {"action": "delete", "task_ref": ref}

    # ───────────────────────────── modify / update ─────────────────────
    def visitModifyAction(self, ctx):
        # rule: (UPDATE|MODIFY) TASK taskTitle SET fieldAssign (',' fieldAssign)*
        ref = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())

        updates = {}
        for fa in ctx.fieldAssign():
            # fieldAssign : IDENTIFIER '='? IDENTIFIER ;
            key = fa.IDENTIFIER(0).getText().lower()
            val = fa.IDENTIFIER(1).getText()
            updates[key] = val

        return {"action": "update", "task_ref": ref, "updates": updates}


def parse(text: str) -> dict:
    """
    Parse user input with the case-insensitive grammar that đã generate sẵn.
    """
    stream = InputStream(text)
    lexer = AssistantDSLLexer(stream)
    tokens = CommonTokenStream(lexer)
    parser = AssistantDSLParser(tokens)
    tree = parser.program()
    return _Visitor().visit(tree) or {"error": "cannot_parse"}
