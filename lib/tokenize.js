/**
 * @fileOverview Parser for ECMAScript 5.1 tokenization.
 */
define(['parse', 'booleanParser', 'commentParser', 'identifierParser',
    'lineTerminatorParser', 'nullParser',  'numberParser', 'punctuatorParser',
    'reservedWordParser', 'stringParser', 'whiteSpaceParser', 'regularExpressionParser'],
function(parse, booleanParser, commentParser, identifierParser,
    lineTerminatorParser, nullParser, numberParser, punctuatorParser,
    reservedWordParser, stringParser, whiteSpaceParser, regularExpressionParser){
"use strict";

/* Helpers
 ******************************************************************************/
var Token = function(type, p) {
    return parse.bind(p, function(value) {
        return parse.always({
            'type': type,
            'value': value,
            'toString': function() {
                return "{ type:" + type + " value:" + value + " }";
            }
        });
    });
};

/* Parsers
 ******************************************************************************/
var literal = parse.choice(
    parse.attempt(Token('String', stringParser.stringLiteral)),
    parse.attempt(Token('RegularExpression', regularExpressionParser.regularExpressionLiteral)),
    parse.attempt(Token('Boolean', booleanParser.booleanLiteral)),
    parse.attempt(Token('Null', nullParser.nullLiteral)),
    Token('Number', numberParser.numericLiteral));
    
var token = parse.choice(
    parse.attempt(literal),
    parse.attempt(Token('Identifer', identifierParser.identifier)),
    parse.attempt(Token('Keyword', reservedWordParser.reservedWord)),
    Token('Punctuator', punctuatorParser.punctuator));

var inputElementRegExp = parse.choice(
    parse.attempt(Token('Comment', commentParser.comment)), 
    parse.attempt(Token('WhiteSpace', whiteSpaceParser.whiteSpace)),
    parse.attempt(Token('LineTerminator', lineTerminatorParser.lineTerminator)),
    token);

/**
 * Tokenizes EMCAScript 5.1 input.
 * 
 * Result includes all tokens including comments and whitespace.
 */
var tokenize = parse.run.bind(undefined, parse.many(inputElementRegExp));

/**
 * Tokenzes ECMAScript 5.1 input and outputs only language element tokens
 */
var tokenizeLang = parse.run.bind(undefined, parse.many(parse.RecParser(function(self) {
    return parse.choice(
        parse.attempt(parse.next(commentParser.comment, self)),
        parse.attempt(parse.next(whiteSpaceParser.whiteSpace, self)),
        parse.attempt(parse.next(lineTerminatorParser.lineTerminator, self)),
        token);
})));

/* Export
 ******************************************************************************/
return {
    'token': token,
    'inputElementRegExp': inputElementRegExp,
    
    'tokenize': tokenize,
    'tokenizeLang': tokenizeLang
};

});