grammar AssistantDSL;

/*
 * cú pháp:
 *   remind me to submit report in 45 minutes
 *   remind me to water flowers in 3 minutes
 # script generate_parser.sh – chạy một lần hoặc CI để test 
    antlr4 -Dlanguage=Python3 -o app/gen/assistantdsl AssistantDSL.g4
 */

command  : reminder EOF ;

reminder
        : 'remind' 'me' 'to' TITLE 'in' INT 'minutes'
        ;

TITLE   : ~('i'|'I') (~('\r'|'\n'))+?   ;  // tham lam vừa đủ
INT     : [0-9]+ ;
WS      : [ \t\r\n]+ -> skip ;