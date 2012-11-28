/**
 * @fileOverview Parsers for boolean values based on ECMAScript 5.1.
 */
define(['parse'], function(parse){
"use strict";

/* Parsers
 ******************************************************************************/
// Literals
////////////////////////////////////////
/**
 * Parser for true literal.
 * 
 * Returns true.
 */
var trueLiteral = parse.next(parse.string('true'), parse.always(true));

/**
 * Parser for false literal.
 * 
 * Returns false
 */
var falseLiteral = parse.next(parse.string('false'), parse.always(false));

/**
 * Parser that matches boolean literal.
 * 
 * Returns the value of the boolean literal
 */
var booleanLiteral = parse.either(
    parse.attempt(trueLiteral),
    falseLiteral);

/* Export
 ******************************************************************************/
return {
    'trueLiteral': trueLiteral,
    'falseLiteral': falseLiteral,
    'booleanLiteral': booleanLiteral
};

});