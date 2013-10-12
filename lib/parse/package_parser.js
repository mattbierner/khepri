/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/package_parser.kep'
 * DO NOT EDIT
*/
;
define(["require", "parse/parse", "parse/lang", "ecma/parse/common", "ecma/parse/token_parser", "khepri_ast/package", "khepri/parse/statement_parser", "khepri/parse/value_parser"], (function(require, parse, parse_lang, ecma, token, ast_package, statement_parser, value) {
    "use strict";
    var withStatement = (function() {
        return require("khepri/parse/statement_parser").withStatement.apply(undefined, arguments);
    });
    var blockStatement = (function() {
        return require("khepri/parse/statement_parser").blockStatement.apply(undefined, arguments);
    });
    var packageExport = parse.Parser("Package Export", ecma.node(value.identifier, ast_package.PackageExport.create));
    var packageExports = parse.Parser("Package Exports", ecma.node(parse_lang.between(token.punctuator("("), token.punctuator(")"), parse.eager(parse_lang.sepBy(token.punctuator(","), packageExport))), ast_package.PackageExports.create));
    var packageBody = parse.Parser("Package Body", parse.either(withStatement, blockStatement));
    var khepriPackage = parse.Parser("Package", parse.next(token.keyword("package"), ecma.nodea(parse.enumeration(packageExports, packageBody), ast_package.Package.create)));
    return ({
        "khepriPackage": khepriPackage
    });
}));