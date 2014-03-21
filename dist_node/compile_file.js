/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile_file.kep'
 * DO NOT EDIT
*/"use strict";
var path = require("path"),
    fs = require("fs"),
    compile = require("./compile"),
    compileFile, KHEPRI_EXT = /^\.kep$/i;
(compileFile = (function(inFile, outFile, header, options, ok, error) {
    return fs.realpath(inFile, (function(err, resolvedPath) {
        if (err) throw err;
        if (fs.lstatSync(resolvedPath)
            .isDirectory()) return fs.readdir(resolvedPath, (function(err, files) {
            files.forEach((function(file) {
                var subPath = path.join(inFile, file);
                if (fs.lstatSync(subPath)
                    .isDirectory()) {
                    return compileFile(subPath, (outFile && path.join(outFile, file)),
                        header, options, ok, error);
                }
                if (path.extname(file)
                    .match(KHEPRI_EXT)) return compileFile(subPath, (outFile && path.join(
                        outFile, (path.basename(file, ".kep") + ".js"))), header,
                    options, ok, error);
            }));
        }));
        fs.readFile(resolvedPath, "utf8", (function(err, data) {
            if (err) throw err;
            if (outFile) console.log((((("Khepri'" + inFile) + "' to:'") + outFile) + "'"));
            compile(data, (((typeof header) === "function") ? header(inFile) : header), options, (
                function(data) {
                    return ok(data, inFile, outFile);
                }), (function(data) {
                return error(data, inFile, outFile);
            }));
        }));
    }));
}));
(module.exports = compileFile);