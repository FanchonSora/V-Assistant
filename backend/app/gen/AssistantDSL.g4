grammar AssistantDSL;
options { caseInsensitive = true; }

// ────────────── parser rules ──────────────
program: command EOF;

command: greetingCommand | actionCommand | supportCommand | confirmCommand;
greetingCommand: introduce | greeting;
actionCommand: createAction | viewAction | deleteAction | modifyAction;
supportCommand: ksupport;
confirmCommand: affirmative | negative;

// greetings
introduce: 'what' 'is' 'your' 'name' QUESTION?;
greeting: kgreeting ('my' 'name' 'is' IDENTIFIER)?;

// actions
createAction: kcreate taskTitle dueSpec? rruleClause? statusClause?;
viewAction: kview;
deleteAction: kdelete taskTitle dueSpec?;
modifyAction: kmodify taskTitle dueSpec? SET fieldAssign (',' fieldAssign)*;

// helper clauses (actions command)
dueSpec: IN INT timeUnit | AT DATE TIME;
timeUnit: MINUTE | HOUR | DAY;
rruleClause: REPEAT EVERY INT timeUnit;
statusClause: AS STATUS;
fieldAssign: IDENTIFIER '=' (IDENTIFIER | STATUS);
taskTitle: IDENTIFIER ( ~(IN | INT | MINUTE | HOUR | DAY) IDENTIFIER )*;

// confirmations
affirmative: YES;
negative: NO;

// keyword groups
kintroduce : ; // placeholder for compatibility
kgreeting: KGREETING;
ksupport: ('show' | 'view' | 'list' | 'Show' | 'View' | 'List' | 'SHOW' | 'VIEW' | 'LIST') 'some' 'instructions';
kcreate: ('remind' | 'create' | 'Remind' | 'Create' | 'REMIND' | 'CREATE') 'me' 'to';
kview: ('show' | 'list' | 'view' | 'Show' | 'List' | 'View' | 'SHOW' | 'LIST' | 'VIEW') 'tasks';
kdelete: ('delete' | 'remove' | 'Delete' | 'Remove' | 'DELETE' | 'REMOVE') 'task';
kmodify: ('update' | 'modify' | 'Update' | 'Modify' | 'UPDATE' | 'MODIFY') 'task';

// ────────────── lexer rules ──────────────
QUESTION: '?';
KGREETING: 'hi' | 'hello' | 'hey' | 'Hi' | 'HI' | 'Hello' | 'HELLO' | 'Hey' | 'HEY';

// reserved single-word tokens (appear before IDENTIFIER) if not it will define the INDENTIFIER before reserved the word
IN: 'in';
AT: 'at';
REPEAT: 'repeat';
EVERY: 'every';
AS: 'as';
SET: 'set';

// yes / no
YES: 'yes' | 'yep' | 'ok' | 'Yes' | 'Yep' | 'Ok' | 'YES' | 'YEP' | 'OK';
NO: 'no' | 'nope' | 'NO' | 'NOPE' | 'No' | 'Nope';

// status
STATUS: 'pending' | 'done';

// time units
MINUTE: 'minute' | 'minutes';
HOUR: 'hour' | 'hours';
DAY: 'day' | 'days';

// literals
DATE: [0-9][0-9][0-9][0-9] '-' [0-9][0-9] '-' [0-9][0-9];
TIME: [0-9][0-9] ':' [0-9][0-9];
INT: [0-9]+;

// identifier
IDENTIFIER: [a-zA-Z][a-zA-Z0-9]*;

// whitespace
WS: [ \t\r\n]+ -> skip;