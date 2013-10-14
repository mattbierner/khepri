/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/pattern_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "ecma/parse/common", "ecma/parse/token_parser", "khepri_ast/pattern", "khepri/parse/value_parser"], (function(require, exports, __o, __o0, __o1, __o2, ast_pattern, value) {
    "use strict";
    var pattern, identifier, ellipsis, importPattern, arrayPattern, objectPattern;
    var __o = __o,
        always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        __o0 = __o0,
        between = __o0["between"],
        sepBy1 = __o0["sepBy1"],
        __o1 = __o1,
        node = __o1["node"],
        nodea = __o1["nodea"],
        __o2 = __o2,
        keyword = __o2["keyword"],
        punctuator = __o2["punctuator"],
        ast_pattern = ast_pattern,
        value = value; {
            (pattern = (function() {
                return pattern.apply(undefined, arguments);
            }));
            (identifier = Parser("Identifier Pattern", bind(value.identifier, (function(x) {
                return always(ast_pattern.IdentifierPattern.create(x.loc, x));
            }))));
            (ellipsis = Parser("Ellipsis Pattern", bind(punctuator("..."), (function(x) {
                return always(ast_pattern.EllipsisPattern.create(x.loc));
            }))));
            (arrayPattern = Parser("Array Pattern", nodea(enumeration(optional(null, identifier), between(punctuator("["), punctuator("]"), eager(sepBy1(punctuator(","), pattern)))), ast_pattern.ArrayPattern.create)));
            var objectKeyPattern = either(bind(identifier, (function(key) {
                return always(({
                    "key": key
                }));
            })), binds(enumeration(value.stringLiteral, next(punctuator(":"), pattern)), (function(key, value) {
                return always(({
                    "key": key,
                    "value": value
                }));
            })));
            (objectPattern = Parser("Object Pattern", nodea(enumeration(optional(null, identifier), between(punctuator("{"), punctuator("}"), eager(sepBy1(punctuator(","), objectKeyPattern)))), ast_pattern.ObjectPattern.create)));
            (importPattern = Parser("Import Pattern", next(keyword("import"), nodea(enumeration(value.stringLiteral, either(attempt(objectPattern), identifier)), ast_pattern.ImportPattern.create))));
            (pattern = Parser("Pattern", choice(ellipsis, attempt(arrayPattern), attempt(objectPattern), identifier)));
    }
    (exports.pattern = pattern);
    (exports.identifier = identifier);
    (exports.ellipsis = ellipsis);
    (exports.importPattern = importPattern);
    (exports.arrayPattern = arrayPattern);
    (exports.objectPattern = objectPattern);
}))