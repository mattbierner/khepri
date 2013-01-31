/**
 * @fileOverview
 */
define(['parse/parse',
        'stream',
        'ecma/lex/token',
        'ecma/parse/program',
        'ecma/ast/clause', 'ecma/ast/declaration', 'ecma/ast/expression',
        'ecma/ast/function', 'ecma/ast/node', 'ecma/ast/program',
        'ecma/ast/statement', 'ecma/ast/value'],
function(parse,
        stream,
        lexToken,
        program,
        astClause, astDeclaration, astExpression,
        astFunction, astNode, astProgram,
        astStatement, astValue){
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

/* State
 ******************************************************************************/
var ParserState = function(stream, pos, ast) {
    parse.InputState.call(this, stream, pos);
    this.ast = ast;
};
ParserState.prototype = new parse.InputState;

ParserState.prototype.next = function(tok) {
    return (this._next ||
        (this._next = new ParserState(stream.rest(this.input), this.pos.increment(tok), this.ast)));
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
var parseStream = (function(){
    var defaultAst = Object.freeze({
        'clause': astClause,
        'declaration': astDeclaration,
        'expression': astExpression,
        'function': astFunction,
        'node': astNode,
        'program': astProgram,
        'statement': astStatement,
        'value': astValue
    });
    
    return function(s, ast) {
        var state = new ParserState(parserStream(s), new parse.Position(0, 0), (ast || defaultAst));
        return parse.runState(program.program, state);
    };
}());

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