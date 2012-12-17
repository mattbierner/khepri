/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['parse/parse'], function(parse){
"use strict";

/* 
 ******************************************************************************/
var punctuator = function(v) {
    return parse.token(function(tok) {
        return (tok.type === 'Punctuator' && tok.value === v);
    });
};

var keyword = function(v) {
    return parse.token(function(tok) {
        return (tok.type === 'Keyword' && tok.value === v);
    });
};

var identifier = parse.token(function(tok) {
    return (tok.type === 'Identifier');
});

var nullLiteral = parse.token(function(tok) {
    return (tok.type === 'Null');
});

var booleanLiteral = parse.token(function(tok) {
    return (tok.type === 'Boolean');
});

var numericLiteral = parse.token(function(tok) {
    return (tok.type === 'Number');
});

var stringLiteral = parse.token(function(tok) {
    return (tok.type === 'String');
});

var regularExpressionLiteral = parse.token(function(tok) {
    return (tok.type === 'RegularExpression');
});

/* Export
 ******************************************************************************/
return {
    'punctuator': punctuator,
    'keyword': keyword,
    'identifier': identifier,
    
    'nullLiteral': nullLiteral,
    'booleanLiteral': booleanLiteral,
    'numericLiteral': numericLiteral,
    'stringLiteral': stringLiteral,
    'regularExpressionLiteral': regularExpressionLiteral
};

});