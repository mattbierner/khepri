define(['parse'], function(parse){
/**
 * @fileOverview Defines parsers for whitespace values based on ECMAScript 5.1.
 */

/* Exported Objects
 ******************************************************************************/
/**
 * Tab
 */
var tab = parse.char('\u0009');

/**
 * Vertical Tab
 */
var vt = parse.char('\u000B');

/**
 * Form Feed
 */
var ff = parse.char('\u000C');

/**
 * Space
 */
var sp = parse.char('\u0020');

/**
 * No-break space
 */
var nbsp = parse.char('\u00A0');

/**
 * Byte Order Mark
 */
var bom = parse.char('\uFEFF');

/**
 * Any Unicode space separator.
 */
var usp = parse.token.bind(RegExp.prototype.test.bind(/^\s$/));


/**
 * A whitespace character.
 */
var whiteSpace = parse.choice(
    tab,
    vt,
    ff,
    sp,
    nbsp,
    bom,
    usp
);


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