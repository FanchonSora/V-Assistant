# Generated from AssistantDSL.g4 by ANTLR 4.9.2
from antlr4 import *
if __name__ is not None and "." in __name__:
    from .AssistantDSLParser import AssistantDSLParser
else:
    from AssistantDSLParser import AssistantDSLParser

# This class defines a complete generic visitor for a parse tree produced by AssistantDSLParser.

class AssistantDSLVisitor(ParseTreeVisitor):

    # Visit a parse tree produced by AssistantDSLParser#command.
    def visitCommand(self, ctx:AssistantDSLParser.CommandContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#reminder.
    def visitReminder(self, ctx:AssistantDSLParser.ReminderContext):
        return self.visitChildren(ctx)



del AssistantDSLParser