/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "./stage/lexical", "./stage/normalize", "./stage/transform", "./stage/khepri_peep",
    "./stage/ecma_peep"
], (function(require, exports, lexical, normalize, transform, khepri_peep, ecma_peep) {
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
    })(lexical.check, (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(normalize.normalize, (function(root, options) {
        return ({
            "ast": root,
            "options": (options || ({}))
        });
    }))))))));
    (exports.compile = compile);
}));