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
    })(ecma_peep.optimize, (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(transform.transform, (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(khepri_peep.optimize, lexical.check))));
    (exports.compile = compile);
}))