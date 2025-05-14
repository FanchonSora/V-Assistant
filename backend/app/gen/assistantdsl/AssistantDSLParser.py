# Generated from AssistantDSL.g4 by ANTLR 4.9.2
# encoding: utf-8
from antlr4 import *
from io import StringIO
import sys
if sys.version_info[1] > 5:
	from typing import TextIO
else:
	from typing.io import TextIO


def serializedATN():
    with StringIO() as buf:
        buf.write("\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3\n")
        buf.write("\22\4\2\t\2\4\3\t\3\3\2\3\2\3\2\3\3\3\3\3\3\3\3\3\3\3")
        buf.write("\3\3\3\3\3\3\3\2\2\4\2\4\2\2\2\17\2\6\3\2\2\2\4\t\3\2")
        buf.write("\2\2\6\7\5\4\3\2\7\b\7\2\2\3\b\3\3\2\2\2\t\n\7\3\2\2\n")
        buf.write("\13\7\4\2\2\13\f\7\5\2\2\f\r\7\b\2\2\r\16\7\6\2\2\16\17")
        buf.write("\7\t\2\2\17\20\7\7\2\2\20\5\3\2\2\2\2")
        return buf.getvalue()


class AssistantDSLParser ( Parser ):

    grammarFileName = "AssistantDSL.g4"

    atn = ATNDeserializer().deserialize(serializedATN())

    decisionsToDFA = [ DFA(ds, i) for i, ds in enumerate(atn.decisionToState) ]

    sharedContextCache = PredictionContextCache()

    literalNames = [ "<INVALID>", "'remind'", "'me'", "'to'", "'in'", "'minutes'" ]

    symbolicNames = [ "<INVALID>", "<INVALID>", "<INVALID>", "<INVALID>", 
                      "<INVALID>", "<INVALID>", "TITLE", "INT", "WS" ]

    RULE_command = 0
    RULE_reminder = 1

    ruleNames =  [ "command", "reminder" ]

    EOF = Token.EOF
    T__0=1
    T__1=2
    T__2=3
    T__3=4
    T__4=5
    TITLE=6
    INT=7
    WS=8

    def __init__(self, input:TokenStream, output:TextIO = sys.stdout):
        super().__init__(input, output)
        self.checkVersion("4.9.2")
        self._interp = ParserATNSimulator(self, self.atn, self.decisionsToDFA, self.sharedContextCache)
        self._predicates = None




    class CommandContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def reminder(self):
            return self.getTypedRuleContext(AssistantDSLParser.ReminderContext,0)


        def EOF(self):
            return self.getToken(AssistantDSLParser.EOF, 0)

        def getRuleIndex(self):
            return AssistantDSLParser.RULE_command

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterCommand" ):
                listener.enterCommand(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitCommand" ):
                listener.exitCommand(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitCommand" ):
                return visitor.visitCommand(self)
            else:
                return visitor.visitChildren(self)




    def command(self):

        localctx = AssistantDSLParser.CommandContext(self, self._ctx, self.state)
        self.enterRule(localctx, 0, self.RULE_command)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 4
            self.reminder()
            self.state = 5
            self.match(AssistantDSLParser.EOF)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class ReminderContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def TITLE(self):
            return self.getToken(AssistantDSLParser.TITLE, 0)

        def INT(self):
            return self.getToken(AssistantDSLParser.INT, 0)

        def getRuleIndex(self):
            return AssistantDSLParser.RULE_reminder

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterReminder" ):
                listener.enterReminder(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitReminder" ):
                listener.exitReminder(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitReminder" ):
                return visitor.visitReminder(self)
            else:
                return visitor.visitChildren(self)




    def reminder(self):

        localctx = AssistantDSLParser.ReminderContext(self, self._ctx, self.state)
        self.enterRule(localctx, 2, self.RULE_reminder)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 7
            self.match(AssistantDSLParser.T__0)
            self.state = 8
            self.match(AssistantDSLParser.T__1)
            self.state = 9
            self.match(AssistantDSLParser.T__2)
            self.state = 10
            self.match(AssistantDSLParser.TITLE)
            self.state = 11
            self.match(AssistantDSLParser.T__3)
            self.state = 12
            self.match(AssistantDSLParser.INT)
            self.state = 13
            self.match(AssistantDSLParser.T__4)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx





