/**
 * @fileOverview
 */
define(['parse/parse',
        'stream/stream',
        'khepri/position',
        'ecma/lex/token',
        'khepri/parse/program_parser'],
function(parse,
        stream,
        position,
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
        switch (x.type) {
        case 'Whitespace':
        case 'LineTerminator':
        case 'Comment':
            return false;
        default:
            return true;
        }
    };
    return function(s) {
        return stream.filter(s, whitespaceFilter);
    };
}());

/**
 * Maps a lex stream to a parse stream.
 * 
 * @param s Stream of tokens.
 * 
 * @return Stream suitable for parsing.
 */
var parserStream = function(s) {
    return langElementStream(s);
};

/* State
 ******************************************************************************/
var ParserState = function(stream, pos, prevEnd) {
    parse.InputState.call(this, stream, pos);
    this._prevEnd = prevEnd;
};
ParserState.prototype = new parse.InputState;

ParserState.prototype.next = function(tok) {
    return (this._next ||
        (this._next = new ParserState(stream.rest(this.input), this.pos.increment(tok), this.loc.end)));
};
Object.defineProperty(ParserState.prototype, 'loc', {
    'get': function() {
        if (stream.isEmpty(this.input)) {
            return new position.SourceLocation(this._prevEnd, this._prevEnd);
        }
        return stream.first(this.input).loc;
    }
});


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
    var state = new ParserState(parserStream(s), new parse.Position(0), new position.SourcePosition(0, 0));
    return parse.runState(program.program, state);
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
var parseInput = function(input, ast) {
    return parseStream(stream.from(input), ast);
};

/* Export
 ******************************************************************************/
return {
    'parserStream': parserStream,
    
    'parse': parseInput,
    'parseStream': parseStream
};

});