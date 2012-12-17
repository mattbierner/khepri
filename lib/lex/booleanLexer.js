/**
 * @fileOverview Lexers for boolean values based on ECMAScript 5.1.
 */
define(['parse'], function(parse){
"use strict";

/* Lexers
 ******************************************************************************/
// Literals
////////////////////////////////////////
/**
 * Lexer for true literal.
 * 
 * Returns true.
 */
var trueLiteral = parse.next(parse.string('true'),
    parse.always(true));

/**
 * Lexer for false literal.
 * 
 * Returns false
 */
var falseLiteral = parse.next(parse.string('false'),
    parse.always(false));

/**
 * Lexer that matches boolean literal.
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