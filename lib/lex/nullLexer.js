/**
 * @fileOverview Lexers for ECMAScript 5.1 null value.
 */
define(['parse'], function(parse){
"use strict";

/* Lexers
 ******************************************************************************/
// Literals
////////////////////////////////////////
/**
 * Lexer that matches null literal.
 */
var nullLiteral = parse.next(parse.string('null'), parse.always(null));

/* Export
 ******************************************************************************/
return {
    'nullLiteral': nullLiteral
};

});