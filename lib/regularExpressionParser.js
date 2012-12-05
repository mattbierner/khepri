/**
 * @fileOverview Parsers for ECMAScript 5.1 regular expression literals.
 */
define(['parse', 'identifierParser', 'lineTerminatorParser'],
function(parse, identifierParser, lineTerminatorParser){
"use strict";

/* Parsers
 ******************************************************************************/
// Parts
////////////////////////////////////////
/**
 * Parser for non terminator character in a regular expression.
 */
var regularExpressionNonTerminator = parse.token(function(tok) {
    return !parse.test(lineTerminatorParser.lineTerminator, tok);
});

/**
 * Parser for regular expression backslash sequence.
 */
var regularExpressionBackslashSequence = parse.next(parse.character('\\'),
    parse.bind(regularExpressionNonTerminator, function(char) {
        return parse.always('\\' + char);
    }));

// Class
////////////////////////////////////////
var regularExpressionClassChar = parse.either(
    parse.attempt(parse.token(function(tok) {
        return !parse.test(lineTerminatorParser.lineTerminator, tok) &&
            tok != ']' && tok != '\\'; 
    })),
    regularExpressionBackslashSequence);

var regularExpressionClassChars = parse.many(regularExpressionClassChar);

var regularExpressionClass = parse.between(parse.character('['), parse.character(']'), 
    parse.bind(regularExpressionClassChars, function(body) {
        return parse.always('[' + body.join('') + ']');
    }));

// Characters
////////////////////////////////////////
/**
 * Parser for a character in a regular expression.
 */
var regularExpressionChar =  parse.choice(
    parse.token(function(tok) {
        return !parse.test(lineTerminatorParser.lineTerminator, tok) &&
            tok != '\\' && tok != '/' && tok != '['; 
    }),
    regularExpressionBackslashSequence,
    regularExpressionClass);

/**
 * Parser for first character of a regular expression.
 */
var regularExpressionFirstChar = parse.choice(
    parse.token(function(tok) {
        return !parse.test(lineTerminatorParser.lineTerminator, tok) &&
            tok != '*' && tok != '\\' && tok != '/' && tok != '['; 
    }),
    regularExpressionBackslashSequence,
    regularExpressionClass);

/**
 * Parser for string of regular expression chars.
 */
var regularExpressionChars = parse.many(regularExpressionChar);

// Literal Parts
////////////////////////////////////////
/**
 * Parser for regular expression flags.
 */
var regularExpressionFlags = parse.many(identifierParser.identifierPart);

/**
 * Parser for the body of a gular expression
 */
var regularExpressionBody = parse.bind(regularExpressionFirstChar, function(first) {
    return parse.bind(regularExpressionChars, function(rest) {
        return parse.always(first + rest.join(''));
    });
});
    
// Literal
////////////////////////////////////////
/**
 * Parser for regular expression literals.
 */
var regularExpressionLiteral = parse.bind(
    parse.between(parse.character('/'), parse.character('/'), regularExpressionBody),
    function(body) {
         return parse.bind(regularExpressionFlags, function(flags) {
            return parse.always(new RegExp(body, flags.join('')));
        });
    });

/* Export
 ******************************************************************************/
return {
    'regularExpressionLiteral': regularExpressionLiteral
};

});