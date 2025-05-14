# Generated from C:/Source/v-assistant/backend/app/utils/../gen/AssistantDSL.g4 by ANTLR 4.13.2
# encoding: utf-8
from antlr4 import *
from io import StringIO
import sys
if sys.version_info[1] > 5:
	from typing import TextIO
else:
	from typing.io import TextIO

def serializedATN():
    return [
        4,1,6,47,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,1,0,1,0,
        1,1,1,1,1,1,3,1,18,8,1,1,1,1,1,1,1,1,1,5,1,24,8,1,10,1,12,1,27,9,
        1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,5,2,36,8,2,10,2,12,2,39,9,2,1,3,1,
        3,1,4,1,4,1,5,1,5,1,5,0,2,2,4,6,0,2,4,6,8,10,0,2,1,0,1,2,1,0,3,4,
        43,0,12,1,0,0,0,2,17,1,0,0,0,4,28,1,0,0,0,6,40,1,0,0,0,8,42,1,0,
        0,0,10,44,1,0,0,0,12,13,3,2,1,0,13,1,1,0,0,0,14,15,6,1,-1,0,15,18,
        3,10,5,0,16,18,3,4,2,0,17,14,1,0,0,0,17,16,1,0,0,0,18,25,1,0,0,0,
        19,20,10,3,0,0,20,21,3,8,4,0,21,22,3,2,1,4,22,24,1,0,0,0,23,19,1,
        0,0,0,24,27,1,0,0,0,25,23,1,0,0,0,25,26,1,0,0,0,26,3,1,0,0,0,27,
        25,1,0,0,0,28,29,6,2,-1,0,29,30,3,10,5,0,30,37,1,0,0,0,31,32,10,
        2,0,0,32,33,3,6,3,0,33,34,3,4,2,3,34,36,1,0,0,0,35,31,1,0,0,0,36,
        39,1,0,0,0,37,35,1,0,0,0,37,38,1,0,0,0,38,5,1,0,0,0,39,37,1,0,0,
        0,40,41,7,0,0,0,41,7,1,0,0,0,42,43,7,1,0,0,43,9,1,0,0,0,44,45,5,
        5,0,0,45,11,1,0,0,0,3,17,25,37
    ]

