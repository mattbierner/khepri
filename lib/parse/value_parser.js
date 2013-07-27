/**
 * @fileOverview 
 */
define(['parse/parse',
        'khepri_ast/value', 
        'ecma/parse/token_parser'],
function(parse,
        ast_value, 
        token){
"use strict";

var literal = function(kind, p) {
    return parse.bind(p, function(x) {
        return parse.always(new ast_value.Literal(x.loc, kind, x.value));
    });
};

// Literal
////////////////////////////////////////
var nullLiteral = parse.Parser('Null Literal',
    literal('null', token.nullLiteral));

var booleanLiteral = parse.Parser('Boolean Literal',
    literal('boolean', token.booleanLiteral));

var numericLiteral = parse.Parser('Numeric Literal',
    literal('number', token.numericLiteral));

var stringLiteral = parse.Parser('String Literal',
    literal('string', token.stringLiteral));

var regularExpressionLiteral = parse.Parser('Regular Expression Literal',
    literal('regexp', token.regularExpressionLiteral));

/**
 * Parser for a simple ECMAScript literal, excluding array and object literals.
 */
var literal = parse.Parser('Literal',
    parse.choice(
        nullLiteral,
        booleanLiteral,
        numericLiteral,
        stringLiteral,
        regularExpressionLiteral));

// Identifier
////////////////////////////////////////
var identifier = parse.Parser('Identifier',
    parse.bind(
        token.anyIdentifier,
        function(x) {
            return parse.always(new ast_value.Identifier(x.loc, x.value));
        }));

/* Export
 ******************************************************************************/
return {
// Literal
    'nullLiteral': nullLiteral,
    'booleanLiteral': booleanLiteral,
    'numericLiteral': numericLiteral,
    'stringLiteral': stringLiteral,
    'regularExpressionLiteral': regularExpressionLiteral,
    'literal': literal,

// Identifier
    'identifier': identifier
};

});