/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile.kep'
 * DO NOT EDIT
*/"use strict";
var __o = require("ecma-unparse")["unparse"],
    unparse = __o["unparse"],
    __o0 = require("ecma-unparse")["print"],
    print = __o0["print"],
    __o1 = require("khepri-parse")["lex"]["lexer"],
    lex = __o1["lex"],
    __o2 = require("khepri-parse")["parse"]["parser"],
    parseStream = __o2["parseStream"],
    khepriCompile = require("khepri-compile")["compile"],
    compile, compiler = (function(input, options) {
        return print(unparse((function(x) {
            return khepriCompile(x, options);
        })(parseStream(lex(input)))));
    });
(compile = (function(input, header, options, ok, err) {
    try {
        return ok(((header || "") + compiler(input, options)));
    } catch (e) {
        return err(e);
    }
}));
(module.exports = compile);