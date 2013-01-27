/**
 * @fileOverview Lexers for comments based on ECMAScript 5.1.
 */
define(['parse/parse', 'parse/parse_string', 'parse/parse_eager',
        'stream',
        'ecma/lex/line_terminator_lexer'],
    function(parse, parse_string, parse_eager,
            stream,
            line_terminator){
"use strict";

var join = function(p, c) {
    return p + "" + c;
};

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
        return parse.always(stream.reduce(chars, join, ''));
    }));

// Multi Line Comment
////////////////////////////////////////
/**
 * Lexer for token that marks the start of a multi line comment.
 */
var multiLineCommentStartMarker = parse_string.string('/*');

/**
 * Lexer for token that markets the end of a multi line comment.
 */
var multiLineCommentEndMarker = parse_string.string('*/');

/**
 * Lexer for string of characters inside of multi line comment.
 */
var multiLineCommentChars = parse.RecParser('multiLineCommentChars Lexer', function(self) {
    return parse.either(
        parse.attempt(parse.next(parse_string.character('*'), parse.either(
            parse.next(parse_string.character('/'), parse.always(stream.end)),
            parse.consParser(parse.always('*'), self)))),
        parse.consParser(parse.anyToken, self));
    });

/**
 * Lexer for a multi line comment.
 * 
 * Returns the contents of the comment.
 */
var multiLineComment = parse.next(multiLineCommentStartMarker,
    parse.bind(multiLineCommentChars, function(chars) {
        return parse.always(stream.reduce(chars, join, ''));
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