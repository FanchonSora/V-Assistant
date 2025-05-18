grammar AssistantDSL;

options { caseInsensitive = true; }

program   : command EOF ;
command   : greetingCommand | actionCommand ;

/* greeting ---------------------------------------------------------*/
greetingCommand : introduce | greeting ;
introduce       : 'What' 'is' 'your' 'name' ;
greeting        : ('Hi' | 'Hello' | 'Hey') ('my' 'name' 'is' Name)? ;

/* actions  ---------------------------------------------------------*/
actionCommand : createAction | viewAction | deleteAction | modifyAction ;

createAction : 'Remind' 'me' 'to' taskTitle dueSpec? ;
viewAction   : ('Show' | 'List' | 'View') 'tasks' ;
deleteAction : ('Delete' | 'Remove') 'task' taskTitle ;
modifyAction : ('Update' | 'Modify') 'task' taskTitle 'set' fieldAssign (',' fieldAssign)* ;

/* helpers  ---------------------------------------------------------*/
dueSpec     : 'in' INT timeUnit ;
timeUnit    : 'minute' 's'? | 'hour' 's'? | 'day' 's'? ;
fieldAssign : IDENTIFIER '='? IDENTIFIER ;
taskTitle   : IDENTIFIER (IDENTIFIER)* ;
Name        : IDENTIFIER ;

INT        : [0-9]+ ;
IDENTIFIER : [a-zA-Z0-9]+ ;
WS         : [ \t\r\n]+ -> skip ;
