/*
 * THIS FILE IS AUTO GENERATED from 'lib/stage/khepri_peep.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "../khepri_peep"], (function(require, exports, khepri_peep) {
    "use strict";
    var optimize;
    (optimize = (function(__o) {
        var options = __o["options"],
            ast = __o["ast"];
        return ({
            "options": options,
            "ast": khepri_peep.optimize(ast)
        });
    }));
    (exports.optimize = optimize);
}));