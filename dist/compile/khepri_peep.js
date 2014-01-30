/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/khepri_peep.kep'
 * DO NOT EDIT
*/
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
        concatArgs = (function() {
            var args = arguments;
            return ast_expression.TupleExpression.create(null, flatten(map((function(x) {
                return (((!x) || Array.isArray(x)) ? x : ((x.type === "TupleExpression") ?
                    x.elements : x));
            }), args)));
        }),
        peepholes = ({}),
        addPeephole = (function(types, up, condition, f) {
            var entry = ({
                "condition": condition,
                "map": f,
                "up": up
            });
            types.forEach((function(type) {
                (peepholes[type] = (peepholes[type] ? peepholes[type].concat(entry) : [entry]));
            }));
        });
    addPeephole(["ReturnStatement"], false, (function(node) {
        return (node.argument && (node.argument.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.argument.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ReturnStatement.create(node.loc, node.argument.body)]));
    }));
    addPeephole(["ExpressionStatement"], false, (function(node) {
        return (node.expression && (node.expression.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.expression.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ExpressionStatement.create(node.loc, node.expression.body)]));
    }));
    addPeephole(["ExpressionStatement"], false, (function(node) {
        return ((node.expression && (node.expression.type === "AssignmentExpression")) && (node.expression
            .right.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.expression.right.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ExpressionStatement.create(node.loc, ast_expression.AssignmentExpression
                .create(node.expression.loc, node.expression.operator, node.expression.left,
                    node.expression.right.body))]));
    }));
    addPeephole(["ArrayPattern"], false, (function(_) {
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
        return (node.base.type === "CurryExpression");
    }), (function(node) {
        return ast_expression.CurryExpression.create(null, node.base.base, concatArgs(node.base.args,
            node.args));
    }));
    addPeephole(["BinaryExpression"], true, (function(node) {
        return ((node.operator === "|>") && ((((node.right.type === "CurryExpression") || (node.right.type ===
                "BinaryOperatorExpression")) || (node.right.type === "UnaryOperatorExpression")) ||
            (node.right.type === "TernaryOperatorExpression")));
    }), (function(node) {
        return ast_expression.CallExpression.create(null, ((node.right.type === "CurryExpression") ?
            node.right.base : node.right), concatArgs((node.right.args || []), node.left));
    }));
    addPeephole(["BinaryExpression"], true, (function(__o1) {
        var operator = __o1["operator"],
            left = __o1["left"];
        return ((operator === "<|") && ((((left.type === "CurryExpression") || (left.type ===
            "BinaryOperatorExpression")) || (left.type === "UnaryOperatorExpression")) || (left
            .type === "TernaryOperatorExpression")));
    }), (function(node) {
        return ast_expression.CallExpression.create(null, ((node.left.type === "CurryExpression") ?
            node.left.base : node.left), concatArgs((node.left.args || []), node.right));
    }));
    var transform = (function(node) {
        var transforms = (peepholes[node.type] || [])
            .filter((function(x) {
                return x.condition(node);
            })),
            down = transforms.filter((function(x) {
                return (!x.up);
            })),
            up = transforms.filter((function(x) {
                return x.up;
            }));
        return down.reduce((function(p, c) {
            return c.map(p, transform);
        }), node);
    }),
        transformDown = (function(node) {
            var transforms = (peepholes[node.type] || [])
                .filter((function(x) {
                    return ((!x.up) && x.condition(node));
                }));
            return transforms.reduce((function(p, c) {
                return c.map(p, transformDown);
            }), node);
        }),
        transformUp = (function(node) {
            var transforms = (peepholes[node.type] || [])
                .filter((function(x) {
                    return (x.up && x.condition(node));
                }));
            return transforms.reduce((function(p, c) {
                return c.map(p, transformUp);
            }), node);
        }),
        opt = (function(z) {
            var t = tree.modifyNode((function(node) {
                return (node && transformDown(node));
            }), z);
            if (zipper.isLeaf(t)) {
                do {
                    (t = tree.modifyNode((function(node) {
                        return (node && transformUp(node));
                    }), t));
                    if (zipper.isLast(t)) {
                        if (zipper.isRoot(t)) return t;
                        (t = zipper.up(t));
                    } else return opt(zipper.right(t));
                }
                while (true);
            }
            return opt(zipper.down(t));
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