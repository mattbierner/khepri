/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "nu/stream", "ecma/position", "khepri_ast/token", "khepri/parse/program_parser"], function(parse, stream, position, parser, lexToken, program) {
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
