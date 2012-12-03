/**
 * @fileOverview Parsers for comments based on ECMAScript 5.1.
 */
define(['parse', 'lineTerminatorParser'], function(parse, lineTerminatorParser){
"use strict";

/* Parsers
 ******************************************************************************/
// Single Line Comment
////////////////////////////////////////
/**
 * Parser for token that marks the start of a single line comment.
 */
var singleLineCommentMarker = parse.string('//');

/**
 * Parser for a valid character in a single line comment.
 */
var singleLineCommentChar = parse.token(function(tok) {
    return !parse.test(lineTerminatorParser.lineTerminator, tok);
});

/**
 * Parser for a single line comment
 * 
 * Returns the contents of the comment.
 */
var singleLineComment = parse.next(singleLineCommentMarker,
    parse.bind(parse.many(singleLineCommentChar), function(chars) {
        return parse.always(chars.join(''));
    }));

// Multi Line Comment
////////////////////////////////////////
/**
 * Parser for token that marks the start of a multi line comment.
 */
var multiLineCommentStartMarker = parse.string('/*');

/**
 * Parser for token that markets the end of a multi line comment.
 */
var multiLineCommentEndMarker = parse.string('*/');

/**
 * 
 */
var multiLineCommentChars = parse.Parser('multiLineCommentChars Parser', parse.either(
    parse.next(parse.character('*'), parse.either(
        parse.next(parse.character('/'), parse.never()),
        parse.always('*'))),
    parse.anyToken));

/**
 * Parser for a multi line comment.
 * 
 * Returns the contents of the comment.
 */
var multiLineComment = parse.between(multiLineCommentStartMarker, multiLineCommentEndMarker,
    parse.bind(parse.many(multiLineCommentChars), function(chars) {
        return parse.always(chars.join(''));
    }));


// Comment
////////////////////////////////////////
var comment = parse.Parser('Comment Parser', parse.either(
    parse.attempt(singleLineComment),
    multiLineComment));


/* Export
 ******************************************************************************/

return {
    'singleLineComment': singleLineComment,
    'multiLineComment': multiLineComment,
    'comment': comment
};

});