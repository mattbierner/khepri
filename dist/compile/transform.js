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
    var transform;
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
        return (function() {
            {
                var decls = map(declarations, transform)
                    .filter(identity);
                return (!decls.length ? decls : ecma_declaration.VariableDeclaration.create(loc, decls));
            }
        })
            .call(this);
    });
    var variableDeclarator = (function(loc, id, init) {
        return (!id ? null : ecma_declaration.VariableDeclarator.create(loc, transform(id), transform(init)));
    });
    var objectPatternElement = (function(loc, key, value) {
        return khepri_pattern.ObjectPatternElement.create(loc, key, value);
    });
    var arrayPattern = (function(loc, elements, id) {
        var node = khepri_pattern.ObjectPattern.create(loc, map(elements, (function(x, i) {
            return objectPatternElement(null, khepri_value.Literal.create(null, "number", i), x);
        })));
        (node.id = id);
        return node;
    });
    var innerPattern = (function() {
        {
            var objectElementUnpack = (function(base, pattern, key, f) {
                var p = pattern;
                var k;
                switch (key.type) {
                    case "IdentifierPattern":
                        (k = stringLiteral(null, key.id.name));
                        break;
                    case "AsPattern":
                        (k = stringLiteral(null, key.id.id.name));
                        (p = key);
                        break;
                    default:
                        (k = key);
                        break;
                }
                var innerBase = khepri_expression.MemberExpression.create(null, base, k, true);
                return (p ? flatten(innerPattern(innerBase, p, f)) : f(identifier(null, k.value),
                    innerBase));
            });
            return (function(base, pattern, f) {
                switch (pattern.type) {
                    case "IdentifierPattern":
                        return f(identifier(null, pattern.id.name), base);
                    case "AsPattern":
                        return concat(f(pattern.id, base), flatten(innerPattern(pattern.id, pattern.target,
                            f)));
                    case "ArrayPattern":
                        return flatten(innerPattern(base, arrayPattern(pattern.loc, pattern.elements,
                            pattern.id), f));
                    case "ObjectPattern":
                        return flatten(concat(innerPattern(base, pattern.id, f), flatten(maps((function(
                            __o) {
                            var __o = __o,
                                target = __o["target"],
                                key = __o["key"];
                            return objectElementUnpack(pattern.id, target, key, f);
                        }), pattern.elements))));
                    default:
                        return [];
                }
            });
        }
    })
        .call(this);
    var asUnpack = (function() {
        {
            var make = variableDeclarator.bind(null, null);
            return flatten((function(pattern, value) {
                return innerPattern(value, pattern, make);
            }));
        }
    })
        .call(this);
    var unpack = (function() {
        {
            var make = variableDeclarator.bind(null, null);
            return flatten((function(pattern, value) {
                return innerPattern(value, pattern, make);
            }));
        }
    })
        .call(this);
    var identifierPattern = (function(loc, name) {
        return identifier(loc, name);
    });
    var callExpression = (function(loc, callee, args) {
        return ecma_expression.CallExpression.create(loc, transform(callee), map(args, transform));
    });
    var memberExpression = (function(loc, object, property, computed) {
        return ecma_expression.MemberExpression.create(loc, transform(object), transform(property),
            computed);
    });
    var blockStatement = (function(loc, body) {
        return ecma_statement.BlockStatement.create(loc, map(body, transform));
    });
    (expressionStatement = (function(loc, expression) {
        return ecma_statement.ExpressionStatement.create(loc, transform(expression));
    }));
    var returnStatement = (function(loc, argument) {
        return ecma_statement.ReturnStatement.create(loc, transform(argument));
    });
    var withStatement = (function(loc, bindings, body) {
        return (function() {
            {
                var vars = flatten(map(bindings, (function(imp) {
                    if ((imp.type === "ImportPattern")) {
                        var base = callExpression(null, identifier(null, "require"), [imp.from]);
                        return unpack(imp.pattern, base);
                    }
                    return unpack(imp.pattern, imp.value);
                }))),
                    prefix = (vars.length ? variableDeclaration(null, vars) : []);
                return blockStatement(loc, concat(prefix, body.body));
            }
        })
            .call(this);
    });
    var functionExpression = (function(loc, id, parameters, body) {
        return (function() {
            {
                var params = maps(transform, filter((function(x) {
                    return (x.type !== "EllipsisPattern");
                }), parameters.elements)),
                    elementsPrefix = flatten(maps((function(x) {
                        switch (x.type) {
                            case "IdentifierPattern":
                                return [];
                            case "AsPattern":
                                return innerPattern(transform(x.id), x.target,
                                    variableDeclarator.bind(null, null));
                            default:
                                return innerPattern(transform(x.id), x, variableDeclarator.bind(
                                    null, null));
                        }
                    }), parameters.elements)),
                    argumentsPrefix = (parameters.id ? variableDeclarator(null, transform(parameters.id),
                        identifier(null, "arguments")) : []),
                    prefix = concat(elementsPrefix, argumentsPrefix);
                return ecma_expression.FunctionExpression.create(loc, transform(id), params,
                    blockStatement(body.loc, concat((prefix.length ? variableDeclaration(null, prefix) : []),
                        transform(body)
                        .body)));
            }
        })
            .call(this);
    });
    var letExpression = (function(loc, bindings, body) {
        return callExpression(loc, memberExpression(null, functionExpression(null, null, khepri_pattern.ArgumentsPattern
            .create(null, null, []), blockStatement(null, [withStatement(null, bindings,
                blockStatement(null, [returnStatement(null, body)]))])), identifier(null, "call")), [
            ecma_expression.ThisExpression.create(null)
        ]);
    });
    var curryExpression = (function(loc, base, args) {
        return (!args.length ? transform(base) : callExpression(null, memberExpression(null, base,
            identifier(null, "bind")), concat(nullLiteral(null), args)));
    });
    var assignmentExpression = (function(loc, operator, left, right) {
        return ecma_expression.AssignmentExpression.create(loc, operator, transform(left), transform(right));
    });
    var pipeline = (function(loc, value, target) {
        if ((target.type === "CurryExpression")) {
            return callExpression(loc, transform(target.base), concat(target.args, value));
        }
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
        return (function() {
            {
                var imp = ((body.type === "WithStatement") ? body.bindings.filter((function(x) {
                    return (x.type === "ImportPattern");
                })) : []),
                    imports = map(imp, (function(x) {
                        return x.from;
                    })),
                    exportList = map(exports.exports, (function(x) {
                        return transform(x.id);
                    })),
                    exportHeader = (exportList.length ? ecma_declaration.VariableDeclaration.create(
                            null, map(exportList, variableDeclarator.bind(null, null))) :
                        ecma_statement.EmptyStatement.create(null)),
                    exportBody = exportList.map((function(x) {
                        return expressionStatement(null, ecma_expression.AssignmentExpression.create(
                            null, "=", memberExpression(null, identifier(null, "exports"),
                                identifier(null, x.name)), identifier(null, x.name)));
                    })),
                    fBody = ((body.type === "WithStatement") ? withStatement(null, map(body.bindings, (
                        function(x) {
                            return ((x.type !== "ImportPattern") ? x : khepri_declaration.Binding
                                .create(null, x.pattern, x.pattern.id));
                        })), body.body) : transform(body)),
                    packageBody = ecma_expression.FunctionExpression.create(null, null, concat(
                        identifier(null, "require"), identifier(null, "exports"), imp.map((function(
                            x) {
                            return transform(x.pattern);
                        }))), blockStatement(fBody.loc, concat(expressionStatement(null,
                            stringLiteral(null, "use strict")), exportHeader, fBody.body,
                        exportBody)));
                return callExpression(loc, identifier(null, "define"), [ecma_expression.ArrayExpression
                    .create(null, concat(stringLiteral(null, "require"), stringLiteral(null,
                        "exports"), imports)), packageBody
                ]);
            }
        })
            .call(this);
    });
    (transform = (function(node) {
        if ((!node || !(node instanceof khepri_node.Node))) return node;
        switch (node.type) {
            case "VariableDeclaration":
                return variableDeclaration(node.loc, node.declarations);
            case "VariableDeclarator":
                return variableDeclarator(node.loc, node.id, node.init);
            case "StaticDeclaration":
                return new(ecma_statement.EmptyStatement)(node.loc);
            case "CatchClause":
                return new(ecma_clause.CatchClause)(node.loc, transform(node.param), transform(node.body));
            case "SwitchCase":
                return new(ecma_clause.SwitchCase)(node.loc, transform(node.test), map(node.consequent,
                    transform));
            case "BlockStatement":
                return blockStatement(node.loc, node.body);
            case "ExpressionStatement":
                return expressionStatement(node.loc, node.expression);
            case "IfStatement":
                return new(ecma_statement.IfStatement)(node.loc, transform(node.test), transform(node.consequent),
                    transform(node.alternate));
            case "WithStatement":
                return withStatement(node.loc, node.bindings, node.body);
            case "SwitchStatement":
                return new(ecma_statement.SwitchStatement)(node.loc, transform(node.discriminant), map(
                    node.cases, transform));
            case "ReturnStatement":
                return returnStatement(node.loc, node.argument);
            case "ThrowStatement":
                return new(ecma_statement.ThrowStatement)(node.loc, transform(node.argument));
            case "BreakStatement":
                return ecma_statement.BreakStatement.create(node.loc, null);
            case "ContinueStatement":
                return ecma_statement.ThrowStatement.create(node.loc, null);
            case "TryStatement":
                return ecma_statement.TryStatement.create(node.loc, transform(node.block), transform(
                    node.handler), transform(node.finalizer));
            case "WhileStatement":
                return ecma_statement.WhileStatement.create(node.loc, transform(node.test), transform(
                    node.body));
            case "DoWhileStatement":
                return ecma_statement.DoWhileStatement.create(node.loc, transform(node.body), transform(
                    node.test));
            case "ForStatement":
                return ecma_statement.ForStatement.create(node.loc, transform(node.init), transform(
                    node.test), transform(node.update), transform(node.body));
            case "AssignmentExpression":
                return assignmentExpression(node.loc, node.operator, node.left, node.right);
            case "UnaryExpression":
                return ecma_expression.UnaryExpression.create(node.loc, node.operator, transform(node.argument));
            case "BinaryExpression":
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
                        return ecma_expression.BinaryExpression.create(node.loc, node.operator,
                            transform(node.left), transform(node.right));
                }
            case "LogicalExpression":
                return ecma_expression.LogicalExpression.create(node.loc, node.operator, transform(node
                    .left), transform(node.right));
            case "ConditionalExpression":
                return ecma_expression.ConditionalExpression.create(node.loc, transform(node.test),
                    transform(node.consequent), transform(node.alternate));
            case "NewExpression":
                return ecma_expression.NewExpression.create(node.loc, transform(node.callee), map(node.args,
                    transform));
            case "CallExpression":
                return callExpression(node.loc, node.callee, node.args);
            case "MemberExpression":
                return ecma_expression.MemberExpression.create(node.loc, transform(node.object),
                    transform(node.property), node.computed);
            case "LetExpression":
                return letExpression(node.loc, node.bindings, node.body);
            case "CurryExpression":
                return curryExpression(node.loc, node.base, node.args);
            case "UnaryOperatorExpression":
                return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null,
                        null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))]),
                    blockStatement(null, [returnStatement(null, khepri_expression.UnaryExpression.create(
                        null, node.op, identifier(null, "x")))]));
            case "BinaryOperatorExpression":
                var kind = (((node.op === "||") || (node.op === "&&")) ? khepri_expression.LogicalExpression :
                    khepri_expression.BinaryExpression);
                return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null,
                    null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
                        khepri_pattern.IdentifierPattern.create(null, identifier(null, "y"))
                    ]), blockStatement(null, [returnStatement(null, kind.create(null, node.op,
                    identifier(null, "x"), identifier(null, "y")))]));
            case "TernaryOperatorExpression":
                return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null,
                    null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
                        khepri_pattern.IdentifierPattern.create(null, identifier(null, "y")),
                        khepri_pattern.IdentifierPattern.create(null, identifier(null, "z"))
                    ]), blockStatement(null, [returnStatement(null, khepri_expression.ConditionalExpression
                    .create(null, identifier(null, "x"), identifier(null, "y"), identifier(
                        null, "z")))]));
            case "FunctionExpression":
                return functionExpression(node.loc, node.id, node.params, node.body);
            case "ArrayExpression":
                return ecma_expression.ArrayExpression.create(node.loc, map(node.elements, transform));
            case "ObjectExpression":
                return ecma_expression.ObjectExpression.create(node.loc, map(node.properties, transform));
            case "ObjectValue":
                return ecma_value.ObjectValue.create(node.loc, transform(node.key), transform(node.value));
            case "ArgumentsPattern":
                return identifier(node.loc, node.id.name);
            case "IdentifierPattern":
                return identifier(node.loc, node.id.name);
            case "AsPattern":
            case "ArrayPattern":
            case "ObjectPattern":
                return transform(node.id);
            case "EllipsisPattern":
            case "SinkPattern":
                return (node.id ? identifier(node.loc, node.id) : null);
            case "Program":
                return ecma_program.Program.create(node.loc, (Array.isArray(node.body) ? map(node.body,
                    transform) : [transform(node.body)]));
            case "Package":
                return packageBlock(node.loc, node.exports, node.body);
        }
        return node;
    }));
    (exports.transform = transform);
}))