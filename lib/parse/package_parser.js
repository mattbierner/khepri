/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/package_parser.kep'
 * DO NOT EDIT
*/
;
define(["require", "parse/parse", "parse/lang", "ecma/parse/common", "ecma/parse/token_parser", "khepri_ast/package", "khepri/parse/value_parser", "khepri/parse/pattern_parser"], function(require, parse, parse_lang, ecma_parse, token, ast_package, value, pattern) {
    var sourceElements = function() {
        return require("khepri/parse/program_parser").sourceElements.apply(undefined, arguments);
    }
    ;
    var packageExport = parse.Parser("Package Export", ecma_parse.node(value.identifier, ast_package.PackageExport.create));
    var packageExports = parse.Parser("Package Exports", ecma_parse.node(parse_lang.between(token.punctuator("("), token.punctuator(")"), parse.eager(parse_lang.sepBy(token.punctuator(","), packageExport))), ast_package.PackageExports.create));
    var packageImport = parse.Parser("Package Import", parse.next(token.keyword("import"), ecma_parse.nodea(parse.enumeration(value.stringLiteral, pattern.objectPattern), ast_package.PackageImport.create)));
    var packageImports = parse.Parser("Package Imports", parse.next(token.keyword("with"), ecma_parse.node(parse.eager(parse_lang.sepBy(token.punctuator(","), packageImport)), ast_package.PackageImports.create)));
    var packageBody = parse.Parser("Package Body", ecma_parse.node(parse_lang.between(token.punctuator("{"), token.punctuator("}"), sourceElements), ast_package.PackageBody.create));
    var khepriPackage = parse.Parser("Package", parse.next(token.keyword("package"), ecma_parse.nodea(parse.enumeration(packageExports, parse.optional(null, packageImports), packageBody), ast_package.Package.create)));
    return ({
        "khepriPackage": khepriPackage
    });
}
);
