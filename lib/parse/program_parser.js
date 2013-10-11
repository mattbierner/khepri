/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/program_parser.kep'
 * DO NOT EDIT
*/
;
define(["require", "parse/parse", "nu/stream", "ecma/parse/common", "ecma/parse/token_parser", "khepri_ast/program", "khepri/parse/statement_parser", "khepri/parse/package_parser"], function(require, parse, stream, ecma_parse, token, ast_program, statement, package_parser) {
    "use strict";
    var statementParser = function() {
        return require("khepri/parse/statement_parser").statement.apply(undefined, arguments);
    }
    ;
    var sourceElement = statementParser;
    var sourceElements = parse.eager(parse.many(sourceElement));
    var program = parse.Parser("Program", ecma_parse.node(parse.either(package_parser.khepriPackage, parse.eager(parse.rec(function(self) {
        return parse.either(parse.next(parse.eof, parse.always(stream.end)), parse.cons(sourceElement, self));
    }
    ))), ast_program.Program.create));
    return ({
        "sourceElement": sourceElement,
        "sourceElements": sourceElements,
        "program": program
    });
}
);
