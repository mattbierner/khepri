/**
 * @fileOverview Lexer for ECMAScript 5.1 tokenization.
 */
define(['parse', 'booleanLexer', 'commentLexer', 'identifierLexer',
    'lineTerminatorLexer', 'nullLexer',  'numberLexer', 'punctuatorLexer',
    'reservedWordLexer', 'stringLexer', 'whiteSpaceLexer', 'regularExpressionLexer'],
function(parse, booleanLexer, commentLexer, identifierLexer,
    lineTerminatorLexer, nullLexer, numberLexer, punctuatorLexer,
    reservedWordLexer, stringLexer, whiteSpaceLexer, regularExpressionLexer){
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

/* Lexers
 ******************************************************************************/
var literal = parse.choice(
    parse.attempt(Token('String', stringLexer.stringLiteral)),
    parse.attempt(Token('RegularExpression', regularExpressionLexer.regularExpressionLiteral)),
    parse.attempt(Token('Boolean', booleanLexer.booleanLiteral)),
    parse.attempt(Token('Null', nullLexer.nullLiteral)),
    Token('Number', numberLexer.numericLiteral));
    
var token = parse.choice(
    parse.attempt(literal),
    parse.attempt(Token('Identifer', identifierLexer.identifier)),
    parse.attempt(Token('Keyword', reservedWordLexer.reservedWord)),
    Token('Punctuator', punctuatorLexer.punctuator));

var inputElementRegExp = parse.choice(
    parse.attempt(Token('Comment', commentLexer.comment)), 
    parse.attempt(Token('WhiteSpace', whiteSpaceLexer.whiteSpace)),
    parse.attempt(Token('LineTerminator', lineTerminatorLexer.lineTerminator)),
    token);

/**
 * Tokenizes EMCAScript 5.1 input.
 * 
 * Result includes all tokens including comments and whitespace.
 */
var lex = parse.run.bind(undefined, parse.many(inputElementRegExp));

/**
 * Tokenzes ECMAScript 5.1 input and outputs only language element tokens
 */
var lexLang = parse.run.bind(undefined, parse.many(parse.RecParser(function(self) {
    return parse.choice(
        parse.attempt(parse.next(commentLexer.comment, self)),
        parse.attempt(parse.next(whiteSpaceLexer.whiteSpace, self)),
        parse.attempt(parse.next(lineTerminatorLexer.lineTerminator, self)),
        token);
})));

/* Export
 ******************************************************************************/
return {
    'token': token,
    'inputElementRegExp': inputElementRegExp,
    
    'lex': lex,
    'lexLang': lexLang
};

});