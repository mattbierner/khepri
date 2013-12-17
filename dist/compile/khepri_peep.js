/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/khepri_peep.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "neith/tree", "neith/zipper", "khepri_ast_zipper/khepri_zipper", "khepri_ast/node",
    "khepri_ast/statement", "khepri_ast/expression"
], (function(require, exports, tree, zipper, __o, __o0, ast_statement, ast_expression) {
    "use strict";
    var optimize;
    var tree = tree,
        zipper = zipper,
        __o = __o,
        khepriZipper = __o["khepriZipper"],
        __o0 = __o0,
        modify = __o0["modify"],
        Node = __o0["Node"],
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
        return (Array.isArray(x) ? reduce(x, (function(p, c) {
            return p.concat(c);
        }), []) : x);
    });
    var peepholes = ({});
    var addPeephole = (function(type, condition, f) {
        var entry = ({
            "condition": condition,
            "map": f
        });
        (peepholes[type] = (peepholes[type] ? peepholes[type].concat(entry) : [entry]));
    });
    addPeephole("ReturnStatement", (function(node) {
        return (node.argument && (node.argument.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.argument.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ReturnStatement.create(node.loc, node.argument.body)]));
    }));
    addPeephole("ExpressionStatement", (function(node) {
        return (node.expression && (node.expression.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.expression.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ExpressionStatement.create(node.loc, node.expression.body)]));
    }));
    addPeephole("CurryExpression", (function(node) {
        return !node.args.length;
    }), (function(node) {
        return node.base;
    }));
    addPeephole("BinaryExpression", (function(node) {
        return ((node.operator === "|>") && ((((node.left.type === "CurryExpression") || (node.left.type ===
                "BinaryOperatorExpression")) || (node.left.type === "UnaryOperatorExpression")) ||
            (node.left.type === "TernaryOperatorExpression")));
    }), (function(node) {
        return ast_expression.CallExpression.create(null, ((node.left.type === "CurryExpression") ?
            node.left.base : node.left), concat((node.left.args || []), node.right));
    }));
    addPeephole("BinaryExpression", (function(node) {
        return ((node.operator === "<|") && ((((node.right.type === "CurryExpression") || (node.right.type ===
                "BinaryOperatorExpression")) || (node.right.type === "UnaryOperatorExpression")) ||
            (node.right.type === "TernaryOperatorExpression")));
    }), (function(node) {
        return ast_expression.CallExpression.create(null, ((node.right.type === "CurryExpression") ?
            node.right.base : node.right), concat((node.right.args || []), node.left));
    }));
    var opt = (function(z) {
        var t = tree.modifyNode((function(node) {
            if (!node) return node;
            var transforms = (peepholes[node.type] || [])
                .filter((function(x) {
                    return x.condition(node);
                }));
            return transforms.reduce((function(p, c) {
                return c.map(p);
            }), node);
        }), z);
        var next = zipper.nextDfs(t);
        return (next ? opt(next) : t);
    });
    (optimize = (function(node) {
        return tree.node(zipper.root(opt(khepriZipper(node))));
    }));
    (exports.optimize = optimize);
}))