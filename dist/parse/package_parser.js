/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/package_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "khepri_ast/package", "khepri/parse/common",
    "khepri/parse/token_parser", "khepri/parse/value_parser", "khepri/parse/pattern_parser",
    "khepri/parse/statement_parser", "khepri/parse/shared"
], (function(require, exports, __o, __o0, ast_package, __o1, __o2, __o3, __o4, statement, __o5) {
    "use strict";
    var khepriPackage;
    var __o = __o,
        attempt = __o["attempt"],
        eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        __o0 = __o0,
        between = __o0["between"],
        sepBy = __o0["sepBy"],
        ast_package = ast_package,
        __o1 = __o1,
        node = __o1["node"],
        nodea = __o1["nodea"],
        __o2 = __o2,
        keyword = __o2["keyword"],
        punctuator = __o2["punctuator"],
        __o3 = __o3,
        identifier = __o3["identifier"],
        stringLiteral = __o3["stringLiteral"],
        __o4 = __o4,
        objectPattern = __o4["objectPattern"],
        identifierPattern = __o4["identifier"],
        statement = statement,
        __o5 = __o5,
        logicalComma = __o5["logicalComma"];
    var withStatement = (function() {
        var args = arguments; {
            var __o6 = require("khepri/parse/statement_parser"),
                withStatement = __o6["withStatement"];
            return withStatement.apply(undefined, args);
        }
    });
    var blockStatement = (function() {
        var args = arguments; {
            var __o6 = require("khepri/parse/statement_parser"),
                blockStatement = __o6["blockStatement"];
            return blockStatement.apply(undefined, args);
        }
    });
    var packageExport = Parser.bind(null, "Package Export")(node(identifier, ast_package.PackageExport.create));
    var packageExports = Parser.bind(null, "Package Exports")(node(between(punctuator("("), punctuator(")"),
        eager(sepBy(logicalComma, packageExport))), ast_package.PackageExports.create));
    var packageBody = Parser.bind(null, "Package Body")(either(withStatement, blockStatement));
    (khepriPackage = Parser("Package", next(keyword("package"), nodea(enumeration(packageExports, packageBody),
        ast_package.Package.create))));
    (exports.khepriPackage = khepriPackage);
}))