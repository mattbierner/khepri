/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/ecma_peep.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "neith/tree", "neith/zipper", "ecma_ast_zipper/ecma_zipper", "ecma_ast/node",
    "ecma_ast/value", "ecma_ast/declaration", "ecma_ast/statement", "ecma_ast/expression"
], (function(require, exports, tree, zipper, __o, __o0, ast_value, ast_declaration, ast_statement, ast_expression) {
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
        ast_declaration = ast_declaration,
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
    var addPeephole = (function(types, up, condition, f) {
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
                return ((((c.type === "VariableDeclaration") && p.length) && (p[0].type ===
                    "VariableDeclaration")) ? concat(modify(c, ({
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
                return ((x.type === "EmptyStatement") ? [] : x);
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
            right = __o1["right"];
        var value = arithmetic[operator](left.value, right.value);
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
            argument = __o1["argument"];
        var value = arithmetic0[operator](argument.value);
        return ast_value.Literal.create(null, typeof value, value);
    }));
    var transform = (function(node) {
        var transforms = (peepholes[node.type] || [])
            .filter((function(x) {
                return x.condition(node);
            }));
        var down = transforms.filter((function(x) {
            return !x.up;
        }));
        var up = transforms.filter((function(x) {
            return x.up;
        }));
        return down.reduce((function(p, c) {
            return c.map(p, transform);
        }), node);
    });
    var transformDown = (function(node) {
        var transforms = (peepholes[node.type] || [])
            .filter((function(x) {
                return (!x.up && x.condition(node));
            }));
        return transforms.reduce((function(p, c) {
            return c.map(p, transformDown);
        }), node);
    });
    var transformUp = (function(node) {
        var transforms = (peepholes[node.type] || [])
            .filter((function(x) {
                return (x.up && x.condition(node));
            }));
        return transforms.reduce((function(p, c) {
            return c.map(p, transformUp);
        }), node);
    });
    var opt = (function(z) {
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
}))