define(['parse'], function(parse){
/**
 * @fileOverview Parsers for ECMAScript 5.1 null values.
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