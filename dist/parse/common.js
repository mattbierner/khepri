/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/common.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "khepri/position", "nu/stream"], (function(require, exports, parse, __o, stream) {
    "use strict";
    var precedence, node, nodea, positionParser;
    var parse = parse,
        always = parse["always"],
        bind = parse["bind"],
        __o = __o,
        SourceLocation = __o["SourceLocation"],
        stream = stream,
        NIL = stream["NIL"];
    (precedence = (function(p, table) {
        var sep = parse.choicea(table.map((function(entry) {
            return bind(entry.sep, (function(__o0) {
                var __o0 = __o0,
                    value = __o0["value"];
                return always(({
                    "value": value,
                    "node": entry.node,
                    "precedence": entry.precedence,
                    "right": entry.right
                }), value);
            }));
        })));
        return bind(parse.eager(parse.rec((function(self) {
            return parse.cons(p, parse.optional(NIL, parse.cons(sep, parse.expected("binary expression", self))));
        }))), (function(list) {
            var stack = [],
                out = [];
            while ((list.length > 0)) {
                var tok = list.shift();
                if (tok.type) {
                    out.push(tok);
                } else {
                    while ((stack.length > 0)) {
                        var o2 = stack[(stack.length - 1)];
                        if (((!tok.right && (o2.precedence === tok.precedence)) || (o2.precedence < tok.precedence))) {
                            stack.pop();
                            var rt = out.pop(),
                                lf = out.pop();
                            out.push(new(o2.node)(SourceLocation.merge(lf.loc, rt.loc), o2.value, lf, rt));
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
                out.push(new(o.node)(SourceLocation.merge(lf0.loc, rt0.loc), o.value, lf0, rt0));
            }

            return parse.always(out.pop());
        }));
    }));
    (positionParser = parse.extract((function(__o0) {
        var __o0 = __o0,
            position = __o0["position"];
        return position;
    })));
    var locParser = parse.extract((function(__o0) {
        var __o0 = __o0,
            loc = __o0["loc"];
        return loc;
    }));
    var prevEnd = parse.extract((function(__o0) {
        var __o0 = __o0,
            _prevEnd = __o0["_prevEnd"];
        return _prevEnd;
    }));
    (node = (function(p, f) {
        return parse.binds(parse.enumeration(locParser, p, prevEnd), (function(o, x, c) {
            return always(f(new(SourceLocation)((o && o.start), c), x));
        }));
    }));
    (nodea = (function(p, f) {
        return parse.binds(parse.enumeration(locParser, p, prevEnd), (function(o, x, c) {
            return always(f.apply(undefined, stream.toArray(stream.cons(new(SourceLocation)((o && o.start), c), x))));
        }));
    }));
    (exports.precedence = precedence);
    (exports.node = node);
    (exports.nodea = nodea);
    (exports.positionParser = positionParser);
}))