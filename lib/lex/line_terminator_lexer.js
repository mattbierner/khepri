/**
 * @fileOverview Lexers for line terminators based on ECMAScrLexeript 5.1.
 */
define(['parse/parse', 'parse/parse_string'], function(parse, parse_string){
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
var lfLexer = parse.Parser('Line Feed Lexer',
    parse_string.character(lf));

/**
 * Carriage Return
 */
var crLexer = parse.Parser('Carriage Return Lexer',
    parse_string.character(cr));

/**
 * Line Separator
 */
var lsLexer = parse.Parser('Line Separator Lexer',
    parse_string.character(ls));

/**
 * Paragraph Separator
 */
var psLexer = parse.Parser('Paragraph Separator Lexer',
    parse_string.character(ps));

/**
 * A line terminator character.
 */
var lineTerminator = parse.Parser('Line Terminator Lexer',
    parse.token(function(tok) {
        switch (tok) {
        case lf:
        case cr:
        case ls:
        case ps:
            return true;
        default:
            return false;
        }
    }));

/**
 * A sequence of characters denoting a linter terminator.
 * 
 * crlf sequences are returned as a single token.
 */
var lineTerminatorSequence = parse.Parser('Line Terminator Sequence Lexer',
    parse.choice(
        parse.attempt(lfLexer),
        parse.attempt(lsLexer),
        parse.attempt(psLexer),
        parse.next(crLexer,
            parse.either(
                parse.attempt(parse.next(lfLexer,
                    parse.always(cr + lf))),
                parse.always(cr)))));

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