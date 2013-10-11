/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/program_parser.kep'
 * DO NOT EDIT
*/
define((function(require, exports, module) {
    "use strict";
    var sourceElement, sourceElements, program;
    var __a = require("parse/parse"),
        always = __a["always"],
        cons = __a["cons"],
        eager = __a["eager"],
        either = __a["either"],
        eof = __a["eof"],
        many = __a["many"],
        next = __a["next"],
        Parser = __a["Parser"],
        rec = __a["rec"];
    var __a0 = require("parse/lang"),
        then = __a0["then"];
    var __a1 = require("nu/stream"),
        NIL = __a1["end"];
    var __a2 = require("ecma/parse/common"),
        node = __a2["node"];
    var ast_program = require("khepri_ast/program");
    var statement = require("khepri/parse/statement_parser");
    var __a3 = require("khepri/parse/package_parser"),
        khepriPackage = __a3["khepriPackage"];
    var statementParser = (function() {
        return require("khepri/parse/statement_parser").statement.apply(undefined, arguments);
    });
    (sourceElement = statementParser);
    (sourceElements = eager(many(sourceElement)));
    (program = Parser("Program", node(either(then(khepriPackage, eof), eager(rec((function(self) {
        return either(next(eof, always(NIL)), cons(sourceElement, self));
    })))), ast_program.Program.create)));
    (exports.sourceElement = sourceElement);
    (exports.sourceElements = sourceElements);
    (exports.program = program);
}))