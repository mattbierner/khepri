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
        parse.ParserState.call(this, stream, pos);
        (this._prevEnd = prevEnd);
    }
    ;
    (ParserState.prototype = new parse.ParserState());
    (ParserState.prototype.next = function(tok) {
        if (! this._next){
            var rest = stream.rest(this.input);
            var end = (stream.isEmpty(rest) ? tok.loc.end : stream.first(rest).loc.start);
            var s = new ParserState(rest, this.position.increment(tok, end), this.loc.end);
            (this._next = function(_, m, cok) {
                return cok(tok, s, m);
            }
            );
        }
        
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
    var parseInput = function(input) {
        return parseStream(stream.from(input));
    }
    ;
    return ({
        "parserStream": parserStream,
        "parse": parseInput,
        "parseStream": parseStream
    });
}
);
