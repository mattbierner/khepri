define(['parse', 'reservedWordParser'], function(parse, reservedWordParser){
/**
 * @fileOverview Defines parsers for identifier based on ECMAScript 5.1.
 */

var unicodeLetter = parse.letter;  // TODO: fix for unicode.

var unicodeDigit = parse.digit; // TODO: fix for unicode.

var unicodeConnectorPunctuation = parse.choice(
    parse.char('\u005F'),
    parse.char('\u203F'),
    parse.char('\u2040'),
    parse.char('\u2054'),
    parse.char('\uFE33'),
    parse.char('\uFE34'),
    parse.char('\uFE4D'),
    parse.char('\uFE4E'),
    parse.char('\uFE4F'),
    parse.char('\uFF3F')
);

var unicodeCombiningMark = parse.never();

var identifierStart = parse.choice(
    unicodeLetter,
    parse.char('$'),
    parse.char('_'),
    //parse.next()
);

var identifierPart = parser.choice(
    identifierStart,
    parse.anyChar,
    unicodeConnectorPunctuation
);

var identifier = parse.bind(identifierName, function(name) {
    return (parse.test(reservedWordParser.reservedWord, name) ?
        parse.never() :
        parse.always(name));
});

/* Export
 ******************************************************************************/

return {
};

});