class AssistantDSLParser ( Parser ):

    grammarFileName = "AssistantDSL.g4"

    atn = ATNDeserializer().deserialize(serializedATN())

    decisionsToDFA = [ DFA(ds, i) for i, ds in enumerate(atn.decisionToState) ]

    sharedContextCache = PredictionContextCache()

    literalNames = [ "<INVALID>", "'*'", "'/'", "'+'", "'-'" ]

    symbolicNames = [ "<INVALID>", "<INVALID>", "<INVALID>", "<INVALID>", 
                      "<INVALID>", "Integer", "WS" ]

    RULE_program = 0
    RULE_expression = 1
    RULE_opeexpression = 2
    RULE_operation1st = 3
    RULE_operation2nd = 4
    RULE_term = 5

    ruleNames =  [ "program", "expression", "opeexpression", "operation1st", 
                   "operation2nd", "term" ]

    EOF = Token.EOF
    T__0=1
    T__1=2
    T__2=3
    T__3=4
    Integer=5
    WS=6

    def __init__(self, input:TokenStream, output:TextIO = sys.stdout):
        super().__init__(input, output)
        self.checkVersion("4.13.2")
        self._interp = ParserATNSimulator(self, self.atn, self.decisionsToDFA, self.sharedContextCache)
        self._predicates = None




    class ProgramContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def expression(self):
            return self.getTypedRuleContext(AssistantDSLParser.ExpressionContext,0)


        def getRuleIndex(self):
            return AssistantDSLParser.RULE_program

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterProgram" ):
                listener.enterProgram(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitProgram" ):
                listener.exitProgram(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitProgram" ):
                return visitor.visitProgram(self)
            else:
                return visitor.visitChildren(self)




    def program(self):

        localctx = AssistantDSLParser.ProgramContext(self, self._ctx, self.state)
        self.enterRule(localctx, 0, self.RULE_program)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 12
            self.expression(0)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class ExpressionContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def term(self):
            return self.getTypedRuleContext(AssistantDSLParser.TermContext,0)


        def opeexpression(self):
            return self.getTypedRuleContext(AssistantDSLParser.OpeexpressionContext,0)


        def expression(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(AssistantDSLParser.ExpressionContext)
            else:
                return self.getTypedRuleContext(AssistantDSLParser.ExpressionContext,i)


        def operation2nd(self):
            return self.getTypedRuleContext(AssistantDSLParser.Operation2ndContext,0)


        def getRuleIndex(self):
            return AssistantDSLParser.RULE_expression

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterExpression" ):
                listener.enterExpression(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitExpression" ):
                listener.exitExpression(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitExpression" ):
                return visitor.visitExpression(self)
            else:
                return visitor.visitChildren(self)



    def expression(self, _p:int=0):
        _parentctx = self._ctx
        _parentState = self.state
        localctx = AssistantDSLParser.ExpressionContext(self, self._ctx, _parentState)
        _prevctx = localctx
        _startState = 2
        self.enterRecursionRule(localctx, 2, self.RULE_expression, _p)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 17
            self._errHandler.sync(self)
            la_ = self._interp.adaptivePredict(self._input,0,self._ctx)
            if la_ == 1:
                self.state = 15
                self.term()
                pass

            elif la_ == 2:
                self.state = 16
                self.opeexpression(0)
                pass


            self._ctx.stop = self._input.LT(-1)
            self.state = 25
            self._errHandler.sync(self)
            _alt = self._interp.adaptivePredict(self._input,1,self._ctx)
            while _alt!=2 and _alt!=ATN.INVALID_ALT_NUMBER:
                if _alt==1:
                    if self._parseListeners is not None:
                        self.triggerExitRuleEvent()
                    _prevctx = localctx
                    localctx = AssistantDSLParser.ExpressionContext(self, _parentctx, _parentState)
                    self.pushNewRecursionContext(localctx, _startState, self.RULE_expression)
                    self.state = 19
                    if not self.precpred(self._ctx, 3):
                        from antlr4.error.Errors import FailedPredicateException
                        raise FailedPredicateException(self, "self.precpred(self._ctx, 3)")
                    self.state = 20
                    self.operation2nd()
                    self.state = 21
                    self.expression(4) 
                self.state = 27
                self._errHandler.sync(self)
                _alt = self._interp.adaptivePredict(self._input,1,self._ctx)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.unrollRecursionContexts(_parentctx)
        return localctx


    class OpeexpressionContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def term(self):
            return self.getTypedRuleContext(AssistantDSLParser.TermContext,0)


        def opeexpression(self, i:int=None):
            if i is None:
                return self.getTypedRuleContexts(AssistantDSLParser.OpeexpressionContext)
            else:
                return self.getTypedRuleContext(AssistantDSLParser.OpeexpressionContext,i)


        def operation1st(self):
            return self.getTypedRuleContext(AssistantDSLParser.Operation1stContext,0)


        def getRuleIndex(self):
            return AssistantDSLParser.RULE_opeexpression

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterOpeexpression" ):
                listener.enterOpeexpression(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitOpeexpression" ):
                listener.exitOpeexpression(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitOpeexpression" ):
                return visitor.visitOpeexpression(self)
            else:
                return visitor.visitChildren(self)



    def opeexpression(self, _p:int=0):
        _parentctx = self._ctx
        _parentState = self.state
        localctx = AssistantDSLParser.OpeexpressionContext(self, self._ctx, _parentState)
        _prevctx = localctx
        _startState = 4
        self.enterRecursionRule(localctx, 4, self.RULE_opeexpression, _p)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 29
            self.term()
            self._ctx.stop = self._input.LT(-1)
            self.state = 37
            self._errHandler.sync(self)
            _alt = self._interp.adaptivePredict(self._input,2,self._ctx)
            while _alt!=2 and _alt!=ATN.INVALID_ALT_NUMBER:
                if _alt==1:
                    if self._parseListeners is not None:
                        self.triggerExitRuleEvent()
                    _prevctx = localctx
                    localctx = AssistantDSLParser.OpeexpressionContext(self, _parentctx, _parentState)
                    self.pushNewRecursionContext(localctx, _startState, self.RULE_opeexpression)
                    self.state = 31
                    if not self.precpred(self._ctx, 2):
                        from antlr4.error.Errors import FailedPredicateException
                        raise FailedPredicateException(self, "self.precpred(self._ctx, 2)")
                    self.state = 32
                    self.operation1st()
                    self.state = 33
                    self.opeexpression(3) 
                self.state = 39
                self._errHandler.sync(self)
                _alt = self._interp.adaptivePredict(self._input,2,self._ctx)

        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.unrollRecursionContexts(_parentctx)
        return localctx


    class Operation1stContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser


        def getRuleIndex(self):
            return AssistantDSLParser.RULE_operation1st

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterOperation1st" ):
                listener.enterOperation1st(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitOperation1st" ):
                listener.exitOperation1st(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitOperation1st" ):
                return visitor.visitOperation1st(self)
            else:
                return visitor.visitChildren(self)




    def operation1st(self):

        localctx = AssistantDSLParser.Operation1stContext(self, self._ctx, self.state)
        self.enterRule(localctx, 6, self.RULE_operation1st)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 40
            _la = self._input.LA(1)
            if not(_la==1 or _la==2):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class Operation2ndContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser


        def getRuleIndex(self):
            return AssistantDSLParser.RULE_operation2nd

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterOperation2nd" ):
                listener.enterOperation2nd(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitOperation2nd" ):
                listener.exitOperation2nd(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitOperation2nd" ):
                return visitor.visitOperation2nd(self)
            else:
                return visitor.visitChildren(self)




    def operation2nd(self):

        localctx = AssistantDSLParser.Operation2ndContext(self, self._ctx, self.state)
        self.enterRule(localctx, 8, self.RULE_operation2nd)
        self._la = 0 # Token type
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 42
            _la = self._input.LA(1)
            if not(_la==3 or _la==4):
                self._errHandler.recoverInline(self)
            else:
                self._errHandler.reportMatch(self)
                self.consume()
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx


    class TermContext(ParserRuleContext):
        __slots__ = 'parser'

        def __init__(self, parser, parent:ParserRuleContext=None, invokingState:int=-1):
            super().__init__(parent, invokingState)
            self.parser = parser

        def Integer(self):
            return self.getToken(AssistantDSLParser.Integer, 0)

        def getRuleIndex(self):
            return AssistantDSLParser.RULE_term

        def enterRule(self, listener:ParseTreeListener):
            if hasattr( listener, "enterTerm" ):
                listener.enterTerm(self)

        def exitRule(self, listener:ParseTreeListener):
            if hasattr( listener, "exitTerm" ):
                listener.exitTerm(self)

        def accept(self, visitor:ParseTreeVisitor):
            if hasattr( visitor, "visitTerm" ):
                return visitor.visitTerm(self)
            else:
                return visitor.visitChildren(self)




    def term(self):

        localctx = AssistantDSLParser.TermContext(self, self._ctx, self.state)
        self.enterRule(localctx, 10, self.RULE_term)
        try:
            self.enterOuterAlt(localctx, 1)
            self.state = 44
            self.match(AssistantDSLParser.Integer)
        except RecognitionException as re:
            localctx.exception = re
            self._errHandler.reportError(self, re)
            self._errHandler.recover(self, re)
        finally:
            self.exitRule()
        return localctx



    def sempred(self, localctx:RuleContext, ruleIndex:int, predIndex:int):
        if self._predicates == None:
            self._predicates = dict()
        self._predicates[1] = self.expression_sempred
        self._predicates[2] = self.opeexpression_sempred
        pred = self._predicates.get(ruleIndex, None)
        if pred is None:
            raise Exception("No predicate with index:" + str(ruleIndex))
        else:
            return pred(localctx, predIndex)

    def expression_sempred(self, localctx:ExpressionContext, predIndex:int):
            if predIndex == 0:
                return self.precpred(self._ctx, 3)
         

    def opeexpression_sempred(self, localctx:OpeexpressionContext, predIndex:int):
            if predIndex == 1:
                return self.precpred(self._ctx, 2)
         




