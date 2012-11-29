/**
 * @fileOverview Parsers for ECMAScript 5.1 string values.
 */
define(['parse', 'lineTerminatorParser', 'numberParser'],
function(parse, lineTerminatorParser, numberParser){
"use strict";

/* Helpers
 ******************************************************************************/
var fromCharCodeParser = function(digits) {
    return parse.always(String.fromCharCode(parseInt(digits.join(''), 16)));
};


/* Parsers
 ******************************************************************************/
// Constants
////////////////////////////////////////
var doubleQuote = parse.char('"');
var escape = parse.char('\\');
var singleQuote = parse.char("'");

/**
 * Parser for string line continuation.
 * 
 * Returns an empty string.
 */
var lineContinuation = parse.next(
    parse.next(escape, lineTerminatorParser.lineTerminatorSequence),
    parse.always(''));

// Escape Character
////////////////////////////////////////
/**
 * 
 */
var singleEscapeCharacter = parse.choice(
    parse.next(parse.char("'"), parse.always("'")),
    parse.next(parse.char('"'), parse.always('"')),
    parse.next(parse.char('\\'), parse.always('\\')),
    parse.next(parse.char('b'), parse.always('\u0008')),
    parse.next(parse.char('f'), parse.always('\u000C')),
    parse.next(parse.char('n'), parse.always('\u000A')),
    parse.next(parse.char('r'), parse.always('\u000D')),
    parse.next(parse.char('t'), parse.always('\u0009')),
    parse.next(parse.char('v'), parse.always('\u000B')));

var escapeCharacter = parse.choice(
    singleEscapeCharacter,
    numberParser.decimalDigit,
    parse.char('u'),
    parse.char('x'));

var nonEscapeCharacter = parse.token(function(tok) {
    return !(parse.test(escapeCharacter, tok) ||
        parse.test(lineTerminatorParser.lineTerminator, tok));
});

// Escape Sequence
////////////////////////////////////////
/**
 * Parser for a hex escape sequence.
 * 
 * Returns the character defined by the escape sequence.
 */
var hexEscapeSequence = parse.next(parse.char('x'),
    parse.bind(parse.times(2, numberParser.hexDigit), fromCharCodeParser));

/**
 * Parser for a unicode escape sequence.
 * 
 * Returns the unicode character defined by the escape sequence.
 */
var unicodeEscapeSequence = parse.next(parse.char('u'),
    parse.bind(parse.times(4, numberParser.hexDigit), fromCharCodeParser));

var characterEscapeSequence = parse.either(
    singleEscapeCharacter,
    nonEscapeCharacter);

var escapeSequence = parse.choice(
    characterEscapeSequence,
    parse.next(parse.char('0'), parse.next(parse.either(
        parse.eof(),
        parse.token(function(tok) {
            return !parse.test(numberParser.decimalDigit, tok);
        })
    ), parse.always('\u0000'))),
    hexEscapeSequence,
    unicodeEscapeSequence);

// String Characters
////////////////////////////////////////
var doubleStringCharacter = parse.choice(
    parse.attempt(lineContinuation),
    parse.next(escape, escapeSequence),
    parse.token(function(tok) {
        return !(parse.test(doubleQuote, tok) ||
            parse.test(escape, tok) ||
            parse.test(lineTerminatorParser.lineTerminator, tok));
    }));

var doubleStringCharacters = parse.many(doubleStringCharacter);


var singleStringCharacter = parse.choice(
    parse.attempt(lineContinuation),
    parse.next(escape, escapeSequence),
    parse.token(function(tok) {
        return !(parse.test(singleQuote, tok) ||
            parse.test(escape, tok) || 
            parse.test(lineTerminatorParser.lineTerminator, tok));
    }));

/**
 * 
 */
var singleStringCharacters = parse.many(singleStringCharacter);

// String Literals
////////////////////////////////////////

/**
 * Parser for a single quoted string literal.
 * 
 * Returns the value of the string enclosed in the single quoted string literal.
 */
var singleStringLiteral = parse.next(singleQuote,
    parse.bind(singleStringCharacters, function(str) {
        return parse.next(singleQuote, parse.always(str.join('')));
    })
);

/**
 * Parser for a double quoted string literal.
 * 
 * Returns the value of the string enclosed in the double quoted string literal.
 */
var doubleStringLiteral =  parse.next(doubleQuote,
    parse.bind(doubleStringCharacters, function(str) {
        return parse.next(doubleQuote, parse.always(str.join('')));
    })
);

/**
 * Parser for a string literal.
 * 
 * Returns the value of the string enclosed in the string literal.
 */
var stringLiteral = parse.either(
    parse.attempt(singleStringLiteral),
    doubleStringLiteral);


/* Export
 ******************************************************************************/

return {
// Constants
    'doubleQuote': doubleQuote,
    'escape': escape,
    'singleQuote': singleQuote,
    
// Escape Sequences
    'unicodeEscapeSequence': unicodeEscapeSequence,
    'hexEscapeSequence': hexEscapeSequence,
    'escapeSequence': escapeSequence,
    
// Literals
    'stringLiteral': stringLiteral
};

});