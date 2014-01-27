/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/package_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "khepri-ast/package", "./common", "./token_parser",
    "./value_parser", "./statement_parser"
], (function(require, exports, __o, __o0, ast_package, __o1, __o2, __o3, _) {
    "use strict";
    var eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        expected = __o["expected"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        between = __o0["between"],
        sepBy = __o0["sepBy"],
        node = __o1["node"],
        nodea = __o1["nodea"],
        keyword = __o2["keyword"],
        punctuator = __o2["punctuator"],
        identifier = __o3["identifier"],
        khepriPackage, withStatement = (function() {
            var args = arguments,
                __o4 = require("./statement_parser"),
                withStatement = __o4["withStatement"];
            return withStatement.apply(undefined, args);
        }),
        blockStatement = (function() {
            var args = arguments,
                __o4 = require("./statement_parser"),
                blockStatement = __o4["blockStatement"];
            return blockStatement.apply(undefined, args);
        }),
        packageExport = Parser("Package Export", node(identifier, ast_package.PackageExport.create)),
        packageExports = Parser("Package Exports", node(between(punctuator("("), punctuator(")"), eager(sepBy(
            optional(null, punctuator(",")), packageExport))), ast_package.PackageExports.create)),
        packageBody = Parser("Package Body", either(withStatement, blockStatement));
    (khepriPackage = Parser("Package", nodea(next(keyword("package"), enumeration(expected(
        "package export list", packageExports), packageBody)), ast_package.Package.create)));
    (exports.khepriPackage = khepriPackage);
}));