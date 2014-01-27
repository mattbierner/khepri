/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/program_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "khepri-ast/program", "./common",
    "./statement_parser", "./package_parser"
], (function(require, exports, __o, __o0, __o1, ast_program, __o2, _, _0) {
    "use strict";
    var always = __o["always"],
        cons = __o["cons"],
        eager = __o["eager"],
        either = __o["either"],
        eof = __o["eof"],
        many = __o["many"],
        next = __o["next"],
        Parser = __o["Parser"],
        rec = __o["rec"],
        then = __o0["then"],
        NIL = __o1["NIL"],
        node = __o2["node"],
        sourceElement, sourceElements, program, statementParser = (function() {
            var args = arguments,
                __o3 = require("./statement_parser"),
                statement = __o3["statement"];
            return statement.apply(undefined, args);
        }),
        khepriPackage = (function() {
            var args = arguments,
                __o3 = require("./package_parser"),
                khepriPackage = __o3["khepriPackage"];
            return khepriPackage.apply(undefined, args);
        });
    (sourceElement = statementParser);
    (sourceElements = eager(many(sourceElement)));
    (program = Parser("Program", node(either(then(khepriPackage, eof), eager(rec((function(self) {
        return either(next(eof, always(NIL)), cons(sourceElement, self));
    })))), ast_program.Program.create)));
    (exports.sourceElement = sourceElement);
    (exports.sourceElements = sourceElements);
    (exports.program = program);
}));