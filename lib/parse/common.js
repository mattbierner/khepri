/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/common.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "khepri/position", "nu/stream"], (function(require, exports, parse, position, stream) {
    "use strict";
    var precedence, node, nodea, positionParser;
    var parse = parse,
        position = position,
        stream = stream; {
            (precedence = (function(p, table) {
                var sep = parse.choicea(table.map((function(entry) {
                    return parse.bind(entry.sep, (function(v) {
                        return parse.always(({
                            "value": v.value,
                            "node": entry.node,
                            "precedence": entry.precedence
                        }), v.value);
                    }));
                })));
                return parse.bind(parse.rec((function(self) {
                    return parse.cons(p, parse.optional(stream.end, parse.cons(sep, parse.expected("binary expression", self))));
                })), (function(x) {
                    var list = stream.toArray(x);
                    var stack = [],
                        out = [];
                    while ((list.length > 0)) {
                        var tok = list.shift();
                        if (tok.type) {
                            out.push(tok);
                        } else {
                            while ((stack.length > 0)) {
                                var o2 = stack[(stack.length - 1)];
                                if ((o2.precedence <= tok.precedence)) {
                                    stack.pop();
                                    var rt = out.pop(),
                                        lf = out.pop();
                                    out.push(new(o2.node)(position.SourceLocation.merge(lf.loc, rt.loc), o2.value, lf, rt));
                                } else {
                                    break;
                                }

                            }

                            stack.push(tok);
                        }

                    }

                    while ((stack.length > 0)) {
                        var o = stack.pop();
                        var rt0 = out.pop(),
                            lf0 = out.pop();
                        out.push(new(o.node)(position.SourceLocation.merge(lf0.loc, rt0.loc), o.value, lf0, rt0));
                    }

                    return parse.always(out.pop());
                }));
            }));
            (positionParser = parse.extract((function(state) {
                return state.position;
            })));
            var locParser = parse.extract((function(state) {
                return state.loc;
            }));
            var prevEnd = parse.extract((function(state) {
                return state._prevEnd;
            }));
            (node = (function(p, f) {
                return parse.binds(parse.enumeration(locParser, p, prevEnd), (function(o, x, c) {
                    return parse.always(f(new(position.SourceLocation)(o.start, c), x));
                }));
            }));
            (nodea = (function(p, f) {
                return parse.binds(parse.enumeration(locParser, p, prevEnd), (function(o, x, c) {
                    return parse.always(f.apply(undefined, stream.toArray(stream.cons(new(position.SourceLocation)(o.start, c), x))));
                }));
            }));
    }
    (exports.precedence = precedence);
    (exports.node = node);
    (exports.nodea = nodea);
    (exports.positionParser = positionParser);
}))