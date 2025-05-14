# Generated from C:/Source/v-assistant/backend/app/utils/../gen/AssistantDSL.g4 by ANTLR 4.13.2
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


    # Visit a parse tree produced by AssistantDSLParser#expression.
    def visitExpression(self, ctx:AssistantDSLParser.ExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#opeexpression.
    def visitOpeexpression(self, ctx:AssistantDSLParser.OpeexpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#operation1st.
    def visitOperation1st(self, ctx:AssistantDSLParser.Operation1stContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#operation2nd.
    def visitOperation2nd(self, ctx:AssistantDSLParser.Operation2ndContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#term.
    def visitTerm(self, ctx:AssistantDSLParser.TermContext):
        return self.visitChildren(ctx)



del AssistantDSLParser