/**
 * @fileOverview Lexers for line terminators based on ECMAScrLexeript 5.1.
 */
define(['parse/parse'], function(parse){
"use strict";

var lf = '\u000A',
    cr = '\u000D',
    ls = '\u2028',
    ps = '\u2029';

/* Lexers
 ******************************************************************************/
/**
 * Line Feed
 */
var lfLexer = parse.character(lf);

/**
 * Carriage Return
 */
var crLexer = parse.character(cr);

/**
 * Line Separator
 */
var lsLexer = parse.character(ls);

/**
 * Paragraph Separator
 */
var psLexer = parse.character(ps);

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
    lfLexer,
    lsLexer,
    psLexer,
    parse.next(crLexer, parse.either(
        parse.attempt(parse.next(lfLexer, parse.always(cr + lf))),
        parse.always(cr))));

/* Export
 ******************************************************************************/
return {
    'lf': lfLexer,
    'cr': crLexer,
    'ls': lsLexer,
    'ps': psLexer,

    'lineTerminator': lineTerminator,
    'lineTerminatorSequence': lineTerminatorSequence
};

});