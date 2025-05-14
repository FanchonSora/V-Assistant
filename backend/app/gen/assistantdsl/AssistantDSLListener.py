# Generated from AssistantDSL.g4 by ANTLR 4.9.2
from antlr4 import *
if __name__ is not None and "." in __name__:
    from .AssistantDSLParser import AssistantDSLParser
else:
    from AssistantDSLParser import AssistantDSLParser

# This class defines a complete listener for a parse tree produced by AssistantDSLParser.
class AssistantDSLListener(ParseTreeListener):

    # Enter a parse tree produced by AssistantDSLParser#command.
    def enterCommand(self, ctx:AssistantDSLParser.CommandContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#command.
    def exitCommand(self, ctx:AssistantDSLParser.CommandContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#reminder.
    def enterReminder(self, ctx:AssistantDSLParser.ReminderContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#reminder.
    def exitReminder(self, ctx:AssistantDSLParser.ReminderContext):
        pass



del AssistantDSLParser