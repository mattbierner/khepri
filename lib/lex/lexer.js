/**
 * @fileOverview Lexer for ECMAScript 5.1 tokenization.
 */
define(['parse/parse',
        'ecma/ast/token',
        'ecma/lex/boolean_lexer', 'ecma/lex/comment_lexer', 'ecma/lex/identifier_lexer',
        'ecma/lex/line_terminator_lexer', 'ecma/lex/null_lexer', 'ecma/lex/number_lexer', 'ecma/lex/punctuator_lexer',
        'ecma/lex/reserved_word_lexer', 'ecma/lex/string_lexer', 'ecma/lex/whitespace_lexer', 'ecma/lex/regular_expression_lexer'],
function(parse,
        astToken,
        boolean_lexer, comment_lexer, identifier_lexer,
        line_terminator_lexer, null_lexer, number_lexer, punctuator_lexer,
        reserved_word_lexer, string_lexer, whitespace_lexer, regular_expression_lexer){
"use strict";

/**
 * 
 */
var SourceLocation = function(start, end) {
    this.start = start;
    this.end = end;
};

SourceLocation.prototype.toString = function() {
    return '{start:' + this.start + ' end:' + this.end + '}';
};

/* Helpers
 ******************************************************************************/
var positionParser = parse.extract(function(state) {
    return state.pos;
});

var makeToken = function(type, p) {
    return parse.binda(
        parse.sequence(
            positionParser,
            p,
            positionParser),
        function(start, v, end) {
            return parse.always(new astToken.Token(type, v, new SourceLocation(start, end)));
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

var langInputElement = parse.RecParser(function(self) {
    return parse.choice(
        parse.attempt(parse.next(comment_lexer.comment, self)),
        parse.attempt(parse.next(whitespace_lexer.whitespace, self)),
        parse.attempt(parse.next(line_terminator_lexer.lineTerminator, self)),
        token);
});

/**
 * Parser for lexing ECMAScript 5.1 input.
 */
var lexer = parse.many(inputElementRegExp);

/**
 * Parser for lexing ECMAScript 5.1 input, returning only language elements.
 */
var langLexer = parse.many(langInputElement);

/* Running
 ******************************************************************************/
/**
 * Lexes EMCAScript 5.1 input.
 * 
 * Result includes all tokens including comments and whitespace.
 */
var lex = parse.runMany.bind(undefined, inputElementRegExp);

/**
 * Lexes ECMAScript 5.1 input and outputs only language element tokens
 */
var lexLang = parse.runMany.bind(undefined, langInputElement);

/* Export
 ******************************************************************************/
return {
    'token': token,
    'inputElementRegExp': inputElementRegExp,
    
    'lexer': lexer,
    
    'langLexer': langLexer,
    
    'lex': lex,
    'lexLang': lexLang
};

});