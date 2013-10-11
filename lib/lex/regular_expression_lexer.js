/**
 * @fileOverview Lexers for ECMAScript 5.1 regular expression literals.
 */
define(['parse/parse', 'parse/lang',
        'parse/text',
        'nu/stream',
        'ecma/lex/regular_expression_lexer',
        'khepri/lex/identifier_lexer', 'khepri/lex/line_terminator_lexer'],
function(parse, parse_lang,
        parse_string,
        stream,
        regexp_lexer,
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
var regularExpressionBackslashSequence = parse.next(parse_string.character('\\'),
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

var regularExpressionClass = parse_lang.between(parse_string.character('['), parse_string.character(']'), 
    parse.bind(regularExpressionClassChars, function(body) {
        return parse.always('[' + stream.foldl(join, '', body) + ']');
    }));

// Characters
////////////////////////////////////////
/**
 * Lexer for first character of a regular expression.
 */
var regularExpressionFirstChar = parse.choice(
    parse.token(function(tok) {
        return !parse.test(line_terminator_lexer.lineTerminator, tok) &&
            tok !== '*' && tok !== '\\' && tok !== '`' && tok !== '['; 
    }),
    regularExpressionBackslashSequence,
    regularExpressionClass);

/**
 * Lexer for a character in a regular expression.
 */
var regularExpressionChar =  parse.choice(
    parse.token(function(tok) {
        return !parse.test(line_terminator_lexer.lineTerminator, tok) &&
            tok !== '\\' && tok !== '`' && tok !== '['; 
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
 * Lexer for the body of a regular expression
 */
var regularExpressionBody = parse.bind(
    parse.cons(regularExpressionFirstChar, regularExpressionChars),
    function(s) {
        return parse.always(stream.foldl(join, '', s));
    });

// Literal
////////////////////////////////////////
/**
 * Lexer for regular expression literals.
 */
var regularExpressionLiteral = parse.Parser('Regular Expression Lexer',
    parse.binds(
        parse.enumeration(
            parse_lang.between(parse_string.character('`'), parse_string.character('`'),
                regularExpressionBody),
            regularExpressionFlags),
        function(body, flags) {
            return parse.always(new RegExp(body, stream.foldl(join, '', flags)));
        }));

/* Export
 ******************************************************************************/
return {
    'regularExpressionNonTerminator': regularExpressionNonTerminator,
    'regularExpressionBackslashSequence': regularExpressionBackslashSequence,
    
// Class
    'regularExpressionClassChar': regularExpressionClassChar,
    'regularExpressionClassChars': regularExpressionClassChars,
    'regularExpressionClass': regularExpressionClass,
    
// Characters
    'regularExpressionChar': regularExpressionChar,
    'regularExpressionChars': regularExpressionChars,
    'regularExpressionFirstChar': regularExpressionFirstChar,
    
// Parts
    'regularExpressionFlags': regularExpressionFlags,
    'regularExpressionBody': regularExpressionBody,
    
// Regex Literal
    'regularExpressionLiteral': regularExpressionLiteral
};

return regular_expression_lexer;
});