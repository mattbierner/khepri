/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/compile.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri/compile/lexical", "khepri/compile/transform", "khepri/compile/peephole"], (
    function(require, exports, lexical, transform, peephole) {
        "use strict";
        var compile;
        var lexical = lexical,
            transform = transform,
            peephole = peephole;
        (compile = (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(transform.transform, (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(peephole.optimize, lexical.check)));
        (exports.compile = compile);
    }))