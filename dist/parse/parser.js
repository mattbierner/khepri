/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "nu-stream/stream", "../position", "./program_parser"], (function(require,
    exports, parse, stream, __o, __o0) {
    "use strict";
    var first = stream["first"],
        filter = stream["filter"],
        isEmpty = stream["isEmpty"],
        rest = stream["rest"],
        NIL = stream["NIL"],
        streamFrom = stream["from"],
        SourceLocation = __o["SourceLocation"],
        SourcePosition = __o["SourcePosition"],
        program = __o0["program"],
        parserStream, ParserPosition, ParserState, parseInput, parseStream;
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
        var self = this;
        (self.tokenPosition = tokenPosition);
        (self.sourcePosition = sourcePosition);
    }));
    (ParserPosition.prototype = new(parse.Position)());
    (ParserPosition.prototype.constructor = ParserPosition);
    (ParserPosition.initial = new(ParserPosition)(parse.Position.initial, SourcePosition.initial));
    (ParserPosition.prototype.increment = (function(tok, end) {
        var self = this;
        return new(ParserPosition)(self.tokenPosition.increment(tok), end);
    }));
    (ParserPosition.prototype.toString = (function() {
        var self = this;
        return ("" + self.sourcePosition);
    }));
    (ParserPosition.prototype.compare = (function(pos) {
        var self = this;
        return self.tokenPosition.compare(pos.tokenPosition);
    }));
    (ParserState = (function(input, pos, prevEnd) {
        var self = this;
        parse.ParserState.call(self, input, pos);
        (self._prevEnd = prevEnd);
    }));
    (ParserState.prototype = new(parse.ParserState)());
    (ParserState.initial = new(ParserState)(NIL, ParserPosition.initial, SourcePosition.initial));
    (ParserState.prototype.setInput = (function(input) {
        var self = this;
        return new(ParserState)(input, self.position, self._prevEnd);
    }));
    (ParserState.prototype.setPosition = (function(position) {
        var self = this;
        return new(ParserState)(self.input, position, self._prevEnd);
    }));
    (ParserState.prototype.next = (function(tok) {
        var self = this;
        if ((!self._next)) {
            var r = rest(self.input),
                end = (isEmpty(r) ? tok.loc.end : first(r)
                    .loc.start),
                s = new(ParserState)(r, self.position.increment(tok, end), self.loc.end);
            (self._next = (function(_, m, cok) {
                return cok(tok, s, m);
            }));
        }
        return self._next;
    }));
    Object.defineProperty(ParserState.prototype, "loc", ({
        "get": (function() {
            var self = this;
            return (isEmpty(self.input) ? new(SourceLocation)(self._prevEnd, self._prevEnd) : first(
                    self.input)
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
}));