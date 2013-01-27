/**
 * @fileOverview Lexers for boolean values based on ECMAScript 5.1.
 */
define(['parse/parse', 'parse/parse_string'], function(parse, parse_string){
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
var trueLiteral = parse.Parser('True Literal Lexer',
    parse.next(parse_string.string('true'),
        parse.always(true)));

/**
 * Lexer for false literal.
 * 
 * Returns false
 */
var falseLiteral = parse.Parser('False Literal Lexer',
    parse.next(parse_string.string('false'),
        parse.always(false)));

/**
 * Lexer that matches boolean literal.
 * 
 * Returns the value of the boolean literal
 */
var booleanLiteral = parse.Parser('Boolean Literal Lexer',
    parse.either(
        parse.attempt(trueLiteral),
        falseLiteral));

/* Export
 ******************************************************************************/
return {
    'trueLiteral': trueLiteral,
    'falseLiteral': falseLiteral,
    'booleanLiteral': booleanLiteral
};

});