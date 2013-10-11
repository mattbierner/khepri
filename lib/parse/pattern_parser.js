/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/pattern_parser.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "parse/lang", "ecma/parse/common", "ecma/parse/token_parser", "khepri_ast/pattern", "khepri/parse/value_parser"], function(parse, parse_lang, ecma, token, ast_pattern, value) {
    "use strict";
    var pattern = function() {
        return pattern.apply(undefined, arguments);
    }
    ;
    var identifier = parse.Parser("Identifier Pattern", parse.bind(token.anyIdentifier, function(x) {
        return parse.always(ast_pattern.Identifier.create(x.loc, x.value));
    }
    ));
    var ellipsis = parse.Parser("Ellipsis Pattern", parse.bind(token.punctuator("..."), function(x) {
        return parse.always(ast_pattern.Ellipsis.create(x.loc));
    }
    ));
    var arrayPattern = parse.Parser("Array Pattern", ecma.nodea(parse.enumeration(parse.optional(null, identifier), parse_lang.between(token.punctuator("["), token.punctuator("]"), parse.eager(parse_lang.sepBy1(token.punctuator(","), pattern)))), ast_pattern.ArrayPattern.create));
    var objectKeyPattern = parse.either(parse.bind(identifier, function(key) {
        return parse.always(({
            "key": key
        }));
    }
    ), parse.binds(parse.enumeration(value.stringLiteral, parse.next(token.punctuator(":"), pattern)), function(key, value) {
        return parse.always(({
            "key": key,
            "value": value
        }));
    }
    ));
    var objectPattern = parse.Parser("Object Pattern", ecma.nodea(parse.enumeration(parse.optional(null, identifier), parse_lang.between(token.punctuator("{"), token.punctuator("}"), parse.eager(parse_lang.sepBy1(token.punctuator(","), objectKeyPattern)))), ast_pattern.ObjectPattern.create));
    (pattern = parse.Parser("Pattern", parse.choice(parse.attempt(arrayPattern), parse.attempt(objectPattern), identifier, ellipsis)));
    return ({
        "pattern": pattern,
        "identifier": identifier,
        "ellipsis": ellipsis,
        "arrayPattern": arrayPattern,
        "objectPattern": objectPattern
    });
}
);
