/*
 * THIS FILE IS AUTO GENERATED from 'lib/transform.kep'
 * DO NOT EDIT
*/
"use strict";
var record = require("bes")["record"],
    ecma_clause = require("ecma-ast")["clause"],
    ecma_declaration = require("ecma-ast")["declaration"],
    ecma_expression = require("ecma-ast")["expression"],
    ecma_node = require("ecma-ast")["node"],
    ecma_program = require("ecma-ast")["program"],
    ecma_statement = require("ecma-ast")["statement"],
    ecma_value = require("ecma-ast")["value"],
    khepri_clause = require("khepri-ast")["clause"],
    khepri_declaration = require("khepri-ast")["declaration"],
    khepri_expression = require("khepri-ast")["expression"],
    khepri_node = require("khepri-ast")["node"],
    khepri_pattern = require("khepri-ast")["pattern"],
    khepri_program = require("khepri-ast")["program"],
    khepri_statement = require("khepri-ast")["statement"],
    khepri_value = require("khepri-ast")["value"],
    __o = require("khepri-ast-zipper"),
    khepriZipper = __o["khepriZipper"],
    tree = require("neith")["tree"],
    zipper = require("neith")["zipper"],
    scope = require("./scope"),
    __o0 = require("./tail"),
    Tail = __o0["Tail"],
    trampoline = __o0["trampoline"],
    fun = require("./fun"),
    transform, _transform = (function() {
        var args = arguments;
        return _transform.apply(null, args);
    }),
    isStrict = (function(elems) {
        if (((elems && elems.length) && (elems[0].type === "ExpressionStatement"))) {
            var first = elems[0].expression;
            return (((first && (first.type === "Literal")) && (first.kind === "string")) && (first.value ===
                "use strict"));
        }
        return false;
    }),
    State = record.declare(null, ["ctx", "scope", "packageManager"]);
