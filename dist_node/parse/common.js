"use strict";
var parse = require("bennu")["parse"],
    always = parse["always"],
    bind = parse["bind"],
    stream = require("nu-stream")["stream"],
    NIL = stream["NIL"],
    __o = require("../position"),
    SourceLocation = __o["SourceLocation"],
    precedence, node, nodea, positionParser;
(precedence = (function(p, table) {
    var sep = parse.choicea(table.map((function(entry) {
        return bind(entry.sep, (function(__o0) {
            var value = __o0["value"];
            return always(({
                "value": value,
                "node": entry.node,
                "precedence": entry.precedence,
                "right": entry.right
            }), value);
        }));
    })));
    return bind(parse.eager(parse.rec((function(self) {
        return parse.cons(p, parse.optional(NIL, parse.cons(sep, parse.expected(
            "binary expression", self))));
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
            var o = stack.pop(),
                rt0 = out.pop(),
                lf0 = out.pop();
            out.push(new(o.node)(SourceLocation.merge(lf0.loc, rt0.loc), o.value, lf0, rt0));
        }
        return parse.always(out.pop());
    }));
}));
(positionParser = parse.extract((function(__o0) {
    var position = __o0["position"];
    return position;
})));
var locParser = parse.extract((function(__o0) {
    var loc = __o0["loc"];
    return loc;
})),
    prevEnd = parse.extract((function(__o0) {
        var _prevEnd = __o0["_prevEnd"];
        return _prevEnd;
    }));
(node = (function(p, f) {
    return parse.binds(parse.enumeration(locParser, p, prevEnd), (function(o, x, c) {
        return always(f(new(SourceLocation)((o && o.start), c), x));
    }));
}));
(nodea = (function(p, f) {
    return parse.binds(parse.enumeration(locParser, p, prevEnd), (function(o, x, c) {
        return always(f.apply(undefined, stream.toArray(stream.cons(new(SourceLocation)((o && o.start),
            c), x))));
    }));
}));
(exports.precedence = precedence);
(exports.node = node);
(exports.nodea = nodea);
(exports.positionParser = positionParser);