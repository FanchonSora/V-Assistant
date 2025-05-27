from antlr4 import InputStream, CommonTokenStream
from datetime import datetime, timedelta

from .assistantdsl.AssistantDSLLexer   import AssistantDSLLexer
from .assistantdsl.AssistantDSLParser  import AssistantDSLParser
from .assistantdsl.AssistantDSLVisitor import AssistantDSLVisitor


class _Visitor(AssistantDSLVisitor):
    # entry-point ────────────────────────────────────────────────────
    def visitProgram(self, ctx):
        return self.visit(ctx.command())
    
    # ───────────── greeting / introduce / asking ─────────────
    def visitGreeting(self, ctx):
        # grammar: kgreeting ('my' 'name' 'is' IDENTIFIER)?
        name = ctx.IDENTIFIER().getText() if ctx.IDENTIFIER() else None
        return {"action": "greet", "name": name}

    def visitIntroduce(self, ctx):
        # grammar: 'what' 'is' 'your' 'name' QUESTION?
        # We assume the user wants the bot to introduce itself.
        return {"action": "introduce"}
    
    def visitAsking(self, ctx):
        # grammar: kasking 'are' 'you' QUESTION?
        # Use the entire text as the question or grab the QUESTION token.
        question = ctx.getText()
        return {"action": "ask", "question": question}
    
    # ───────────── support (usage instructions) ─────────────
    def visitSupportTasks(self, ctx):
        return {"action": "instruction_tasks"}
    
    def visitSupportGreetings(self, ctx):
        return {"action": "instruction_greetings"}
    
    def visitSupportInfor(self, ctx):
        return {"action": "instruction_infor"}
    
    # ───────────── create / remind ─────────────
    def visitCreateAction(self, ctx):
        # Extract title: taskTitle is one or more IDENTIFIER tokens
        title = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())
        
        # ---------- dueSpec ----------
        task_date = None
        task_time = None
        if ctx.dueSpec():
            spec_ctx = ctx.dueSpec()
            first = spec_ctx.getChild(0).getText().lower()
            if first == "in":
                # Relative specification : in INT timeUnit
                amount = int(spec_ctx.INT().getText())
                unit = spec_ctx.timeUnit().getText().lower()
                delta = {
                    "minute": timedelta(minutes=amount),
                    "minutes": timedelta(minutes=amount),
                    "hour": timedelta(hours=amount),
                    "hours": timedelta(hours=amount),
                    "day": timedelta(days=amount),
                    "days": timedelta(days=amount)
                }.get(unit)
                if delta:
                    due = datetime.utcnow() + delta
                    task_date, task_time = due.date(), due.time()
            elif first == "at":
                # Absolute specification: at DATE TIME
                date_text = spec_ctx.DATE().getText()
                time_text = spec_ctx.TIME().getText()
                task_date = datetime.strptime(date_text, "%Y-%m-%d").date()
                task_time = datetime.strptime(time_text, "%H:%M").time()
        
        # ---------- rruleClause ----------
        repeat = None
        if ctx.rruleClause():
            # grammar: REPEAT EVERY INT? timeUnit
            # We assume the unit is the last child.
            repeat = ctx.rruleClause().getChild(ctx.rruleClause().getChildCount()-1).getText().lower()
        
        # ---------- statusClause ----------
        status = None
        if ctx.statusClause():
            # grammar: AS STATUS
            status = ctx.statusClause().STATUS().getText().lower()
        
        return {
            "action": "create",
            "title": title,
            "task_date": task_date,
            "task_time": task_time,
            "repeat": repeat,
            "status": status,
        }
    
    # ───────────── view / list ─────────────
    def visitViewAction(self, ctx):
        #date = ctx.DATE().getText() if ctx.DATE() and ctx.DATE().getText().strip() else None
        #return {"action": "view", "date": date}
        return {"action": "view"}
    
    # ───────────── delete ─────────────
    def visitDeleteAction(self, ctx):
        # Extract title from taskTitle rule (may have multiple identifiers)
        title = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())
        task_date = None
        task_time = None
        if ctx.dueSpec():
            spec_ctx = ctx.dueSpec()
            # If dueSpec uses absolute spec (at DATE TIME)
            if spec_ctx.DATE():
                date_text = spec_ctx.DATE().getText()
                task_date = datetime.strptime(date_text, "%Y-%m-%d").date()
            if spec_ctx.TIME():
                time_text = spec_ctx.TIME().getText()
                task_time = datetime.strptime(time_text, "%H:%M").time()
        return {
            "action": "delete",
            "title": title,
            "task_date": task_date,
            "task_time": task_time,
        }
    
    # ───────────── update / modify ─────────────
    def visitModifyAction(self, ctx):
        # Extract title from taskTitle rule
        title = " ".join(tok.getText() for tok in ctx.taskTitle().IDENTIFIER())
        task_date = None
        task_time = None
        if ctx.dueSpec():
            spec_ctx = ctx.dueSpec()
            if spec_ctx.DATE():
                date_text = spec_ctx.DATE().getText()
                task_date = datetime.strptime(date_text, "%Y-%m-%d").date()
            if spec_ctx.TIME():
                time_text = spec_ctx.TIME().getText()
                task_time = datetime.strptime(time_text, "%H:%M").time()
        # Process field assignments: one mandatory then possibly more separated by comma
        updates = {}
        # ctx.fieldAssign() returns a list of assignment nodes.
        for fa in ctx.fieldAssign():
            idents = fa.IDENTIFIER()
            if len(idents) == 2:
                key = idents[0].getText().lower()
                val = idents[1].getText()
            elif len(idents) == 1 and fa.STATUS():
                key = idents[0].getText().lower()
                val = fa.STATUS().getText().lower()
            else:
                continue
            updates[key] = val
        return {
            "action": "update",
            "title": title,
            "task_date": task_date,
            "task_time": task_time,
            "updates": updates,
        }
    
    # ───────────── cancel (set status = cancelled) ─────────────
    def visitCancelAction(self, ctx):
        # Assuming cancel uses the same taskTitle rule to reference the task.
        title = ctx.taskTitle().getText() if ctx.taskTitle() else None
        return {"action": "cancel", "title": title}
    
    # ───────────── confirmation ─────────────
    def visitAffirmative(self, _):
        return {"action": "confirm", "value": True}
    
    def visitNegative(self, _):
        return {"action": "confirm", "value": False}

# public helper ────────────────────────────────────────────────────
def parse(text: str) -> dict:
    stream  = InputStream(text)
    lexer   = AssistantDSLLexer(stream)
    tokens  = CommonTokenStream(lexer)
    parser  = AssistantDSLParser(tokens)
    tree    = parser.program()
    result  = _Visitor().visit(tree)
    return result if result else {"error": "cannot_parse"}