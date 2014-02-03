/*
 * THIS FILE IS AUTO GENERATED from 'lib/transform.kep'
 * DO NOT EDIT
*/
"use strict";
var ecma_clause = require("ecma-ast")["clause"],
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
    khepri_pattern = require("khepri-ast")["pattern"],
    khepri_program = require("khepri-ast")["program"],
    khepri_statement = require("khepri-ast")["statement"],
    khepri_value = require("khepri-ast")["value"],
    transform, transformStage, concat = Function.prototype.call.bind(Array.prototype.concat),
    reduce = Function.prototype.call.bind(Array.prototype.reduce),
    filter = (function(f, a) {
        return Array.prototype.filter.call(a, f);
    }),
    map = (function(f, a) {
        return Array.prototype.map.call(a, f);
    }),
    flatten = (function(x) {
        return (Array.isArray(x) ? reduce(x, (function(p, c, _) {
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
    expressionStatement, _transform, packageManager, identifier = (function(loc, name) {
        return ecma_value.Identifier.create(loc, name);
    }),
    stringLiteral = (function(loc, value) {
        return ecma_value.Literal.create(loc, "string", value);
    }),
    nullLiteral = (function(loc) {
        return ecma_value.Literal.create(loc, "null", null);
    }),
    variableDeclaration = (function(loc, declarations) {
        return ecma_declaration.VariableDeclaration.create(loc, _transform(declarations));
    }),
    variableDeclarator = (function(loc, id, init) {
        return ecma_declaration.VariableDeclarator.create(loc, _transform(id), _transform(init));
    }),
    innerPattern = (function() {
        var objectElementUnpack = (function(base, pattern, key, f) {
            return (function() {
                var innerBase = khepri_expression.MemberExpression.create(null, base, key, true);
                return (pattern ? flatten(innerPattern(innerBase, pattern, f)) : f(identifier(null, key.value),
                    innerBase));
            })();
        });
        return (function(base, pattern, f) {
            switch (pattern.type) {
                case "IdentifierPattern":
                    return f(identifier(null, pattern.id.name), base);
                case "AsPattern":
                    return concat(f(pattern.id, base), flatten(innerPattern(pattern.id, pattern.target, f)));
                case "ObjectPattern":
                    return map((function(__o) {
                        var target = __o["target"],
                            key = __o["key"];
                        return flatten(objectElementUnpack(pattern.ud.id, target, key, f));
                    }), pattern.elements);
                default:
                    return [];
            }
        });
    })(),
    unpack = (function() {
        var make = variableDeclarator.bind(null, null);
        return (function(pattern, value) {
            return flatten(innerPattern(value, pattern, make));
        });
    })(),
    identifierPattern = (function(loc, name) {
        return identifier(loc, name);
    }),
    callExpression = (function(loc, callee, args) {
        return ecma_expression.CallExpression.create(loc, _transform(callee), _transform(args));
    }),
    memberExpression = (function(loc, object, property, computed) {
        return ecma_expression.MemberExpression.create(loc, _transform(object), _transform(property), computed);
    }),
    blockStatement = (function(loc, body) {
        return ecma_statement.BlockStatement.create(loc, _transform(body));
    });
(expressionStatement = (function(loc, expression) {
    return ecma_statement.ExpressionStatement.create(loc, _transform(expression));
}));
var returnStatement = (function(loc, argument) {
    return ecma_statement.ReturnStatement.create(loc, _transform(argument));
}),
    withStatement = (function(loc, bindings, body) {
        return (function() {
            var vars = flatten(map((function(imp) {
                var base = ((imp.type === "ImportPattern") ? packageManager.importPackage(imp.from.value) :
                    imp.value);
                return unpack(imp.pattern, base);
            }), bindings)),
                prefix = variableDeclaration(null, vars);
            return blockStatement(loc, concat(prefix, body.body));
        })();
    }),
    functionExpression = (function(loc, id, parameters, functionBody) {
        return (function() {
            var params = _transform(filter((function(x) {
                return (x.type !== "EllipsisPattern");
            }), parameters.elements)),
                elementsPrefix = flatten(map((function(x) {
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
                argumentsPrefix = concat((parameters.self ? variableDeclarator(null, _transform(parameters.self),
                    ecma_expression.ThisExpression.create(null)) : []), (parameters.id ? variableDeclarator(
                    null, _transform(parameters.id), identifier(null, "arguments")) : [])),
                body = ((functionBody.type === "BlockStatement") ? functionBody : khepri_statement.BlockStatement
                    .create(null, khepri_statement.ReturnStatement.create(null, functionBody))),
                strict = isStrict(body.body),
                prefix = concat(elementsPrefix, argumentsPrefix);
            return ecma_expression.FunctionExpression.create(loc, _transform(id), params, blockStatement(body.loc,
                concat((strict ? khepri_statement.ExpressionStatement.create(null, khepri_value.Literal.create(
                    null, "string", "use strict")) : []), variableDeclaration(null, prefix), (function() {
                    var block = _transform(body)
                        .body;
                    return (strict ? block.slice(1) : block);
                })())));
        })();
    }),
    letExpression = (function(loc, bindings, body) {
        return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(null, null, []),
            blockStatement(null, [withStatement(null, bindings, blockStatement(null, [returnStatement(null,
                body)]))])), []);
    }),
    curryExpression = (function(loc, base, args) {
        return callExpression(null, memberExpression(null, base, identifier(null, "bind")), concat(nullLiteral(null),
            args));
    }),
    assignmentExpression = (function(loc, operator, left, right) {
        return ecma_expression.AssignmentExpression.create(loc, operator, _transform(left), _transform(right));
    }),
    pipeline = (function(loc, value, target) {
        return callExpression(loc, target, [value]);
    }),
    singleCompose = (function(loc, f, g) {
        return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(null, null, [
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "f")), khepri_pattern.IdentifierPattern
            .create(null, identifier(null, "g"))
        ]), blockStatement(null, [returnStatement(null, functionExpression(null, null, khepri_pattern.ArgumentsPattern
            .create(null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null,
                "x"))]), blockStatement(null, [returnStatement(null, callExpression(null,
                identifier(null, "f"), [callExpression(null, identifier(null, "g"), [
                    identifier(null, "x")
                ])]))])))])), [f, g]);
    }),
    multiCompose = (function(loc, f, g) {
        return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(null, null, [
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "f")), khepri_pattern.IdentifierPattern
            .create(null, identifier(null, "g"))
        ]), blockStatement(null, [returnStatement(null, functionExpression(null, null, khepri_pattern.ArgumentsPattern
            .create(null, null, []), blockStatement(null, [returnStatement(null, callExpression(
                null, identifier(null, "f"), [callExpression(null, memberExpression(
                    null, identifier(null, "g"), identifier(null, "apply")), [
                    nullLiteral(null), identifier(null, "arguments")
                ])]))])))])), [f, g]);
    }),
    packageBlock = (function(loc, exports, body) {
        return (function() {
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
                fBody = ((body.type === "WithStatement") ? khepri_statement.WithStatement.create(null, filter((
                    function(x) {
                        return (x.type !== "ImportPattern");
                    }), body.bindings), body.body) : body);
            return _transform(packageManager.definePackage(loc, exportedNames, imports, targets, fBody));
        })();
    }),
    transformers = ({}),
    addTransform = (function(target, f) {
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
    return ecma_clause.SwitchCase.create(node.loc, _transform(node.test), _transform(node.consequent));
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
    return ecma_statement.SwitchStatement.create(node.loc, _transform(node.discriminant), _transform(node.cases));
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
    var op = node.operator;
    switch (op) {
        case "++":
            (op = "+");
            break;
        case "--":
            (op = "-");
            break;
    }
    return ecma_expression.UnaryExpression.create(node.loc, op, _transform(node.argument));
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
            return ecma_expression.BinaryExpression.create(node.loc, node.operator, _transform(node.left),
                _transform(node.right));
    }
}));
addTransform("LogicalExpression", (function(node) {
    return ecma_expression.LogicalExpression.create(node.loc, node.operator, _transform(node.left), _transform(
        node.right));
}));
addTransform("ConditionalExpression", (function(node) {
    return ecma_expression.ConditionalExpression.create(node.loc, _transform(node.test), _transform(node.consequent),
        _transform(node.alternate));
}));
addTransform("NewExpression", (function(node) {
    return ecma_expression.NewExpression.create(node.loc, _transform(node.callee), _transform(node.args));
}));
addTransform("CallExpression", (function(node) {
    return callExpression(node.loc, node.callee, node.args);
}));
addTransform("MemberExpression", (function(node) {
    return ecma_expression.MemberExpression.create(node.loc, _transform(node.object), _transform(node.property),
        node.computed);
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
    ]), blockStatement(null, [returnStatement(null, khepri_expression.UnaryExpression.create(null, node.op,
        identifier(null, "x")))]));
}));
addTransform("BinaryOperatorExpression", (function(node) {
    var kind = (((node.op === "||") || (node.op === "&&")) ? khepri_expression.LogicalExpression :
        khepri_expression.BinaryExpression);
    return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [
        khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")), khepri_pattern.IdentifierPattern
        .create(null, identifier(null, "y"))
    ]), blockStatement(null, [returnStatement(null, kind.create(null, node.op, identifier(null, "x"),
        identifier(null, "y")))]));
}));
addTransform("TernaryOperatorExpression", (function(node) {
    return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [
        khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")), khepri_pattern.IdentifierPattern
        .create(null, identifier(null, "y")), khepri_pattern.IdentifierPattern.create(null, identifier(
            null, "z"))
    ]), blockStatement(null, [returnStatement(null, khepri_expression.ConditionalExpression.create(null,
        identifier(null, "x"), identifier(null, "y"), identifier(null, "z")))]));
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
    if ((!node)) return node;
    if (Array.isArray(node)) return map(_transform, node);
    if ((!(node instanceof khepri_node.Node))) return node;
    var t = transformers[node.type];
    if ((!t)) return node;
    return t(node);
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
        "ast": _transform(ast)
    });
}));
(exports.transform = transform);
(exports.transformStage = transformStage);