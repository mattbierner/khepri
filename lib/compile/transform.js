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
    var arrayPattern;
    var objectPattern = (function(base, pattern, key, f) {
        if ((key.type === "IdentifierPattern")) debugger;

        var k = ((key.type === "IdentifierPattern") ? khepri_value.Literal.create(null, "string", key.id.name) : key);
        var innerBase = khepri_expression.MemberExpression.create(null, base, k, true);
        if (!pattern) return f(khepri_value.Identifier.create(null, k.value), innerBase);

        switch (pattern.type) {
            case "IdentifierPattern":
                return f(khepri_value.Identifier.create(null, pattern.id.name), innerBase);
            case "ArrayPattern":
                var elements = map(pattern.elements, (function(x, i) {
                    return arrayPattern(innerBase, x, i);
                }));
                return (pattern.id.gen ? elements : concat([f(pattern.id, innerBase)], elements));
            case "ObjectPattern":
                var elements2 = reduce(pattern.elements, (function(p, c) {
                    return (function() {
                        {
                            var val = objectPattern(innerBase, c.value, c.key); {
                                return (val ? concat(p, val) : p);
                            }
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
                return khepri_declaration.VariableDeclarator.create(null, l, r);
            }); {
                return (function(base, pattern, key) {
                    return objectPattern(base, pattern, key, make);
                });
            }
        }
    })();
    var objectAssignmentPattern = (function() {
        {
            var make = (function(l, r) {
                return ecma_statement.ExpressionStatement.create(null, ecma_expression.AssignmentExpression.create(null, "=", l, r));
            }); {
                return (function(base, pattern, key) {
                    return objectPattern(base, pattern, key, make);
                });
            }
        }
    })();
    (arrayPattern = (function(base, pattern, index) {
        return objectDeclPattern(base, pattern, khepri_value.Literal.create(null, "number", index));
    }));
    var transform = (function(node) {
        if ((!node || !(node instanceof khepri_node.Node))) return node;

        switch (node.type) {
            case "CatchClause":
                return new ecma_clause.CatchClause(node.loc, transform(node.param), transform(node.body));
            case "SwitchCase":
                return new ecma_clause.SwitchCase(node.loc, transform(node.test), map(node.consequent, transform));
            case "BlockStatement":
                return new ecma_statement.BlockStatement(node.loc, map(node.body, transform));
            case "ExpressionStatement":
                return new ecma_statement.ExpressionStatement(node.loc, transform(node.expression));
            case "IfStatement":
                return new ecma_statement.IfStatement(node.loc, transform(node.test), transform(node.consequent), transform(node.alternate));
            case "WithStatement":
                var bindings = reduce(node.bindings, (function(p, imp) {
                    var base = imp.value;
                    if ((imp.type === "ImportPattern")) {
                        var base0 = ecma_expression.CallExpression.create(null, ecma_value.Identifier.create(null, "require"), [imp.from]);
                        switch (imp.pattern.type) {
                            case "IdentifierPattern":
                                return concat(p, khepri_declaration.VariableDeclarator.create(null, imp.pattern, base0));
                            case "ObjectPattern":
                                var b = khepri_value.Identifier.create(null, imp.from.name);
                                return concat(p, ecma_declaration.VariableDeclarator.create(null, transform(imp.pattern.id), base0), reduce(imp.pattern.elements, (function(p, c) {
                                    return (function() {
                                        {
                                            var val = objectDeclPattern(transform(imp.pattern.id), c.value, c.key); {
                                                return (val ? concat(p, val) : p);
                                            }
                                        }
                                    })();
                                }), []));
                        }
                        return p;
                    }

                    switch (imp.pattern.type) {
                        case "IdentifierPattern":
                            return concat(p, khepri_declaration.VariableDeclarator.create(null, imp.pattern, base));
                        case "ObjectPattern":
                            return concat(p, khepri_declaration.VariableDeclarator.create(null, imp.pattern.id, base), flatten(map(imp.pattern.elements, (function(c) {
                                return objectDeclPattern(imp.pattern.id, c.value, c.key);
                            }))));
                        case "ArrayPattern":
                            return concat(p, khepri_declaration.VariableDeclarator.create(null, imp.pattern.id, base), flatten(map(imp.pattern.elements, (function(c, i) {
                                return arrayPattern(imp.pattern.id, c, i);
                            }))));
                    }
                    return p;
                }), []);
                var prefix = (bindings.length ? khepri_declaration.VariableDeclaration.create(null, bindings) : []);
                return transform(khepri_statement.BlockStatement.create(node.body.loc, concat(prefix, node.body)));
            case "SwitchStatement":
                return new ecma_statement.SwitchStatement(node.loc, transform(node.discriminant), map(node.cases, transform));
            case "ReturnStatement":
                return new ecma_statement.ReturnStatement(node.loc, transform(node.argument));
            case "ThrowStatement":
                return new ecma_statement.ThrowStatement(node.loc, transform(node.argument));
            case "TryStatement":
                return new ecma_statement.TryStatement(node.loc, transform(node.block), transform(node.handler), transform(node.finalizer));
            case "WhileStatement":
                return new ecma_statement.WhileStatement(node.loc, transform(node.test), transform(node.body));
            case "DoWhileStatement":
                return new ecma_statement.DoWhileStatment(node.loc, transform(node.body), transform(node.test));
            case "ForStatement":
                return new ecma_statement.ForStatement(node.loc, transform(node.init), transform(node.test), transform(node.update), transform(node.body));
            case "AssignmentExpression":
                return new ecma_expression.AssignmentExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "UnaryExpression":
                return new ecma_expression.UnaryExpression(node.loc, node.operator, transform(node.argument));
            case "BinaryExpression":
                return new ecma_expression.BinaryExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "LogicalExpression":
                return new ecma_expression.LogicalExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "ConditionalExpression":
                return new ecma_expression.ConditionalExpression(node.loc, transform(node.test), transform(node.consequent), transform(node.alternate));
            case "NewExpression":
                return ecma_expression.NewExpression.create(node.loc, transform(node.callee), map(node.args, transform));
            case "CallExpression":
                return ecma_expression.CallExpression.create(node.loc, transform(node.callee), node.args.map(transform));
            case "MemberExpression":
                return ecma_expression.MemberExpression.create(node.loc, transform(node.object), transform(node.property), node.computed);
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
            case "LetExpression":
                return transform(khepri_expression.CallExpression.create(node.loc, khepri_expression.FunctionExpression.create(null, null, khepri_pattern.ParameterList.create(null, []), khepri_statement.BlockStatement.create(null, [khepri_statement.WithStatement.create(null, node.bindings, khepri_statement.BlockStatement.create(null, [khepri_statement.ReturnStatement.create(null, node.body)]))])), []));
            case "FunctionExpression":
                return (function() {
                    {
                        var params = reduce(transform(node.params), (function(p, c) {
                            if ((!c || (c.type === "EllipsisPattern"))) return p;

                            return p.concat([c]);
                        }), []),
                            prefix = reduce(node.params.patterns, (function(p, c) {
                                var base;
                                switch (c.type) {
                                    case "ArrayPattern":
                                        (base = khepri_value.Identifier.create(null, c.id.name));
                                        return concat(p, khepri_declaration.VariableDeclaration.create(null, reduce(c.elements, (function(p, c, i) {
                                            return (function() {
                                                {
                                                    var val = arrayPattern(base, c, i); {
                                                        return (val ? concat(p, val) : p);
                                                    }
                                                }
                                            })();
                                        }), [])));
                                    case "ObjectPattern":
                                        (base = khepri_value.Identifier.create(null, c.id.name));
                                        return concat(p, khepri_declaration.VariableDeclaration.create(null, reduce(c.elements, (function(p, c) {
                                            return (function() {
                                                {
                                                    var val = objectDeclPattern(base, c.value, c.key); {
                                                        return (val ? concat(p, val) : p);
                                                    }
                                                }
                                            })();
                                        }), [])));
                                }
                                return p;
                            }), []); {
                                return ecma_expression.FunctionExpression.create(node.loc, transform(node.id), params, transform(new khepri_statement.BlockStatement(node.body.loc, concat(prefix, node.body.body))));
                        }
                    }
                })();
            case "ParameterList":
                return map(node.patterns, transform);
            case "IdentifierPattern":
                return new ecma_value.Identifier(node.loc, node.id.name);
            case "ArrayPattern":
                return new ecma_value.Identifier(node.loc, node.id.name);
            case "ObjectPattern":
                return new ecma_value.Identifier(node.loc, node.id.name);
            case "EllipsisPattern":
                return null;
            case "Program":
                return ecma_program.Program.create(node.loc, (Array.isArray(node.body) ? map(node.body, transform) : [transform(node.body)]));
            case "Package":
                var imp = ((node.body.type === "WithStatement") ? node.body.bindings.filter((function(x) {
                    return (x.type === "ImportPattern");
                })) : []);
                var imports = map(imp, (function(x) {
                    return x.from;
                }));
                var exports = map(node.exports.exports, (function(x) {
                    return x.id;
                }));
                var exportHeader = ecma_declaration.VariableDeclaration.create(null, exports.map((function(x) {
                    return ecma_declaration.VariableDeclarator.create(null, x);
                })));
                var exportBody = exports.map((function(x) {
                    return ecma_statement.ExpressionStatement.create(null, ecma_expression.AssignmentExpression.create(null, "=", ecma_expression.MemberExpression.create(null, ecma_value.Identifier.create(null, "exports"), ecma_value.Identifier.create(null, x.name)), ecma_value.Identifier.create(null, x.name)));
                }));
                var fBody = transform(((node.body.type === "WithStatement") ? khepri_statement.WithStatement.create(null, node.body.bindings.map((function(x) {
                    return ((x.type !== "ImportPattern") ? x : khepri_declaration.Binding.create(null, x.pattern, x.pattern.id));
                })), node.body.body) : node.body));
                var body = ecma_expression.FunctionExpression.create(null, null, concat(ecma_value.Identifier.create(null, "require"), ecma_value.Identifier.create(null, "exports"), imp.map((function(x) {
                    return transform(x.pattern.id);
                }))), ecma_statement.BlockStatement.create(fBody.loc, concat(ecma_statement.ExpressionStatement.create(null, ecma_value.Literal.create(null, "string", "use strict")), exportHeader, fBody.body, exportBody)));
                return ecma_expression.CallExpression.create(node.loc, ecma_value.Identifier.create(null, "define"), [ecma_expression.ArrayExpression.create(null, concat(ecma_value.Literal.create(null, "string", "require"), ecma_value.Literal.create(null, "string", "exports"), imports)), body]);
            case "VariableDeclaration":
                return new ecma_declaration.VariableDeclaration(node.loc, map(node.declarations, transform));
            case "VariableDeclarator":
                return new ecma_declaration.VariableDeclarator(node.loc, transform(node.id), transform(node.init));
            case "StaticDeclaration":
                return new ecma_statement.EmptyStatement(node.loc);
        }
        return node;
    });
    return ({
        "transform": transform
    });
}));