/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/transform.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "ecma_ast/clause", "ecma_ast/declaration", "ecma_ast/expression", "ecma_ast/node",
    "ecma_ast/program", "ecma_ast/statement", "ecma_ast/value", "khepri_ast/clause", "khepri_ast/declaration",
    "khepri_ast/expression", "khepri_ast/node", "khepri_ast/pattern", "khepri_ast/program", "khepri_ast/statement",
    "khepri_ast/value"
], (function(require, exports, ecma_clause, ecma_declaration, ecma_expression, ecma_node, ecma_program,
    ecma_statement, ecma_value, khepri_clause, khepri_declaration, khepri_expression, khepri_node,
    khepri_pattern, khepri_program, khepri_statement, khepri_value) {
    "use strict";
    var transform, transformStage;
    var ecma_clause = ecma_clause,
        ecma_declaration = ecma_declaration,
        ecma_expression = ecma_expression,
        ecma_node = ecma_node,
        ecma_program = ecma_program,
        ecma_statement = ecma_statement,
        ecma_value = ecma_value,
        khepri_clause = khepri_clause,
        khepri_declaration = khepri_declaration,
        khepri_expression = khepri_expression,
        khepri_node = khepri_node,
        setUserData = khepri_node["setUserData"],
        khepri_pattern = khepri_pattern,
        khepri_program = khepri_program,
        khepri_statement = khepri_statement,
        khepri_value = khepri_value;
    var concat = Function.prototype.call.bind(Array.prototype.concat);
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var identity = (function(x) {
        return x;
    });
    var filter = (function(f, a) {
        return Array.prototype.filter.call(a, f);
    });
    var maps = (function(f, a) {
        return Array.prototype.map.call(a, f);
    });
    var flatten = (function(x) {
        return (Array.isArray(x) ? reduce(x, (function(p, c) {
            return p.concat(c);
        }), []) : x);
    });
    var expressionStatement;
    var _transform;
    var identifier = (function(loc, name) {
        return ecma_value.Identifier.create(loc, name);
    });
    var stringLiteral = (function(loc, value) {
        return ecma_value.Literal.create(loc, "string", value);
    });
    var nullLiteral = (function(loc) {
        return ecma_value.Literal.create(loc, "null", null);
    });
    var variableDeclaration = (function(loc, declarations) {
        var decls = map(declarations, _transform)
            .filter(identity);
        return (!decls.length ? decls : ecma_declaration.VariableDeclaration.create(loc, decls));
    });
    var variableDeclarator = (function(loc, id, init) {
        return (!id ? null : ecma_declaration.VariableDeclarator.create(loc, _transform(id), _transform(
            init)));
    });
    var innerPattern = (function() {
        var objectElementUnpack = (function(base, pattern, key, f) {
            var innerBase = khepri_expression.MemberExpression.create(null, base, key, true);
            return (pattern ? flatten(innerPattern(innerBase, pattern, f)) : f(identifier(null, key.value),
                innerBase));
        });
        return (function(base, pattern, f) {
            switch (pattern.type) {
                case "IdentifierPattern":
                    return f(identifier(null, pattern.id.name), base);
                case "AsPattern":
                    return concat(f(pattern.id, base), flatten(innerPattern(pattern.id, pattern.target,
                        f)));
                case "ObjectPattern":
                    return flatten(maps((function(__o) {
                        var target = __o["target"],
                            key = __o["key"];
                        return objectElementUnpack(pattern.ud.id, target, key, f);
                    }), pattern.elements));
                default:
                    return [];
            }
        });
    })
        .call(this);
    var unpack = (function() {
        var make = variableDeclarator.bind(null, null);
        return (function(pattern, value) {
            return flatten(innerPattern(value, pattern, make));
        });
    })
        .call(this);
    var identifierPattern = (function(loc, name) {
        return identifier(loc, name);
    });
    var callExpression = (function(loc, callee, args) {
        return ecma_expression.CallExpression.create(loc, _transform(callee), map(args, _transform));
    });
    var memberExpression = (function(loc, object, property, computed) {
        return ecma_expression.MemberExpression.create(loc, _transform(object), _transform(property),
            computed);
    });
    var blockStatement = (function(loc, body) {
        return ecma_statement.BlockStatement.create(loc, map(body, _transform));
    });
    (expressionStatement = (function(loc, expression) {
        return ecma_statement.ExpressionStatement.create(loc, _transform(expression));
    }));
    var returnStatement = (function(loc, argument) {
        return ecma_statement.ReturnStatement.create(loc, _transform(argument));
    });
    var withStatement = (function(loc, bindings, body) {
        var vars = flatten(map(bindings, (function(imp) {
            if ((imp.type === "ImportPattern")) {
                var base = callExpression(null, identifier(null, "require"), [imp.from]);
                return unpack(imp.pattern, base);
            }
            return unpack(imp.pattern, imp.value);
        }))),
            prefix = (vars.length ? variableDeclaration(null, vars) : []);
        return blockStatement(loc, concat(prefix, body.body));
    });
    var functionExpression = (function(loc, id, parameters, body) {
        var params = maps(_transform, filter((function(x) {
            return (x.type !== "EllipsisPattern");
        }), parameters.elements)),
            elementsPrefix = flatten(maps((function(x) {
                switch (x.type) {
                    case "IdentifierPattern":
                        return [];
                    case "AsPattern":
                        return innerPattern(_transform(x.id), x.target, variableDeclarator.bind(
                            null, null));
                    default:
                        return innerPattern(_transform(x), x, variableDeclarator.bind(null,
                            null));
                }
            }), parameters.elements)),
            argumentsPrefix = (parameters.id ? variableDeclarator(null, _transform(parameters.id),
                identifier(null, "arguments")) : []),
            prefix = concat(elementsPrefix, argumentsPrefix);
        return ecma_expression.FunctionExpression.create(loc, _transform(id), params, blockStatement(body.loc,
            concat((prefix.length ? variableDeclaration(null, prefix) : []), _transform(body)
                .body)));
    });
    var letExpression = (function(loc, bindings, body) {
        return callExpression(loc, memberExpression(null, functionExpression(null, null, khepri_pattern.ArgumentsPattern
            .create(null, null, []), blockStatement(null, [withStatement(null, bindings,
                blockStatement(null, [returnStatement(null, body)]))])), identifier(null, "call")), [
            ecma_expression.ThisExpression.create(null)
        ]);
    });
    var curryExpression = (function(loc, base, args) {
        return callExpression(null, memberExpression(null, base, identifier(null, "bind")), concat(
            nullLiteral(null), args));
    });
    var assignmentExpression = (function(loc, operator, left, right) {
        return ecma_expression.AssignmentExpression.create(loc, operator, _transform(left), _transform(
            right));
    });
    var pipeline = (function(loc, value, target) {
        return callExpression(loc, target, [value]);
    });
    var singleCompose = (function(loc, f, g) {
        return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(
            null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "f")),
                khepri_pattern.IdentifierPattern.create(null, identifier(null, "g"))
            ]), blockStatement(null, [returnStatement(null, functionExpression(null, null,
            khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern
                .create(null, identifier(null, "x"))
            ]), blockStatement(null, [returnStatement(null, callExpression(null,
                identifier(null, "f"), [callExpression(null, identifier(
                    null, "g"), [identifier(null, "x")])]))])))])), [f, g]);
    });
    var multiCompose = (function(loc, f, g) {
        return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(
            null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "f")),
                khepri_pattern.IdentifierPattern.create(null, identifier(null, "g"))
            ]), blockStatement(null, [returnStatement(null, functionExpression(null, null,
            khepri_pattern.ArgumentsPattern.create(null, null, []), blockStatement(null, [
                returnStatement(null, callExpression(null, identifier(null, "f"), [
                    callExpression(null, memberExpression(null, identifier(
                        null, "g"), identifier(null, "apply")), [
                        nullLiteral(null), identifier(null, "arguments")
                    ])
                ]))
            ])))])), [f, g]);
    });
    var packageBlock = (function(loc, exports, body) {
        var imp = ((body.type === "WithStatement") ? body.bindings.filter((function(x) {
            return (x.type === "ImportPattern");
        })) : []),
            imports = map(imp, (function(x) {
                return x.from;
            })),
            __exports = map(exports.exports, (function(x) {
                return x.id.names;
            })),
            exportList = map(exports.exports, (function(x) {
                return _transform(x.id);
            })),
            exportHeader = (exportList.length ? ecma_declaration.VariableDeclaration.create(null, map(
                exportList, (function(x) {
                    return variableDeclarator(null, x);
                }))) : ecma_statement.EmptyStatement.create(null)),
            exportBody = exportList.map((function(x) {
                return expressionStatement(null, ecma_expression.AssignmentExpression.create(null,
                    "=", memberExpression(null, identifier(null, "exports"), identifier(null, x
                        .name)), identifier(null, x.name)));
            })),
            fBody = ((body.type === "WithStatement") ? withStatement(null, map(body.bindings, (function(x) {
                return ((x.type !== "ImportPattern") ? x : khepri_declaration.Binding.create(
                    null, x.pattern, x.pattern.id));
            })), body.body) : _transform(body)),
            packageBody = ecma_expression.FunctionExpression.create(null, null, concat(identifier(null,
                "require"), identifier(null, "exports"), imp.map((function(x) {
                return _transform(x.pattern);
            }))), blockStatement(fBody.loc, concat(expressionStatement(null, stringLiteral(null,
                "use strict")), exportHeader, fBody.body, exportBody)));
        return callExpression(loc, identifier(null, "define"), [ecma_expression.ArrayExpression.create(null,
                concat(stringLiteral(null, "require"), stringLiteral(null, "exports"), imports)),
            packageBody
        ]);
    });
    var transformers = ({});
    var addTransform = (function(target, f) {
        (transformers[target] = f);
    });
    addTransform("VariableDeclaration", (function(node) {
        return variableDeclaration(node.loc, node.declarations);
    }));
    addTransform("VariableDeclarator", (function(node) {
        return variableDeclarator(node.loc, node.id, node.init);
    }));
    addTransform("StaticDeclaration", (function(node) {
        return ecma_statement.EmptyStatement.create(node.loc);
    }));
    addTransform("CatchClause", (function(node) {
        return ecma_clause.CatchClause.create(node.loc, _transform(node.param), _transform(node.body));
    }));
    addTransform("SwitchCase", (function(node) {
        return ecma_clause.SwitchCase.create(node.loc, _transform(node.test), map(node.consequent,
            _transform));
    }));
    addTransform("BlockStatement", (function(node) {
        return blockStatement(node.loc, node.body);
    }));
    addTransform("ExpressionStatement", (function(node) {
        return expressionStatement(node.loc, node.expression);
    }));
    addTransform("IfStatement", (function(node) {
        return ecma_statement.IfStatement.create(node.loc, _transform(node.test), _transform(node.consequent),
            _transform(node.alternate));
    }));
    addTransform("WithStatement", (function(node) {
        return withStatement(node.loc, node.bindings, node.body);
    }));
    addTransform("SwitchStatement", (function(node) {
        return ecma_statement.SwitchStatement.create(node.loc, _transform(node.discriminant), map(node.cases,
            _transform));
    }));
    addTransform("ReturnStatement", (function(node) {
        return returnStatement(node.loc, node.argument);
    }));
    addTransform("ThrowStatement", (function(node) {
        return ecma_statement.ThrowStatement.create(node.loc, _transform(node.argument));
    }));
    addTransform("BreakStatement", (function(node) {
        return ecma_statement.BreakStatement.create(node.loc, null);
    }));
    addTransform("ContinueStatement", (function(node) {
        return ecma_statement.ThrowStatement.create(node.loc, null);
    }));
    addTransform("TryStatement", (function(node) {
        return ecma_statement.TryStatement.create(node.loc, _transform(node.block), _transform(node.handler),
            _transform(node.finalizer));
    }));
    addTransform("WhileStatement", (function(node) {
        return ecma_statement.WhileStatement.create(node.loc, _transform(node.test), _transform(node.body));
    }));
    addTransform("DoWhileStatement", (function(node) {
        return ecma_statement.DoWhileStatement.create(node.loc, _transform(node.body), _transform(node.test));
    }));
    addTransform("ForStatement", (function(node) {
        return ecma_statement.ForStatement.create(node.loc, _transform(node.init), _transform(node.test),
            _transform(node.update), _transform(node.body));
    }));
    addTransform("AssignmentExpression", (function(node) {
        return assignmentExpression(node.loc, node.operator, node.left, node.right);
    }));
    addTransform("UnaryExpression", (function(node) {
        return ecma_expression.UnaryExpression.create(node.loc, node.operator, _transform(node.argument));
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
                return pipeline(node.loc, node.left, node.right);
            case "<|":
                return pipeline(node.loc, node.right, node.left);
            default:
                return ecma_expression.BinaryExpression.create(node.loc, node.operator, _transform(node
                    .left), _transform(node.right));
        }
    }));
    addTransform("LogicalExpression", (function(node) {
        return ecma_expression.LogicalExpression.create(node.loc, node.operator, _transform(node.left),
            _transform(node.right));
    }));
    addTransform("ConditionalExpression", (function(node) {
        return ecma_expression.ConditionalExpression.create(node.loc, _transform(node.test), _transform(
            node.consequent), _transform(node.alternate));
    }));
    addTransform("NewExpression", (function(node) {
        return ecma_expression.NewExpression.create(node.loc, _transform(node.callee), map(node.args,
            _transform));
    }));
    addTransform("CallExpression", (function(node) {
        return callExpression(node.loc, node.callee, node.args);
    }));
    addTransform("MemberExpression", (function(node) {
        return ecma_expression.MemberExpression.create(node.loc, _transform(node.object), _transform(
            node.property), node.computed);
    }));
    addTransform("LetExpression", (function(node) {
        return letExpression(node.loc, node.bindings, node.body);
    }));
    addTransform("CurryExpression", (function(node) {
        return curryExpression(node.loc, node.base, node.args);
    }));
    addTransform("UnaryOperatorExpression", (function(node) {
        return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))
        ]), blockStatement(null, [returnStatement(null, khepri_expression.UnaryExpression.create(
            null, node.op, identifier(null, "x")))]));
    }));
    addTransform("BinaryOperatorExpression", (function(node) {
        var kind = (((node.op === "||") || (node.op === "&&")) ? khepri_expression.LogicalExpression :
            khepri_expression.BinaryExpression);
        return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "y"))
        ]), blockStatement(null, [returnStatement(null, kind.create(null, node.op, identifier(null,
            "x"), identifier(null, "y")))]));
    }));
    addTransform("TernaryOperatorExpression", (function(node) {
        return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "y")),
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "z"))
        ]), blockStatement(null, [returnStatement(null, khepri_expression.ConditionalExpression.create(
            null, identifier(null, "x"), identifier(null, "y"), identifier(null, "z")))]));
    }));
    addTransform("FunctionExpression", (function(node) {
        return functionExpression(node.loc, node.id, node.params, node.body);
    }));
    addTransform("ArrayExpression", (function(node) {
        return ecma_expression.ArrayExpression.create(node.loc, _transform(node.elements));
    }));
    addTransform("ObjectExpression", (function(node) {
        return ecma_expression.ObjectExpression.create(node.loc, _transform(node.properties));
    }));
    addTransform("ObjectValue", (function(node) {
        return ecma_value.ObjectValue.create(node.loc, _transform(node.key), _transform(node.value));
    }));
    addTransform("ArgumentsPattern", (function(node) {
        return identifier(node.loc, node.id.name);
    }));
    addTransform("IdentifierPattern", (function(node) {
        return identifier(node.loc, node.id.name);
    }));
    addTransform("AsPattern", (function(node) {
        return _transform(node.id);
    }));
    addTransform("ArrayPattern", (function(node) {
        return _transform(node.ud.id);
    }));
    addTransform("ObjectPattern", (function(node) {
        return _transform(node.ud.id);
    }));
    addTransform("EllipsisPattern", (function(node) {
        return ((node.ud && node.ud.id) ? _transform(node.ud.id) : null);
    }));
    addTransform("SinkPattern", (function(node) {
        return ((node.ud && node.ud.id) ? _transform(node.ud.id) : null);
    }));
    addTransform("Program", (function(node) {
        return ecma_program.Program.create(node.loc, (Array.isArray(node.body) ? _transform(node.body) : [
            _transform(node.body)
        ]));
    }));
    addTransform("Package", (function(node) {
        return packageBlock(node.loc, node.exports, node.body);
    }));
    (_transform = (function(node) {
        if ((!node || !(node instanceof khepri_node.Node))) return node;
        if (Array.isArray(node)) return map(node, _transform);
        var t = transformers[node.type];
        if (!t) return node;
        return t(node);
    }));
    (transform = (function(__o) {
        var options = __o["options"],
            ast = __o["ast"];
        return ({
            "options": options,
            "ast": _transform(ast)
        });
    }));
    (exports.transform = transform);
    (exports.transformStage = transformStage);
}))