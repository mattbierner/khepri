/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "nu/stream", "ecma/position", "ecma/parse/parser", "khepri_ast/token", "khepri/parse/program_parser"], function(parse, stream, position, parser, lexToken, program) {
    "use strict";
    var parserStream = function(langElementFilter) {
        return function(s) {
            return stream.filter(langElementFilter, s);
        }
        ;
    }
    (function langElementFilter(x) {
        switch(x.type){
            case "Whitespace":
            case "LineTerminator":
            case "Comment":
            return false;
            default:
            return true;
        }
    }
    );
    var ParserState = function(stream, pos, prevEnd) {
        parse.InputState.call(this, stream, pos);
        (this._prevEnd = prevEnd);
    }
    ;
    (ParserState.prototype = new parse.InputState());
    (ParserState.prototype.next = function(tok) {
        var rest = stream.rest(this.input);
        var end = (stream.isEmpty(rest) ? tok.loc.end : stream.first(rest).loc.start);
        if (! this._next)(this._next = new ParserState(rest, this.pos.increment(tok, end), this.loc.end));
        
        return this._next;
    }
    );
    Object.defineProperty(ParserState.prototype, "loc", ({
        "get": function() {
            return (stream.isEmpty(this.input) ? new position.SourceLocation(this._prevEnd, this._prevEnd) : stream.first(this.input).loc);
        }
        
    }));
    var parseStream = function(s) {
        return parse.runState(program.program, new ParserState(parserStream(s), new parser.ParserPosition(parse.Position.initial, position.SourcePosition.initial), position.SourcePosition.initial));
    }
    ;
    var parseInput = function(input, ast) {
        return parseStream(stream.from(input), ast);
    }
    ;
    return ({
        "parserStream": parserStream,
        "parse": parseInput,
        "parseStream": parseStream
    });
}
);
