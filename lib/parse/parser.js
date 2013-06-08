/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
define(["parse/parse", "nu/stream", "ecma/lex/token", "ecma/position", "ecma/parse/parser", "khepri/parse/program_parser"], function(parse, stream, lexToken, position, parser, program) {
    "use strict";
    var parserStream = function() {
        var langElementFilter = function(x) {
            switch(x.type){
                case "Whitespace":
                case "LineTerminator":
                case "Comment":
                return false;
                default:
                return true;
            }
        }
        ;
        return function(s) {
            return stream.filter(langElementFilter, s);
        }
        ;
    }
    ();
    var parseStream = function(s) {
        return parse.runState(program.program, new parser.ParserState(parserStream(s), new parser.ParserPosition(parse.Position.initial, position.SourcePosition.initial), position.SourcePosition.initial));
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
