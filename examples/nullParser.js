define(['parse'], function(parse){
/**
 * @fileOverview Defines parsers for null value based on ECMAScript 5.1.
 */

// Literals
////////////////////////////////////////
/**
 * Parser that matches decimal character.
 */
var nullLiteral = parse.bind(parse.string('null'), function() {
    return parse.always(null);
});

/* Export
 ******************************************************************************/

return {
// Literals
    'nullLiteral': nullLiteral
};

});