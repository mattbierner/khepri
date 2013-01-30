/**
 * @fileOverview
 */
define(['parse/parse',
        'stream',
        'ecma/lex/token',
        'ecma/parse/program'],
function(parse,
        stream,
        lexToken,
        program){
"use strict";

/* Streams
 ******************************************************************************/
/**
 * Filters lex stream to remove whitespace and comments.
 * 
 * TODO: better line terminator check
 */
var langElementStream = (function(){
    var whitespaceFilter = function(x) {
        return (x.type !== 'Whitespace');
    };
    
    var commentFilter = function(s) {
        if (stream.isEmpty(s)) {
            return s;
        }
        var first = stream.first(s),
            rest = stream.rest(s);
        if (first.type === 'Comment') {
            return (first.value.indexOf('\n') !== -1 ?
                stream.cons(new lexToken.LineTerminatorToken('\n', first.loc), commentFilter(rest)) :
                commentFilter(rest));
        }
        return stream.memoStream(first, commentFilter.bind(undefined, rest));
    };
    
    return function(s) {
        return commentFilter(stream.filter(s, whitespaceFilter));
    };
}());

/**
 * Filters lex stream to remove line terminators and note tokens following
 * a line terminator.
 */
var lineTerminatorStream = function(s) {
    if (stream.isEmpty(s)) {
        return s;
    }
    
    var first = stream.first(s), rest = stream.rest(s);
    
    if (first.type === 'LineTerminator') {
        while (first.type === 'LineTerminator') {
            if (stream.isEmpty(rest)) {
                return rest;
            } else {
                first = stream.first(rest)
                rest = stream.rest(rest);
            }
        }
        var tok = new lexToken.Token(first.value, first.loc);
        tok.type = first.type;
        tok.lineTerminator = true;
        
        first = tok;
    }
    return stream.memoStream(first, lineTerminatorStream.bind(undefined, rest));
};


/**
 * Maps a lex stream to a parse stream.
 * 
 * @param s Stream of tokens.
 * 
 * @return Stream suitable for parsing.
 */
var parserStream = function(s) {
    return lineTerminatorStream(langElementStream(s));
};

/* Running
 ******************************************************************************/
/**
 * Parses a lex stream into an AST.
 * 
 * May throw any parse errors.
 * 
 * @param s Stream of tokens.
 * 
 * @return AST.
 */
var parseStream = function(s) {
    return parse.runStream(program.program, parserStream(s));
};

/**
 * Parses a lex array into an AST.
 * 
 * May throw any parse errors.
 * 
 * @param input Array like object of tokens.
 * 
 * @return AST.
 */
var parseInput = function(input) {
    return parseStream(stream.from(input));
};

/* Export
 ******************************************************************************/
return {
    'parserStream': parserStream,
    
    'parse': parseInput,
    'parseStream': parseStream
};

});