/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/ecma_peep.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "neith/tree", "neith/zipper", "ecma-ast-zipper", "ecma-ast/node", "ecma-ast/value",
    "ecma-ast/declaration", "ecma-ast/statement", "ecma-ast/expression"
], (function(require, exports, tree, zipper, __o, __o0, ast_value, ast_declaration, ast_statement, ast_expression) {
    "use strict";
    var ecmaZipper = __o["ecmaZipper"],
        modify = __o0["modify"],
        Node = __o0["Node"],
        optimize, concat = (function() {
            var args = arguments;
            return [].concat.apply([], args);
        }),
        map = (function(f, x) {
            return [].map.call(x, f);
        }),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        flatten = (function(x) {
            return (Array.isArray(x) ? [].concat.apply([], x.map(flatten)) : x);
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
            return !!x;
        }));
        return modify(node, ({
            "declarations": declarations
        }), ({}));
    }));
    addPeephole(["VariableDeclaration"], true, (function(node) {
        return !node.declarations.length;
    }), (function(_) {
        return null;
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": flatten(node.body.map((function(x) {
                return ((x && (x.type === "BlockStatement")) ? x.body : x);
            })))
        }), ({}));
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": node.body.reduceRight((function(p, c) {
                return ((((c && (c.type === "VariableDeclaration")) && p.length) && (p[
                    0].type === "VariableDeclaration")) ? concat(modify(c, ({
                    "declarations": concat(c.declarations, p[0].declarations)
                }), ({})), p.slice(1)) : concat(c, p));
            }), [])
        }), ({}));
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": flatten(node.body.map((function(x) {
                return ((!x || (x.type === "EmptyStatement")) ? [] : x);
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
    }),
        isPrimitive = (function(node) {
            return ((node.type === "Literal") && ((((node.kind === "string") || (node.kind === "number")) ||
                (node.kind === "boolean")) || (node.kind === "null")));
        });
    addPeephole(["BinaryExpression", "LogicalExpression"], true, (function(__o1) {
        var operator = __o1["operator"],
            left = __o1["left"],
            right = __o1["right"];
        return ((arithmetic[operator] && isPrimitive(left)) && isPrimitive(right));
    }), (function(__o1) {
        var operator = __o1["operator"],
            left = __o1["left"],
            right = __o1["right"],
            value = arithmetic[operator](left.value, right.value);
        return ast_value.Literal.create(null, typeof value, value);
    }));
    var arithmetic0 = ({
        "!": (function(x) {
            return !x;
        }),
        "~": (function(x) {
            return~ x;
        }),
        "typeof": (function(x) {
            return typeof x;
        }),
        "+": (function(x) {
            return +x;
        }),
        "-": (function(x) {
            return -x;
        })
    }),
        isPrimitive0 = (function(node) {
            return ((node.type === "Literal") && ((((node.kind === "string") || (node.kind === "number")) ||
                (node.kind === "boolean")) || (node.kind === "null")));
        });
    addPeephole(["UnaryExpression"], true, (function(__o1) {
        var operator = __o1["operator"],
            argument = __o1["argument"];
        return (arithmetic0[operator] && isPrimitive0(argument));
    }), (function(__o1) {
        var operator = __o1["operator"],
            argument = __o1["argument"],
            value = arithmetic0[operator](argument.value);
        return ast_value.Literal.create(null, typeof value, value);
    }));
    var transform = (function(node) {
        var transforms = (peepholes[node.type] || [])
            .filter((function(x) {
                return x.condition(node);
            })),
            down = transforms.filter((function(x) {
                return !x.up;
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
                    return (!x.up && x.condition(node));
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
            "ast": tree.node(zipper.root(opt(ecmaZipper(ast))))
        });
    }));
    (exports.optimize = optimize);
}));