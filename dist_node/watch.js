/*
 * THIS FILE IS AUTO GENERATED FROM 'lib/watch.kep'
 * DO NOT EDIT
*/
"use strict";
var path = require("path"),
    fs = require("fs"),
    watchr = require("watchr"),
    compileFile = require("./compile_file"),
    watch;
(watch = (function(inFile, outFile, header, options, ok, err) {
    return watchr.watch(({
        "paths": [inFile],
        "listeners": ({
            "change": (function(changeType, filePath, fileCurrentStat, filePreviousStat) {
                if ((path.extname(filePath)
                    .toLowerCase() !== ".kep")) return;
                var rel = path.relative(inFile, filePath),
                    base = path.basename(rel, ".kep"),
                    dir = path.dirname(rel),
                    out = path.join(outFile, dir, (base + ".js"));
                compileFile(filePath, out, header, options, ok, err);
            })
        })
    }));
}));
(module.exports = watch);