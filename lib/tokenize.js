/**
 * @fileOverview Parsers for ECMAScript 5.1 tokenization.
 */
define(['parse', 'booleanParser', 'commentParser', 'identifierParser',
    'lineTerminatorParser', 'nullParser',  'numberParser', 'punctuatorParser',
    'reservedWordParser', 'stringParser', 'whiteSpaceParser'],
function(parse, booleanParser, commentParser, identifierParser,
    lineTerminatorParser, nullParser, numberParser, punctuatorParser,
    reservedWordParser, stringParser, whiteSpaceParser){

/* Parsers
 ******************************************************************************/
var literal = parse.choice(
    stringParser.stringLiteral,
    booleanParser.booleanLiteral,
    nullParser.nullLiteral,
    numberParser.numericLiteral);
    
var token = parse.choice(
    literal,
    identifierParser.identifier,
    reservedWordParser.reservedWord,
    punctuatorParser.punctuator);

var inputElementRegExp = parse.choice(
    whiteSpaceParser.whiteSpace,
    lineTerminatorParser.lineTerminator,
    commentParser.comment,
    token);

/* Export
 ******************************************************************************/
return {
    'token': token,
    'inputElementRegExp': inputElementRegExp
};

});