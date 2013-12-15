/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/pattern_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "khepri_ast/pattern", "khepri/parse/common",
    "khepri/parse/token_parser", "khepri/parse/value_parser"
], (function(require, exports, __o, __o0, ast_pattern, __o1, __o2, __o3) {
    "use strict";
    var pattern, topLevelPattern, identifierPattern, sinkPattern, ellipsisPattern, importPattern, arrayPattern,
            objectPattern, argumentList, argumentsPattern, asPattern;
    var __o = __o,
        always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        eager = __o["eager"],
        either = __o["either"],
        expected = __o["expected"],
        enumeration = __o["enumeration"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        __o0 = __o0,
        between = __o0["between"],
        sepBy = __o0["sepBy"],
        sepBy1 = __o0["sepBy1"],
        then = __o0["then"],
        ast_pattern = ast_pattern,
        __o1 = __o1,
        node = __o1["node"],
        nodea = __o1["nodea"],
        __o2 = __o2,
        keyword = __o2["keyword"],
        punctuator = __o2["punctuator"],
        __o3 = __o3,
        identifier = __o3["identifier"],
        stringLiteral = __o3["stringLiteral"];
    (topLevelPattern = (function() {
        var args = arguments;
        return topLevelPattern.apply(undefined, args);
    }));
    var sep = optional(null, punctuator(","));
    (identifierPattern = Parser("Identifier Pattern", bind(identifier, (function(x) {
        return always(ast_pattern.IdentifierPattern.create(x.loc, x));
    }))));
    (sinkPattern = Parser("Sink Pattern", bind(keyword("_"), (function(x) {
        return always(ast_pattern.SinkPattern.create(x.loc));
    }))));
    (ellipsisPattern = Parser("Ellipsis Pattern", bind(punctuator("..."), (function(x) {
        return always(ast_pattern.EllipsisPattern.create(x.loc));
    }))));
    (asPattern = Parser("As Pattern", nodea(enumeration(attempt(then(identifierPattern, punctuator("#"))),
        topLevelPattern), ast_pattern.AsPattern.create)));
    (arrayPattern = Parser("Array Pattern", node(between(punctuator("["), punctuator("]"), expected(
        "array pattern element", eager(sepBy1(sep, topLevelPattern)))), ast_pattern.ArrayPattern.create)));
    var objectPatternElement = choice(nodea(enumeration(stringLiteral, next(punctuator(":"), topLevelPattern)),
        ast_pattern.ObjectPatternElement.create), node(asPattern, (function(loc, key) {
        return ast_pattern.ObjectPatternElement.create(loc, key, null);
    })), node(identifierPattern, (function(loc, key) {
        return ast_pattern.ObjectPatternElement.create(loc, key, null);
    })));
    (objectPattern = Parser("Object Pattern", node(between(punctuator("{"), punctuator("}"), expected(
            "object pattern element", eager(sepBy1(sep, objectPatternElement)))), ast_pattern.ObjectPattern
        .create)));
    (importPattern = Parser("Import Pattern", next(keyword("import"), nodea(enumeration(stringLiteral, choice(
        sinkPattern, objectPattern, asPattern, identifierPattern)), ast_pattern.ImportPattern.create))));
    (topLevelPattern = Parser("Top Level Pattern", choice(ellipsisPattern, sinkPattern, arrayPattern,
        objectPattern, asPattern, identifierPattern)));
    var argumentElements = eager(sepBy(sep, topLevelPattern));
    (argumentList = Parser("Argument List", node(argumentElements, (function(loc, elements) {
        return ast_pattern.ArgumentsPattern.create(loc, null, elements);
    }))));
    (argumentsPattern = Parser("Arguments Pattern", either(attempt(nodea(enumeration(optional(null,
            identifierPattern), between(punctuator("("), punctuator(")"), argumentElements)),
        ast_pattern.ArgumentsPattern.create)), argumentList)));
    (pattern = Parser("Pattern", choice(importPattern, topLevelPattern)));
    (exports.pattern = pattern);
    (exports.topLevelPattern = topLevelPattern);
    (exports.identifierPattern = identifierPattern);
    (exports.sinkPattern = sinkPattern);
    (exports.ellipsisPattern = ellipsisPattern);
    (exports.importPattern = importPattern);
    (exports.arrayPattern = arrayPattern);
    (exports.objectPattern = objectPattern);
    (exports.argumentList = argumentList);
    (exports.argumentsPattern = argumentsPattern);
    (exports.asPattern = asPattern);
}))