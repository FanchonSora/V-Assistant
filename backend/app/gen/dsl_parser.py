from antlr4 import InputStream, CommonTokenStream
from datetime import datetime, timedelta
from datetime import datetime
import time

from .assistantdsl.AssistantDSLLexer import AssistantDSLLexer
from .assistantdsl.AssistantDSLParser import AssistantDSLParser
from .assistantdsl.AssistantDSLVisitor import AssistantDSLVisitor

class _Visitor(AssistantDSLVisitor):
    def visitProgram(self, ctx):
        return self.visit(ctx.command())

    # greeting -------------------------------------------------------
    def visitGreeting(self, ctx):
        # Dùng ctx.IDENTIFIER() vì rule greeting dùng IDENTIFIER
        name = ctx.IDENTIFIER().getText() if ctx.IDENTIFIER() else None
        return {"action": "greet", "name": name}

    # introduce ------------------------------------------------------
    def visitIntroduce(self, ctx):
        return {"action": "introduce", "name": "Fanchon"}

    # support --------------------------------------------------------
    def visitSupport(self, ctx):
        instructions = (
            "Các lệnh khả dụng:\n"
            " Remind me to <task> in <minutes/hours/days> OR at <YYYY-MM-DD HH:MM> repeat every <period> as <pending|done>\n"
            " Show tasks\n"
            " Delete task <task_reference>\n"
            " Update task <task_reference> set <field>=<value>\n"
            " What is your name\n"
            " Hi (or Hello, Hey) [my name is <your name>]"
        )
        return {"action": "instruction", "instructions": instructions}

    # create / remind -----------------------------------------------
    def visitCreateAction(self, ctx):
        title = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())

        # ---------- dueSpec ----------
        due = None
        task_date = None
        task_time = None
        if ctx.dueSpec():
            # Check first token of dueSpec: either 'in' or 'at'
            first = ctx.dueSpec().getChild(0).getText().lower()
            if first == "at":
                # Get DATE and TIME separately
                date_text = ctx.dueSpec().DATE().getText()       
                time_text = ctx.dueSpec().TIME().getText()
                # Parse datetime in given format
                task_date = datetime.strptime(date_text, "%Y-%m-%d").date()
                task_time = datetime.strptime(time_text, "%H:%M").time()
            else:
                # Relative: "in" INT timeUnit
                amount = int(ctx.dueSpec().INT().getText())
                unit = ctx.dueSpec().timeUnit().getText().lower()
                if unit.startswith("minute"):
                    due = datetime.utcnow() + timedelta(minutes=amount)
                elif unit.startswith("hour"):
                    due = datetime.utcnow() + timedelta(hours=amount)
                elif unit.startswith("day"):
                    due = datetime.utcnow() + timedelta(days=amount)
                
                if due:
                    task_date = due.date()
                    task_time = due.time()

        # ---------- repeat ----------
        repeat = None
        if ctx.rruleClause() and ctx.rruleClause().getChildCount() >= 3:
            repeat = ctx.rruleClause().getChild(2).getText().lower()
        # ---------- status ----------
        status = None
        if ctx.statusClause():
            status = ctx.statusClause().getChild(1).getText().lower()   # 'pending' | 'done'

        return {
            "action": "create",
            "title":  title,
            "task_date": task_date,
            "task_time": task_time,
            "repeat": repeat,
            "status": status,
        }
    
    # view -----------------------------------------------------------
    def visitViewAction(self, ctx):
        return {"action": "view"}

    # delete ---------------------------------------------------------
    def visitDeleteAction(self, ctx):
        ref = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())
        task_date = None
        task_time = None
        if ctx.dueSpec():
            first = ctx.dueSpec().getChild(0).getText().lower()
            if first == "at":
                date_text = ctx.dueSpec().DATE().getText()
                time_text = ctx.dueSpec().TIME().getText()
                task_date = datetime.strptime(date_text, "%Y-%m-%d").date()
                task_time = datetime.strptime(time_text, "%H:%M").time()
        return {
            "action": "delete",
            "title": ref,
            "task_date": task_date,
            "task_time": task_time,
        }

    # modify / update ------------------------------------------------
    def visitModifyAction(self, ctx):
        ref = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())
        task_date = None
        task_time = None
        if ctx.dueSpec():
            first = ctx.dueSpec().getChild(0).getText().lower()
            if first == "at":
                date_text = ctx.dueSpec().DATE().getText()
                time_text = ctx.dueSpec().TIME().getText()
                task_date = datetime.strptime(date_text, "%Y-%m-%d").date()
                task_time = datetime.strptime(time_text, "%H:%M").time()

        updates = {}
        for fa in ctx.fieldAssign():
            idents = fa.IDENTIFIER()
            if len(idents) == 2:
                key = idents[0].getText().lower()
                val = idents[1].getText()
            elif len(idents) == 1:
                key = idents[0].getText().lower()
                val = fa.STATUS().getText() if fa.STATUS() else None
            else:
                continue
            if key and val:
                updates[key] = val
        return {
            "action": "update",
            "title": ref,
            "task_date": task_date,
            "task_time": task_time,
            "updates": updates,
        }
    
    def visitAffirmative(self, ctx):
        return {"action": "confirm", "value": True}

    def visitNegative(self, ctx):
        return {"action": "confirm", "value": False}


def parse(text: str) -> dict:
    stream = InputStream(text)
    lexer = AssistantDSLLexer(stream)
    tokens = CommonTokenStream(lexer)
    parser = AssistantDSLParser(tokens)
    tree = parser.program()
    return _Visitor().visit(tree) or {"error": "cannot_parse"}