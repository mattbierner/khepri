/**
 * @fileOverview Defines parsers for whitespace values based on ECMAScript 5.1.
 */
define(['parse/parse', 'parse/parse_string'], function(parse, parse_string){
"use strict";

var tab = '\u0009',
    vt = '\u000B',
    ff = '\u000C',
    sp = '\u0020',
    nbsp = '\u00A0',
    bom = '\uFEFF';

/* Lexers
 ******************************************************************************/
/**
 * Tab
 */
var tabParser = parse_string.character(tab);

/**
 * Vertical Tab
 */
var vtParser = parse_string.character(vt);

/**
 * Form Feed
 */
var ffParser = parse_string.character(ff);

/**
 * Space
 */
var spParser = parse_string.character(sp);

/**
 * No-break space
 */
var nbspParser = parse_string.character(nbsp);

/**
 * Byte Order Mark
 */
var bomParser = parse_string.character(bom);

/**
 * Any Unicode space separator.
 */
var uspParser = parse.token(RegExp.prototype.test.bind(/^\s$/));

/**
 * A whitespace character.
 */
var whitespace = parse.Parser('Whitespace Lexer',
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
    'tab': tabParser,
    'vt': vtParser,
    'ff': ffParser,
    'sp': spParser,
    'nbsp': nbspParser,
    'bom': bomParser,
    'usp': uspParser,
    
    'whitespace': whitespace
};

});