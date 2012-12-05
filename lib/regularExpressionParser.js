/**
 * @fileOverview Parsers for ECMAScript 5.1 null value.
 */
define(['parse', 'identifierParser', 'lineTerminatorParser'],
function(parse, identifierParser, lineTerminatorParser){
"use strict";

/* Parsers
 ******************************************************************************/
// Parts
////////////////////////////////////////
var regularExpressionNonTerminator = parse.token(function(tok) {
    return !parse.test(lineTerminatorParser.lineTerminator, tok);
});

var regularExpressionBackslashSequence = parse.next(parse.character('\\'),
    parse.bind(regularExpressionNonTerminator, function(char) {
        return parse.always('\\' + char);
    }));

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

var regularExpressionChar =  parse.choice(
    parse.token(function(tok) {
        return !parse.test(lineTerminatorParser.lineTerminator, tok) &&
            tok != '\\' && tok != '/' && tok != '['; 
    }),
    regularExpressionBackslashSequence,
    regularExpressionClass);

var regularExpressionFirstChar = parse.choice(
    parse.token(function(tok) {
        return !parse.test(lineTerminatorParser.lineTerminator, tok) &&
            tok != '*' && tok != '\\' && tok != '/' && tok != '['; 
    }),
    regularExpressionBackslashSequence,
    regularExpressionClass);

var regularExpressionChars = parse.many(regularExpressionChar);


var regularExpressionFlags = parse.many(identifierParser.identifierPart);
    
var regularExpressionBody = parse.bind(regularExpressionFirstChar, function(first) {
    return parse.bind(regularExpressionChars, function(rest) {
        return parse.always(first + rest.join(''));
    });
});
    
// Literal
////////////////////////////////////////
var regularExpressionLiteral = parse.next(parse.character('/'),
    parse.bind(regularExpressionBody, function(body) {
        return parse.next(parse.character('/'),
            parse.bind(regularExpressionFlags, function(flags) {
                return parse.always(new RegExp(body, flags.join('')));
            }));
    }));

/* Export
 ******************************************************************************/
return {
    'regularExpressionLiteral': regularExpressionLiteral
};

});