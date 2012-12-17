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
var Token = function(type, value) {
    this.type = type;
    this.value = value;
};

Token.prototype.toString = function() {
    return "{" + this.type + " " + this.value + "}";
};

var makeToken = function(type, p) {
    return parse.bind(p, function(value) {
        return parse.always(new Token(type, value));
    });
};

/* Lexers
 ******************************************************************************/
var literal = parse.choice(
    parse.attempt(makeToken('String', stringLexer.stringLiteral)),
    parse.attempt(makeToken('RegularExpression', regularExpressionLexer.regularExpressionLiteral)),
    parse.attempt(makeToken('Boolean', booleanLexer.booleanLiteral)),
    parse.attempt(makeToken('Null', nullLexer.nullLiteral)),
    makeToken('Number', numberLexer.numericLiteral));
    
var token = parse.choice(
    parse.attempt(literal),
    parse.attempt(makeToken('Identifier', identifierLexer.identifier)),
    parse.attempt(makeToken('Keyword', reservedWordLexer.reservedWord)),
    makeToken('Punctuator', punctuatorLexer.punctuator));

var inputElementRegExp = parse.choice(
    parse.attempt(makeToken('Comment', commentLexer.comment)), 
    parse.attempt(makeToken('WhiteSpace', whiteSpaceLexer.whiteSpace)),
    parse.attempt(makeToken('LineTerminator', lineTerminatorLexer.lineTerminator)),
    token);

/**
 * makeTokenizes EMCAScript 5.1 input.
 * 
 * Result includes all tokens including comments and whitespace.
 */
var lex = parse.run.bind(undefined, parse.many(inputElementRegExp));

/**
 * makeTokenzes ECMAScript 5.1 input and outputs only language element tokens
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