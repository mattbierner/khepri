/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/boolean_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var always = __o["always"],
        either = __o["either"],
        next = __o["next"],
        Parser = __o["Parser"],
        string = __o0["string"],
        trueLiteral, falseLiteral, booleanLiteral;
    (trueLiteral = Parser("True Literal Lexer", next(string("true"), always(true))));
    (falseLiteral = Parser("False Literal Lexer", next(string("false"), always(false))));
    (booleanLiteral = Parser("Boolean Literal Lexer", either(trueLiteral, falseLiteral)));
    (exports.trueLiteral = trueLiteral);
    (exports.falseLiteral = falseLiteral);
    (exports.booleanLiteral = booleanLiteral);
}));