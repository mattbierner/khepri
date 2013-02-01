/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['parse/parse',
        'ecma/ast/value'],
function(parse,
        astValue){
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

var identifier = function(v) {
    return parse.bind(
        parse.token(function(tok) {
            return (tok.type === 'Identifier' && tok.value === v);
        }),
    function(x) {
        return parse.always(new astValue.Identifier(x.value));
    });
};

var anyIdentifier = parse.Parser('Identifier',
    parse.bind(
        parse.token(function(tok) {
            return (tok.type === 'Identifier');
        }),
    function(x) {
        return parse.always(new astValue.Identifier(x.value));
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

var lineTerminator = parse.lookahead(parse.token(function(tok) {
    return tok.lineTerminator;
}));

/* Export
 ******************************************************************************/
return {
    'punctuator': punctuator,
    'lineTerminator': lineTerminator,
    'keyword': keyword,
    'identifier': identifier,
    'anyIdentifier': anyIdentifier,
    
    'nullLiteral': nullLiteral,
    'booleanLiteral': booleanLiteral,
    'numericLiteral': numericLiteral,
    'stringLiteral': stringLiteral,
    'regularExpressionLiteral': regularExpressionLiteral
};

});