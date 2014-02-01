"use strict";
var __o = require("nu-stream")["stream"],
    foldl = __o["foldl"],
    map = __o["map"],
    js_beautify = require("./beautify"),
    print, join = foldl.bind(null, (function(x, y) {
        return (x + y);
    }), ""),
    mapTokens = map.bind(null, (function(x) {
        if (!x) return "";
        switch (x.type) {
            case "Null":
                return "null";
            case "Comment":
                return (("/*" + x.value) + "*/");
            case "String":
                return JSON.stringify(x.value)
                    .replace("\u2028", "\\u2028")
                    .replace("\u2029", "\\u2029");
            default:
                return x.value;
        }
    })),
    options = ({
        "preserve_newlines": false,
        "wrap_line_length": 120,
        "break_chained_methods": true
    }),
    beautify = (js_beautify.js_beautify || js_beautify);
(print = (function(f, g) {
    return (function(x) {
        return f(g(x));
    });
})((function(x) {
    return beautify(x, options);
}), (function(f, g) {
    return (function(x) {
        return f(g(x));
    });
})(join, mapTokens)));
(exports.print = print);