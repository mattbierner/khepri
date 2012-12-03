/**
 * @fileOverview Parsers for ECMAScript 5.1 number values.
 */
define(['parse', 'parse_string'], function(parse, parse_string){
"use strict";

/* Helpers
 ******************************************************************************/
var test = RegExp.prototype.test;

var joinParser = function(p, joiner) {
    return parse.bind(p, function(v) {
        return parse.always(v.join(joiner));
    });
};

/* Parsers
 ******************************************************************************/
// Constants
////////////////////////////////////////
/**
 * Parser that matches decimal character.
 */
var decimal = parse.character('.');

/**
 * Parser that matches negative sign.
 */
var negativeSign = parse.character('-');

/**
 * Parser that matches positive sign.
 */
var positiveSign = parse.character('+');

/**
 * Parser that matches character that indicates the beginning of the exponent
 * part of a number.
 * Either: 'e' or 'E'.
 */
var exponentIndicator = parse.token(test.bind(/^e$/i));

/**
 * Parser that matches characters that indicate the beginning of a hex number,
 * Either: '0x' or '0X'.
 */
var hexIndicator = parse.either(
    parse.attempt(parse.string('0x')),
    parse.string('0X'));

// Digits
////////////////////////////////////////
/**
 * Parser that matches any decimal number digit.
 * One of: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
 */
var decimalDigit = parse.token(test.bind(/^[0-9]$/));

/**
 * Parser that matches any non zero decimal number digit.
 * One of: '1', '2', '3', '4', '5', '6', '7', '8', '9'
 */
var nonZeroDigit = parse.token(test.bind(/^[1-9]$/));

/**
 * Parser that matches any hex number digit.
 * One of: '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',
 * 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F'
 */
 var hexDigit = parse.token(test.bind(/^[0-9a-f]$/i));

/**
 * Parser that matches a string of 1 or more decimal digits.
 */
var decimalDigits = joinParser(parse.many1(decimalDigit), '');

/**
 * Parser that matches a string of 1 or more hex digits.
 */
var hexDigits = joinParser(parse.many1(hexDigit), '');

// Integer
////////////////////////////////////////
/**
 * Parser that matches an unsigned integer.
 * 
 * Returns the numeric value of the integer.
 */
var unsignedInteger =  parse.bind(decimalDigits, function(t) {
    return parse.always(parseInt(t));
});

/**
 * Parser that matches a signed integer.
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
 * Parser that matches the exponent part of a number.
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
 * Returns the number value of the input.
 */
var decimalLiteral = parse.choice(
    parse.attempt(parse.next(decimal, parse.bind(decimalDigits, function(decimal) {
            var base = parseFloat('.' + decimal);
            return parse.either(
                parse.attempt(parse.bind(exponentPart, function(e) {
                    return parse.always(base * Math.pow(10, parseInt(e)));
                })),
                parse.always(base));
        }))),
    parse.attempt(parse.bind(decimalDigits, function(whole) {
        return parse.next(decimal, parse.bind(parse.optional(decimalDigits), function(decimal) {
            var base = parseFloat(whole + '.' + (decimal ? decimal[0] : 0));
            return parse.either(
                parse.attempt(parse.bind(exponentPart, function(e) {
                    return parse.always(base * Math.pow(10, parseInt(e)));
                })),
                parse.always(base));
        }));
    })),
    parse.bind(decimalIntegerLiteral, function(integerPart) {
        return parse.either(
            parse.attempt(parse.bind(exponentPart, function(e) {
                return parse.always(integerPart * Math.pow(10, parseInt(e)));
            })),
            parse.always(integerPart));
    }));

/**
 * Literal for any numeric value
 * Returns the number value of the input.
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