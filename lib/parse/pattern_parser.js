/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/pattern_parser.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "parse/lang", "ecma/parse/common", "ecma/parse/token_parser", "khepri_ast/pattern", "khepri/parse/value_parser"], (function(parse, parse_lang, ecma, token, ast_pattern, value) {
    "use strict";
    var pattern = (function() {
        return pattern.apply(undefined, arguments);
    });
    var identifier = parse.Parser("Identifier Pattern", parse.bind(value.identifier, (function(x) {
        return parse.always(ast_pattern.IdentifierPattern.create(x.loc, x));
    })));
    var ellipsis = parse.Parser("Ellipsis Pattern", parse.bind(token.punctuator("..."), (function(x) {
        return parse.always(ast_pattern.EllipsisPattern.create(x.loc));
    })));
    var arrayPattern = parse.Parser("Array Pattern", ecma.nodea(parse.enumeration(parse.optional(null, identifier), parse_lang.between(token.punctuator("["), token.punctuator("]"), parse.eager(parse_lang.sepBy1(token.punctuator(","), pattern)))), ast_pattern.ArrayPattern.create));
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
    var objectPattern = parse.Parser("Object Pattern", ecma.nodea(parse.enumeration(parse.optional(null, identifier), parse_lang.between(token.punctuator("{"), token.punctuator("}"), parse.eager(parse_lang.sepBy1(token.punctuator(","), objectKeyPattern)))), ast_pattern.ObjectPattern.create));
    var importPattern = parse.Parser("Import Pattern", parse.next(token.keyword("import"), ecma.nodea(parse.enumeration(value.stringLiteral, parse.either(parse.attempt(objectPattern), identifier)), ast_pattern.ImportPattern.create)));
    (pattern = parse.Parser("Pattern", parse.choice(ellipsis, parse.attempt(arrayPattern), parse.attempt(objectPattern), identifier)));
    return ({
        "pattern": pattern,
        "identifier": identifier,
        "ellipsis": ellipsis,
        "importPattern": importPattern,
        "arrayPattern": arrayPattern,
        "objectPattern": objectPattern
    });
}));