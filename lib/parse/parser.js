/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "nu/stream", "ecma/position", "ecma/parse/parser", "khepri/parse/program_parser"], (function(require, exports, parse, __o, __o0, parser, __o1) {
    "use strict";
    var parserStream, parseInput, parseStream;
    var parse = parse,
        __o = __o,
        first = __o["first"],
        filter = __o["filter"],
        isEmpty = __o["isEmpty"],
        rest = __o["rest"],
        streamFrom = __o["from"],
        __o0 = __o0,
        SourceLocation = __o0["SourceLocation"],
        SourcePosition = __o0["SourcePosition"],
        parser = parser,
        __o1 = __o1,
        program = __o1["program"]; {
            (parserStream = (function() {
                {
                    var langElementFilter = (function(x) {
                        switch (x.type) {
                            case "Whitespace":
                            case "LineTerminator":
                            case "Comment":
                                return false;
                            default:
                                return true;
                        }
                    }); {
                        return (function(s) {
                            return filter(langElementFilter, s);
                        });
                    }
                }
            })());
            var ParserState = (function(stream, pos, prevEnd) {
                parse.ParserState.call(this, stream, pos);
                (this._prevEnd = prevEnd);
            });
            (ParserState.prototype = new parse.ParserState());
            (ParserState.prototype.next = (function(tok) {
                if (!this._next) {
                    var r = rest(this.input);
                    var end = (isEmpty(r) ? tok.loc.end : first(r).loc.start);
                    var s = new ParserState(r, this.position.increment(tok, end), this.loc.end);
                    (this._next = (function(_, m, cok) {
                        return cok(tok, s, m);
                    }));
                }

                return this._next;
            }));
            Object.defineProperty(ParserState.prototype, "loc", ({
                "get": (function() {
                    return (isEmpty(this.input) ? new SourceLocation(this._prevEnd, this._prevEnd) : first(this.input).loc);
                })
            }));
            (parseStream = (function(s) {
                return parse.runState(program, new ParserState(parserStream(s), new parser.ParserPosition(parse.Position.initial, SourcePosition.initial), SourcePosition.initial));
            }));
            (parseInput = (function(input) {
                return parseStream(streamFrom(input));
            }));
    }
    (exports.parserStream = parserStream);
    (exports.parseInput = parseInput);
    (exports.parseStream = parseStream);
}))