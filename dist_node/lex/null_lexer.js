"use strict";
var __o = require("bennu")["parse"],
    always = __o["always"],
    next = __o["next"],
    Parser = __o["Parser"],
    __o0 = require("bennu")["text"],
    string = __o0["string"],
    nullLiteral;
(nullLiteral = Parser("Null Lexer", next(string("null"), always(null))));
(exports.nullLiteral = nullLiteral);