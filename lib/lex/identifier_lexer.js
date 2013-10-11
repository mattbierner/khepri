/**
 * @fileOverview Lexers for ECMAScript 5.1 identifiers.
 */
define(['parse/parse', 'parse/text',
        'nu/stream',
        'khepri/lex/reserved_word_lexer', 'khepri/lex/string_lexer'],
function(parse, parse_string,
        stream,
        reserved_word_lexer, string_lexer){
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

var join = function(p, c) {
    return p + "" + c;
};


/* Lexers
 ******************************************************************************/
// Characters
////////////////////////////////////////
/**
 * Zero Width non-joiner Lexer
 */
var zwnj = parse_string.character('\u200c');

/**
 * Zero Width joiner Lexer
 */
var zwj = parse_string.character('\u200d')

/**
 * Lexer for a unicode letter character.
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
 * Lexer for a Unicode digit character.
 * 
 * Any character in the Unicode category Decimal number (Nd).
 * 
 * @TODO Implement for unicode based on spec.
 */
var unicodeDigit = parse_string.digit;

/**
 * Lexer for a Unicode connector punctuation character.
 * 
 * Any character in the Unicode category Connector Punctuation (Pc).
 */
var unicodeConnectorPunctuation = parse.token(function(tok) {
    return (pc.indexOf(tok) !== -1);
});

/**
 * Lexer for any combining mark Unicode character.
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
 * Lexer for the start of an identifier.
 */
var identifierStart = parse.choice(
    unicodeLetter,
    parse_string.character('$'),
    parse_string.character('_'),
    parse.next(string_lexer.escape,
        string_lexer.unicodeEscapeSequence));

/**
 * Lexer for the rest of an identifier after the first character.
 */
var identifierPart = parse.choice(
    parse.attempt(identifierStart),
    unicodeCombiningMark,
    unicodeDigit,
    unicodeConnectorPunctuation,
    zwnj,
    zwj);

var identifierParts = parse.many(identifierPart);

/**
 * Lexer for any identifier name.
 * 
 * May be a keyword.
 */
var identifierName = parse.cons(identifierStart, identifierParts);

// Identifier
////////////////////////////////////////
var reservedWordTest = parse.next(
    reserved_word_lexer.reservedWord,
    parse.eof);

/**
 * Lexer for an identifier.
 * 
 * Checks to make sure returned identifier is not a keyword.
 */
var identifier = parse.Parser('Identifier Lexer',
    parse.bind(identifierName, function(name) {
        return (parse.testStream(reservedWordTest, name) ?
            parse.fail() :
            parse.always(stream.foldl(join, '', name)));
    }));

/* Export
 ******************************************************************************/
return {
// Characters
    'zwnj': zwnj,
    'zwj': zwj,
    'unicodeLetter': unicodeLetter,
    'unicodeDigit': unicodeDigit,
    'unicodeConnectorPunctuation': unicodeConnectorPunctuation,
    'unicodeCombiningMark': unicodeCombiningMark,
    
// Parts
    'identifierStart': identifierStart,
    'identifierPart': identifierPart,
    'identifierParts': identifierParts,
    'identifierName': identifierName,
    
// Identifier
    'identifier': identifier
};

});