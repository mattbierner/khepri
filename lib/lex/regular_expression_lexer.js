/**
 * @fileOverview Lexers for ECMAScript 5.1 regular expression literals.
 */
define(['parse/parse', 'parse/parse_eager',
        'stream',
        'ecma/lex/identifier_lexer', 'ecma/lex/line_terminator_lexer'],
function(parse, parse_eager,
        stream,
        identifier_lexer, line_terminator_lexer){
"use strict";

var join = function(p, c) {
    return p + '' + c;
};

/* Lexers
 ******************************************************************************/
// Parts
////////////////////////////////////////
/**
 * Lexer for non terminator character in a regular expression.
 */
var regularExpressionNonTerminator = parse.token(function(tok) {
    return !parse.test(line_terminator_lexer.lineTerminator, tok);
});

/**
 * Lexer for regular expression backslash sequence.
 */
var regularExpressionBackslashSequence = parse.next(parse.character('\\'),
    parse.bind(regularExpressionNonTerminator, function(char) {
        return parse.always('\\' + char);
    }));

// Class
////////////////////////////////////////
var regularExpressionClassChar = parse.either(
    parse.attempt(parse.token(function(tok) {
        return !parse.test(line_terminator_lexer.lineTerminator, tok) &&
            tok !== ']' && tok !== '\\'; 
    })),
    regularExpressionBackslashSequence);

var regularExpressionClassChars = parse.many(regularExpressionClassChar);

var regularExpressionClass = parse.between(parse.character('['), parse.character(']'), 
    parse.bind(regularExpressionClassChars, function(body) {
        return parse.always('[' + stream.reduce(body, join, '') + ']');
    }));

// Characters
////////////////////////////////////////
/**
 * Lexer for a character in a regular expression.
 */
var regularExpressionChar =  parse.choice(
    parse.token(function(tok) {
        return !parse.test(line_terminator_lexer.lineTerminator, tok) &&
            tok !== '\\' && tok !== '/' && tok !== '['; 
    }),
    regularExpressionBackslashSequence,
    regularExpressionClass);

/**
 * Lexer for first character of a regular expression.
 */
var regularExpressionFirstChar = parse.choice(
    parse.token(function(tok) {
        return !parse.test(line_terminator_lexer.lineTerminator, tok) &&
            tok !== '*' && tok !== '\\' && tok !== '/' && tok !== '['; 
    }),
    regularExpressionBackslashSequence,
    regularExpressionClass);

/**
 * Lexer for string of regular expression chars.
 */
var regularExpressionChars = parse.many(regularExpressionChar);

// Literal Parts
////////////////////////////////////////
/**
 * Lexer for regular expression flags.
 */
var regularExpressionFlags = parse.many(identifier_lexer.identifierPart);

/**
 * Lexer for the body of a gular expression
 */
var regularExpressionBody = parse.bind(
    parse.consParser(regularExpressionFirstChar, regularExpressionChars),
    function(s) {
        return parse.always(stream.reduce(s, join, ''));
    });
    
// Literal
////////////////////////////////////////
/**
 * Lexer for regular expression literals.
 */
var regularExpressionLiteral = parse.Parser('Regular Expression Lexer',
    parse.binda(
        parse.sequence(
            parse.between(parse.character('/'), parse.character('/'),
                regularExpressionBody),
            regularExpressionFlags),
        function(body, flags) {
            return parse.always(new RegExp(body, stream.reduce(flags, join, '')));
        }));

/* Export
 ******************************************************************************/
return {
    'regularExpressionLiteral': regularExpressionLiteral
};

});