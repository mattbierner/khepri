define(['parse', 'reservedWordParser', 'stringParser'],
function(parse, reservedWordParser, stringParser){
/**
 * @fileOverview Parsers for ECMAScript 5.1 identifiers based.
 */

/* Parsers
 ******************************************************************************/
// Constants
////////////////////////////////////////
/**
 * Zero Width non-joiner Parser
 */
var zwnj = parse.char('\u200c');

/**
 * Zero Width joiner Parser
 */
var zwj = parse.char('\u200d')

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
var unicodeLetter = parse.letter; 

/**
 * Parser for a Unicode digit character.
 * 
 * Any character in the Unicode category Decimal number (Nd).
 * 
 * @TODO Implement for unicode based on spec.
 */
var unicodeDigit = parse.digit;

/**
 * Parser for a Unicode connector punctuation character.
 * 
 * Any character in the Unicode category Connector Punctuation (Pc).
 */
var unicodeConnectorPunctuation = parse.choice(
    parse.char('\u005F'),
    parse.char('\u203F'),
    parse.char('\u2040'),
    parse.char('\u2054'),
    parse.char('\uFE33'),
    parse.char('\uFE34'),
    parse.char('\uFE4D'),
    parse.char('\uFE4E'),
    parse.char('\uFE4F'),
    parse.char('\uFF3F'));

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
    parse.char('$'),
    parse.char('_'),
    parse.next(parse.char('\\'), stringParser.unicodeEscapeSequence));

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

/**
 * Parser for any identifier name.
 * 
 * May be a keyword.
 */
var identifierName = parse.bind(identifierStart, function(start) {
    return parse.bind(parse.many(identifierPart), function(rest) {
        return parse.always(start + rest.join(''));
    });
});

// Identifier
////////////////////////////////////////
/**
 * Parser for an identifier.
 * 
 * Checks to make sure returned identifier is not a keyword.
 */
var identifier = parse.bind(identifierName, function(name) {
    return (parse.test(reservedWordParser.reservedWord, name) ?
        parse.never() :
        parse.always(name));
});

/* Export
 ******************************************************************************/
return {
    'identifier': identifier
};

});