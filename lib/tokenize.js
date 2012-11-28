/**
 * @fileOverview Parsers for ECMAScript 5.1 tokenization.
 */
define(['parse', 'booleanParser', 'commentParser', 'identifierParser',
    'lineTerminatorParser', 'nullParser',  'numberParser', 'punctuatorParser',
    'reservedWordParser', 'stringParser', 'whiteSpaceParser'],
function(parse, booleanParser, commentParser, identifierParser,
    lineTerminatorParser, nullParser, numberParser, punctuatorParser,
    reservedWordParser, stringParser, whiteSpaceParser){

var Token = function(type) {
    return function(value) {
        return parse.always({
            'type': type,
            'value': value,
            'toString': function() {
                return "{ type:" + type + " value:" + value + " }";
            }
        });
    };
};

/* Parsers
 ******************************************************************************/
var literal = parse.choice(
    parse.attempt(parse.bind(stringParser.stringLiteral, Token('string'))),
    parse.attempt(parse.bind(booleanParser.booleanLiteral, Token('boolean'))),
    parse.attempt(parse.bind(nullParser.nullLiteral, Token('null'))),
    parse.bind(numberParser.numericLiteral, Token('number')));
    
var token = parse.choice(
    parse.attempt(literal),
    parse.attempt(parse.bind(identifierParser.identifier, Token('Identifier'))),
    parse.attempt(parse.bind(reservedWordParser.reservedWord, Token('keyword'))),
    parse.bind(punctuatorParser.punctuator, Token('punctuator')));

var inputElementRegExp = parse.choice(
    parse.attempt(parse.next(whiteSpaceParser.whiteSpace, parse.always(''))),
    parse.attempt(lineTerminatorParser.lineTerminator),
    parse.attempt(commentParser.comment),
    token);

var tokenize = parse.Parser(function(self) {
    return parse.choice(
        parse.attempt(parse.next(whiteSpaceParser.whiteSpace, self)),
        parse.attempt(parse.next(lineTerminatorParser.lineTerminator, self)),
        parse.attempt(parse.next(commentParser.comment, self)),
        token);
});

/* Export
 ******************************************************************************/
return {
    'token': token,
    'inputElementRegExp': inputElementRegExp
};

});