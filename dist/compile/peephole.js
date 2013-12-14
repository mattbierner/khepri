/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/peephole.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "ecma_ast/node"], (function(require, exports, __o) {
    "use strict";
    var optimize;
    var __o = __o,
        modify = __o["modify"],
        Node = __o["Node"];
    var map = (function(f, x) {
        return [].map.call(x, f);
    });
    var peepholes = ({});
    var addPeephole = (function(type, f) {
        (peepholes[type] = (peepholes[type] ? peepholes[type].concat(f) : [f]));
    });
    addPeephole("VariableDeclarator", (function(node) {
        return (((node.init && (node.init.type === "Identifier")) && (node.id.name === node.init.name)) ? null : node);
    }));
    addPeephole("VariableDeclaration", (function(node) {
        return (function() {
            {
                var declarations = node.declarations.filter((function(x) {
                    return !!x;
                }));
                return (!declarations.length ? null : modify(node, ({
                    "declarations": declarations
                }), ({})));
            }
        }).call(this);
    }));
    (optimize = (function(node) {
        if (!node) return node;

        if (Array.isArray(node)) return map(optimize, node);

        if (!(node instanceof Node)) return node;

        var transforms = (peepholes[node.type] || []);
        var result = transforms.reduce((function(p, c) {
            return c(p);
        }), node);
        if (!result) return result;

        return modify(result, node.children.reduce((function(p, c) {
            (p[c] = optimize(node[c]));
            return p;
        }), ({})), ({}));
    }));
    (exports.optimize = optimize);
}))