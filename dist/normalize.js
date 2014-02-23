/*
 * THIS FILE IS AUTO GENERATED from 'lib/normalize.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "neith/tree", "neith/walk", "neith/zipper", "khepri-ast-zipper", "khepri-ast/declaration",
    "khepri-ast/statement", "khepri-ast/expression", "khepri-ast/pattern", "khepri-ast/value", "./fun"
], (function(require, exports, tree, __o, zipper, __o0, ast_declaration, ast_statement, ast_expression, ast_pattern,
    ast_value, fun) {
    "use strict";
    var walk = __o["walk"],
        khepriZipper = __o0["khepriZipper"],
        normalize, peepholes = ({}),
        addPeephole = (function(types, up, condition, f) {
            var entry = ({
                "condition": condition,
                "map": f,
                "up": up
            });
            types.forEach((function(type) {
                (peepholes[type] = (peepholes[type] ? fun.concat(peepholes[type], entry) : [entry]));
            }));
        });
    addPeephole(["LetExpression"], true, (function(node) {
        return (node.bindings.length > 1);
    }), (function(__o) {
        var loc = __o["loc"],
            bindings = __o["bindings"],
            body = __o["body"];
        return fun.foldr((function(p, c) {
            return ast_expression.LetExpression.create(loc, [c], p);
        }), body, bindings);
    }));
    addPeephole(["ArrayPattern"], false, (function(_) {
        return true;
    }), (function(__o) {
        var loc = __o["loc"],
            elements = __o["elements"];
        return ast_pattern.ObjectPattern.create(loc, fun.map((function(x, i) {
            return ast_pattern.ObjectPatternElement.create(null, ast_value.Literal.create(
                null, "number", i), x);
        }), elements));
    }));
    addPeephole(["ObjectPatternElement"], false, (function(node) {
        return (!node.target);
    }), (function(node) {
        var loc = node["loc"],
            key = node["key"];
        switch (key.type) {
            case "IdentifierPattern":
                return ast_pattern.ObjectPatternElement.create(null, ast_value.Literal.create(null,
                    "string", key.id.name), key);
            case "AsPattern":
                return ast_pattern.ObjectPatternElement.create(null, ast_value.Literal.create(null,
                    "string", key.id.id.name), key);
            default:
                return node;
        }
    }));
    addPeephole(["CurryExpression"], true, (function(node) {
        return (node.args.length > 1);
    }), (function(node) {
        var first = node.args[0],
            rest = node.args.slice(1);
        return ast_expression.CurryExpression.create(null, ast_expression.CurryExpression.create(null,
            node.base, [first]), rest);
    }));
    var upTransforms = (function(node) {
        return ((node && peepholes[node.type]) || [])
            .filter((function(x) {
                return (x.up && x.condition(node));
            }));
    }),
        downTransforms = (function(node) {
            return ((node && peepholes[node.type]) || [])
                .filter((function(x) {
                    return ((!x.up) && x.condition(node));
                }));
        }),
        transform = (function(ctx, transforms) {
            return (transforms.length ? tree.modifyNode((function(node) {
                return transforms.reduce((function(p, c) {
                    return c.map(p);
                }), node);
            }), ctx) : ctx);
        }),
        opt = walk.bind(null, (function(ctx) {
            var node = tree.node(ctx);
            return transform(ctx, downTransforms(node));
        }), (function(ctx) {
            var node = tree.node(ctx);
            return transform(ctx, upTransforms(node));
        }));
    (normalize = (function(ast) {
        return tree.node(zipper.root(opt(khepriZipper(ast))));
    }));
    (exports.normalize = normalize);
}));