# Generated from AssistantDSL.g4 by ANTLR 4.9.2
from antlr4 import *
from io import StringIO
import sys
if sys.version_info[1] > 5:
    from typing import TextIO
else:
    from typing.io import TextIO



def serializedATN():
    with StringIO() as buf:
        buf.write("\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2\n")
        buf.write("=\b\1\4\2\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7")
        buf.write("\4\b\t\b\4\t\t\t\3\2\3\2\3\2\3\2\3\2\3\2\3\2\3\3\3\3\3")
        buf.write("\3\3\4\3\4\3\4\3\5\3\5\3\5\3\6\3\6\3\6\3\6\3\6\3\6\3\6")
        buf.write("\3\6\3\7\3\7\6\7.\n\7\r\7\16\7/\3\b\6\b\63\n\b\r\b\16")
        buf.write("\b\64\3\t\6\t8\n\t\r\t\16\t9\3\t\3\t\3/\2\n\3\3\5\4\7")
        buf.write("\5\t\6\13\7\r\b\17\t\21\n\3\2\6\4\2KKkk\4\2\f\f\17\17")
        buf.write("\3\2\62;\5\2\13\f\17\17\"\"\2?\2\3\3\2\2\2\2\5\3\2\2\2")
        buf.write("\2\7\3\2\2\2\2\t\3\2\2\2\2\13\3\2\2\2\2\r\3\2\2\2\2\17")
        buf.write("\3\2\2\2\2\21\3\2\2\2\3\23\3\2\2\2\5\32\3\2\2\2\7\35\3")
        buf.write("\2\2\2\t \3\2\2\2\13#\3\2\2\2\r+\3\2\2\2\17\62\3\2\2\2")
        buf.write("\21\67\3\2\2\2\23\24\7t\2\2\24\25\7g\2\2\25\26\7o\2\2")
        buf.write("\26\27\7k\2\2\27\30\7p\2\2\30\31\7f\2\2\31\4\3\2\2\2\32")
        buf.write("\33\7o\2\2\33\34\7g\2\2\34\6\3\2\2\2\35\36\7v\2\2\36\37")
        buf.write("\7q\2\2\37\b\3\2\2\2 !\7k\2\2!\"\7p\2\2\"\n\3\2\2\2#$")
        buf.write("\7o\2\2$%\7k\2\2%&\7p\2\2&\'\7w\2\2\'(\7v\2\2()\7g\2\2")
        buf.write(")*\7u\2\2*\f\3\2\2\2+-\n\2\2\2,.\n\3\2\2-,\3\2\2\2./\3")
        buf.write("\2\2\2/\60\3\2\2\2/-\3\2\2\2\60\16\3\2\2\2\61\63\t\4\2")
        buf.write("\2\62\61\3\2\2\2\63\64\3\2\2\2\64\62\3\2\2\2\64\65\3\2")
        buf.write("\2\2\65\20\3\2\2\2\668\t\5\2\2\67\66\3\2\2\289\3\2\2\2")
        buf.write("9\67\3\2\2\29:\3\2\2\2:;\3\2\2\2;<\b\t\2\2<\22\3\2\2\2")
        buf.write("\6\2/\649\3\b\2\2")
        return buf.getvalue()


class AssistantDSLLexer(Lexer):

    atn = ATNDeserializer().deserialize(serializedATN())

    decisionsToDFA = [ DFA(ds, i) for i, ds in enumerate(atn.decisionToState) ]

    T__0 = 1
    T__1 = 2
    T__2 = 3
    T__3 = 4
    T__4 = 5
    TITLE = 6
    INT = 7
    WS = 8

    channelNames = [ u"DEFAULT_TOKEN_CHANNEL", u"HIDDEN" ]

    modeNames = [ "DEFAULT_MODE" ]

    literalNames = [ "<INVALID>",
            "'remind'", "'me'", "'to'", "'in'", "'minutes'" ]

    symbolicNames = [ "<INVALID>",
            "TITLE", "INT", "WS" ]

    ruleNames = [ "T__0", "T__1", "T__2", "T__3", "T__4", "TITLE", "INT", 
                  "WS" ]

    grammarFileName = "AssistantDSL.g4"

    def __init__(self, input=None, output:TextIO = sys.stdout):
        super().__init__(input, output)
        self.checkVersion("4.9.2")
        self._interp = LexerATNSimulator(self, self.atn, self.decisionsToDFA, PredictionContextCache())
        self._actions = None
        self._predicates = None


