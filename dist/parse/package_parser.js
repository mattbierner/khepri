/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/package_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "khepri_ast/package", "khepri/parse/common",
    "khepri/parse/token_parser", "khepri/parse/value_parser", "khepri/parse/statement_parser"
], (function(require, exports, __o, __o0, ast_package, __o1, __o2, __o3) {
    "use strict";
    var khepriPackage;
    var __o = __o,
        eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        expected = __o["expected"],
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
        identifier = __o3["identifier"];
    var withStatement = (function() {
        var args = arguments;
        var __o4 = require("khepri/parse/statement_parser"),
            withStatement = __o4["withStatement"];
        return withStatement.apply(undefined, args);
    });
    var blockStatement = (function() {
        var args = arguments;
        var __o4 = require("khepri/parse/statement_parser"),
            blockStatement = __o4["blockStatement"];
        return blockStatement.apply(undefined, args);
    });
    var packageExport = Parser("Package Export", node(identifier, ast_package.PackageExport.create));
    var packageExports = Parser("Package Exports", node(between(punctuator("("), punctuator(")"), eager(sepBy(
        optional(null, punctuator(",")), packageExport))), ast_package.PackageExports.create));
    var packageBody = Parser("Package Body", either(withStatement, blockStatement));
    (khepriPackage = Parser("Package", nodea(next(keyword("package"), enumeration(expected(
        "package export list", packageExports), packageBody)), ast_package.Package.create)));
    (exports.khepriPackage = khepriPackage);
}))