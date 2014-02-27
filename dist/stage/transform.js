/*
 * THIS FILE IS AUTO GENERATED from 'lib/stage/transform.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "../transform"], (function(require, exports, transformer) {
    "use strict";
    var transform;
    (transform = (function(__o) {
        var options = __o["options"],
            ast = __o["ast"],
            packageManager = (options.package_manager || "amd");
        return ({
            "options": options,
            "ast": transformer.transform(ast, packageManager)
        });
    }));
    (exports.transform = transform);
}));