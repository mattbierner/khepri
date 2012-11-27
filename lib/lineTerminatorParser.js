define(['parse'], function(parse){
/**
 * @fileOverview Parsers for line terminators based on ECMAScript 5.1.
 */

/* Exported Objects
 ******************************************************************************/
/**
 * Line Feed
 */
var lf = parse.char('\u000A');

/**
 * Carriage Return
 */
var cr = parse.char('\u000D');

/**
 * Line Separator
 */
var ls = parse.char('\u2028');

/**
 * Paragraph Separator
 */
var ps = parse.char('\u2029');

/**
 * A line terminator character.
 */
var lineTerminator = parse.choice(
    lf,
    cr, 
    ls,
    ps
);

/**
 * A sequence of characters denoting a linter terminator.
 * 
 * CRLF sequences are returned as a single token.
 */
var lineTerminatorSequence = parse.choice(
    lf,
    ls,
    ps,
    parse.bind(cr, function(c) {
        return parse.either(
            parse.attempt(parse.bind(lf, function(f) {
                return parse.always(c + f);
            })),
            parse.always(c)
        );
    })
);


/* Export
 ******************************************************************************/

return {
    'lf': lf,
    'cr': cr,
    'ls': ls,
    'ps': ps,
    'lineTerminator': lineTerminator,
    'lineTerminatorSequence': lineTerminatorSequence
};

});