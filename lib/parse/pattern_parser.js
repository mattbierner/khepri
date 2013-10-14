/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/pattern_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "ecma/parse/common", "ecma/parse/token_parser", "khepri_ast/pattern", "khepri/parse/value_parser"], (function(require, exports, parse, parse_lang, __o, token, ast_pattern, value) {
    "use strict";
    var pattern, identifier, ellipsis, importPattern, arrayPattern, objectPattern;
    var parse = parse,
        Parser = parse["Parser"],
        parse_lang = parse_lang,
        __o = __o,
        node = __o["node"],
        nodea = __o["nodea"],
        token = token,
        ast_pattern = ast_pattern,
        value = value; {
            (pattern = (function() {
                return pattern.apply(undefined, arguments);
            }));
            (identifier = Parser("Identifier Pattern", parse.bind(value.identifier, (function(x) {
                return parse.always(ast_pattern.IdentifierPattern.create(x.loc, x));
            }))));
            (ellipsis = Parser("Ellipsis Pattern", parse.bind(token.punctuator("..."), (function(x) {
                return parse.always(ast_pattern.EllipsisPattern.create(x.loc));
            }))));
            (arrayPattern = Parser("Array Pattern", nodea(parse.enumeration(parse.optional(null, identifier), parse_lang.between(token.punctuator("["), token.punctuator("]"), parse.eager(parse_lang.sepBy1(token.punctuator(","), pattern)))), ast_pattern.ArrayPattern.create)));
            var objectKeyPattern = parse.either(parse.bind(identifier, (function(key) {
                return parse.always(({
                    "key": key
                }));
            })), parse.binds(parse.enumeration(value.stringLiteral, parse.next(token.punctuator(":"), pattern)), (function(key, value) {
                return parse.always(({
                    "key": key,
                    "value": value
                }));
            })));
            (objectPattern = Parser("Object Pattern", nodea(parse.enumeration(parse.optional(null, identifier), parse_lang.between(token.punctuator("{"), token.punctuator("}"), parse.eager(parse_lang.sepBy1(token.punctuator(","), objectKeyPattern)))), ast_pattern.ObjectPattern.create)));
            (importPattern = Parser("Import Pattern", parse.next(token.keyword("import"), nodea(parse.enumeration(value.stringLiteral, parse.either(parse.attempt(objectPattern), identifier)), ast_pattern.ImportPattern.create))));
            (pattern = Parser("Pattern", parse.choice(ellipsis, parse.attempt(arrayPattern), parse.attempt(objectPattern), identifier)));
    }
    (exports.pattern = pattern);
    (exports.identifier = identifier);
    (exports.ellipsis = ellipsis);
    (exports.importPattern = importPattern);
    (exports.arrayPattern = arrayPattern);
    (exports.objectPattern = objectPattern);
}))