define(["require", "exports", "neith/tree", "neith/zipper", "khepri-ast-zipper", "khepri-ast/node",
    "khepri-ast/statement", "khepri-ast/expression", "khepri-ast/pattern", "khepri-ast/value"
], (function(require, exports, tree, zipper, __o, __o0, ast_statement, ast_expression, ast_pattern, ast_value) {
    "use strict";
    var khepriZipper = __o["khepriZipper"],
        modify = __o0["modify"],
        Node = __o0["Node"],
        setUserData = __o0["setUserData"],
        optimize, concat = (function() {
            var args = arguments;
            return [].concat.apply([], args);
        }),
        map = (function(f, x) {
            return [].map.call(x, f);
        }),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        flatten = (function(x) {
            return (Array.isArray(x) ? reduce(x, (function(p, c) {
                return p.concat(c);
            }), []) : x);
        }),
        peepholes = ({}),
        addPeephole = (function(type, condition, f) {
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
    addPeephole("ExpressionStatement", (function(node) {
        return ((node.expression && (node.expression.type === "AssignmentExpression")) && (node.expression
            .right.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.expression.right.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ExpressionStatement.create(node.loc, ast_expression.AssignmentExpression
                .create(node.expression.loc, node.expression.operator, node.expression.left,
                    node.expression.right.body))]));
    }));
    addPeephole("ArrayPattern", (function(_) {
        return true;
    }), (function(__o1) {
        var loc = __o1["loc"],
            elements = __o1["elements"],
            ud = __o1["ud"];
        return setUserData(ast_pattern.ObjectPattern.create(loc, map((function(x, i) {
            return ast_pattern.ObjectPatternElement.create(null, ast_value.Literal.create(
                null, "number", i), x);
        }), elements)), ud);
    }));
    addPeephole("ObjectPatternElement", (function(node) {
        return !node.target;
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
    addPeephole("CurryExpression", (function(node) {
        return !node.args.length;
    }), (function(node) {
        return node.base;
    }));
    addPeephole("CurryExpression", (function(node) {
        return (node.base.type === "CurryExpression");
    }), (function(node) {
        return ast_expression.CurryExpression.create(null, node.base.base, concat(node.base.args, node.args));
    }));
    addPeephole("BinaryExpression", (function(node) {
        return ((node.operator === "|>") && ((((node.right.type === "CurryExpression") || (node.right.type ===
                "BinaryOperatorExpression")) || (node.right.type === "UnaryOperatorExpression")) ||
            (node.right.type === "TernaryOperatorExpression")));
    }), (function(node) {
        return ast_expression.CallExpression.create(null, ((node.right.type === "CurryExpression") ?
            node.right.base : node.right), concat((node.right.args || []), node.left));
    }));
    addPeephole("BinaryExpression", (function(__o1) {
        var operator = __o1["operator"],
            left = __o1["left"];
        return ((operator === "<|") && ((((left.type === "CurryExpression") || (left.type ===
            "BinaryOperatorExpression")) || (left.type === "UnaryOperatorExpression")) || (left
            .type === "TernaryOperatorExpression")));
    }), (function(node) {
        return ast_expression.CallExpression.create(null, ((node.left.type === "CurryExpression") ?
            node.left.base : node.left), concat((node.left.args || []), node.right));
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
        }), z),
            next = zipper.nextDfs(t);
        return (next ? opt(next) : t);
    });
    (optimize = (function(__o1) {
        var options = __o1["options"],
            ast = __o1["ast"];
        return ({
            "options": options,
            "ast": tree.node(zipper.root(opt(khepriZipper(ast))))
        });
    }));
    (exports.optimize = optimize);
}));