(State.empty = State.create(null, scope.Scope.empty, null));
var ok = (function(x) {
    return (function(s, ok) {
        return ok(x, s);
    });
}),
    bind = (function(p, f) {
        return (function(s, ok) {
            return new(Tail)(p, s, (function(x, s) {
                return f(x)(s, ok);
            }));
        });
    }),
    pass = ok(),
    next = (function(p, n) {
        return bind(p, (function(_) {
            return n;
        }));
    }),
    seqa = (function(arr) {
        return fun.reduce(arr, next);
    }),
    seq = (function() {
        var args = arguments;
        return seqa(args);
    }),
    extract = (function(s, ok) {
        return ok(s, s);
    }),
    setState = (function(s) {
        return (function(_, ok) {
            return ok(s, s);
        });
    }),
    modifyState = (function(f) {
        return bind(extract, (function(s) {
            return setState(f(s));
        }));
    }),
    examineState = (function(f) {
        return bind(extract, (function(s) {
            return f(s);
        }));
    }),
    examineScope = (function(f) {
        return bind(extract, (function(s) {
            return f(s.scope);
        }));
    }),
    examineRealScope = (function(f) {
        return bind(extract, (function(s) {
            return f(s.realScope);
        }));
    }),
    packageManager = examineState((function(s) {
        return ok(s.packageManager);
    })),
    modifyScope = (function(f) {
        return (function(s, ok, err) {
            var scope = f(s.scope),
                newState = State.setScope(s, scope);
            return ok(scope, newState);
        });
    }),
    setScope = (function(s) {
        return modifyScope((function() {
            return s;
        }));
    }),
    move = (function(op) {
        return modifyState((function(s) {
            return s.setCtx(op(s.ctx));
        }));
    }),
    modify = (function(f) {
        return move(tree.modifyNode.bind(null, f));
    }),
    set = (function(f) {
        return move(tree.setNode.bind(null, f));
    }),
    ctx = examineState((function(s) {
        return ok(s.ctx);
    })),
    get = (function(op) {
        return examineState((function(s) {
            return ok(op(s.ctx));
        }));
    }),
    node = get(tree.node),
    enterBlock = examineScope((function(s) {
        return setScope(new(scope.Scope)(({}), s, ({}), ({})));
    })),
    exitBlock = examineScope((function(s) {
        return setScope(s.outer);
    })),
    addVar = (function(id, uid) {
        return examineScope((function(s) {
            return (s.hasOwnMapping(uid) ? pass : (function() {
                var name = s.getUnusedId(id);
                return setScope(scope.Scope.addMapping(scope.Scope.addMutableBinding(s, name), uid,
                    name));
            })());
        }));
    }),
    getMapping = (function(uid) {
        return examineScope((function(s) {
            return ok(s.getMapping(uid));
        }));
    }),
    identifier = (function(loc, name) {
        return ecma_value.Identifier.create(loc, name);
    }),
    stringLiteral = (function(loc, value) {
        return ecma_value.Literal.create(loc, "string", value);
    }),
    nullLiteral = (function(loc) {
        return ecma_value.Literal.create(loc, "null", null);
    }),
    variableDeclaration = khepri_declaration.VariableDeclaration.create,
    variableDeclarator = ecma_declaration.VariableDeclarator.create,
    innerPattern = (function() {
        var objectElementUnpack = (function(base, pattern, key) {
            var innerBase = khepri_expression.MemberExpression.create(null, base, key, true);
            return (pattern ? fun.flatten(innerPattern(innerBase, pattern)) : khepri_declaration.Binding.create(
                null, identifier(null, key.value), innerBase));
        });
        return (function(base, pattern) {
            switch (pattern.type) {
                case "IdentifierPattern":
                    return [khepri_declaration.Binding.create(null, pattern.id, base)];
                case "AsPattern":
                    return fun.concat(innerPattern(base, pattern.id), fun.flatten(innerPattern(pattern.id,
                        pattern.target)));
                case "ObjectPattern":
                    return fun.flatten(fun.map((function(__o1) {
                        var target = __o1["target"],
                            key = __o1["key"];
                        return objectElementUnpack(pattern.ud.id, target, key);
                    }), pattern.elements));
                default:
                    return [];
            }
        });
    })(),
    unpack = (function(pattern, value) {
        return fun.map((function(x) {
            return variableDeclarator(null, x.pattern, x.value);
        }), fun.flatten(innerPattern(value, pattern)));
    }),
    unpackAssign = (function(pattern, value) {
        return fun.map((function(x) {
            return ecma_expression.AssignmentExpression.create(null, "=", x.pattern, x.value);
        }), fun.flatten(innerPattern(value, pattern)));
    }),
    unpackParameters = (function(parameters) {
        var elementsPrefix = fun.map((function(x) {
            switch (x.type) {
                case "IdentifierPattern":
                    return [];
                case "AsPattern":
                    return fun.flatten(innerPattern(x.id, x.target));
                default:
                    return innerPattern(x, x);
            }
        }), parameters.elements),
            selfPrefix = (parameters.self ? innerPattern(ecma_expression.ThisExpression.create(null), parameters.self) : []),
            argumentsPrefix = (parameters.id ? innerPattern(identifier(null, "arguments"), parameters.id) : []);
        return fun.flatten(fun.concat(elementsPrefix, selfPrefix, argumentsPrefix));
    }),
    withStatementNoImport = (function(loc, bindings, body) {
        var vars = fun.flatten(fun.map((function(imp) {
            return unpack(imp.pattern, imp.value);
        }), bindings)),
            prefix = variableDeclaration(null, vars);
        return khepri_statement.BlockStatement.create(loc, fun.concat(prefix, body.body));
    }),
    withStatement = (function(packageManager, loc, bindings, body) {
        var flattenImport = (function(imp) {
            return ((imp.type === "ImportPattern") ? khepri_declaration.Binding.create(null, imp.pattern,
                packageManager.importPackage(imp.from.value)) : imp);
        });
        return withStatementNoImport(loc, fun.map(flattenImport, bindings), body);
    }),
    functionExpression = (function(loc, id, parameters, functionBody) {
        var params = fun.filter((function(x) {
            return (x.type !== "EllipsisPattern");
        }), parameters.elements),
            bindings = fun.map((function(x) {
                return variableDeclarator(null, x.pattern, x.value);
            }), unpackParameters(parameters)),
            body = ((functionBody.type === "BlockStatement") ? functionBody : khepri_statement.BlockStatement.create(
                null, khepri_statement.ReturnStatement.create(null, functionBody))),
            strict = isStrict(body.body);
        return khepri_expression.FunctionExpression.create(loc, id, params, khepri_statement.BlockStatement.create(
            body.loc, fun.concat((strict ? khepri_statement.ExpressionStatement.create(null, khepri_value.Literal
                .create(null, "string", "use strict")) : []), variableDeclaration(null, bindings), (
                function() {
                    var block = body.body;
                    return (strict ? block.slice(1) : block);
                })())));
    }),
    letExpression = (function(loc, bindings, body) {
        return khepri_expression.CallExpression.create(loc, khepri_expression.FunctionExpression.create(null, null,
            khepri_pattern.ArgumentsPattern.create(null, null, []), khepri_statement.BlockStatement.create(null, [
                withStatementNoImport(packageManager, bindings, khepri_statement.BlockStatement.create(null, [
                    khepri_statement.ReturnStatement.create(null, body)
                ]))
            ])), []);
    }),
    unaryOperatorExpression = (function(loc, op) {
        return khepri_expression.FunctionExpression.create(loc, null, khepri_pattern.ArgumentsPattern.create(null,
                null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))]), khepri_expression.UnaryExpression
            .create(null, op, identifier(null, "x")));
    }),
    binaryOperatorExpression = (function(loc, op) {
        var kind = (((op === "||") || (op === "&&")) ? khepri_expression.LogicalExpression : khepri_expression.BinaryExpression);
        return khepri_expression.FunctionExpression.create(loc, null, khepri_pattern.ArgumentsPattern.create(null,
            null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")), khepri_pattern.IdentifierPattern
                .create(null, identifier(null, "y"))
            ]), kind.create(null, op, identifier(null, "x"), identifier(null, "y")));
    }),
    ternaryOperatorExpression = (function(loc) {
        return khepri_expression.FunctionExpression.create(loc, null, khepri_pattern.ArgumentsPattern.create(null,
            null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")), khepri_pattern.IdentifierPattern
                .create(null, identifier(null, "y")), khepri_pattern.IdentifierPattern.create(null, identifier(
                    null, "z"))
            ]), khepri_expression.ConditionalExpression.create(null, identifier(null, "x"), identifier(null,
            "y"), identifier(null, "z")));
    }),
    curryExpression = (function(loc, base, args) {
        return khepri_expression.CallExpression.create(null, khepri_expression.MemberExpression.create(null, base,
            identifier(null, "bind")), fun.concat(nullLiteral(null), args));
    }),
    pipe = (function(loc, value, target) {
        return khepri_expression.CallExpression.create(loc, target, [value]);
    }),
    singleCompose = (function(loc, f, g) {
        return khepri_expression.CallExpression.create(loc, khepri_expression.FunctionExpression.create(null, null,
            khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null,
                identifier(null, "f")), khepri_pattern.IdentifierPattern.create(null, identifier(null,
                "g"))]), khepri_expression.FunctionExpression.create(null, null, khepri_pattern.ArgumentsPattern
                .create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))]),
                khepri_expression.CallExpression.create(null, identifier(null, "f"), [khepri_expression.CallExpression
                    .create(null, identifier(null, "g"), [identifier(null, "x")])
                ]))), [f, g]);
    }),
    multiCompose = (function(loc, f, g) {
        return khepri_expression.CallExpression.create(loc, khepri_expression.FunctionExpression.create(null, null,
            khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null,
                identifier(null, "f")), khepri_pattern.IdentifierPattern.create(null, identifier(null,
                "g"))]), khepri_expression.FunctionExpression.create(null, null, khepri_pattern.ArgumentsPattern
                .create(null, null, []), khepri_expression.CallExpression.create(null, identifier(null, "f"), [
                    khepri_expression.CallExpression.create(null, khepri_expression.MemberExpression.create(
                        null, identifier(null, "g"), identifier(null, "apply")), [nullLiteral(null),
                        identifier(null, "arguments")
                    ])
                ]))), [f, g]);
    }),
    packageBlock = (function(packageManager, loc, exports, body) {
        var imports = ((body.type === "WithStatement") ? fun.filter((function(x) {
            return (x.type === "ImportPattern");
        }), body.bindings) : []),
            exportedNames = fun.map((function(x) {
                return x.id.name;
            }), exports.exports),
            targets = fun.reduce(imports, (function(p, c) {
                (p[c.from.value] = c.pattern);
                return p;
            }), ({})),
            fBody = ((body.type === "WithStatement") ? khepri_statement.WithStatement.create(null, fun.filter((
                function(x) {
                    return (x.type !== "ImportPattern");
                }), body.bindings), body.body) : body);
        return packageManager.definePackage(loc, exportedNames, imports, targets, fBody);
    }),
    transformers = ({}),
    addTransform = (function(type, pre, post) {
        var entry = ({
            "pre": pre,
            "post": post
        });
        (transformers[type] = (transformers[type] ? transformers[type].concat(entry) : [entry]));
    });
