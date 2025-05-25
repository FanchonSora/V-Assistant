# Generated from E:/Homework/PPl/Project/V-Assistant/backend/app/utils/../gen/AssistantDSL.g4 by ANTLR 4.13.2
from antlr4 import *
if "." in __name__:
    from .AssistantDSLParser import AssistantDSLParser
else:
    from AssistantDSLParser import AssistantDSLParser

# This class defines a complete listener for a parse tree produced by AssistantDSLParser.
class AssistantDSLListener(ParseTreeListener):

    # Enter a parse tree produced by AssistantDSLParser#program.
    def enterProgram(self, ctx:AssistantDSLParser.ProgramContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#program.
    def exitProgram(self, ctx:AssistantDSLParser.ProgramContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#command.
    def enterCommand(self, ctx:AssistantDSLParser.CommandContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#command.
    def exitCommand(self, ctx:AssistantDSLParser.CommandContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#greetingCommand.
    def enterGreetingCommand(self, ctx:AssistantDSLParser.GreetingCommandContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#greetingCommand.
    def exitGreetingCommand(self, ctx:AssistantDSLParser.GreetingCommandContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#actionCommand.
    def enterActionCommand(self, ctx:AssistantDSLParser.ActionCommandContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#actionCommand.
    def exitActionCommand(self, ctx:AssistantDSLParser.ActionCommandContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#supportCommand.
    def enterSupportCommand(self, ctx:AssistantDSLParser.SupportCommandContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#supportCommand.
    def exitSupportCommand(self, ctx:AssistantDSLParser.SupportCommandContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#confirmCommand.
    def enterConfirmCommand(self, ctx:AssistantDSLParser.ConfirmCommandContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#confirmCommand.
    def exitConfirmCommand(self, ctx:AssistantDSLParser.ConfirmCommandContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#introduce.
    def enterIntroduce(self, ctx:AssistantDSLParser.IntroduceContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#introduce.
    def exitIntroduce(self, ctx:AssistantDSLParser.IntroduceContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#greeting.
    def enterGreeting(self, ctx:AssistantDSLParser.GreetingContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#greeting.
    def exitGreeting(self, ctx:AssistantDSLParser.GreetingContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#createAction.
    def enterCreateAction(self, ctx:AssistantDSLParser.CreateActionContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#createAction.
    def exitCreateAction(self, ctx:AssistantDSLParser.CreateActionContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#viewAction.
    def enterViewAction(self, ctx:AssistantDSLParser.ViewActionContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#viewAction.
    def exitViewAction(self, ctx:AssistantDSLParser.ViewActionContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#deleteAction.
    def enterDeleteAction(self, ctx:AssistantDSLParser.DeleteActionContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#deleteAction.
    def exitDeleteAction(self, ctx:AssistantDSLParser.DeleteActionContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#modifyAction.
    def enterModifyAction(self, ctx:AssistantDSLParser.ModifyActionContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#modifyAction.
    def exitModifyAction(self, ctx:AssistantDSLParser.ModifyActionContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#dueSpec.
    def enterDueSpec(self, ctx:AssistantDSLParser.DueSpecContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#dueSpec.
    def exitDueSpec(self, ctx:AssistantDSLParser.DueSpecContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#timeUnit.
    def enterTimeUnit(self, ctx:AssistantDSLParser.TimeUnitContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#timeUnit.
    def exitTimeUnit(self, ctx:AssistantDSLParser.TimeUnitContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#rruleClause.
    def enterRruleClause(self, ctx:AssistantDSLParser.RruleClauseContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#rruleClause.
    def exitRruleClause(self, ctx:AssistantDSLParser.RruleClauseContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#statusClause.
    def enterStatusClause(self, ctx:AssistantDSLParser.StatusClauseContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#statusClause.
    def exitStatusClause(self, ctx:AssistantDSLParser.StatusClauseContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#fieldAssign.
    def enterFieldAssign(self, ctx:AssistantDSLParser.FieldAssignContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#fieldAssign.
    def exitFieldAssign(self, ctx:AssistantDSLParser.FieldAssignContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#taskTitle.
    def enterTaskTitle(self, ctx:AssistantDSLParser.TaskTitleContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#taskTitle.
    def exitTaskTitle(self, ctx:AssistantDSLParser.TaskTitleContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#affirmative.
    def enterAffirmative(self, ctx:AssistantDSLParser.AffirmativeContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#affirmative.
    def exitAffirmative(self, ctx:AssistantDSLParser.AffirmativeContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#negative.
    def enterNegative(self, ctx:AssistantDSLParser.NegativeContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#negative.
    def exitNegative(self, ctx:AssistantDSLParser.NegativeContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#kintroduce.
    def enterKintroduce(self, ctx:AssistantDSLParser.KintroduceContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#kintroduce.
    def exitKintroduce(self, ctx:AssistantDSLParser.KintroduceContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#kgreeting.
    def enterKgreeting(self, ctx:AssistantDSLParser.KgreetingContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#kgreeting.
    def exitKgreeting(self, ctx:AssistantDSLParser.KgreetingContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#ksupport.
    def enterKsupport(self, ctx:AssistantDSLParser.KsupportContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#ksupport.
    def exitKsupport(self, ctx:AssistantDSLParser.KsupportContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#kcreate.
    def enterKcreate(self, ctx:AssistantDSLParser.KcreateContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#kcreate.
    def exitKcreate(self, ctx:AssistantDSLParser.KcreateContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#kview.
    def enterKview(self, ctx:AssistantDSLParser.KviewContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#kview.
    def exitKview(self, ctx:AssistantDSLParser.KviewContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#kdelete.
    def enterKdelete(self, ctx:AssistantDSLParser.KdeleteContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#kdelete.
    def exitKdelete(self, ctx:AssistantDSLParser.KdeleteContext):
        pass


    # Enter a parse tree produced by AssistantDSLParser#kmodify.
    def enterKmodify(self, ctx:AssistantDSLParser.KmodifyContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#kmodify.
    def exitKmodify(self, ctx:AssistantDSLParser.KmodifyContext):
        pass



del AssistantDSLParser