/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/shared.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "khepri/parse/token_parser"], (function(require, exports, __o, __o0) {
    "use strict";
    var logicalComma;
    var __o = __o,
        always = __o["always"],
        choice = __o["choice"],
        look = __o["look"],
        eof = __o["eof"],
        Parser = __o["Parser"],
        token = __o["token"],
        __o0 = __o0,
        keyword = __o0["keyword"],
        punctuator = __o0["punctuator"];
    var lineTerminator = look(token((function(tok) {
        return tok.lineTerminator;
    })));
    (logicalComma = Parser.bind(null, "Logical Comma")(choice(punctuator(","), lineTerminator, eof, always())));
    (exports.logicalComma = logicalComma);
}))