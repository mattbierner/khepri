/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/transform.kep'
 * DO NOT EDIT
*/
;
define(["ecma_ast/clause", "ecma_ast/declaration", "ecma_ast/expression", "ecma_ast/node", "ecma_ast/program", "ecma_ast/statement", "ecma_ast/value", "khepri_ast/clause", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/node", "khepri_ast/pattern", "khepri_ast/program", "khepri_ast/statement", "khepri_ast/value"], (function(ecma_clause, ecma_declaration, ecma_expression, ecma_node, ecma_program, ecma_statement, ecma_value, khepri_clause, khepri_declaration, khepri_expression, khepri_node, khepri_pattern, khepri_program, khepri_statement, khepri_value) {
    var concat = Function.prototype.call.bind(Array.prototype.concat);
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var flatten = (function(x) {
        return reduce(x, (function(p, c) {
            return p.concat(c);
        }), []);
    });
    var transform;
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
        return ecma_declaration.VariableDeclaration.create(loc, map(declarations, transform));
    });
    var variableDeclarator = (function(loc, id, init) {
        return ecma_declaration.VariableDeclarator.create(loc, transform(id), transform(init));
    });
    var arrayPattern;
    var objectPattern = (function(base, pattern, key, f) {
        var k = ((key.type === "IdentifierPattern") ? stringLiteral(null, key.id.name) : key);
        var innerBase = khepri_expression.MemberExpression.create(null, base, k, true);
        if (!pattern) return f(identifier(null, k.value), innerBase);

        switch (pattern.type) {
            case "IdentifierPattern":
                return f(identifier(null, pattern.id.name), innerBase);
            case "ArrayPattern":
                var elements = map(pattern.elements, (function(x, i) {
                    return arrayPattern(innerBase, x, i);
                }));
                return (pattern.id.gen ? elements : concat([f(pattern.id, innerBase)], elements));
            case "ObjectPattern":
                var elements2 = reduce(pattern.elements, (function(p, c) {
                    return (function() {
                        {
                            var val = objectPattern(innerBase, c.target, c.key);
                            return (val ? concat(p, val) : p);
                        }
                    })();
                }), []);
                return (pattern.id.gen ? elements2 : concat([f(pattern.id, innerBase)], elements2));
            default:
                return null;
        }
    });
    var objectDeclPattern = (function() {
        {
            var make = (function(l, r) {
                return variableDeclarator(null, l, r);
            });
            return (function(base, pattern, key) {
                return objectPattern(base, pattern, key, make);
            });
        }
    })();
    var objectAssignmentPattern = (function() {
        {
            var make = (function(l, r) {
                return expressionStatement(null, ecma_expression.AssignmentExpression.create(null, "=", l, r));
            });
            return (function(base, pattern, key) {
                return objectPattern(base, pattern, key, make);
            });
        }
    })();
    (arrayPattern = (function(base, pattern, index) {
        return objectDeclPattern(base, pattern, khepri_value.Literal.create(null, "number", index));
    }));
    var identifierPattern = (function(loc, name) {
        return identifier(loc, name);
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
        var vars = reduce(bindings, (function(p, imp) {
            var base = imp.value;
            if ((imp.type === "ImportPattern")) {
                var base0 = ecma_expression.CallExpression.create(null, identifier(null, "require"), [imp.from]);
                switch (imp.pattern.type) {
                    case "IdentifierPattern":
                        return concat(p, variableDeclarator(null, imp.pattern, base0));
                    case "ObjectPattern":
                        return concat(p, variableDeclarator(null, imp.pattern.id, base0), reduce(imp.pattern.elements, (function(p, c) {
                            return (function() {
                                {
                                    var val = objectDeclPattern(transform(imp.pattern.id), c.target, c.key);
                                    return (val ? concat(p, val) : p);
                                }
                            })();
                        }), []));
                }
                return p;
            }

            switch (imp.pattern.type) {
                case "IdentifierPattern":
                    return concat(p, variableDeclarator(null, imp.pattern, base));
                case "ObjectPattern":
                    return concat(p, variableDeclarator(null, imp.pattern.id, base), flatten(map(imp.pattern.elements, (function(c) {
                        return objectDeclPattern(imp.pattern.id, c.target, c.key);
                    }))));
                case "ArrayPattern":
                    return concat(p, variableDeclarator(null, imp.pattern.id, base), flatten(map(imp.pattern.elements, (function(c, i) {
                        return arrayPattern(imp.pattern.id, c, i);
                    }))));
            }
            return p;
        }), []);
        var prefix = (vars.length ? variableDeclaration(null, vars) : []);
        return blockStatement(loc, concat(prefix, body.body));
    });
    var functionExpression = (function(loc, id, parameters, body) {
        return (function() {
            {
                var params = reduce(transform(parameters.elements), (function(p, c) {
                    if ((!c || (c.type === "EllipsisPattern"))) return p;

                    return p.concat([transform(c)]);
                }), []),
                    prefix = reduce(parameters.elements, (function(p, c) {
                        var base;
                        switch (c.type) {
                            case "ArrayPattern":
                                (base = transform(c.id));
                                return concat(p, variableDeclaration(null, reduce(c.elements, (function(p, c, i) {
                                    return (function() {
                                        {
                                            var val = arrayPattern(base, c, i);
                                            return (val ? concat(p, val) : p);
                                        }
                                    })();
                                }), [])));
                            case "ObjectPattern":
                                (base = transform(c.id));
                                return concat(p, variableDeclaration(null, reduce(c.elements, (function(p, c) {
                                    return (function() {
                                        {
                                            var val = objectDeclPattern(base, c.target, c.key);
                                            return (val ? concat(p, val) : p);
                                        }
                                    })();
                                }), [])));
                        }
                        return p;
                    }), (parameters.id ? [variableDeclaration(null, [variableDeclarator(null, parameters.id, identifier(null, "arguments"))])] : []));
                return ecma_expression.FunctionExpression.create(loc, transform(id), params, blockStatement(body.loc, concat(prefix, transform(body).body)));
            }
        })();
    });
    var callExpression = (function(loc, callee, args) {
        return ecma_expression.CallExpression.create(loc, transform(callee), map(args, transform));
    });
    var memberExpression = (function(loc, object, property, computed) {
        return ecma_expression.MemberExpression.create(loc, transform(object), transform(property), computed);
    });
    var letExpression = (function(loc, bindings, body) {
        return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(null, null, []), blockStatement(null, [withStatement(null, bindings, blockStatement(null, [returnStatement(null, body)]))])), []);
    });
    var curryExpression = (function(loc, base, args) {
        return ((args.length === 0) ? transform(base) : callExpression(null, memberExpression(null, base, identifier(null, "bind")), concat(nullLiteral(null), args)));
    });
    var assignmentExpression = (function(loc, operator, left, right) {
        return ecma_expression.AssignmentExpression.create(loc, operator, transform(left), transform(right));
    });
    var pipeline = (function(loc, value, target) {
        return callExpression(loc, target, [value]);
    });
    var singleCompose = (function(loc, f, g) {
        return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "f")), khepri_pattern.IdentifierPattern.create(null, identifier(null, "g"))]), blockStatement(null, [returnStatement(null, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))]), blockStatement(null, [returnStatement(null, callExpression(null, identifier(null, "f"), [callExpression(null, identifier(null, "g"), [identifier(null, "x")])]))])))])), [f, g]);
    });
    var multiCompose = (function(loc, f, g) {
        return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "f")), khepri_pattern.IdentifierPattern.create(null, identifier(null, "g"))]), blockStatement(null, [returnStatement(null, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(null, null, []), blockStatement(null, [returnStatement(null, callExpression(null, identifier(null, "f"), [callExpression(null, memberExpression(null, identifier(null, "g"), identifier(null, "apply")), [nullLiteral(null), identifier(null, "arguments")])]))])))])), [f, g]);
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
                        return x.id;
                    })),
                    exportHeader = ecma_declaration.VariableDeclaration.create(null, map(exportList, (function(x) {
                        return variableDeclarator(null, x);
                    }))),
                    exportBody = exportList.map((function(x) {
                        return expressionStatement(null, ecma_expression.AssignmentExpression.create(null, "=", memberExpression(null, identifier(null, "exports"), identifier(null, x.name)), identifier(null, x.name)));
                    })),
                    fBody = ((body.type === "WithStatement") ? withStatement(null, map(body.bindings, (function(x) {
                        return ((x.type !== "ImportPattern") ? x : khepri_declaration.Binding.create(null, x.pattern, x.pattern.id));
                    })), body.body) : transform(body)),
                    packageBody = ecma_expression.FunctionExpression.create(null, null, concat(identifier(null, "require"), identifier(null, "exports"), imp.map((function(x) {
                        return transform(x.pattern);
                    }))), blockStatement(fBody.loc, concat(expressionStatement(null, stringLiteral(null, "use strict")), exportHeader, fBody.body, exportBody)));
                return callExpression(loc, identifier(null, "define"), [ecma_expression.ArrayExpression.create(null, concat(stringLiteral(null, "require"), stringLiteral(null, "exports"), imports)), packageBody]);
            }
        })();
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
                return new(ecma_clause.SwitchCase)(node.loc, transform(node.test), map(node.consequent, transform));
            case "BlockStatement":
                return blockStatement(node.loc, node.body);
            case "ExpressionStatement":
                return expressionStatement(node.loc, node.expression);
            case "IfStatement":
                return new(ecma_statement.IfStatement)(node.loc, transform(node.test), transform(node.consequent), transform(node.alternate));
            case "WithStatement":
                return withStatement(node.loc, node.bindings, node.body);
            case "SwitchStatement":
                return new(ecma_statement.SwitchStatement)(node.loc, transform(node.discriminant), map(node.cases, transform));
            case "ReturnStatement":
                return returnStatement(node.loc, node.argument);
            case "ThrowStatement":
                return new(ecma_statement.ThrowStatement)(node.loc, transform(node.argument));
            case "BreakStatement":
                return ecma_statement.BreakStatement.create(node.loc, null);
            case "ContinueStatement":
                return ecma_statement.ThrowStatement.create(node.loc, null);
            case "TryStatement":
                return new(ecma_statement.TryStatement)(node.loc, transform(node.block), transform(node.handler), transform(node.finalizer));
            case "WhileStatement":
                return new(ecma_statement.WhileStatement)(node.loc, transform(node.test), transform(node.body));
            case "DoWhileStatement":
                return new(ecma_statement.DoWhileStatement)(node.loc, transform(node.body), transform(node.test));
            case "ForStatement":
                return new(ecma_statement.ForStatement)(node.loc, transform(node.init), transform(node.test), transform(node.update), transform(node.body));
            case "AssignmentExpression":
                return assignmentExpression(node.loc, node.operator, node.left, node.right);
            case "UnaryExpression":
                return new(ecma_expression.UnaryExpression)(node.loc, node.operator, transform(node.argument));
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
                        return ecma_expression.BinaryExpression.create(node.loc, node.operator, transform(node.left), transform(node.right));
                }
            case "LogicalExpression":
                return new(ecma_expression.LogicalExpression)(node.loc, node.operator, transform(node.left), transform(node.right));
            case "ConditionalExpression":
                return new(ecma_expression.ConditionalExpression)(node.loc, transform(node.test), transform(node.consequent), transform(node.alternate));
            case "NewExpression":
                return ecma_expression.NewExpression.create(node.loc, transform(node.callee), map(node.args, transform));
            case "CallExpression":
                return callExpression(node.loc, node.callee, node.args);
            case "MemberExpression":
                return ecma_expression.MemberExpression.create(node.loc, transform(node.object), transform(node.property), node.computed);
            case "LetExpression":
                return letExpression(node.loc, node.bindings, node.body);
            case "CurryExpression":
                return curryExpression(node.loc, node.base, node.args);
            case "UnaryOperatorExpression":
                return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))]), blockStatement(null, [returnStatement(null, khepri_expression.UnaryExpression.create(null, node.op, identifier(null, "x")))]));
            case "BinaryOperatorExpression":
                var kind = (((node.op === "||") || (node.op === "&&")) ? khepri_expression.LogicalExpression : khepri_expression.BinaryExpression);
                return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")), khepri_pattern.IdentifierPattern.create(null, identifier(null, "y"))]), blockStatement(null, [returnStatement(null, kind.create(null, node.op, identifier(null, "x"), identifier(null, "y")))]));
            case "TernaryOperatorExpression":
                return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")), khepri_pattern.IdentifierPattern.create(null, identifier(null, "y")), khepri_pattern.IdentifierPattern.create(null, identifier(null, "z"))]), blockStatement(null, [returnStatement(null, khepri_expression.ConditionalExpression.create(null, identifier(null, "x"), identifier(null, "y"), identifier(null, "z")))]));
            case "FunctionExpression":
                return functionExpression(node.loc, node.id, node.params, node.body);
            case "ArrayExpression":
                return ecma_expression.ArrayExpression.create(node.loc, map(node.elements, transform));
            case "ObjectExpression":
                return ecma_expression.ObjectExpression.create(node.loc, map(node.properties, (function(x) {
                    return ({
                        "kind": x.kind,
                        "key": transform(x.key),
                        "value": transform(x.value)
                    });
                })));
            case "ArgumentsPattern":
                return identifier(node.loc, node.id.name);
            case "IdentifierPattern":
                return identifier(node.loc, node.id.name);
            case "ArrayPattern":
            case "ObjectPattern":
                return transform(node.id);
            case "EllipsisPattern":
                return null;
            case "SinkPattern":
                return (node.id ? identifier(node.loc, node.id) : null);
            case "Program":
                return ecma_program.Program.create(node.loc, (Array.isArray(node.body) ? map(node.body, transform) : [transform(node.body)]));
            case "Package":
                return packageBlock(node.loc, node.exports, node.body);
        }
        return node;
    }));
    return ({
        "transform": transform
    });
}));