/**
 * @fileOverview Lexer for ECMAScript 5.1 tokenization.
 */
define(['parse', 'ecma/lex/boolean_lexer', 'ecma/lex/comment_lexer', 'ecma/lex/identifier_lexer',
    'ecma/lex/line_terminator_lexer', 'ecma/lex/null_lexer',  'ecma/lex/number_lexer', 'ecma/lex/punctuator_lexer',
    'ecma/lex/reserved_word_lexer', 'ecma/lex/string_lexer', 'ecma/lex/whitespace_lexer', 'ecma/lex/regular_expression_lexer'],
function(parse, boolean_lexer, comment_lexer, identifier_lexer,
    line_terminator_lexer, null_lexer, number_lexer, punctuator_lexer,
    reserved_word_lexer, string_lexer, whitespace_lexer, regular_expression_lexer){
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
    parse.attempt(makeToken('String', string_lexer.stringLiteral)),
    parse.attempt(makeToken('RegularExpression', regular_expression_lexer.regularExpressionLiteral)),
    parse.attempt(makeToken('Boolean', boolean_lexer.booleanLiteral)),
    parse.attempt(makeToken('Null', null_lexer.nullLiteral)),
    makeToken('Number', number_lexer.numericLiteral));
    
var token = parse.choice(
    parse.attempt(literal),
    parse.attempt(makeToken('Identifier', identifier_lexer.identifier)),
    parse.attempt(makeToken('Keyword', reserved_word_lexer.reservedWord)),
    makeToken('Punctuator', punctuator_lexer.punctuator));

var inputElementRegExp = parse.choice(
    parse.attempt(makeToken('Comment', comment_lexer.comment)), 
    parse.attempt(makeToken('WhiteSpace', whitespace_lexer.whitespace)),
    parse.attempt(makeToken('LineTerminator', line_terminator_lexer.lineTerminator)),
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
        parse.attempt(parse.next(comment_lexer.comment, self)),
        parse.attempt(parse.next(whitespace_lexer.whitespace, self)),
        parse.attempt(parse.next(line_terminator_lexer.lineTerminator, self)),
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