addTransform("VariableDeclaration", null, modify((function(node) {
    return ecma_declaration.VariableDeclaration.create(node.loc, node.declarations);
})));
addTransform("VariableDeclarator", null, modify((function(node) {
    return ecma_declaration.VariableDeclarator.create(node.loc, node.id, node.init);
})));
addTransform("StaticDeclaration", modify((function(node) {
    return ecma_statement.EmptyStatement.create(node.loc);
})));
addTransform("CatchClause", null, modify((function(node) {
    return ecma_clause.CatchClause.create(node.loc, node.param, node.body);
})));
addTransform("SwitchCase", null, modify((function(node) {
    return ecma_clause.SwitchCase.create(node.loc, node.test, node.consequent);
})));
addTransform("BlockStatement", null, modify((function(node) {
    return ecma_statement.BlockStatement.create(node.loc, node.body);
})));
addTransform("ExpressionStatement", null, modify((function(node) {
    return ecma_statement.ExpressionStatement.create(node.loc, node.expression);
})));
addTransform("IfStatement", null, modify((function(node) {
    return ecma_statement.IfStatement.create(node.loc, node.test, node.consequent, node.alternate);
})));
addTransform("WithStatement", next(bind(packageManager, (function(packageManager) {
    return modify((function(node) {
        return withStatement(packageManager, node.loc, node.bindings, node.body);
    }));
})), _transform));
addTransform("SwitchStatement", null, modify((function(node) {
    return ecma_statement.SwitchStatement.create(node.loc, node.discriminant, node.cases);
})));
addTransform("ReturnStatement", null, modify((function(node) {
    return ecma_statement.ReturnStatement.create(node.loc, node.argument);
})));
addTransform("ThrowStatement", null, modify((function(node) {
    return ecma_statement.ThrowStatement.create(node.loc, node.argument);
})));
addTransform("BreakStatement", modify((function(node) {
    return ecma_statement.BreakStatement.create(node.loc, null);
})));
addTransform("ContinueStatement", modify((function(node) {
    return ecma_statement.ContinueStatement.create(node.loc, null);
})));
addTransform("TryStatement", null, modify((function(node) {
    return ecma_statement.TryStatement.create(node.loc, node.block, node.handler, node.finalizer);
})));
addTransform("WhileStatement", null, modify((function(node) {
    return ecma_statement.WhileStatement.create(node.loc, node.test, node.body);
})));
addTransform("DoWhileStatement", null, modify((function(node) {
    return ecma_statement.DoWhileStatement.create(node.loc, node.body, node.test);
})));
addTransform("ForStatement", null, modify((function(node) {
    return ecma_statement.ForStatement.create(node.loc, node.init, node.test, node.update, node.body);
})));
addTransform("AssignmentExpression", null, modify((function(node) {
    return ecma_expression.AssignmentExpression.create(node.loc, node.operator, node.left, node.right);
})));
addTransform("UnaryExpression", null, modify((function(node) {
    var op = node.operator;
    switch (op) {
        case "++":
            (op = "+");
            break;
        case "--":
            (op = "-");
            break;
    }
    return ecma_expression.UnaryExpression.create(node.loc, op, node.argument);
})));
addTransform("BinaryExpression", modify((function(node) {
    switch (node.operator) {
        case "\\>":
            return singleCompose(node.loc, node.right, node.left);
        case "\\>>":
            return multiCompose(node.loc, node.right, node.left);
        case "<\\":
            return singleCompose(node.loc, node.left, node.right);
        case "<<\\":
            return multiCompose(node.loc, node.left, node.right);
        case "|>":
            return pipe(node.loc, node.left, node.right);
        case "<|":
            return pipe(node.loc, node.right, node.left);
        default:
            return node;
    }
})), modify((function(node) {
    return ecma_expression.BinaryExpression.create(node.loc, node.operator, node.left, node.right);
})));
addTransform("LogicalExpression", null, modify((function(node) {
    return ecma_expression.LogicalExpression.create(node.loc, node.operator, node.left, node.right);
})));
addTransform("ConditionalExpression", null, modify((function(node) {
    return ecma_expression.ConditionalExpression.create(node.loc, node.test, node.consequent, node.alternate);
})));
addTransform("NewExpression", null, modify((function(node) {
    return ecma_expression.NewExpression.create(node.loc, node.callee, node.args);
})));
addTransform("CallExpression", null, modify((function(node) {
    return ecma_expression.CallExpression.create(node.loc, node.callee, node.args);
})));
addTransform("MemberExpression", null, modify((function(node) {
    return ecma_expression.MemberExpression.create(node.loc, node.object, node.property, node.computed);
})));
addTransform("LetExpression", modify((function(node) {
    return letExpression(node.loc, node.bindings, node.body);
})));
addTransform("CurryExpression", modify((function(node) {
    return curryExpression(node.loc, node.base, node.args);
})));
addTransform("UnaryOperatorExpression", next(modify((function(node) {
    return unaryOperatorExpression(node.loc, node.op);
})), _transform));
addTransform("BinaryOperatorExpression", next(modify((function(node) {
    return binaryOperatorExpression(node.loc, node.op);
})), _transform));
addTransform("TernaryOperatorExpression", next(modify((function(node) {
    return ternaryOperatorExpression(node.loc);
})), _transform));
addTransform("FunctionExpression", seq(enterBlock, modify((function(node) {
    return functionExpression(node.loc, node.id, node.params, node.body);
}))), seq(exitBlock, modify((function(node) {
    return ecma_expression.FunctionExpression.create(null, node.id, node.params, node.body);
}))));
addTransform("ArrayExpression", null, modify((function(node) {
    return ecma_expression.ArrayExpression.create(node.loc, node.elements);
})));
addTransform("ObjectExpression", null, modify((function(node) {
    return ecma_expression.ObjectExpression.create(node.loc, node.properties);
})));
addTransform("ObjectValue", null, modify((function(node) {
    return ecma_value.ObjectValue.create(node.loc, node.key, node.value);
})));
addTransform("ArgumentsPattern", null, modify((function(node) {
    return node.id;
})));
addTransform("IdentifierPattern", null, modify((function(node) {
    return node.id;
})));
addTransform("AsPattern", null, modify((function(node) {
    return node.id;
})));
addTransform("ObjectPattern", null, modify((function(node) {
    return node.ud.id;
})));
addTransform("EllipsisPattern", null, modify((function(node) {
    return (node.ud && node.ud.id);
})));
addTransform("SinkPattern", null, modify((function(node) {
    return (node.ud && node.ud.id);
})));
addTransform("Program", null, modify((function(node) {
    return ecma_program.Program.create(node.loc, (Array.isArray(node.body) ? node.body : [node.body]));
})));
addTransform("Package", bind(packageManager, (function(packageManager) {
    return modify((function(node) {
        return packageBlock(packageManager, node.loc, node.exports, node.body);
    }));
})));
addTransform("Identifier", bind(node, (function(node) {
    return ((node.ud && node.ud.uid) ? next(addVar(node.name, node.ud.uid), bind(getMapping(node.ud.uid), (
        function(name) {
            return set(identifier(node.loc, name));
        }))) : set(identifier(node.loc, node.name)));
})));
var _trans = (function(node) {
    if ((node && (node instanceof khepri_node.Node))) {
        var t = transformers[node.type];
        if ((t && t[0].pre)) return t[0].pre;
    }
    return pass;
}),
    _transp = (function(node) {
        if ((node && (node instanceof khepri_node.Node))) {
            var t = transformers[node.type];
            if ((t && t[0].post)) return t[0].post;
        }
        return pass;
    });
(_transform = bind(node, _trans));
var _transformPost = bind(node, _transp),
    walk = (function(pre, post) {
        return next(pre, bind(ctx, (function(t) {
            if (zipper.isLeaf(t)) {
                var loop = next(post, bind(ctx, (function(t) {
                    if (zipper.isLast(t)) {
                        if (zipper.isRoot(t)) return ok();
                        return next(move(zipper.up), loop);
                    } else {
                        return next(move(zipper.right), walk(pre, post));
                    }
                })));
                return loop;
            }
            return next(move(zipper.down), walk(pre, post));
        })));
    });
(transform = (function(ast, manager) {
    var amd_manager = require("./package_manager/amd"),
        node_manager = require("./package_manager/node"),
        packageManager = amd_manager;
    if ((manager === "node"))(packageManager = node_manager);
    return trampoline(next(walk(_transform, _transformPost), node)(State.create(khepriZipper(ast), scope.Scope.empty,
        packageManager), (function(x) {
        return x;
    })));
}));
(exports.transform = transform);