/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile.kep'
 * DO NOT EDIT
*/
"use strict";
var lexical = require("./stage/lexical"),
    transform = require("./transform"),
    khepri_peep = require("./khepri_peep"),
    ecma_peep = require("./ecma_peep"),
    compile;
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