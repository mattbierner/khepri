/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/pattern_parser.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "parse/parse_lang", "ecma/parse/token_parser", "khepri/ast/pattern"], function(parse, parse_lang, token, astPattern) {
    "use strict";
    var identifier = parse.Parser("Identifier Pattern", parse.bind(token.anyIdentifier, function(x) {
        return parse.always(new astPattern.Identifier(x.loc, x.value));
    }
    ));
    var ellipsis = parse.Parser("Ellipsis Pattern", parse.bind(token.punctuator("..."), function(x) {
        return parse.always(new astPattern.Ellipsis(x.loc));
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
