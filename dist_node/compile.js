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
    __o3 = require("khepri-compile")["compile"],
    khepriCompile = __o3["compile"],
    compile, compiler = (function(input, options) {
        return print(unparse((function(x) {
            return khepriCompile(x, options);
        })(parseStream(lex(input)))));
    });
(compile = (function(input, header, options, ok, err) {
    try {
        console.log(options);
        return ok(((header || "") + compiler(input, options)));
    } catch (e) {
        return err(e);
    }
}));
(module.exports = compile);