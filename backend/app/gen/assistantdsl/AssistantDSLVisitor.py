# Generated from E:/Homework/PPl/Project/V-Assistant/backend/app/utils/../gen/AssistantDSL.g4 by ANTLR 4.13.2
from antlr4 import *
if "." in __name__:
    from .AssistantDSLParser import AssistantDSLParser
else:
    from AssistantDSLParser import AssistantDSLParser

# This class defines a complete generic visitor for a parse tree produced by AssistantDSLParser.

class AssistantDSLVisitor(ParseTreeVisitor):

    # Visit a parse tree produced by AssistantDSLParser#program.
    def visitProgram(self, ctx:AssistantDSLParser.ProgramContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#sentence.
    def visitSentence(self, ctx:AssistantDSLParser.SentenceContext):
        return self.visitChildren(ctx)



del AssistantDSLParser