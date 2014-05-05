/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile_file.kep'
 * DO NOT EDIT
*/"use strict";
var path = require("path"),
    fs = require("fs"),
    __o = require("async"),
    each = __o["each"],
    compile = require("./compile"),
    compileFile, KHEPRI_EXT = /^\.kep$/i;
(compileFile = (function(inFile, outFile, header, options, ok, error) {
    return fs.realpath(inFile, (function(err, resolvedPath) {
        if (err) throw err;
        if (fs.lstatSync(resolvedPath)
            .isDirectory()) return fs.readdir(resolvedPath, (function(err0, files) {
            each(files, (function(file) {
                var subPath = path.join(inFile, file);
                if (fs.lstatSync(subPath)
                    .isDirectory()) return compileFile(subPath, (outFile && path.join(
                    outFile, file)), header, options, ok, error);
                if (path.extname(file)
                    .match(KHEPRI_EXT)) return compileFile(subPath, (outFile && path.join(
                        outFile, (path.basename(file, ".kep") + ".js"))), header,
                    options, ok, error);
            }));
        }));
        fs.readFile(resolvedPath, "utf8", (function(err0, data) {
            if (err0) throw err0;
            if (outFile) console.log((((("Khepri'" + inFile) + "' to:'") + outFile) + "'"));
            compile(data, (((typeof header) === "function") ? header(inFile) : header), options,
                inFile, (function(data0) {
                    return ok(data0, inFile, outFile);
                }), (function(data0) {
                    return error(data0, inFile, outFile);
                }));
        }));
    }));
}));
(module.exports = compileFile);