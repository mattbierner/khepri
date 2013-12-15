/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/null_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var nullLiteral;
    var __o = __o,
        always = __o["always"],
        next = __o["next"],
        Parser = __o["Parser"],
        __o0 = __o0,
        string = __o0["string"];
    (nullLiteral = Parser("Null Lexer", next(string("null"), always(null))));
    (exports.nullLiteral = nullLiteral);
}))