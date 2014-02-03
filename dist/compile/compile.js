/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/compile.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "./stage/lexical", "./transform", "./khepri_peep", "./ecma_peep"], (function(require,
    exports, lexical, transform, khepri_peep, ecma_peep) {
    "use strict";
    var compile;
    (compile = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })((function(__o) {
        var ast = __o["ast"];
        return ast;
    }), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(ecma_peep.optimize, (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(transform.transform, (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(khepri_peep.optimize, (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(lexical.check, (function(root, options) {
        return ({
            "ast": root,
            "options": (options || ({}))
        });
    })))))));
    (exports.compile = compile);
}));