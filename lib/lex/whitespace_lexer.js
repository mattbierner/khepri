/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/whitespace_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var tab, vt, ff, sp, nbsp, bom, usp, whitespace;
    var __o = __o,
        Parser = __o["Parser"],
        token = __o["token"],
        __o0 = __o0,
        character = __o0["character"],
        match = __o0["match"]; {
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
            (whitespace = Parser("Whitespace Lexer", token((function(tok) {
                switch (tok) {
                    case tabChar:
                    case vtChar:
                    case ffChar:
                    case spChar:
                    case nbspChar:
                    case bomChar:
                        return true;
                    default:
                        return false;
                }
            }))));
    }
    (exports.tab = tab);
    (exports.vt = vt);
    (exports.ff = ff);
    (exports.sp = sp);
    (exports.nbsp = nbsp);
    (exports.bom = bom);
    (exports.usp = usp);
    (exports.whitespace = whitespace);
}))