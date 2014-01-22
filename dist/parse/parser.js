/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "nu-stream/stream", "khepri/position", "khepri/parse/program_parser"], (
    function(require, exports, parse, __o, __o0, __o1) {
        "use strict";
        var parserStream, ParserPosition, ParserState, parseInput, parseStream;
        var parse = parse,
            __o = __o,
            first = __o["first"],
            filter = __o["filter"],
            isEmpty = __o["isEmpty"],
            rest = __o["rest"],
            NIL = __o["NIL"],
            streamFrom = __o["from"],
            __o0 = __o0,
            SourceLocation = __o0["SourceLocation"],
            SourcePosition = __o0["SourcePosition"],
            __o1 = __o1,
            program = __o1["program"];
        (parserStream = filter.bind(null, (function(x) {
            switch (x.type) {
                case "Whitespace":
                case "LineTerminator":
                case "Comment":
                    return false;
                default:
                    return true;
            }
        })));
        (ParserPosition = (function(tokenPosition, sourcePosition) {
            (this.tokenPosition = tokenPosition);
            (this.sourcePosition = sourcePosition);
        }));
        (ParserPosition.prototype = new(parse.Position)());
        (ParserPosition.prototype.constructor = ParserPosition);
        (ParserPosition.initial = new(ParserPosition)(parse.Position.initial, SourcePosition.initial));
        (ParserPosition.prototype.increment = (function(tok, end) {
            return new(ParserPosition)(this.tokenPosition.increment(tok), end);
        }));
        (ParserPosition.prototype.toString = (function() {
            return ("" + this.sourcePosition);
        }));
        (ParserPosition.prototype.compare = (function(pos) {
            return this.tokenPosition.compare(pos.tokenPosition);
        }));
        (ParserState = (function(input, pos, prevEnd) {
            parse.ParserState.call(this, input, pos);
            (this._prevEnd = prevEnd);
        }));
        (ParserState.prototype = new(parse.ParserState)());
        (ParserState.initial = new(ParserState)(NIL, ParserPosition.initial, SourcePosition.initial));
        (ParserState.prototype.setInput = (function(input) {
            return new(ParserState)(input, this.position, this._prevEnd);
        }));
        (ParserState.prototype.setPosition = (function(position) {
            return new(ParserState)(this.input, position, this._prevEnd);
        }));
        (ParserState.prototype.next = (function(tok) {
            if (!this._next) {
                var r = rest(this.input);
                var end = (isEmpty(r) ? tok.loc.end : first(r)
                    .loc.start);
                var s = new(ParserState)(r, this.position.increment(tok, end), this.loc.end);
                (this._next = (function(_, m, cok) {
                    return cok(tok, s, m);
                }));
            }
            return this._next;
        }));
        Object.defineProperty(ParserState.prototype, "loc", ({
            "get": (function() {
                return (isEmpty(this.input) ? new(SourceLocation)(this._prevEnd, this._prevEnd) : first(
                        this.input)
                    .loc);
            })
        }));
        (parseStream = (function(s) {
            return parse.runState(program, new(ParserState)(parserStream(s), ParserPosition.initial));
        }));
        (parseInput = (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(parseStream, streamFrom));
        (exports.parserStream = parserStream);
        (exports.ParserPosition = ParserPosition);
        (exports.ParserState = ParserState);
        (exports.parseInput = parseInput);
        (exports.parseStream = parseStream);
    }))