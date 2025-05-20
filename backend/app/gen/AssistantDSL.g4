grammar AssistantDSL;

options { caseInsensitive = true; }

/* ────────────── parser rules ────────────── */
program: command EOF ;
command: greetingCommand | actionCommand | supportCommand | confirmCommand ;

greetingCommand: introduce | greeting ;
introduce: 'What' 'is' 'your' 'name' ;
greeting: ('Hi' | 'Hello' | 'Hey') ('my' 'name' 'is' IDENTIFIER)? ;

supportCommand: 'Show' 'some' 'instructions' ;

actionCommand: createAction | viewAction | deleteAction | modifyAction ;
createAction: 'Remind' 'me' 'to' taskTitle dueSpec? rruleClause? statusClause? ;
viewAction: ('Show' | 'List' | 'View') 'tasks' ;
deleteAction: ('Delete' | 'Remove') 'task' taskTitle ;
modifyAction: ('Update' | 'Modify') 'task' taskTitle 'set' fieldAssign (',' fieldAssign)* ;

confirmCommand: affirmative | negative ;
affirmative: YES ;
negative: NO ;

dueSpec: ( 'in' INT timeUnit ) | ( 'at' DATE TIME ) ;
timeUnit: MINUTE | HOUR | DAY ;

rruleClause: 'repeat' 'every' IDENTIFIER ;
statusClause: 'as' ('pending' | 'done') ;
fieldAssign: IDENTIFIER '='? IDENTIFIER ;

/* task title dừng khi gặp “in” hay con số */
taskTitle: IDENTIFIER ( { self._input.LT(1).type not in { self.INT, self.MINUTE, self.HOUR, self.DAY } and self._input.LT(1).text.lower() != "in" }? IDENTIFIER )* ;

/* ────────────── lexer rules (lưu ý thứ tự ưu tiên) ────────────── */

YES: 'yes' | 'yep' | 'sure' | 'ok' ;
NO: 'no' | 'nope' ;

MINUTE: 'minute' | 'minutes' ;
HOUR: 'hour'   | 'hours' ;
DAY: 'day'    | 'days'  ;

DATE: [0-9][0-9][0-9][0-9] '-' [0-9][0-9] '-' [0-9][0-9] ;
TIME: [0-9][0-9] ':' [0-9][0-9] ;

INT: [0-9]+ ;
IDENTIFIER: [a-zA-Z_][a-zA-Z0-9_]* ;

WS: [ \t\r\n]+ -> skip ;
