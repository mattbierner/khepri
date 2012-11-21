define(['parse'], function(parse){
/**
 * @fileOverview Defines parsers for Line Terminator values based on
 * ECMAScript 5.1.
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
 * 
 */
var lineTerminatorSequence = (function(){
    var notlf = parse.either(
        parse.attempt(parse.eof),
        parse.token(function(tok) {
            return tok.toString() !== '\u000A';
        })
    );
    
    return parse.choice(
        lf,
        ls,
        ps,
        parse.bind(cr, function(c) {
            return parse.bind(parse.lookahead(notlf), function() {
                return parse.always(c);
            });
        }),
        parse.bind(cr, function(c) {
            return parse.bind(lf, function(f) {
                return parse.always(c + f);
            })
        })
    );
}());


/* Export
 ******************************************************************************/

return {
// Literals
    'trueLiteral': trueLiteral,
    'falseLiteral': falseLiteral,
    'booleanLiteral': booleanLiteral
};

});