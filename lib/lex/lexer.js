/**
 * @fileOverview Khepri lexers.
 */
define(['parse/parse',
        'nu/stream',
        'ecma/position',
        'khepri_ast/token',
        'khepri/lex/boolean_lexer',
        'khepri/lex/comment_lexer',
        'khepri/lex/identifier_lexer',
        'khepri/lex/line_terminator_lexer',
        'khepri/lex/null_lexer',
        'khepri/lex/number_lexer',
        'khepri/lex/punctuator_lexer',
        'khepri/lex/reserved_word_lexer',
        'khepri/lex/string_lexer',
        'khepri/lex/whitespace_lexer',
        'khepri/lex/regular_expression_lexer'],
function(parse,
        stream,
        position,
        lexToken,
        boolean_lexer,
        comment_lexer,
        identifier_lexer,
        line_terminator_lexer,
        null_lexer,
        number_lexer,
        punctuator_lexer,
        reserved_word_lexer,
        string_lexer,
        whitespace_lexer,
        regular_expression_lexer){
"use strict";

/* Helpers
 ******************************************************************************/
var positionParser = parse.extract(function(state) {
    return state.position;
});

var makeToken = function(type, p) {
    return parse.binds(
        parse.sequence(
            positionParser,
            p,
            positionParser),
        function(start, value, end) {
            var loc = new position.SourceLocation(start, end);
            return parse.always(new type(loc, value));
        });
};

/* Lexers
 ******************************************************************************/
var literal = parse.choice(
    parse.expected("string literal",
        makeToken(lexToken.StringToken, string_lexer.stringLiteral)),
    parse.expected("regular expression literal",
        makeToken(lexToken.RegularExpressionToken, regular_expression_lexer.regularExpressionLiteral)),
    parse.expected("boolean literal",
        makeToken(lexToken.BooleanToken, boolean_lexer.booleanLiteral)),
    parse.expected("null literal",
        makeToken(lexToken.NullToken, null_lexer.nullLiteral)),
    parse.expected("number literal",
        makeToken(lexToken.NumberToken, number_lexer.numericLiteral)));

var token = parse.choice(
    parse.attempt(parse.expected("identifier",
        makeToken(lexToken.IdentifierToken, identifier_lexer.identifier))),
    parse.attempt(literal),
    parse.attempt(parse.expected("reserved word",
        makeToken(lexToken.KeywordToken, reserved_word_lexer.reservedWord))),
    parse.expected("puctuator",
        makeToken(lexToken.PunctuatorToken, punctuator_lexer.punctuator)));

var inputElementRegExp = parse.choice(
    parse.expected("comment",
        makeToken(lexToken.CommentToken, comment_lexer.comment)),
    parse.expected("whitespace",
        makeToken(lexToken.WhitespaceToken, whitespace_lexer.whitespace)),
    parse.expected("line terminator",
        makeToken(lexToken.LineTerminatorToken, line_terminator_lexer.lineTerminator)),
    token);

/**
 * Parser for lexing ECMAScript 5.1 input.
 */
var lexer = parse.many(inputElementRegExp);

/* Running
 ******************************************************************************/
var lexManyState = function(p, state) {
    var manyP = parse.either(
        parse.bind(p, function(x, state, m) {
            return parse.always(stream.memoStream(x, parse.runState.bind(undefined, manyP, state, m)));
        }),
        parse.next(parse.eof(), parse.always(stream.end)));
    return parse.runState(manyP, state);
};

/**
 * Lexes EMCAScript 5.1 input.
 * 
 * Result includes all tokens including comments and whitespace.
 */
var lex = function(input) {
    var state = new parse.ParserState(stream.from(input), new position.SourcePosition(0, 0));
    return lexManyState(inputElementRegExp, state);
};

/* Export
 ******************************************************************************/
return {
    'literal': literal,
    'token': token,
    'inputElementRegExp': inputElementRegExp,
    
    'lexer': lexer,
    
    'lex': lex,
};

});