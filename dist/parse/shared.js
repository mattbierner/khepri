/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/shared.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "khepri/parse/token_parser"], (function(require, exports, parse, __o) {
    "use strict";
    var logicalComma;
    var parse = parse,
        always = parse["always"],
        choice = parse["choice"],
        look = parse["look"],
        eof = parse["eof"],
        Parser = parse["Parser"],
        token = parse["token"],
        __o = __o,
        keyword = __o["keyword"],
        punctuator = __o["punctuator"];
    var lineTerminator = look(token((function(tok) {
        return tok.lineTerminator;
    })));
    (logicalComma = Parser.bind(null, "Logical Comma")(choice(punctuator(","), lineTerminator, parse.eof)));
    (exports.logicalComma = logicalComma);
}))