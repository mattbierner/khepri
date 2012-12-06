/**
 * @fileOverview Parsers for ECMAScript 5.1 identifiers.
 */
define(['parse', 'parse_string', 'reservedWordParser', 'stringParser'],
function(parse, parse_string, reservedWordParser, stringParser){
"use strict";

var pc = [
    '\u005F',
    '\u203F',
    '\u2040',
    '\u2054',
    '\uFE33',
    '\uFE34',
    '\uFE4D',
    '\uFE4E',
    '\uFE4F',
    '\uFF3F'];

/* Parsers
 ******************************************************************************/
// Constants
////////////////////////////////////////
/**
 * Zero Width non-joiner Parser
 */
var zwnj = parse.character('\u200c');

/**
 * Zero Width joiner Parser
 */
var zwj = parse.character('\u200d')

// Characters
////////////////////////////////////////
/**
 * Parser for a unicode letter character.
 * 
 * Any character in any of the Unicode categories:
 * - Uppercase letter (Lu)
 * - Lowercase letter (Ll)
 * - Titlecase letter (Lt)
 * - Modifier letter (Lm)
 * - Other letter (Lo)
 * - Letter number (Nl)
 * 
 * @TODO Implement for unicode based on spec.
 */
var unicodeLetter = parse_string.letter; 

/**
 * Parser for a Unicode digit character.
 * 
 * Any character in the Unicode category Decimal number (Nd).
 * 
 * @TODO Implement for unicode based on spec.
 */
var unicodeDigit = parse_string.digit;

/**
 * Parser for a Unicode connector punctuation character.
 * 
 * Any character in the Unicode category Connector Punctuation (Pc).
 */
var unicodeConnectorPunctuation = parse.token(function(tok) {
    return (pc.indexOf(tok) !== -1);
});

/**
 * Parser for any combining mark Unicode character.
 * 
 * Any character in any of the Unicode categories:
 * - Non-spacing mark (Mn)
 * - Combining spacing mark (Mc)
 * 
 * @TODO Implement for unicode based on spec
 */
var unicodeCombiningMark = parse.never();

// Parts
////////////////////////////////////////
/**
 * Parser for the start of an identifier.
 */
var identifierStart = parse.choice(
    unicodeLetter,
    parse.character('$'),
    parse.character('_'),
    parse.next(stringParser.escape, stringParser.unicodeEscapeSequence));

/**
 * Parser for the rest of an identifier after the first character.
 */
var identifierPart = parse.choice(
    identifierStart,
    unicodeCombiningMark,
    unicodeDigit,
    unicodeConnectorPunctuation,
    zwnj,
    zwj);

var identifierParts = parse.many(identifierPart);

/**
 * Parser for any identifier name.
 * 
 * May be a keyword.
 */
var identifierName = parse.bind(identifierStart, function(start) {
    return parse.bind(identifierParts, function(rest) {
        return parse.always(start + rest.join(''));
    });
});

// Identifier
////////////////////////////////////////
var _reservedWordTest = parse.next(reservedWordParser.reservedWord, parse.eof());

/**
 * Parser for an identifier.
 * 
 * Checks to make sure returned identifier is not a keyword.
 */
var identifier = parse.Parser('Identifier Parser',
    parse.bind(identifierName, function(name) {
        return (parse.test(_reservedWordTest, name) ?
            parse.never() :
            parse.always(name));
    }));

/* Export
 ******************************************************************************/
return {
    'identifierStart': identifierStart,
    'identifierPart': identifierPart,
    
    'identifier': identifier
};

});