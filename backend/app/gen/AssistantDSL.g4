grammar AssistantDSL;

program: expression;

expression: expression operation2nd expression | term | opeexpression;

opeexpression: opeexpression operation1st opeexpression | term;

operation1st: '*' | '/';
operation2nd: '+' | '-';

term: Integer;

Integer: [0-9]+;

WS : [ \t\r\n]+ -> skip; // skip spaces, tabs, newlines