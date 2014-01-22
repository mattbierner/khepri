/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/whitespace_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text", "nu-stream/stream"], (function(require, exports, __o, __o0,
    __o1) {
    "use strict";
    var tab, vt, ff, sp, nbsp, bom, usp, whitespace;
    var __o = __o,
        always = __o["always"],
        bind = __o["bind"],
        many1 = __o["many1"],
        Parser = __o["Parser"],
        __o0 = __o0,
        character = __o0["character"],
        characters = __o0["characters"],
        match = __o0["match"],
        __o1 = __o1,
        foldl = __o1["foldl"];
    var join = (function(p) {
        return bind(p, (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(always, foldl.bind(null, (function(x, y) {
            return (x + y);
        }), "")));
    });
    var tabChar = "\t",
        vtChar = "\u000b",
        ffChar = "\f",
        spChar = " ",
        nbspChar = " ",
        bomChar = "﻿";
    (tab = character(tabChar));
    (vt = character(vtChar));
    (ff = character(ffChar));
    (sp = character(spChar));
    (nbsp = character(nbspChar));
    (bom = character(bomChar));
    (usp = match(/^\s$/));
    (whitespace = Parser("Whitespace Character Lexer", characters([tabChar, vtChar, ffChar, spChar, nbspChar,
        bomChar
    ])));
    (exports.tab = tab);
    (exports.vt = vt);
    (exports.ff = ff);
    (exports.sp = sp);
    (exports.nbsp = nbsp);
    (exports.bom = bom);
    (exports.usp = usp);
    (exports.whitespace = whitespace);
}))