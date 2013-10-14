/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/program_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "nu/stream", "ecma/parse/common", "khepri_ast/program", "khepri/parse/statement_parser", "khepri/parse/package_parser"], (function(require, exports, __o, __o0, __o1, __o2, ast_program, _0, _1) {
    "use strict";
    var sourceElement, sourceElements, program;
    var __o = __o,
        always = __o["always"],
        cons = __o["cons"],
        eager = __o["eager"],
        either = __o["either"],
        eof = __o["eof"],
        many = __o["many"],
        next = __o["next"],
        Parser = __o["Parser"],
        rec = __o["rec"],
        __o0 = __o0,
        then = __o0["then"],
        __o1 = __o1,
        NIL = __o1["end"],
        __o2 = __o2,
        node = __o2["node"],
        ast_program = ast_program,
        _0 = _0,
        _1 = _1; {
            var statementParser = (function() {
                {
                    var __o3 = require("khepri/parse/statement_parser"),
                        statement = __o3["statement"]; {
                            return statement.apply(undefined, arguments);
                    }
                }
            });
            var khepriPackage = (function() {
                {
                    var __o3 = require("khepri/parse/package_parser"),
                        khepriPackage = __o3["khepriPackage"]; {
                            return khepriPackage.apply(undefined, arguments);
                    }
                }
            });
            (sourceElement = statementParser);
            (sourceElements = eager(many(sourceElement)));
            (program = Parser("Program", node(either(then(khepriPackage, eof), eager(rec((function(self) {
                return either(next(eof, always(NIL)), cons(sourceElement, self));
            })))), ast_program.Program.create)));
    }
    (exports.sourceElement = sourceElement);
    (exports.sourceElements = sourceElements);
    (exports.program = program);
}))