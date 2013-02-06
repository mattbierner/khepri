/**
 * @fileOverview 
 */
define(['parse/parse',
        'ecma/ast/value', 
        'ecma/parse/token_parser'],
function(parse,
        astValue, 
        token){
"use strict";

// Literal
////////////////////////////////////////
var nullLiteral = parse.Parser('Null Literal',
    parse.bind(token.nullLiteral, function(x) {
        return parse.always(new astValue.Literal(x.loc, x.value, 'null'));
    }));

var booleanLiteral = parse.Parser('Boolean Literal',
    parse.bind(token.booleanLiteral, function(x) {
        return parse.always(new astValue.Literal(x.loc, x.value, 'boolean'));
    }));

var numericLiteral = parse.Parser('Numeric Literal',
    parse.bind(token.numericLiteral, function(x) {
        return parse.always(new astValue.Literal(x.loc, x.value, 'number'));
    }));

var stringLiteral = parse.Parser('String Literal',
    parse.bind(token.stringLiteral, function(x) {
        return parse.always(new astValue.Literal(x.loc, x.value, 'string'));
    }));

var regularExpressionLiteral = parse.Parser('Regular Expression Literal',
    parse.bind(token.regularExpressionLiteral, function(x) {
        return parse.always(new astValue.Literal(x.loc, x.value, 'RegExp'));
    }));

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
        parse.token(function(tok) { return (tok.type === 'Identifier'); }),
    function(x) {
        return parse.always(new astValue.Identifier(x.loc, x.value));
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