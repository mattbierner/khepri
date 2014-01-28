/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/line_terminator_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var always = __o["always"],
        choice = __o["choice"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        token = __o["token"],
        character = __o0["character"],
        characters = __o0["characters"],
        lf, cr, ls, ps, lineTerminator, lineTerminatorSequence, lfChar = "\n",
        crChar = "\r",
        lsChar = "\u2028",
        psChar = "\u2029";
    (lf = Parser("Line Feed Lexer", character(lfChar)));
    (cr = Parser("Carriage Return Lexer", character(crChar)));
    (ls = Parser("Line Separator Lexer", character(lsChar)));
    (ps = Parser("Paragraph Separator Lexer", character(psChar)));
    (lineTerminator = Parser("Line Terminator Lexer", characters([lfChar, crChar, lsChar, psChar])));
    (lineTerminatorSequence = Parser("Line Terminator Sequence Lexer", choice(lf, ls, ps, next(cr, optional(
        crChar, next(lf, always((crChar + lfChar))))))));
    (exports.lf = lf);
    (exports.cr = cr);
    (exports.ls = ls);
    (exports.ps = ps);
    (exports.lineTerminator = lineTerminator);
    (exports.lineTerminatorSequence = lineTerminatorSequence);
}));