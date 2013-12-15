/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/shared.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "khepri/parse/token_parser"], (function(require, exports, __o, __o0) {
    "use strict";
    var lineTerminator, noLineTerminator, logicalComma;
    var __o = __o,
        always = __o["always"],
        bind = __o["bind"],
        choice = __o["choice"],
        look = __o["look"],
        eof = __o["eof"],
        next = __o["next"],
        Parser = __o["Parser"],
        token = __o["token"],
        __o0 = __o0,
        keyword = __o0["keyword"],
        punctuator = __o0["punctuator"];
    (lineTerminator = look(token((function(tok) {
        return tok.lineTerminator;
    }))));
    (noLineTerminator = next.bind(null, look(token((function(tok) {
        return !tok.lineTerminator;
    })))));
    (logicalComma = Parser.bind(null, "Logical Comma")(choice(punctuator(","), lineTerminator, eof, always())));
    (exports.lineTerminator = lineTerminator);
    (exports.noLineTerminator = noLineTerminator);
    (exports.logicalComma = logicalComma);
}))