/*
 * THIS FILE IS AUTO GENERATED from 'lib/transform.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bes/record", "ecma-ast/clause", "ecma-ast/declaration", "ecma-ast/expression",
    "ecma-ast/node", "ecma-ast/program", "ecma-ast/statement", "ecma-ast/value", "khepri-ast/clause",
    "khepri-ast/declaration", "khepri-ast/expression", "khepri-ast/node", "khepri-ast/pattern",
    "khepri-ast/program", "khepri-ast/statement", "khepri-ast/value", "khepri-ast-zipper", "nu-stream/stream",
    "neith/tree", "neith/walk", "neith/zipper", "./scope", "./package_manager/amd", "./package_manager/node"
], (function(require, exports, record, ecma_clause, ecma_declaration, ecma_expression, ecma_node, ecma_program,
    ecma_statement, ecma_value, khepri_clause, khepri_declaration, khepri_expression, khepri_node,
    khepri_pattern, khepri_program, khepri_statement, khepri_value, khepri_zipper, stream, tree, zipper_walk,
    zipper, scope, _, _0) {
    "use strict";
    var setUserData = khepri_node["setUserData"],
        Node = khepri_node["Node"],
        modify = khepri_node["modify"],
        foldl = stream["foldl"],
        from = stream["from"],
        NIL = stream["NIL"],
        treeZipper = tree["treeZipper"],
        preWalk = zipper_walk["preWalk"],
        postWalk = zipper_walk["postWalk"],
        transform, concat = Function.prototype.call.bind(Array.prototype.concat),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight),
        filter = (function(f, a) {
            return Array.prototype.filter.call(a, f);
        }),
        map = (function(f, a) {
            return Array.prototype.map.call(a, f);
        }),
        id = (function(x) {
            return x;
        }),
        flatten = (function(x) {
            return (Array.isArray(x) ? reduce(x, (function(p, c) {
                return p.concat(c);
            }), []) : x);
        }),
        isStrict = (function(elems) {
            if (((elems && elems.length) && (elems[0].type === "ExpressionStatement"))) {
                var first = elems[0].expression;
                return (((first && (first.type === "Literal")) && (first.kind === "string")) && (first.value ===
                    "use strict"));
            }
            return false;
        }),
        State = record.declare(null, ["node", "scope", "packageManager"]);
    (State.empty = State.create(null, scope.Scope.empty, null));
    var khepriZipper = treeZipper.bind(null, (function(ctx) {
        return khepri_zipper.getChildren(ctx.node);
    }), (function(ctx, key) {
        return ctx.setNode(khepri_zipper.getChild(ctx.node, key));
    }), (function(ctx, pairs, value) {
        return ctx.setNode(khepri_zipper.construct(ctx.node, stream.map((function(x) {
            return tree.Pair(x.key, x.value.node);
        }), pairs), (function() {
            var v = value();
            return reduce(Object.keys(v), (function(p, c) {
                (p[c] = v[c].node);
                return p;
            }), ({}));
        })));
    })),
        next = (function(a, b) {
            return (function(ctx) {
                return b(a(ctx));
            });
        }),
        seqa = (function(arr) {
            return reduceRight(arr, (function(p, c) {
                return next(c, p);
            }), (function(x) {
                return x;
            }));
        }),
        seq = (function() {
            var args = arguments;
            return seqa(args);
        }),
        examineScope = (function(f) {
            return (function(ctx) {
                return f(zipper.extract(ctx)
                    .scope)(ctx);
            });
        }),
        setScope = (function(s) {
            return zipper.modify((function(state) {
                return state.setScope(s);
            }));
        }),
        realBlock = (function() {
            var body = arguments;
            return examineScope((function(s) {
                return seq(setScope(new(scope.Scope)(({}), s, ({}), ({}))), seqa(body), setScope(s));
            }));
        }),
        modifyNode = (function(f, ctx) {
            return tree.modifyNode((function(s) {
                return s.setNode(f(s.node));
            }), ctx);
        }),
        packageManager, identifier = (function(loc, name) {
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
                return (pattern ? flatten(innerPattern(innerBase, pattern)) : khepri_declaration.Binding
                    .create(null, identifier(null, key.value), innerBase));
            });
            return (function(base, pattern) {
                switch (pattern.type) {
                    case "IdentifierPattern":
                        return concat(khepri_declaration.Binding.create(null, pattern.id, base));
                    case "AsPattern":
                        return concat(innerPattern(base, pattern.id), flatten(innerPattern(pattern.id,
                            pattern.target)));
                    case "ObjectPattern":
                        return flatten(map((function(__o) {
                            var target = __o["target"],
                                key = __o["key"];
                            return objectElementUnpack(pattern.ud.id, target, key);
                        }), pattern.elements));
                    default:
                        return [];
                }
            });
        })(),
        unpack = (function(pattern, value) {
            return map((function(x) {
                return variableDeclarator(null, x.pattern, x.value);
            }), flatten(innerPattern(value, pattern)));
        }),
        unpackAssign = (function(pattern, value) {
            return map((function(x) {
                return ecma_expression.AssignmentExpression.create(null, "=", x.pattern, x.value);
            }), flatten(innerPattern(value, pattern)));
        }),
        withStatement = (function(loc, bindings, body) {
            var vars = flatten(map((function(imp) {
                return unpack(imp.pattern, ((imp.type === "ImportPattern") ? packageManager.importPackage(
                    imp.from.value) : imp.value));
            }), bindings)),
                prefix = variableDeclaration(null, vars);
            return khepri_statement.BlockStatement.create(loc, concat(prefix, body.body));
        }),
        functionExpression = (function(loc, id, parameters, functionBody) {
            var params = filter((function(x) {
                return (x.type !== "EllipsisPattern");
            }), parameters.elements),
                elementsPrefix = map((function(x) {
                    return variableDeclarator(null, x.pattern, x.value);
                }), flatten(map((function(x) {
                    switch (x.type) {
                        case "IdentifierPattern":
                            return [];
                        case "AsPattern":
                            return flatten(innerPattern(x.id, x.target));
                        default:
                            return innerPattern(x, x);
                    }
                }), parameters.elements))),
                argumentsPrefix = concat((parameters.self ? variableDeclarator(null, parameters.self,
                    ecma_expression.ThisExpression.create(null)) : []), (parameters.id ?
                    variableDeclarator(null, parameters.id, identifier(null, "arguments")) : [])),
                body = ((functionBody.type === "BlockStatement") ? functionBody : khepri_statement.BlockStatement
                    .create(null, khepri_statement.ReturnStatement.create(null, functionBody))),
                strict = isStrict(body.body),
                prefix = concat(elementsPrefix, argumentsPrefix);
            return khepri_expression.FunctionExpression.create(loc, id, params, khepri_statement.BlockStatement
                .create(body.loc, concat((strict ? khepri_statement.ExpressionStatement.create(null,
                        khepri_value.Literal.create(null, "string", "use strict")) : []),
                    variableDeclaration(null, prefix), (function() {
                        var block = body.body;
                        return (strict ? block.slice(1) : block);
                    })())));
        }),
        letExpression = (function(loc, bindings, body) {
            return khepri_expression.CallExpression.create(loc, khepri_expression.FunctionExpression.create(
                null, null, khepri_pattern.ArgumentsPattern.create(null, null, []), khepri_statement.BlockStatement
                .create(null, [withStatement(null, bindings, khepri_statement.BlockStatement.create(
                    null, [khepri_statement.ReturnStatement.create(null, body)]))])), []);
        }),
        unaryOperatorExpression = (function(loc, op) {
            return khepri_expression.FunctionExpression.create(loc, null, khepri_pattern.ArgumentsPattern.create(
                    null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))]),
                khepri_expression.UnaryExpression.create(null, op, identifier(null, "x")));
        }),
        binaryOperatorExpression = (function(loc, op) {
            var kind = (((op === "||") || (op === "&&")) ? khepri_expression.LogicalExpression :
                khepri_expression.BinaryExpression);
            return khepri_expression.FunctionExpression.create(loc, null, khepri_pattern.ArgumentsPattern.create(
                null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
                    khepri_pattern.IdentifierPattern.create(null, identifier(null, "y"))
                ]), kind.create(null, op, identifier(null, "x"), identifier(null, "y")));
        }),
        ternaryOperatorExpression = (function(loc) {
            return khepri_expression.FunctionExpression.create(loc, null, khepri_pattern.ArgumentsPattern.create(
                null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
                    khepri_pattern.IdentifierPattern.create(null, identifier(null, "y")),
                    khepri_pattern.IdentifierPattern.create(null, identifier(null, "z"))
                ]), khepri_expression.ConditionalExpression.create(null, identifier(null, "x"),
                identifier(null, "y"), identifier(null, "z")));
        }),
        curryExpression = (function(loc, base, args) {
            return khepri_expression.CallExpression.create(null, khepri_expression.MemberExpression.create(
                null, base, identifier(null, "bind")), concat(nullLiteral(null), args));
        }),
        pipe = (function(loc, value, target) {
            return khepri_expression.CallExpression.create(loc, target, [value]);
        }),
        singleCompose = (function(loc, f, g) {
            return khepri_expression.CallExpression.create(loc, khepri_expression.FunctionExpression.create(
                null, null, khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern
                    .create(null, identifier(null, "f")), khepri_pattern.IdentifierPattern.create(
                        null, identifier(null, "g"))
                ]), khepri_expression.FunctionExpression.create(null, null, khepri_pattern.ArgumentsPattern
                    .create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null,
                        "x"))]), khepri_expression.CallExpression.create(null, identifier(null, "f"), [
                        khepri_expression.CallExpression.create(null, identifier(null, "g"), [
                            identifier(null, "x")
                        ])
                    ]))), [f, g]);
        }),
        multiCompose = (function(loc, f, g) {
            return khepri_expression.CallExpression.create(loc, khepri_expression.FunctionExpression.create(
                null, null, khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern
                    .create(null, identifier(null, "f")), khepri_pattern.IdentifierPattern.create(
                        null, identifier(null, "g"))
                ]), khepri_expression.FunctionExpression.create(null, null, khepri_pattern.ArgumentsPattern
                    .create(null, null, []), khepri_expression.CallExpression.create(null, identifier(
                        null, "f"), [khepri_expression.CallExpression.create(null,
                        khepri_expression.MemberExpression.create(null, identifier(null, "g"),
                            identifier(null, "apply")), [nullLiteral(null), identifier(null,
                            "arguments")])]))), [f, g]);
        }),
        packageBlock = (function(loc, exports, body) {
            var imports = ((body.type === "WithStatement") ? filter((function(x) {
                return (x.type === "ImportPattern");
            }), body.bindings) : []),
                exportedNames = map((function(x) {
                    return x.id.name;
                }), exports.exports),
                targets = reduce(imports, (function(p, c) {
                    (p[c.from.value] = c.pattern);
                    return p;
                }), ({})),
                fBody = ((body.type === "WithStatement") ? khepri_statement.WithStatement.create(null,
                    filter((function(x) {
                        return (x.type !== "ImportPattern");
                    }), body.bindings), body.body) : body);
            return packageManager.definePackage(loc, exportedNames, imports, targets, fBody);
        }),
        transformers = ({}),
        _t, addTransform = (function(type, pre, post) {
            var entry = ({
                "pre": pre,
                "post": post
            });
            (transformers[type] = (transformers[type] ? transformers[type].concat(entry) : [entry]));
        });
    addTransform("VariableDeclaration", id, modifyNode.bind(null, (function(node) {
        return ecma_declaration.VariableDeclaration.create(node.loc, node.declarations);
    })));
    addTransform("VariableDeclarator", id, modifyNode.bind(null, (function(node) {
        return ecma_declaration.VariableDeclarator.create(node.loc, node.id, node.init);
    })));
    addTransform("StaticDeclaration", modifyNode.bind(null, (function(node) {
        return ecma_statement.EmptyStatement.create(node.loc);
    })));
    addTransform("CatchClause", id, modifyNode.bind(null, (function(node) {
        return ecma_clause.CatchClause.create(node.loc, node.param, node.body);
    })));
    addTransform("SwitchCase", id, modifyNode.bind(null, (function(node) {
        return ecma_clause.SwitchCase.create(node.loc, node.test, node.consequent);
    })));
    addTransform("BlockStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.BlockStatement.create(node.loc, node.body);
    })));
    addTransform("ExpressionStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.ExpressionStatement.create(node.loc, node.expression);
    })));
    addTransform("IfStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.IfStatement.create(node.loc, node.test, node.consequent, node.alternate);
    })));
    addTransform("WithStatement", (function(ctx) {
        return _t(modifyNode((function(node) {
            return withStatement(node.loc, node.bindings, node.body);
        }), ctx));
    }));
    addTransform("SwitchStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.SwitchStatement.create(node.loc, node.discriminant, node.cases);
    })));
    addTransform("ReturnStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.ReturnStatement.create(node.loc, node.argument);
    })));
    addTransform("ThrowStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.ThrowStatement.create(node.loc, node.argument);
    })));
    addTransform("BreakStatement", modifyNode.bind(null, (function(node) {
        return ecma_statement.BreakStatement.create(node.loc, null);
    })));
    addTransform("ContinueStatement", modifyNode.bind(null, (function(node) {
        return ecma_statement.ContinueStatement.create(node.loc, null);
    })));
    addTransform("TryStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.TryStatement.create(node.loc, node.block, node.handler, node.finalizer);
    })));
    addTransform("WhileStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.WhileStatement.create(node.loc, node.test, node.body);
    })));
    addTransform("DoWhileStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.DoWhileStatement.create(node.loc, node.body, node.test);
    })));
    addTransform("ForStatement", id, modifyNode.bind(null, (function(node) {
        return ecma_statement.ForStatement.create(node.loc, node.init, node.test, node.update, node
            .body);
    })));
    addTransform("AssignmentExpression", id, modifyNode.bind(null, (function(node) {
        return ecma_expression.AssignmentExpression.create(node.loc, node.operator, node.left, node
            .right);
    })));
    addTransform("UnaryExpression", id, modifyNode.bind(null, (function(node) {
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
    addTransform("BinaryExpression", modifyNode.bind(null, (function(node) {
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
    })), modifyNode.bind(null, (function(node) {
        return ecma_expression.BinaryExpression.create(node.loc, node.operator, node.left, node.right);
    })));
    addTransform("LogicalExpression", id, modifyNode.bind(null, (function(node) {
        return ecma_expression.LogicalExpression.create(node.loc, node.operator, node.left, node.right);
    })));
    addTransform("ConditionalExpression", id, modifyNode.bind(null, (function(node) {
        return ecma_expression.ConditionalExpression.create(node.loc, node.test, node.consequent,
            node.alternate);
    })));
    addTransform("NewExpression", id, modifyNode.bind(null, (function(node) {
        return ecma_expression.NewExpression.create(node.loc, node.callee, node.args);
    })));
    addTransform("CallExpression", id, modifyNode.bind(null, (function(node) {
        return ecma_expression.CallExpression.create(node.loc, node.callee, node.args);
    })));
    addTransform("MemberExpression", id, modifyNode.bind(null, (function(node) {
        return ecma_expression.MemberExpression.create(node.loc, node.object, node.property, node.computed);
    })));
    addTransform("LetExpression", modifyNode.bind(null, (function(node) {
        return letExpression(node.loc, node.bindings, node.body);
    })));
    addTransform("CurryExpression", modifyNode.bind(null, (function(node) {
        return curryExpression(node.loc, node.base, node.args);
    })));
    addTransform("UnaryOperatorExpression", (function(ctx) {
        return _t(modifyNode((function(node) {
            return unaryOperatorExpression(node.loc, node.op);
        }), ctx));
    }));
    addTransform("BinaryOperatorExpression", (function(ctx) {
        return _t(modifyNode((function(node) {
            return binaryOperatorExpression(node.loc, node.op);
        }), ctx));
    }));
    addTransform("TernaryOperatorExpression", (function(ctx) {
        return _t(modifyNode((function(node) {
            return ternaryOperatorExpression(node.loc);
        }), ctx));
    }));
    addTransform("FunctionExpression", modifyNode.bind(null, (function(node) {
        return functionExpression(node.loc, node.id, node.params, node.body);
    })), modifyNode.bind(null, (function(node) {
        return ecma_expression.FunctionExpression.create(null, node.id, node.params, node.body);
    })));
    addTransform("ArrayExpression", id, modifyNode.bind(null, (function(node) {
        return ecma_expression.ArrayExpression.create(node.loc, node.elements);
    })));
    addTransform("ObjectExpression", id, modifyNode.bind(null, (function(node) {
        return ecma_expression.ObjectExpression.create(node.loc, node.properties);
    })));
    addTransform("ObjectValue", id, modifyNode.bind(null, (function(node) {
        return ecma_value.ObjectValue.create(node.loc, node.key, node.value);
    })));
    addTransform("ArgumentsPattern", id, modifyNode.bind(null, (function(node) {
        return node.id;
    })));
    addTransform("IdentifierPattern", id, modifyNode.bind(null, (function(node) {
        return node.id;
    })));
    addTransform("AsPattern", id, modifyNode.bind(null, (function(node) {
        return node.id;
    })));
    addTransform("ObjectPattern", id, modifyNode.bind(null, (function(node) {
        return node.ud.id;
    })));
    addTransform("EllipsisPattern", id, modifyNode.bind(null, (function(node) {
        return (node.ud && node.ud.id);
    })));
    addTransform("SinkPattern", id, modifyNode.bind(null, (function(node) {
        return (node.ud && node.ud.id);
    })));
    addTransform("Program", id, modifyNode.bind(null, (function(node) {
        return ecma_program.Program.create(node.loc, (Array.isArray(node.body) ? node.body : [node.body]));
    })));
    addTransform("Package", modifyNode.bind(null, (function(node) {
        return packageBlock(node.loc, node.exports, node.body);
    })));
    addTransform("Identifier", modifyNode.bind(null, (function(node) {
        return identifier(node.loc, node.name);
    })));
    var _trans = (function(node) {
        if (((!node) || (!(node instanceof khepri_node.Node)))) return id;
        var t = transformers[node.type];
        if ((!t)) return id;
        return t[0].pre;
    }),
        _transp = (function(node) {
            if (((!node) || (!(node instanceof khepri_node.Node)))) return id;
            var t = transformers[node.type];
            if (((!t) || (!t[0].post))) return id;
            return t[0].post;
        });
    (_t = (function(ctx) {
        return _trans(tree.node(ctx)
            .node)(ctx);
    }));
    var _tp = (function(ctx) {
        return _transp(tree.node(ctx)
            .node)(ctx);
    }),
        walk = zipper_walk.walk.bind(null, _t, _tp);
    (transform = (function(ast, manager) {
        var amd_manager = require("./package_manager/amd"),
            node_manager = require("./package_manager/node");
        (packageManager = amd_manager);
        if ((manager === "node"))(packageManager = node_manager);
        return tree.node(walk(khepriZipper(State.create(ast, packageManager))))
            .node;
    }));
    (exports.transform = transform);
}));