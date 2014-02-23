/*
 * THIS FILE IS AUTO GENERATED from 'lib/ecma_peep.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "neith/tree", "neith/walk", "neith/zipper", "ecma-ast-zipper", "ecma-ast/node",
    "ecma-ast/value", "ecma-ast/declaration", "ecma-ast/statement", "ecma-ast/expression", "./fun"
], (function(require, exports, tree, __o, zipper, __o0, __o1, ast_value, ast_declaration, ast_statement,
    ast_expression, fun) {
    "use strict";
    var walk = __o["walk"],
        ecmaZipper = __o0["ecmaZipper"],
        modify = __o1["modify"],
        Node = __o1["Node"],
        optimize, isPrimitive = (function(node) {
            return ((node.type === "Literal") && ((((node.kind === "string") || (node.kind === "number")) ||
                (node.kind === "boolean")) || (node.kind === "null")));
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
    addPeephole(["VariableDeclaration"], false, (function(_) {
        return true;
    }), (function(node) {
        var declarations = node.declarations.filter((function(x) {
            return (!(!x));
        }));
        return modify(node, ({
            "declarations": declarations
        }), ({}));
    }));
    addPeephole(["VariableDeclaration"], true, (function(node) {
        return (!node.declarations.length);
    }), (function(_) {
        return null;
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": fun.flatten(node.body.map((function(x) {
                return ((x && (x.type === "BlockStatement")) ? x.body : x);
            })))
        }), ({}));
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": node.body.reduceRight((function(p, c) {
                return (((((c && (c.type === "VariableDeclaration")) && p.length) && p[
                    0]) && (p[0].type === "VariableDeclaration")) ? fun.concat(
                    modify(c, ({
                        "declarations": fun.concat(c.declarations, p[0].declarations)
                    }), ({})), p.slice(1)) : fun.concat(c, p));
            }), [])
        }), ({}));
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": fun.flatten(node.body.map((function(x) {
                return (((!x) || (x.type === "EmptyStatement")) ? [] : x);
            })))
        }), ({}));
    }));
    var arithmetic = ({
        "+": (function(x, y) {
            return (x + y);
        }),
        "-": (function(x, y) {
            return (x - y);
        }),
        "*": (function(x, y) {
            return (x * y);
        }),
        "/": (function(x, y) {
            return (x / y);
        }),
        "%": "%",
        "<<": (function(x, y) {
            return (x << y);
        }),
        ">>": (function(x, y) {
            return (x >> y);
        }),
        ">>>": (function(x, y) {
            return (x >>> y);
        }),
        "<": (function(x, y) {
            return (x < y);
        }),
        ">": (function(x, y) {
            return (x > y);
        }),
        "<=": (function(x, y) {
            return (x <= y);
        }),
        ">=": (function(x, y) {
            return (x >= y);
        }),
        "||": (function(x, y) {
            return (x || y);
        }),
        "&&": (function(x, y) {
            return (x && y);
        })
    });
    addPeephole(["BinaryExpression", "LogicalExpression"], true, (function(__o) {
        var operator = __o["operator"],
            left = __o["left"],
            right = __o["right"];
        return ((arithmetic[operator] && isPrimitive(left)) && isPrimitive(right));
    }), (function(__o) {
        var operator = __o["operator"],
            left = __o["left"],
            right = __o["right"],
            value = arithmetic[operator](left.value, right.value);
        return ast_value.Literal.create(null, (typeof value), value);
    }));
    var arithmetic0 = ({
        "!": (function(x) {
            return (!x);
        }),
        "~": (function(x) {
            return (~x);
        }),
        "typeof": (function(x) {
            return (typeof x);
        }),
        "+": (function(x) {
            return (+x);
        }),
        "-": (function(x) {
            return (-x);
        })
    });
    addPeephole(["UnaryExpression"], true, (function(__o) {
        var operator = __o["operator"],
            argument = __o["argument"];
        return (arithmetic0[operator] && isPrimitive(argument));
    }), (function(__o) {
        var operator = __o["operator"],
            argument = __o["argument"],
            value = arithmetic0[operator](argument.value);
        return ast_value.Literal.create(null, (typeof value), value);
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
        return tree.node(zipper.root(opt(ecmaZipper(ast))));
    }));
    (exports.optimize = optimize);
}));