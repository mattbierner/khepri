/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['parse/parse',
        'ecma/ast/token'],
function(parse,
        astToken){
"use strict";

/* 
 ******************************************************************************/
var punctuator = function(v) {
    return parse.token(function(tok) {
        return (tok.type === 'Punctuator' && tok.value === v);
    });
};

var lineTerminator = parse.lookahead(parse.token(function(tok) {
    return tok.lineTerminator;
}));


var keyword = function(v) {
    return parse.token(function(tok) {
        return (tok.type === 'Keyword' && tok.value === v);
    });
};

var identifier = parse.Parser('Identifier',
    parse.bind(
        parse.token(function(tok) {
            return (tok.type === 'Identifier');
        }),
    function(x) {
        return parse.always(new astToken.Identifier(x.value));
    }));

var nullLiteral = parse.Parser('Null Literal',
    parse.token(function(tok) {
        return (tok.type === 'Null');
    }));

var booleanLiteral = parse.Parser('Boolean Literal',
    parse.token(function(tok) {
        return (tok.type === 'Boolean');
    }));

var numericLiteral = parse.Parser('Numeric Literal',
    parse.token(function(tok) {
        return (tok.type === 'Number');
    }));

var stringLiteral = parse.Parser('String Literal',
    parse.token(function(tok) {
        return (tok.type === 'String');
    }));

var regularExpressionLiteral = parse.Parser('Regular Expression Literal',
    parse.token(function(tok) {
        return (tok.type === 'RegularExpression');
    }));

/* Export
 ******************************************************************************/
return {
    'punctuator': punctuator,
    'lineTerminator': lineTerminator,
    'keyword': keyword,
    'identifier': identifier,
    
    'nullLiteral': nullLiteral,
    'booleanLiteral': booleanLiteral,
    'numericLiteral': numericLiteral,
    'stringLiteral': stringLiteral,
    'regularExpressionLiteral': regularExpressionLiteral
};

});