grammar AssistantDSL;
options { caseInsensitive = true; }

// ────────────── parser rules ──────────────
program: command EOF;

command: greetingCommand | actionCommand | supportCommand | confirmCommand;
greetingCommand: introduce | greeting | asking;
actionCommand: createAction | viewAction | deleteAction | modifyAction;
supportCommand: supportTasks | supportGreetings | supportInfor;
confirmCommand: affirmative | negative;

// support 
supportTasks: KSUPPORT 'tasks' 'instructions';
supportGreetings: KSUPPORT 'greeting' 'instructions';
supportInfor: KSUPPORT 'bot' 'information';

// greetings
introduce: 'what' 'is' 'your' 'name' QUESTION?;
greeting: kgreeting ('my' 'name' 'is' IDENTIFIER)?;
asking: kasking 'are' 'you' QUESTION?;

// actions
createAction: kcreate taskTitle dueSpec? rruleClause? statusClause?;
viewAction: KVIEW 'tasks';
deleteAction: kdelete taskTitle dueSpec?;
modifyAction: kmodify taskTitle dueSpec? SET fieldAssign (',' fieldAssign)*;

// helper clauses (actions command)
dueSpec: IN INT timeUnit | AT DATE TIME;
timeUnit: MINUTE | HOUR | DAY;
rruleClause: REPEAT EVERY INT? timeUnit;
statusClause: AS STATUS;
fieldAssign: IDENTIFIER '=' (IDENTIFIER | STATUS);
taskTitle: IDENTIFIER (IDENTIFIER)*;

// confirmations
affirmative: YES;
negative: NO;

// keyword groups
kintroduce : ; // placeholder for compatibility
kgreeting: KGREETING;
kasking: KASKING;
kcreate: KCREATE 'me'? 'to'?;
kdelete: KDELETE 'task';
kmodify: KMODIFY 'task';

// ────────────── lexer rules ──────────────
QUESTION: '?';
KGREETING: 'hi' | 'hello' | 'hey' | 'Hi' | 'HI' | 'Hello' | 'HELLO' | 'Hey' | 'HEY';
KASKING: 'how' | 'How' | 'HOW';
KSUPPORT: ('list' | 'List' | 'LIST');
KVIEW: ('show' | 'view' | 'Show' | 'View' | 'SHOW' | 'VIEW');
KCREATE: ('remind' | 'create' | 'Remind' | 'Create' | 'REMIND' | 'CREATE');
KDELETE: ('delete' | 'remove' | 'Delete' | 'Remove' | 'DELETE' | 'REMOVE');
KMODIFY: ('update' | 'modify' | 'Update' | 'Modify' | 'UPDATE' | 'MODIFY');

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
STATUS: 'pending' | 'done' | 'inprogress';

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
