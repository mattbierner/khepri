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
    parse.attempt(stringParser.stringLiteral),
    parse.attempt(booleanParser.booleanLiteral),
    parse.attempt(nullParser.nullLiteral),
    numberParser.numericLiteral);
    
var token = parse.choice(
    parse.attempt(literal),
    parse.attempt(identifierParser.identifier),
    parse.attempt(reservedWordParser.reservedWord),
    punctuatorParser.punctuator);

var inputElementRegExp = parse.choice(
    parse.attempt(whiteSpaceParser.whiteSpace),
    parse.attempt(lineTerminatorParser.lineTerminator),
    parse.attempt(commentParser.comment),
    token);

parse.run(inputElementRegExp, '3')

/* Export
 ******************************************************************************/
return {
    'token': token,
    'inputElementRegExp': inputElementRegExp
};

});