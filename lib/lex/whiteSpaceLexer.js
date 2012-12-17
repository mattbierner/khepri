/**
 * @fileOverview Defines parsers for whitespace values based on ECMAScript 5.1.
 */
define(['parse'], function(parse){
"use strict";

/* Exported Objects
 ******************************************************************************/
/**
 * Tab
 */
var tab = parse.character('\u0009');

/**
 * Vertical Tab
 */
var vt = parse.character('\u000B');

/**
 * Form Feed
 */
var ff = parse.character('\u000C');

/**
 * Space
 */
var sp = parse.character('\u0020');

/**
 * No-break space
 */
var nbsp = parse.character('\u00A0');

/**
 * Byte Order Mark
 */
var bom = parse.character('\uFEFF');

/**
 * Any Unicode space separator.
 */
var usp = parse.token(RegExp.prototype.test.bind(/^\s$/));

/**
 * A whitespace character.
 */
var whiteSpace = parse.Parser('White Space Lexer',
    parse.token(function(tok) {
        switch (tok) {
        case '\u0009':
        case '\u000B':
        case '\u000C':
        case '\u0020':
        case '\u00A0':
        case '\uFEFF':
            return true;
        default:
            return false;
        }
    }));


/* Export
 ******************************************************************************/
return {
    'tab': tab,
    'vt': vt,
    'ff': ff,
    'sp': sp,
    'nbsp': nbsp,
    'bom': bom,
    'usp': usp,
    
    'whiteSpace': whiteSpace
};

});