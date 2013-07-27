/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/pattern_parser.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "parse/parse_lang", "ecma/parse/token_parser", "khepri_ast/pattern"], function(parse, parse_lang, token, ast_pattern) {
    "use strict";
    var identifier = parse.Parser("Identifier Pattern", parse.bind(token.anyIdentifier, function(x) {
        return parse.always(ast_pattern.Identifier.create(x.loc, x.value));
    }
    ));
    var ellipsis = parse.Parser("Ellipsis Pattern", parse.bind(token.punctuator("..."), function(x) {
        return parse.always(ast_pattern.Ellipsis.create(x.loc));
    }
    ));
    var pattern = parse.Parser("Pattern", parse.choice(identifier, ellipsis));
    return ({
        "pattern": pattern,
        "identifier": identifier,
        "ellipsis": ellipsis
    });
}
);
