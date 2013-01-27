/**
 * @fileOverview Lexers for ECMAScript 5.1 null value.
 */
define(['parse/parse', 'parse/parse_string'], function(parse, parse_string){
"use strict";

/* Lexers
 ******************************************************************************/
// Literals
////////////////////////////////////////
/**
 * Lexer that matches null literal.
 */
var nullLiteral = parse.Parser('Null Parser',
    parse.next(parse_string.string('null'),
        parse.always(null)));

/* Export
 ******************************************************************************/
return {
    'nullLiteral': nullLiteral
};

});