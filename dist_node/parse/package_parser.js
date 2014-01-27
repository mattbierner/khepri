"use strict";
var __o = require("bennu")["parse"],
    eager = __o["eager"],
    either = __o["either"],
    enumeration = __o["enumeration"],
    expected = __o["expected"],
    next = __o["next"],
    optional = __o["optional"],
    Parser = __o["Parser"],
    __o0 = require("bennu")["lang"],
    between = __o0["between"],
    sepBy = __o0["sepBy"],
    ast_package = require("khepri-ast")["package"],
    __o1 = require("./common"),
    node = __o1["node"],
    nodea = __o1["nodea"],
    __o2 = require("./token_parser"),
    keyword = __o2["keyword"],
    punctuator = __o2["punctuator"],
    __o3 = require("./value_parser"),
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
    packageExports = Parser("Package Exports", node(between(punctuator("("), punctuator(")"), eager(sepBy(optional(null,
        punctuator(",")), packageExport))), ast_package.PackageExports.create)),
    packageBody = Parser("Package Body", either(withStatement, blockStatement));
(khepriPackage = Parser("Package", nodea(next(keyword("package"), enumeration(expected("package export list",
    packageExports), packageBody)), ast_package.Package.create)));
(exports.khepriPackage = khepriPackage);