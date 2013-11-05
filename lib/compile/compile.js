/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/compile.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri/compile/lexical", "khepri/compile/transform"], (function(require, exports, lexical, transform) {
    "use strict";
    var compile;
    var lexical = lexical,
        transform = transform;
    (compile = (function(root) {
        return transform.transform(lexical.check(root));
    }));
    (exports.compile = compile);
}))