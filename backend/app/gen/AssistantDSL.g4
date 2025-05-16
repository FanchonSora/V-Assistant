grammar AssistantDSL;

program: sentence EOF;

sentence: 'remind' 'me' 'to' TITLE 'in' INT;

TITLE: [a-zA-Z ]+;
INT: [0-9]+;

WS : [ \t\r\n]+ -> skip;