/*
 * THIS FILE IS AUTO GENERATED from 'lib/khepri_peep.kep'
 * DO NOT EDIT
*/
"use strict";
var tree = require("neith")["tree"],
    __o = require("neith")["walk"],
    walk = __o["walk"],
    zipper = require("neith")["zipper"],
    __o0 = require("khepri-ast-zipper"),
    khepriZipper = __o0["khepriZipper"],
    __o1 = require("khepri-ast")["node"],
    modify = __o1["modify"],
    Node = __o1["Node"],
    setUserData = __o1["setUserData"],
    setData = __o1["setData"],
    ast_declaration = require("khepri-ast")["declaration"],
    ast_statement = require("khepri-ast")["statement"],
    ast_expression = require("khepri-ast")["expression"],
    ast_pattern = require("khepri-ast")["pattern"],
    ast_value = require("khepri-ast")["value"],
    fun = require("./fun"),
    optimize, peepholes = ({}),
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
addPeephole(["ReturnStatement"], false, (function(node) {
    return (node.argument && (node.argument.type === "LetExpression"));
}), (function(node) {
    return ast_statement.WithStatement.create(null, node.argument.bindings, ast_statement.BlockStatement.create(
        null, [ast_statement.ReturnStatement.create(node.loc, node.argument.body)]));
}));
addPeephole(["FunctionExpression"], false, (function(node) {
    return (node.body.type === "LetExpression");
}), (function(node) {
    return ast_expression.FunctionExpression.create(null, node.id, node.params, ast_statement.BlockStatement.create(
        null, [ast_statement.WithStatement.create(null, node.body.bindings, ast_statement.BlockStatement.create(
            null, [ast_statement.ReturnStatement.create(node.loc, node.body.body)]))]));
}));
addPeephole(["ExpressionStatement"], true, (function(node) {
    return (node.expression && (node.expression.type === "LetExpression"));
}), (function(node) {
    return ast_statement.WithStatement.create(null, node.expression.bindings, ast_statement.BlockStatement.create(
        null, [ast_statement.ExpressionStatement.create(node.loc, node.expression.body)]));
}));
addPeephole(["ExpressionStatement"], true, (function(node) {
    return ((node.expression && (node.expression.type === "AssignmentExpression")) && (node.expression.right.type ===
        "LetExpression"));
}), (function(node) {
    return ast_statement.WithStatement.create(null, node.expression.right.bindings, ast_statement.BlockStatement
        .create(null, [ast_statement.ExpressionStatement.create(node.loc, ast_expression.AssignmentExpression.create(
            node.expression.loc, node.expression.operator, node.expression.left, node.expression.right
            .body))]));
}));
addPeephole(["LetExpression"], true, (function(node) {
    return (node.body.type === "LetExpression");
}), (function(node) {
    return ast_expression.LetExpression.create(null, fun.concat(node.bindings, node.body.bindings), node.body.body);
}));
addPeephole(["CurryExpression"], true, (function(node) {
    return (node.base.type === "UnaryOperatorExpression");
}), (function(node) {
    var arg = setData(ast_value.Identifier.create(null, "x"), "uid", node.base.ud.x_uid);
    return ast_expression.LetExpression.create(null, [ast_declaration.Binding.create(null, ast_pattern.IdentifierPattern
        .create(null, arg), node.args[0])], ast_expression.FunctionExpression.create(null, null,
        ast_pattern.ArgumentsPattern.create(null, null, []), ast_expression.UnaryExpression.create(null,
            node.base.op, arg)));
}));
addPeephole(["CurryExpression"], true, (function(node) {
    return ((node.base.type === "FunctionExpression") && (!node.base.params.id));
}), (function(node) {
    var first = node.base.params.elements[0],
        rest = node.base.params.elements.slice(1),
        body = ast_expression.FunctionExpression.create(null, null, ast_pattern.ArgumentsPattern.create(null,
            null, rest, node.base.params.self), node.base.body);
    return ((first && (((first.type === "IdentifierPattern") || (first.type === "AsPattern")) || (first.type ===
        "ObjectPattern"))) ? ast_expression.LetExpression.create(null, [ast_declaration.Binding.create(null,
        first, node.args[0])], body) : body);
}));
addPeephole(["CurryExpression"], true, (function(node) {
    return (((node.base.type === "LetExpression") && (node.base.body.type === "FunctionExpression")) && (!node.base
        .body.params.id));
}), (function(node) {
    var first = node.base.body.params.elements[0],
        rest = node.base.body.params.elements.slice(1),
        body = ast_expression.FunctionExpression.create(null, null, ast_pattern.ArgumentsPattern.create(null,
            null, rest, node.base.body.params.self), node.base.body.body);
    return ((first && (((first.type === "IdentifierPattern") || (first.type === "AsPattern")) || (first.type ===
        "ObjectPattern"))) ? ast_expression.LetExpression.create(null, fun.concat(node.base.bindings,
        ast_declaration.Binding.create(null, first, node.args[0])), body) : ast_expression.LetExpression.create(
        null, node.base.bindings, body));
}));
addPeephole(["CurryExpression"], true, (function(node) {
    return ((node.base.type === "BinaryOperatorExpression") && (node.args.length === 1));
}), (function(node) {
    var bound = setData(ast_value.Identifier.create(null, "x"), "uid", node.base.ud.x_uid),
        arg = setData(ast_value.Identifier.create(null, "y"), "uid", node.base.ud.y_uid);
    return ast_expression.LetExpression.create(null, [ast_declaration.Binding.create(null, ast_pattern.IdentifierPattern
        .create(null, bound), node.args[0])], ast_expression.FunctionExpression.create(null, null,
        ast_pattern.ArgumentsPattern.create(null, null, [ast_pattern.IdentifierPattern.create(null, arg)]),
        ast_expression.BinaryExpression.create(null, node.base.op, bound, arg)));
}));
addPeephole(["CurryExpression"], true, (function(node) {
    return (node.base.type === "CurryExpression");
}), (function(node) {
    return ast_expression.CurryExpression.create(null, node.base.base, fun.concat(node.base.args, node.args));
}));
addPeephole(["BinaryExpression"], true, (function(node) {
    return ((node.operator === "|>") && (node.right.type === "CurryExpression"));
}), (function(node) {
    return ast_expression.CallExpression.create(null, ((node.right.type === "CurryExpression") ? node.right.base :
        node.right), fun.concat((node.right.args || []), node.left));
}));
addPeephole(["BinaryExpression"], true, (function(__o) {
    var operator = __o["operator"],
        left = __o["left"];
    return ((operator === "<|") && (left.type === "CurryExpression"));
}), (function(node) {
    return ast_expression.CallExpression.create(null, ((node.left.type === "CurryExpression") ? node.left.base :
        node.left), fun.concat((node.left.args || []), node.right));
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
(optimize = (function(ast) {
    return tree.node(zipper.root(opt(khepriZipper(ast))));
}));
(exports.optimize = optimize);