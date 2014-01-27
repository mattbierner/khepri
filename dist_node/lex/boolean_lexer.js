"use strict";
var __o = require("bennu")["parse"],
    always = __o["always"],
    either = __o["either"],
    next = __o["next"],
    Parser = __o["Parser"],
    __o0 = require("bennu")["text"],
    string = __o0["string"],
    trueLiteral, falseLiteral, booleanLiteral;
(trueLiteral = Parser("True Literal Lexer", next(string("true"), always(true))));
(falseLiteral = Parser("False Literal Lexer", next(string("false"), always(false))));
(booleanLiteral = Parser("Boolean Literal Lexer", either(trueLiteral, falseLiteral)));
(exports.trueLiteral = trueLiteral);
(exports.falseLiteral = falseLiteral);
(exports.booleanLiteral = booleanLiteral);