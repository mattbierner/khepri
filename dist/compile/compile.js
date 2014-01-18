/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/compile.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri/compile/lexical", "khepri/compile/transform", "khepri/compile/khepri_peep",
    "khepri/compile/ecma_peep"
], (function(require, exports, lexical, transform, khepri_peep, ecma_peep) {
    "use strict";
    var compile;
    var lexical = lexical,
        transform = transform,
        khepri_peep = khepri_peep,
        ecma_peep = ecma_peep;
    (compile = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(__o) {
        var ast = __o["ast"];
        return ast;
    }), (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(ecma_peep.optimize, (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(transform.transform, (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(khepri_peep.optimize, (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(lexical.checkStage, (function(root, options) {
        return ({
            "ast": root,
            "options": options
        });
    })))))));
    (exports.compile = compile);
}))