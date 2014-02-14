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
    setUserData = khepri_node["setUserData"],
    Node = khepri_node["Node"],
    modify = khepri_node["modify"],
    khepri_pattern = require("khepri-ast")["pattern"],
    khepri_program = require("khepri-ast")["program"],
    khepri_statement = require("khepri-ast")["statement"],
    khepri_value = require("khepri-ast")["value"],
    khepri_zipper = require("khepri-ast-zipper"),
    stream = require("nu-stream")["stream"],
    foldl = stream["foldl"],
    from = stream["from"],
    NIL = stream["NIL"],
    tree = require("neith")["tree"],
    treeZipper = tree["treeZipper"],
    zipper_walk = require("neith")["walk"],
    preWalk = zipper_walk["preWalk"],
    postWalk = zipper_walk["postWalk"],
    zipper = require("neith")["zipper"],
    scope = require("./scope"),
    transform, transformStage, concat = Function.prototype.call.bind(Array.prototype.concat),
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
    modifyNode = (function(f) {
        return tree.modifyNode.bind(null, (function(ctx) {
            return ctx.setNode(f(ctx.node));
        }));
    }),
    _transform, packageManager, identifier = (function(loc, name) {
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
            return (pattern ? flatten(innerPattern(innerBase, pattern)) : khepri_declaration.Binding.create(
                null, identifier(null, key.value), innerBase));
        });
        return (function(base, pattern) {
            switch (pattern.type) {
                case "IdentifierPattern":
                    return khepri_declaration.Binding.create(null, identifier(null, pattern.id.name), base);
                case "AsPattern":
                    return concat(innerPattern(base, pattern.id), flatten(innerPattern(pattern.id, pattern.target)));
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
    identifierPattern = (function(loc, name) {
        return identifier(loc, name);
    }),
    callExpression = (function(loc, callee, args) {
        return ecma_expression.CallExpression.create(loc, _transform(callee), _transform(args));
    }),
    memberExpression = (function(loc, object, property, computed) {
        return ecma_expression.MemberExpression.create(loc, _transform(object), _transform(property), computed);
    }),
    withStatement = (function(loc, bindings, body) {
        var vars = flatten(map((function(imp) {
            var base = ((imp.type === "ImportPattern") ? packageManager.importPackage(imp.from.value) :
                imp.value);
            return unpack(imp.pattern, base);
        }), bindings)),
            prefix = variableDeclaration(null, vars);
        return khepri_statement.BlockStatement.create(loc, concat(prefix, body.body));
    }),
    functionExpression = (function(loc, id, parameters, functionBody) {
        var params = _transform(filter((function(x) {
            return (x.type !== "EllipsisPattern");
        }), parameters.elements)),
            elementsPrefix = map((function(x) {
                return variableDeclarator(null, x.pattern, x.value);
            }), flatten(map((function(x) {
                switch (x.type) {
                    case "IdentifierPattern":
                        return [];
                    case "AsPattern":
                        return flatten(innerPattern(_transform(x.id), x.target));
                    default:
                        return innerPattern(_transform(x), x);
                }
            }), parameters.elements))),
            argumentsPrefix = concat((parameters.self ? variableDeclarator(null, parameters.self, ecma_expression.ThisExpression
                .create(null)) : []), (parameters.id ? variableDeclarator(null, _transform(parameters.id),
                identifier(null, "arguments")) : [])),
            body = ((functionBody.type === "BlockStatement") ? functionBody : khepri_statement.BlockStatement.create(
                null, khepri_statement.ReturnStatement.create(null, functionBody))),
            strict = isStrict(body.body),
            prefix = concat(elementsPrefix, argumentsPrefix);
        return ecma_expression.FunctionExpression.create(loc, _transform(id), params, ecma_statement.BlockStatement
            .create(body.loc, _transform(concat((strict ? khepri_statement.ExpressionStatement.create(null,
                khepri_value.Literal.create(null, "string", "use strict")) : []), variableDeclaration(
                null, prefix), (function() {
                var block = _transform(body)
                    .body;
                return (strict ? block.slice(1) : block);
            })()))));
    }),
    letExpression = (function(loc, bindings, body) {
        return khepri_expression.CallExpression.create(loc, khepri_expression.FunctionExpression.create(null, null,
            khepri_pattern.ArgumentsPattern.create(null, null, []), khepri_statement.BlockStatement.create(null, [
                withStatement(null, bindings, khepri_statement.BlockStatement.create(null, [
                    khepri_statement.ReturnStatement.create(null, body)
                ]))
            ])), []);
    }),
    curryExpression = (function(loc, base, args) {
        return khepri_expression.CallExpression.create(null, khepri_expression.MemberExpression.create(null, base,
            identifier(null, "bind")), concat(nullLiteral(null), args));
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
                khepri_expression.CallExpression.create(null, identifier(null, "f"), [callExpression(null,
                    identifier(null, "g"), [identifier(null, "x")])]))), [f, g]);
    }),
    multiCompose = (function(loc, f, g) {
        return khepri_expression.CallExpression.create(loc, khepri_expression.FunctionExpression.create(null, null,
            khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null,
                identifier(null, "f")), khepri_pattern.IdentifierPattern.create(null, identifier(null,
                "g"))]), khepri_expression.FunctionExpression.create(null, null, khepri_pattern.ArgumentsPattern
                .create(null, null, []), khepri_expression.CallExpression.create(null, identifier(null, "f"), [
                    khepri_expression.CallExpression.create(null, memberExpression(null, identifier(null,
                        "g"), identifier(null, "apply")), [nullLiteral(null), identifier(null,
                        "arguments")])
                ]))), [f, g]);
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
            fBody = ((body.type === "WithStatement") ? khepri_statement.WithStatement.create(null, filter((function(
                x) {
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
addTransform("VariableDeclaration", id, (function(node) {
    return ecma_declaration.VariableDeclaration.create(node.loc, node.declarations);
}));
addTransform("VariableDeclarator", id, (function(node) {
    return ecma_declaration.VariableDeclarator.create(node.loc, node.id, node.init);
}));
addTransform("StaticDeclaration", (function(node) {
    return ecma_statement.EmptyStatement.create(node.loc);
}));
addTransform("CatchClause", id, (function(node) {
    return ecma_clause.CatchClause.create(node.loc, node.param, node.body);
}));
addTransform("SwitchCase", id, (function(node) {
    return ecma_clause.SwitchCase.create(node.loc, node.test, node.consequent);
}));
addTransform("BlockStatement", id, (function(node) {
    return ecma_statement.BlockStatement.create(node.loc, node.body);
}));
addTransform("ExpressionStatement", id, (function(node) {
    return ecma_statement.ExpressionStatement.create(node.loc, node.expression);
}));
addTransform("IfStatement", id, (function(node) {
    return ecma_statement.IfStatement.create(node.loc, node.test, node.consequent, node.alternate);
}));
addTransform("WithStatement", (function(node, k) {
    return k(withStatement(node.loc, node.bindings, node.body));
}));
addTransform("SwitchStatement", id, (function(node) {
    return ecma_statement.SwitchStatement.create(node.loc, node.discriminant, node.cases);
}));
addTransform("ReturnStatement", id, (function(node) {
    return ecma_statement.ReturnStatement.create(node.loc, node.argument);
}));
addTransform("ThrowStatement", id, (function(node) {
    return ecma_statement.ThrowStatement.create(node.loc, node.argument);
}));
addTransform("BreakStatement", (function(node) {
    return ecma_statement.BreakStatement.create(node.loc, null);
}));
addTransform("ContinueStatement", (function(node) {
    return ecma_statement.ContinueStatement.create(node.loc, null);
}));
addTransform("TryStatement", id, (function(node) {
    return ecma_statement.TryStatement.create(node.loc, node.block, node.handler, node.finalizer);
}));
addTransform("WhileStatement", id, (function(node) {
    return ecma_statement.WhileStatement.create(node.loc, node.test, node.body);
}));
addTransform("DoWhileStatement", id, (function(node) {
    return ecma_statement.DoWhileStatement.create(node.loc, node.body, node.test);
}));
addTransform("ForStatement", id, (function(node) {
    return ecma_statement.ForStatement.create(node.loc, node.init, node.test, node.update, node.body);
}));
addTransform("AssignmentExpression", id, (function(node) {
    return ecma_expression.AssignmentExpression.create(node.loc, node.operator, node.left, node.right);
}));
addTransform("UnaryExpression", id, (function(node) {
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
}));
addTransform("BinaryExpression", (function(node) {
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
}), (function(node) {
    return ecma_expression.BinaryExpression.create(node.loc, node.operator, node.left, node.right);
}));
addTransform("LogicalExpression", id, (function(node) {
    return ecma_expression.LogicalExpression.create(node.loc, node.operator, node.left, node.right);
}));
addTransform("ConditionalExpression", id, (function(node) {
    return ecma_expression.ConditionalExpression.create(node.loc, node.test, node.consequent, node.alternate);
}));
addTransform("NewExpression", id, (function(node) {
    return ecma_expression.NewExpression.create(node.loc, node.callee, node.args);
}));
addTransform("CallExpression", id, (function(node) {
    return ecma_expression.CallExpression.create(node.loc, node.callee, node.args);
}));
addTransform("MemberExpression", id, (function(node) {
    return ecma_expression.MemberExpression.create(node.loc, node.object, node.property, node.computed);
}));
addTransform("LetExpression", (function(node) {
    return letExpression(node.loc, node.bindings, node.body);
}));
addTransform("CurryExpression", (function(node) {
    return curryExpression(node.loc, node.base, node.args);
}));
addTransform("UnaryOperatorExpression", (function(node, k) {
    return k(khepri_expression.FunctionExpression.create(node.loc, null, khepri_pattern.ArgumentsPattern.create(
            null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))]),
        khepri_expression.UnaryExpression.create(null, node.op, identifier(null, "x"))));
}));
addTransform("BinaryOperatorExpression", (function(node, k) {
    var kind = (((node.op === "||") || (node.op === "&&")) ? khepri_expression.LogicalExpression :
        khepri_expression.BinaryExpression);
    return k(khepri_expression.FunctionExpression.create(node.loc, null, khepri_pattern.ArgumentsPattern.create(
        null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "y"))
        ]), kind.create(null, node.op, identifier(null, "x"), identifier(null, "y"))));
}));
addTransform("TernaryOperatorExpression", (function(node, k) {
    return k(khepri_expression.FunctionExpression.create(node.loc, null, khepri_pattern.ArgumentsPattern.create(
        null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "y")), khepri_pattern.IdentifierPattern
            .create(null, identifier(null, "z"))
        ]), khepri_expression.ConditionalExpression.create(null, identifier(null, "x"), identifier(null,
        "y"), identifier(null, "z"))));
}));
addTransform("FunctionExpression", (function(node) {
    return functionExpression(node.loc, node.id, node.params, node.body);
}));
addTransform("ArrayExpression", id, (function(node) {
    return ecma_expression.ArrayExpression.create(node.loc, node.elements);
}));
addTransform("ObjectExpression", id, (function(node) {
    return ecma_expression.ObjectExpression.create(node.loc, node.properties);
}));
addTransform("ObjectValue", id, (function(node) {
    return ecma_value.ObjectValue.create(node.loc, node.key, node.value);
}));
addTransform("ArgumentsPattern", (function(node) {
    return (function(node) {
        return node.id;
    });
}));
addTransform("IdentifierPattern", (function(node) {
    return node.id;
}));
addTransform("AsPattern", (function(node) {
    return node.id;
}));
addTransform("ArrayPattern", (function(node) {
    return node.ud.id;
}));
addTransform("ObjectPattern", (function(node) {
    return node.ud.id;
}));
addTransform("EllipsisPattern", (function(node) {
    return ((node.ud && node.ud.id) ? _transform(node.ud.id) : null);
}));
addTransform("SinkPattern", (function(node) {
    return ((node.ud && node.ud.id) ? _transform(node.ud.id) : null);
}));
addTransform("Program", id, (function(node) {
    return ecma_program.Program.create(node.loc, (Array.isArray(node.body) ? node.body : [node.body]));
}));
addTransform("Package", (function(node) {
    return packageBlock(node.loc, node.exports, node.body);
}));
addTransform("Identifier", (function(node) {
    return identifier(node.loc, node.name);
}));
var _t = (function(node) {
    if ((!node)) return id;
    if (Array.isArray(node)) return modifyNode((function() {
        return map(_transform, node);
    }));
    if ((!(node instanceof khepri_node.Node))) return id;
    var t = transformers[node.type];
    if ((!t)) return id;
    return modifyNode((function(x) {
        return t[0].pre(x, _transform);
    }));
}),
    _transformp = (function(node) {
        if ((!node)) return node;
        if (Array.isArray(node)) return map(_transform, node);
        if ((!(node instanceof khepri_node.Node))) return node;
        var t = transformers[node.type];
        if (((!t) || (!t[0].post))) return node;
        return t[0].post(node);
    }),
    _tp = (function(node) {
        if ((!node)) return id;
        if (Array.isArray(node)) return modifyNode((function() {
            return map(_transformp, node);
        }));
        if ((!(node instanceof khepri_node.Node))) return id;
        var t = transformers[node.type];
        if (((!t) || (!t[0].post))) return id;
        return modifyNode((function(x) {
            return t[0].post(x, t[0].post);
        }));
    }),
    walk = zipper_walk.walk.bind(null, (function(ctx) {
        return _t(tree.node(ctx)
            .node)(ctx);
    }), (function(ctx) {
        return _tp(tree.node(ctx)
            .node)(ctx);
    }));
(_transform = (function(node) {
    if ((!node)) return node;
    if (Array.isArray(node)) return map(_transform, node);
    if ((!(node instanceof khepri_node.Node))) return node;
    var t = transformers[node.type];
    if ((!t)) return node;
    return t[0].pre(node, _transform);
}));
(transform = (function(__o) {
    var options = __o["options"],
        ast = __o["ast"],
        amd_manager = require("./package_manager/amd"),
        node_manager = require("./package_manager/node");
    (packageManager = amd_manager);
    if ((options.package_manager === "node"))(packageManager = node_manager);
    return ({
        "options": options,
        "ast": tree.node(walk(khepriZipper(State.create(ast, packageManager))))
            .node
    });
}));
(exports.transform = transform);
(exports.transformStage = transformStage);