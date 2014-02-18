/*
 * THIS FILE IS AUTO GENERATED from 'lib/fun.kep'
 * DO NOT EDIT
*/
define(["require", "exports"], (function(require, exports) {
    "use strict";
    var reduce, reduceRight, foldl, foldr, concat, filter, map, flatten;
    (reduce = Function.prototype.call.bind(Array.prototype.reduce));
    (reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight));
    (foldl = (function(f, z, a) {
        return reduce(a, f, z);
    }));
    (foldr = (function(f, z, a) {
        return reduceRight(a, f, z);
    }));
    (concat = Array.prototype.concat.bind([]));
    (filter = (function(f, a) {
        return Array.prototype.filter.call(a, f);
    }));
    (map = (function(f, a) {
        return Array.prototype.map.call(a, f);
    }));
    (flatten = (function(x) {
        return (Array.isArray(x) ? Array.prototype.concat.apply([], x) : x);
    }));
    (exports.reduce = reduce);
    (exports.reduceRight = reduceRight);
    (exports.foldl = foldl);
    (exports.foldr = foldr);
    (exports.concat = concat);
    (exports.filter = filter);
    (exports.map = map);
    (exports.flatten = flatten);
}));