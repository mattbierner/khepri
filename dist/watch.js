/*
 * THIS FILE IS AUTO GENERATED from 'lib/watch.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "path", "fs", "watchr", "./compile_file"], (function(require, exports, path, fs, watchr,
    __o) {
    "use strict";
    var compileFile = __o["compileFile"],
        watch, KEP = ".kep";
    (watch = (function(inFile, outFile, header, options, ok, err) {
        return watchr.watch(({
            "paths": [inFile],
            "listeners": ({
                "change": (function(changeType, filePath, fileCurrentStat, filePreviousStat) {
                    if ((path.extname(filePath)
                        .toLowerCase() !== KEP)) return;
                    var rel = path.relative(inFile, filePath),
                        base = path.basename(rel, KEP),
                        dir = path.dirname(rel),
                        out = path.join(outFile, dir, (base + ".js")),
                        h = ((header === undefined) ? ((
                            "/*\n * THIS FILE IS AUTO GENERATED from " + path.join(
                                inFile, rel)) + "\n * DO NOT EDIT\n*/\n") : header);
                    compileFile(filePath, out, h, options, ok, err);
                })
            })
        }));
    }));
    (exports.watch = watch);
}));