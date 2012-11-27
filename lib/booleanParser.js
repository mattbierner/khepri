define(['parse'], function(parse){
/**
 * @fileOverview Parsers for boolean values based on ECMAScript 5.1.
 */

// Literals
////////////////////////////////////////
/**
 * Parser that matches decimal character.
 */
var trueLiteral = parse.bind(parse.string('true'), function() {
    return parse.always(true);
});

var falseLiteral = parse.bind(parse.string('false'), function() {
    return parse.always(false);
});

var booleanLiteral = parse.either(
    parse.attempt(trueLiteral),
    falseLiteral
);


/* Export
 ******************************************************************************/
return {
    'trueLiteral': trueLiteral,
    'falseLiteral': falseLiteral,
    'booleanLiteral': booleanLiteral
};

});