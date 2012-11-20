define(['parse'], function(parse){
/**
 * @fileOverview Defines parsers for numbers based on ECMAScript 5.1.
 */

/* 
 ******************************************************************************/

var test = RegExp.prototype.test;


/* Exported Objects
 ******************************************************************************/

// Constants
////////////////////////////////////////
/**
 * Parser that matches decimal character.
 */
var decimal = parse.char('.');

/**
 * Parser that matches negative sign.
 */
var negativeSign = parse.char('-');

/**
 * Parser that matches positive sign.
 */
var positiveSign = parse.char('+');

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
    parse.string('0X')
);

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
var decimalDigits = parse.bind(parse.many1(decimalDigit), function(v) {
    return parse.always(v.join(''));
});

/**
 * Parser that matches a string of 1 or more hex digits.
 */
var hexDigits = parse.bind(parse.many1(hexDigit), function(v) {
    return parse.always(v.join(''));
});

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
    parse.bind(negativeSign, function() {
        return parse.bind(unsignedInteger, function(num) {
            return parse.always(-num);
        })
    }),
    parse.next(positiveSign, unsignedInteger),
    unsignedInteger
);

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
 */
var decimalIntegerLiteral = parse.bind(decimalDigits, function(num) {
    return parse.always(parseInt(num));
});

/**
 * 
 */
var decimalLiteral = parse.choice(
    parse.bind(decimalDigits, function(integerPart) {
        return parse.bind(exponentPart, function(e) {
            return parse.always(parseInt(integerPart) * 10 ^ parseInt(e));
        });
    })
);


/**
 * 
 */
var numericLiteral = parse.either(
    parse.attempt(decimalLiteral),
    hexIntegerLiteral
);



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
    'decimalLiteral': decimalLiteral
};

});