/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "ecma-unparse/unparse", "ecma-unparse/print", "khepri-parse/lex/lexer",
    "khepri-parse/parse/parser", "khepri-compile/compile"
], (function(require, exports, __o, __o0, __o1, __o2, __o3) {
    "use strict";
    var unparse = __o["unparse"],
        print = __o0["print"],
        lex = __o1["lex"],
        parseStream = __o2["parseStream"],
        khepriCompile = __o3["compile"],
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
    (exports.compile = compile);
}));