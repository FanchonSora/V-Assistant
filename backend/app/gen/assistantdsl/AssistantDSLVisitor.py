# Generated from AssistantDSL.g4 by ANTLR 4.13.2
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


    # Visit a parse tree produced by AssistantDSLParser#command.
    def visitCommand(self, ctx:AssistantDSLParser.CommandContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#greetingCommand.
    def visitGreetingCommand(self, ctx:AssistantDSLParser.GreetingCommandContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#actionCommand.
    def visitActionCommand(self, ctx:AssistantDSLParser.ActionCommandContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#supportCommand.
    def visitSupportCommand(self, ctx:AssistantDSLParser.SupportCommandContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#confirmCommand.
    def visitConfirmCommand(self, ctx:AssistantDSLParser.ConfirmCommandContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#supportTasks.
    def visitSupportTasks(self, ctx:AssistantDSLParser.SupportTasksContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#supportGreetings.
    def visitSupportGreetings(self, ctx:AssistantDSLParser.SupportGreetingsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#supportInfor.
    def visitSupportInfor(self, ctx:AssistantDSLParser.SupportInforContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#introduce.
    def visitIntroduce(self, ctx:AssistantDSLParser.IntroduceContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#greeting.
    def visitGreeting(self, ctx:AssistantDSLParser.GreetingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#asking.
    def visitAsking(self, ctx:AssistantDSLParser.AskingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#createAction.
    def visitCreateAction(self, ctx:AssistantDSLParser.CreateActionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#viewAction.
    def visitViewAction(self, ctx:AssistantDSLParser.ViewActionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#deleteAction.
    def visitDeleteAction(self, ctx:AssistantDSLParser.DeleteActionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#modifyAction.
    def visitModifyAction(self, ctx:AssistantDSLParser.ModifyActionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#dueSpec.
    def visitDueSpec(self, ctx:AssistantDSLParser.DueSpecContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#timeUnit.
    def visitTimeUnit(self, ctx:AssistantDSLParser.TimeUnitContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#rruleClause.
    def visitRruleClause(self, ctx:AssistantDSLParser.RruleClauseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#statusClause.
    def visitStatusClause(self, ctx:AssistantDSLParser.StatusClauseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#fieldAssign.
    def visitFieldAssign(self, ctx:AssistantDSLParser.FieldAssignContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#taskTitle.
    def visitTaskTitle(self, ctx:AssistantDSLParser.TaskTitleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#affirmative.
    def visitAffirmative(self, ctx:AssistantDSLParser.AffirmativeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#negative.
    def visitNegative(self, ctx:AssistantDSLParser.NegativeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#kintroduce.
    def visitKintroduce(self, ctx:AssistantDSLParser.KintroduceContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#kgreeting.
    def visitKgreeting(self, ctx:AssistantDSLParser.KgreetingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#kasking.
    def visitKasking(self, ctx:AssistantDSLParser.KaskingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#kcreate.
    def visitKcreate(self, ctx:AssistantDSLParser.KcreateContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#kdelete.
    def visitKdelete(self, ctx:AssistantDSLParser.KdeleteContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by AssistantDSLParser#kmodify.
    def visitKmodify(self, ctx:AssistantDSLParser.KmodifyContext):
        return self.visitChildren(ctx)



del AssistantDSLParser