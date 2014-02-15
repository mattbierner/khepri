/*
 * THIS FILE IS AUTO GENERATED from 'lib/stage/khepri_peep.kep'
 * DO NOT EDIT
*/
"use strict";
var khepri_peep = require("../khepri_peep"),
    optimize;
(optimize = (function(__o) {
    var options = __o["options"],
        ast = __o["ast"];
    return ({
        "options": options,
        "ast": khepri_peep.optimize(ast)
    });
}));
(exports.optimize = optimize);