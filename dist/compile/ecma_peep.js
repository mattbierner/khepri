/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/ecma_peep.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "neith/tree", "neith/zipper", "ecma_ast_zipper/ecma_zipper", "ecma_ast/node",
    "ecma_ast/value", "ecma_ast/statement", "ecma_ast/expression"
], (function(require, exports, tree, zipper, __o, __o0, ast_value, ast_statement, ast_expression) {
    "use strict";
    var optimize;
    var tree = tree,
        zipper = zipper,
        __o = __o,
        ecmaZipper = __o["ecmaZipper"],
        __o0 = __o0,
        modify = __o0["modify"],
        Node = __o0["Node"],
        ast_value = ast_value,
        ast_statement = ast_statement,
        ast_expression = ast_expression;
    var concat = (function() {
        var args = arguments;
        return [].concat.apply([], args);
    });
    var map = (function(f, x) {
        return [].map.call(x, f);
    });
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var flatten = (function(x) {
        return (!Array.isArray(x) ? x : [].concat.apply([], x.map(flatten)));
    });
    var peepholes = ({});
    var addPeephole = (function(type, condition, f) {
        var entry = ({
            "condition": condition,
            "map": f
        });
        (peepholes[type] = (peepholes[type] ? peepholes[type].concat(entry) : [entry]));
    });
    addPeephole("VariableDeclaration", (function(_) {
        return true;
    }), (function(node) {
        var declarations = node.declarations.filter((function(x) {
            return !!x;
        }));
        return modify(node, ({
            "declarations": declarations
        }), ({}));
    }));
    addPeephole("VariableDeclaration", (function(node) {
        return !node.declarations.length;
    }), (function(_) {
        return null;
    }));
    addPeephole("BlockStatement", (function(_) {
        return true;
    }), (function(node, t) {
        return modify(node, ({
            "body": flatten(node.body.map((function(x) {
                return ((x && (x.type === "BlockStatement")) ? t(x)
                    .body : x);
            })))
        }), ({}));
    }));
    addPeephole("Program", (function(_) {
        return true;
    }), (function(node, t) {
        return modify(node, ({
            "body": flatten(node.body.map((function(x) {
                return ((x && (x.type === "BlockStatement")) ? t(x)
                    .body : x);
            })))
        }), ({}));
    }));
    addPeephole("BinaryExpression", (function(__o1) {
        var operator = __o1["operator"],
            left = __o1["left"],
            right = __o1["right"];
        return (((((operator === "+") && (left.type === "Literal")) && (left.kind === "string")) && (
            right.type === "Literal")) && (right.kind === "string"));
    }), (function(__o1) {
        var left = __o1["left"],
            right = __o1["right"];
        return ast_value.Literal.create(null, "string", (left.value + right.value));
    }));
    var transform = (function(node) {
        var transforms = (peepholes[node.type] || [])
            .filter((function(x) {
                return x.condition(node);
            }));
        return transforms.reduce((function(p, c) {
            return c.map(p, transform);
        }), node);
    });
    var opt = (function(z) {
        var t = tree.modifyNode((function(node) {
            if (!node) return node;
            return transform(node);
        }), z);
        var next = zipper.nextDfs(t);
        return (next ? opt(next) : t);
    });
    (optimize = (function(__o1) {
        var options = __o1["options"],
            ast = __o1["ast"];
        return ({
            "options": options,
            "ast": tree.node(zipper.root(opt(ecmaZipper(ast))))
        });
    }));
    (exports.optimize = optimize);
}))