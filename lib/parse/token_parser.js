/**
 * @fileOverview Parsers for working with lex tokens.
 */
define(['parse/parse',
        'ecma/ast/value'],
function(parse,
        astValue){
"use strict";

var typeParser = function(type) {
    return parse.token(function(tok) {
        return (tok.type === type);
    });
};

/* Parsers
 ******************************************************************************/
// Punctuator
////////////////////////////////////////
var anyPunctuator = typeParser('Punctuator');

var punctuator = function(v) {
    return parse.token(function(tok) {
        return (tok.type === 'Punctuator' && tok.value === v);
    });
};

var anyKeyword = typeParser('Keyword');

var keyword = function(v) {
    return parse.token(function(tok) {
        return (tok.type === 'Keyword' && tok.value === v);
    });
};

var anyIdentifier = parse.Parser('Identifier',
    parse.bind(
        parse.token(function(tok) {
            return (tok.type === 'Identifier');
        }),
    function(x) {
        return parse.always(new astValue.Identifier(x.loc, x.value));
    }));

var identifier = function(v) {
    return parse.bind(
        parse.token(function(tok) {
            return (tok.type === 'Identifier' && tok.value === v);
        }),
    function(x) {
        return parse.always(new astValue.Identifier(x.loc, x.value));
    });
};

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