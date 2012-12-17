/**
 * @fileOverview Lexers for comments based on ECMAScript 5.1.
 */
define(['parse/parse', 'ecma/lex/line_terminator_lexer'], function(parse, line_terminator){
"use strict";

/* Lexers
 ******************************************************************************/
// Single Line Comment
////////////////////////////////////////
/**
 * Lexer for token that marks the start of a single line comment.
 */
var singleLineCommentMarker = parse.string('//');

/**
 * Lexer for a valid character in a single line comment.
 */
var singleLineCommentChar = parse.token(function(tok) {
    return !parse.test(line_terminator.lineTerminator, tok);
});

/**
 * Lexer for a single line comment
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
 * Lexer for token that marks the start of a multi line comment.
 */
var multiLineCommentStartMarker = parse.string('/*');

/**
 * Lexer for token that markets the end of a multi line comment.
 */
var multiLineCommentEndMarker = parse.string('*/');

/**
 * Lexer for string of characters inside of multi line comment.
 */
var multiLineCommentChars = parse.Parser('multiLineCommentChars Lexer',
    parse.either(
        parse.next(parse.character('*'), parse.either(
            parse.next(parse.character('/'), parse.never()),
            parse.always('*'))),
        parse.anyToken));

/**
 * Lexer for a multi line comment.
 * 
 * Returns the contents of the comment.
 */
var multiLineComment = parse.between(multiLineCommentStartMarker, multiLineCommentEndMarker,
    parse.bind(parse.many(multiLineCommentChars), function(chars) {
        return parse.always(chars.join(''));
    }));

// Comment
////////////////////////////////////////
/**
 * Lexer for any ECMAScript 5.1 comment
 */
var comment = parse.Parser('Comment Lexer',
    parse.either(
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