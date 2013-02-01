/**
 * @fileOverview Lexer for ECMAScript 5.1 tokenization.
 */
define(['parse/parse',
        'stream',
        'ecma/position',
        'ecma/lex/token',
        'ecma/lex/boolean_lexer', 'ecma/lex/comment_lexer', 'ecma/lex/identifier_lexer',
        'ecma/lex/line_terminator_lexer', 'ecma/lex/null_lexer', 'ecma/lex/number_lexer', 'ecma/lex/punctuator_lexer',
        'ecma/lex/reserved_word_lexer', 'ecma/lex/string_lexer', 'ecma/lex/whitespace_lexer', 'ecma/lex/regular_expression_lexer'],
function(parse,
        stream,
        position,
        lexToken,
        boolean_lexer, comment_lexer, identifier_lexer,
        line_terminator_lexer, null_lexer, number_lexer, punctuator_lexer,
        reserved_word_lexer, string_lexer, whitespace_lexer, regular_expression_lexer){
"use strict";

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
        function(start, value, end) {
            return parse.always(new type(value, new position.SourceLocation(start, end)));
        });
};

/* Lexers
 ******************************************************************************/
var literal = parse.choice(
    parse.attempt(makeToken(lexToken.StringToken, string_lexer.stringLiteral)),
    parse.attempt(makeToken(lexToken.RegularExpressionToken, regular_expression_lexer.regularExpressionLiteral)),
    parse.attempt(makeToken(lexToken.BooleanToken, boolean_lexer.booleanLiteral)),
    parse.attempt(makeToken(lexToken.NullToken, null_lexer.nullLiteral)),
    makeToken(lexToken.NumberToken, number_lexer.numericLiteral));

var token = parse.choice(
    parse.attempt(makeToken(lexToken.IdentifierToken, identifier_lexer.identifier)),
    parse.attempt(literal),
    parse.attempt(makeToken(lexToken.KeywordToken, reserved_word_lexer.reservedWord)),
    makeToken(lexToken.PunctuatorToken, punctuator_lexer.punctuator));

var inputElementRegExp = parse.choice(
    parse.attempt(makeToken(lexToken.CommentToken, comment_lexer.comment)), 
    parse.attempt(makeToken(lexToken.WhitespaceToken, whitespace_lexer.whitespace)),
    parse.attempt(makeToken(lexToken.LineTerminatorToken, line_terminator_lexer.lineTerminator)),
    token);

/**
 * Parser for lexing ECMAScript 5.1 input.
 */
var lexer = parse.many(inputElementRegExp);

/* Running
 ******************************************************************************/
/**
 * Lexes EMCAScript 5.1 input.
 * 
 * Result includes all tokens including comments and whitespace.
 */
var lex = function(input) {
    var state = new parse.InputState(stream.from(input), new position.SourcePosition(0, 0));
    return parse.runManyState(inputElementRegExp, state);
};

/* Export
 ******************************************************************************/
return {
    'token': token,
    'inputElementRegExp': inputElementRegExp,
    
    'lexer': lexer,
    
    'lex': lex,
};

});