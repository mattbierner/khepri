"use strict";
var __o = require("bennu")["parse"],
    always = __o["always"],
    bind = __o["bind"],
    many1 = __o["many1"],
    Parser = __o["Parser"],
    __o0 = require("bennu")["text"],
    character = __o0["character"],
    characters = __o0["characters"],
    match = __o0["match"],
    __o1 = require("nu-stream")["stream"],
    foldl = __o1["foldl"],
    tab, vt, ff, sp, nbsp, bom, usp, whitespace, join = (function(p) {
        return bind(p, (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(always, foldl.bind(null, (function(x, y) {
            return (x + y);
        }), "")));
    }),
    tabChar = "\t",
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
(whitespace = Parser("Whitespace Character Lexer", characters([tabChar, vtChar, ffChar, spChar, nbspChar, bomChar])));
(exports.tab = tab);
(exports.vt = vt);
(exports.ff = ff);
(exports.sp = sp);
(exports.nbsp = nbsp);
(exports.bom = bom);
(exports.usp = usp);
(exports.whitespace = whitespace);