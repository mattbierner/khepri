/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/package_parser.kep'
 * DO NOT EDIT
*/
define((function(require, exports, module) {
    "use strict";
    var khepriPackage;
    var __a = require("parse/parse"),
        attempt = __a["attempt"],
        eager = __a["eager"],
        either = __a["either"],
        enumeration = __a["enumeration"],
        next = __a["next"],
        optional = __a["optional"],
        Parser = __a["Parser"];
    var __a0 = require("parse/lang"),
        between = __a0["between"],
        sepBy = __a0["sepBy"];
    var __a1 = require("ecma/parse/common"),
        node = __a1["node"],
        nodea = __a1["nodea"];
    var __a2 = require("ecma/parse/token_parser"),
        keyword = __a2["keyword"],
        punctuator = __a2["punctuator"];
    var ast_package = require("khepri_ast/package");
    var __a3 = require("khepri/parse/value_parser"),
        identifier = __a3["identifier"],
        stringLiteral = __a3["stringLiteral"];
    var __a4 = require("khepri/parse/pattern_parser"),
        objectPattern = __a4["objectPattern"],
        identifierPattern = __a4["identifier"];
    var sourceElements = (function() {
        return require("khepri/parse/program_parser").sourceElements.apply(undefined, arguments);
    });
    var packageExport = Parser("Package Export", node(identifier, ast_package.PackageExport.create));
    var packageExports = Parser("Package Exports", node(between(punctuator("("), punctuator(")"), eager(sepBy(punctuator(","), packageExport))), ast_package.PackageExports.create));
    var packageImport = Parser("Package Import", next(keyword("import"), nodea(enumeration(stringLiteral, either(attempt(objectPattern), identifierPattern)), ast_package.PackageImport.create)));
    var packageImports = Parser("Package Imports", next(keyword("with"), node(eager(sepBy(punctuator(","), packageImport)), ast_package.PackageImports.create)));
    var packageBody = Parser("Package Body", node(between(punctuator("{"), punctuator("}"), sourceElements), ast_package.PackageBody.create));
    (khepriPackage = Parser("Package", next(keyword("package"), nodea(enumeration(packageExports, optional(null, packageImports), packageBody), ast_package.Package.create))));
    (exports.khepriPackage = khepriPackage);
}))