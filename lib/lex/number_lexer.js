/**
 * @fileOverview Lexers for ECMAScript 5.1 number values.
 */
define(['parse/parse', 'stream', 'parse/parse_string'], function(parse, stream, parse_string){
"use strict";

/* Helpers
 ******************************************************************************/
var test = RegExp.prototype.test;

var joinLexer = function(p, joiner) {
    return parse.bind(p, function(v) {
        return parse.always(stream.toArray(v).join(joiner));
    });
};

/* Lexers
 ******************************************************************************/
// Constants
////////////////////////////////////////
/**
 * Lexer that matches decimal character.
 */
var decimal = parse.character('.');

/**
 * Lexer that matches negative sign.
 */
var negativeSign = parse.character('-');

/**
 * Lexer that matches positive sign.
 */
var positiveSign = parse.character('+');

/**
 * Lexer that matches character that indicates the beginning of the exponent
 * part of a number.
 * Either: 'e' or 'E'.
 */
var exponentIndicator = parse.token(test.bind(/^e$/i));

/**
 * Lexer that matches characters that indicate the beginning of a hex number,
 * Either: '0x' or '0X'.
 */
var hexIndicator = parse.either(
    parse.attempt(parse.string('0x')),
    parse.string('0X'));

// Digits
////////////////////////////////////////
/**
 * Lexer that matches any decimal number digit.
 * One of: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
 */
var decimalDigit = parse.token(test.bind(/^[0-9]$/));

/**
 * Lexer that matches any non zero decimal number digit.
 * One of: '1', '2', '3', '4', '5', '6', '7', '8', '9'
 */
var nonZeroDigit = parse.token(test.bind(/^[1-9]$/));

/**
 * Lexer that matches any hex number digit.
 * One of: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',
 * 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'
 */
 var hexDigit = parse.token(test.bind(/^[0-9a-f]$/i));

/**
 * Lexer that matches a string of one or more decimal digits.
 */
var decimalDigits = joinLexer(parse.many1(decimalDigit), '');

/**
 * Lexer that matches a string of one or more hex digits.
 */
var hexDigits = joinLexer(parse.many1(hexDigit), '');

// Integer
////////////////////////////////////////
/**
 * Lexer that matches an unsigned integer.
 * 
 * Returns the numeric value of the integer.
 */
var unsignedInteger =  parse.bind(decimalDigits, function(t) {
    return parse.always(parseInt(t));
});

/**
 * Lexer that matches a signed integer.
 * 
 * Returns the numeric value of the integer.
 */
var signedInteger = parse.choice(
    parse.next(negativeSign,
        parse.bind(unsignedInteger, function(num) {
            return parse.always(-num);
        })),
    parse.next(positiveSign, unsignedInteger),
    unsignedInteger);

// Part
////////////////////////////////////////
/**
 * Lexer that matches the exponent part of a number.
 * 
 * Returns the numeric value of the exponent part.
 */
var exponentPart = parse.next(exponentIndicator, signedInteger);

// Literals
////////////////////////////////////////
/**
 * A hex number literal.
 */
var hexIntegerLiteral = parse.next(hexIndicator, parse.bind(hexDigits, function(num) {
    return parse.always(parseInt(num, 16));
}));

/**
 * A integer number literal.
 * 
 * Returns the number value of the input.
 */
var decimalIntegerLiteral = parse.bind(decimalDigits, function(num) {
    return parse.always(parseInt(num));
});

/**
 * A decimal number literal.
 * 
 * Either a integer or a decimal number. Before or after the decimal must contain
 * at least one number. May contain an exponent value at the end.
 * 
 * @return Number value of the input.
 */
var decimalLiteral = parse.binda(
    parse.sequence(
        parse.choice(
            parse.attempt(parse.bind(
                parse.next(decimal,
                    decimalDigits),
                function(fractional) {
                    return parse.always(parseFloat('.' + fractional));
                })),
            parse.attempt(parse.binda(
                parse.sequence(
                    decimalDigits,
                    decimal,
                    parse.optional(decimalDigits, 0)),
                function(whole, _, fractional) {
                    return parse.always(parseFloat(whole + '.' + fractional));
                })),
            decimalIntegerLiteral),
        parse.optional(exponentPart, 0)),
    function(num, exp) {
        return parse.always(num * Math.pow(10, parseInt(exp)));
});

/**
 * Literal for any numeric value
 * 
 * @return Number value of the input.
 */
var numericLiteral = parse.either(
    parse.attempt(hexIntegerLiteral),
    decimalLiteral);

/* Export
 ******************************************************************************/
return {
// Constants
    'decimal': decimal,
    'negativeSign': negativeSign,
    'positiveSign': positiveSign,
    'exponentIndicator': exponentIndicator,
    'hexIndicator': hexIndicator,

// digits
    'decimalDigit': decimalDigit,
    'nonZeroDigit': nonZeroDigit,
    'hexDigit': hexDigit,
    'decimalDigits': decimalDigits,
    'hexDigits': hexDigits,

// integer
    'unsignedInteger': unsignedInteger,
    'signedInteger': signedInteger,

// part
    'exponentPart': exponentPart,

// Literals
    'hexIntegerLiteral': hexIntegerLiteral,
    'decimalIntegerLiteral': decimalIntegerLiteral,
    'decimalLiteral': decimalLiteral,
    'numericLiteral': numericLiteral
};

});