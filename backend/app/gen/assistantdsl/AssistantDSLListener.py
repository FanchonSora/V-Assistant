# Generated from C:/Source/v-assistant/backend/app/utils/../gen/AssistantDSL.g4 by ANTLR 4.13.2
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


    # Enter a parse tree produced by AssistantDSLParser#actionCommand.
    def enterActionCommand(self, ctx:AssistantDSLParser.ActionCommandContext):
        pass

    # Exit a parse tree produced by AssistantDSLParser#actionCommand.
    def exitActionCommand(self, ctx:AssistantDSLParser.ActionCommandContext):
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



del AssistantDSLParser