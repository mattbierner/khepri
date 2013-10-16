/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "nu/stream", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/statement", "khepri_ast/pattern", "khepri/position", "khepri/parse/common", "khepri/parse/token_parser", "khepri/parse/program_parser", "khepri/parse/value_parser", "khepri/parse/pattern_parser"], (function(require, exports, __o, __o0, __o1, ast_declaration, ast_expression, ast_statement, ast_pattern, __o2, __o3, __o4, _, __o5, pattern) {
    "use strict";
    var arrayElement, arrayElements, arrayLiteral, propertyName, propertySetParameterList, propertyValueInitializer, propertyGetInitializer, propertySetInitializer, propertyInitializer, objectProperties, objectLiteral, primaryExpression, thisExpression, args, argumentList, dotAccessor, bracketAccessor, accessor, memberExpression, newExpression, leftHandSideExpression, leftHandReferenceExpression, unaryOperator, unaryExpression, binaryExpression, conditionalExpression, letExpression, assignmentOperator, assignmentExpression, expression;
    var __o = __o,
        always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        expected = __o["expected"],
        lookahead = __o["lookahead"],
        many = __o["many"],
        memo = __o["memo"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        __o0 = __o0,
        between = __o0["between"],
        sepBy = __o0["sepBy"],
        sepBy1 = __o0["sepBy1"],
        then = __o0["then"],
        __o1 = __o1,
        foldl = __o1["foldl"],
        foldr = __o1["foldr"],
        ast_declaration = ast_declaration,
        ast_expression = ast_expression,
        ast_statement = ast_statement,
        ast_pattern = ast_pattern,
        __o2 = __o2,
        SourceLocation = __o2["SourceLocation"],
        __o3 = __o3,
        node = __o3["node"],
        nodea = __o3["nodea"],
        precedence = __o3["precedence"],
        __o4 = __o4,
        keyword = __o4["keyword"],
        punctuator = __o4["punctuator"],
        _ = _,
        __o5 = __o5,
        identifier = __o5["identifier"],
        literal = __o5["literal"],
        stringLiteral = __o5["stringLiteral"],
        pattern = pattern; {
            var sourceElements = (function() {
                {
                    var __o6 = require("khepri/parse/program_parser"),
                        sourceElements = __o6["sourceElements"]; {
                            return sourceElements.apply(undefined, arguments);
                    }
                }
            });
            (expression = (function() {
                return expression.apply(undefined, arguments);
            }));
            (conditionalExpression = (function() {
                return conditionalExpression.apply(undefined, arguments);
            }));
            (newExpression = (function() {
                return newExpression.apply(undefined, arguments);
            }));
            var functionBody = node(sourceElements, ast_statement.BlockStatement.create);
            (arrayElement = Parser("Array Element", expression));
            (arrayElements = Parser("Array Elements", eager(sepBy(punctuator(","), expected("array element", arrayElement)))));
            (arrayLiteral = Parser("Array Literal", node(between(punctuator("["), punctuator("]"), arrayElements), ast_expression.ArrayExpression.create)));
            (propertyName = Parser("Property Name", stringLiteral));
            (propertySetParameterList = bind(identifier, (function(x) {
                return always([x]);
            })));
            (propertyValueInitializer = Parser("Property Value Initializer", nodea(enumeration(propertyName, punctuator(":"), expression), (function(loc, name, _, value) {
                return ({
                    "loc": loc,
                    "key": name,
                    "kind": "init",
                    "value": value
                });
            }))));
            (propertyGetInitializer = Parser("Property Get Initializer", nodea(next(keyword("get"), enumeration(propertyName, punctuator("("), punctuator(")"), between(punctuator("{"), punctuator("}"), functionBody))), (function(loc, name, _0, _1, body) {
                return ({
                    "loc": loc,
                    "key": name,
                    "kind": "get",
                    "value": ast_expression.FunctionExpression.create(loc, null, [], body)
                });
            }))));
            (propertySetInitializer = Parser("Property Set Initializer", nodea(next(keyword("set"), enumeration(propertyName, between(punctuator("("), punctuator(")"), propertySetParameterList), between(punctuator("{"), punctuator("}"), functionBody))), (function(loc, name, parameters, body) {
                return ({
                    "loc": loc,
                    "key": name,
                    "kind": "set",
                    "value": ast_expression.FunctionExpression.create(loc, null, parameters, body)
                });
            }))));
            (propertyInitializer = Parser("Property Initializer", choice(attempt(propertyValueInitializer), propertyGetInitializer, propertySetInitializer)));
            (objectProperties = Parser("Object Properties", eager(sepBy(punctuator(","), propertyInitializer))));
            (objectLiteral = Parser("Object Literal", node(between(punctuator("{"), punctuator("}"), objectProperties), ast_expression.ObjectExpression.create)));
            var parameter = expected("pattern", pattern.pattern);
            var formalParameterList = node(eager(sepBy(punctuator(","), parameter)), ast_pattern.ParameterList.create);
            var ecmaFunctionExpression = nodea(next(keyword("function"), enumeration(optional(null, identifier), between(punctuator("("), punctuator(")"), formalParameterList), between(punctuator("{"), punctuator("}"), functionBody))), ast_expression.FunctionExpression.create);
            var lambdaFormalParameterList = either(between(punctuator("("), punctuator(")"), formalParameterList), formalParameterList);
            var lambdaBody = either(between(punctuator("{"), punctuator("}"), functionBody), node(expression, (function(loc, x) {
                return ast_statement.BlockStatement.create(loc, [ast_statement.ReturnStatement.create(null, x)]);
            })));
            var lambdaFunctionExpression = nodea(next(punctuator("\\"), enumeration(lambdaFormalParameterList, next(punctuator("->"), lambdaBody))), (function(loc, parameters, body) {
                return ast_expression.FunctionExpression.create(loc, null, parameters, body);
            }));
            var functionExpression = Parser("Function Expression", either(ecmaFunctionExpression, lambdaFunctionExpression));
            var thisExpression0 = node(keyword("this"), ast_expression.ThisExpression.create);
            var letIdentifier = expected("Any pattern", pattern.pattern);
            var letBinding = Parser("Let Binding", nodea(enumeration(then(letIdentifier, punctuator("=")), expected("expression", conditionalExpression)), ast_declaration.Binding.create));
            var letExpression0 = Parser("Let Expression", (function() {
                {
                    var letBindings = expected("let bindings", sepBy1(punctuator(","), letBinding)),
                        letBody = expected("expression", conditionalExpression); {
                            return nodea(next(keyword("let"), enumeration(eager(letBindings), next(keyword("in"), letBody))), ast_expression.LetExpression.create);
                    }
                }
            })());
            (primaryExpression = Parser("Primary Expression", choice(thisExpression0, letExpression0, identifier, between(punctuator("("), punctuator(")"), expression), literal, arrayLiteral, objectLiteral, functionExpression)));
            var argumentList0 = Parser("Argument List", eager(sepBy(punctuator(","), expected("expression", expression))));
            (args = Parser("Arguments", node(between(punctuator("("), punctuator(")"), argumentList0), (function(loc, args) {
                (args.loc = loc);
                (args.argument = true);
                return args;
            }))));
            (dotAccessor = Parser("Dot Accessor", node(next(punctuator("."), identifier), (function(loc, x) {
                return [({
                    "loc": loc,
                    "property": x,
                    "computed": false
                })];
            }))));
            (bracketAccessor = Parser("Bracket Accessor", bind(between(punctuator("["), punctuator("]"), eager(sepBy1(punctuator(","), expression))), (function(accessor) {
                return always(accessor.map((function(x) {
                    return ({
                        "loc": x.loc,
                        "property": x,
                        "computed": true
                    });
                })));
            }))));
            (accessor = Parser("Accessor", either(dotAccessor, bracketAccessor)));
            var accessorReducer = (function(p, c) {
                return ast_expression.MemberExpression.create(SourceLocation.merge(p.loc, c.loc), p, c.property, c.computed);
            });
            var memberExpression0 = (function() {
                {
                    var reducer = (function(p, c) {
                        return c.reduce(accessorReducer, p);
                    }); {
                        return Parser("Member Expression", binds(enumeration(either(newExpression, primaryExpression), many(accessor)), (function(expression, props) {
                            return always(foldl(reducer, expression, props));
                        })));
                    }
                }
            })();
            (newExpression = Parser("New Expression", nodea(next(keyword("new"), enumeration(expected("member expression", memberExpression0), optional([], args))), ast_expression.NewExpression.create)));
            (leftHandSideExpression = (function() {
                {
                    var reducer = (function(p, c) {
                        return ((c && c.hasOwnProperty("argument")) ? ast_expression.CallExpression.create(SourceLocation.merge(p.loc, c.loc), p, c) : c.reduce(accessorReducer, p));
                    }); {
                        return Parser("Left Hand Side Expression", binds(enumeration(memo(memberExpression0), many(either(args, accessor))), (function(member, accessors) {
                            return always(foldl(reducer, member, accessors));
                        })));
                    }
                }
            })());
            (leftHandReferenceExpression = (function() {
                {
                    var reducer = (function(p, c) {
                        return c.reduce(accessorReducer, p);
                    }); {
                        return Parser("Left Hand Reference Expression", binds(enumeration(choice(thisExpression0, identifier), many(accessor)), (function(expression, props) {
                            return always(foldl(reducer, expression, props));
                        })));
                    }
                }
            })());
            (unaryOperator = Parser("Unary Operator", choice(keyword("delete", "void", "typeof"), punctuator("+", "-", "~", "!"))));
            (unaryExpression = (function() {
                {
                    var reducer = (function(argument, op) {
                        return ast_expression.UnaryExpression.create(SourceLocation.merge(op.loc, argument.loc), op.value, argument);
                    }); {
                        return Parser("Unary Expression", binds(enumeration(many(unaryOperator), expected("left hand side expression", leftHandSideExpression)), (function(ops, expression) {
                            return always(foldr(reducer, expression, ops));
                        })));
                    }
                }
            })());
            var multiplicativeOperator = punctuator("*", "/", "%");
            var additiveOperator = punctuator("+", "-");
            var shiftOperator = punctuator("<<", ">>", ">>>");
            var relationalOperator = either(punctuator("<", ">", "<=", ">="), keyword("instanceof"));
            var equalityOperator = punctuator("==", "!=", "===", "!==");
            var bitwiseANDOperator = punctuator("&");
            var bitwiseXOROperator = punctuator("^");
            var bitwiseOROperator = punctuator("|");
            var logicalANDOperator = punctuator("&&");
            var logicalOROperator = punctuator("||");
            var precedenceTable = [({
                "sep": multiplicativeOperator,
                "precedence": 1,
                "node": ast_expression.BinaryExpression
            }), ({
                "sep": additiveOperator,
                "precedence": 2,
                "node": ast_expression.BinaryExpression
            }), ({
                "sep": shiftOperator,
                "precedence": 3,
                "node": ast_expression.BinaryExpression
            }), ({
                "sep": equalityOperator,
                "precedence": 5,
                "node": ast_expression.BinaryExpression
            }), ({
                "sep": bitwiseANDOperator,
                "precedence": 6,
                "node": ast_expression.BinaryExpression
            }), ({
                "sep": bitwiseXOROperator,
                "precedence": 7,
                "node": ast_expression.BinaryExpression
            }), ({
                "sep": bitwiseOROperator,
                "precedence": 8,
                "node": ast_expression.BinaryExpression
            }), ({
                "sep": logicalOROperator,
                "precedence": 9,
                "node": ast_expression.LogicalExpression
            }), ({
                "sep": logicalANDOperator,
                "precedence": 10,
                "node": ast_expression.LogicalExpression
            }), ({
                "sep": relationalOperator,
                "precedence": 4,
                "node": ast_expression.BinaryExpression
            })];
            var binaryExpression0 = Parser("Binary Expression", precedence(unaryExpression, precedenceTable));
            (conditionalExpression = (function() {
                {
                    var conditionalBody = next(punctuator("?"), enumeration(expected("expression", expression), punctuator(":"), expected("expression", expression))); {
                        return bind(binaryExpression0, (function(bin) {
                            return optional(bin, nodea(conditionalBody, (function(loc, consequent, _1, alternate) {
                                return ast_expression.ConditionalExpression.create(loc, bin, consequent, alternate);
                            })));
                        }));
                    }
                }
            })());
            (assignmentOperator = Parser("Assignment Operator", punctuator("=", "*=", "*=", "/=", "%=", "+=", "-=", "<<=", ">>=", ">>>=", "&=", "^=", "|=")));
            (assignmentExpression = Parser("Assignment Expression", nodea(enumeration(leftHandReferenceExpression, assignmentOperator, expected("expression", expression)), (function(loc, left, op, right) {
                return ast_expression.AssignmentExpression.create(loc, op.value, left, right);
            }))));
            (expression = conditionalExpression);
    }
    (exports.arrayElement = arrayElement);
    (exports.arrayElements = arrayElements);
    (exports.arrayLiteral = arrayLiteral);
    (exports.propertyName = propertyName);
    (exports.propertySetParameterList = propertySetParameterList);
    (exports.propertyValueInitializer = propertyValueInitializer);
    (exports.propertyGetInitializer = propertyGetInitializer);
    (exports.propertySetInitializer = propertySetInitializer);
    (exports.propertyInitializer = propertyInitializer);
    (exports.objectProperties = objectProperties);
    (exports.objectLiteral = objectLiteral);
    (exports.primaryExpression = primaryExpression);
    (exports.thisExpression = thisExpression);
    (exports.args = args);
    (exports.argumentList = argumentList);
    (exports.dotAccessor = dotAccessor);
    (exports.bracketAccessor = bracketAccessor);
    (exports.accessor = accessor);
    (exports.memberExpression = memberExpression);
    (exports.newExpression = newExpression);
    (exports.leftHandSideExpression = leftHandSideExpression);
    (exports.leftHandReferenceExpression = leftHandReferenceExpression);
    (exports.unaryOperator = unaryOperator);
    (exports.unaryExpression = unaryExpression);
    (exports.binaryExpression = binaryExpression);
    (exports.conditionalExpression = conditionalExpression);
    (exports.letExpression = letExpression);
    (exports.assignmentOperator = assignmentOperator);
    (exports.assignmentExpression = assignmentExpression);
    (exports.expression = expression);
}))