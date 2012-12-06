/**
 * @fileOverview Parsers for line terminators based on ECMAScrParseript 5.1.
 */
define(['parse'], function(parse){
"use strict";

var lf = '\u000A',
    cr = '\u000D',
    ls = '\u2028',
    ps = '\u2029';

/* Parsers
 ******************************************************************************/
/**
 * Line Feed
 */
var lfParser = parse.character(lf);

/**
 * Carriage Return
 */
var crParser = parse.character(cr);

/**
 * Line Separator
 */
var lsParser = parse.character(ls);

/**
 * Paragraph Separator
 */
var psParser = parse.character(ps);

/**
 * A line terminator character.
 */
var lineTerminator = parse.token(function(tok) {
    switch (tok) {
    case lf:
    case cr:
    case ls:
    case ps:
        return true;
    default:
        return false;
    }
});

/**
 * A sequence of characters denoting a linter terminator.
 * 
 * crlf sequences are returned as a single token.
 */
var lineTerminatorSequence = parse.choice(
    lfParser,
    lsParser,
    psParser,
    parse.next(crParser, parse.either(
        parse.attempt(parse.next(lfParser, parse.always(cr + lf))),
        parse.always(cr))));

/* Export
 ******************************************************************************/
return {
    'lf': lfParser,
    'cr': crParser,
    'ls': lsParser,
    'ps': psParser,

    'lineTerminator': lineTerminator,
    'lineTerminatorSequence': lineTerminatorSequence
};

});