/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/value_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "khepri_ast/value", "ecma/parse/token_parser"], (function(require, exports, __o, ast_value, token) {
    "use strict";
    var nullLiteral, booleanLiteral, numericLiteral, stringLiteral, regularExpressionLiteral, literal, identifier;
    var __o = __o,
        always = __o["always"],
        bind = __o["bind"],
        choice = __o["choice"],
        Parser = __o["Parser"],
        ast_value = ast_value,
        token = token; {
            var literalParser = (function(kind, p) {
                return bind(p, (function(x) {
                    return always(ast_value.Literal.create(x.loc, kind, x.value));
                }));
            });
            (nullLiteral = Parser("Null Literal", literalParser("null", token.nullLiteral)));
            (booleanLiteral = Parser("Boolean Literal", literalParser("boolean", token.booleanLiteral)));
            (numericLiteral = Parser("Numeric Literal", literalParser("number", token.numericLiteral)));
            (stringLiteral = Parser("String Literal", literalParser("string", token.stringLiteral)));
            (regularExpressionLiteral = Parser("Regular Expression Literal", literalParser("regexp", token.regularExpressionLiteral)));
            (literal = Parser("Literal", choice(nullLiteral, booleanLiteral, numericLiteral, stringLiteral, regularExpressionLiteral)));
            (identifier = Parser("Identifier", bind(token.anyIdentifier, (function(x) {
                return always(new ast_value.Identifier(x.loc, x.value));
            }))));
    }
    (exports.nullLiteral = nullLiteral);
    (exports.booleanLiteral = booleanLiteral);
    (exports.numericLiteral = numericLiteral);
    (exports.stringLiteral = stringLiteral);
    (exports.regularExpressionLiteral = regularExpressionLiteral);
    (exports.literal = literal);
    (exports.identifier = identifier);
}))