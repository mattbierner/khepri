/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "nu/stream", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/statement", "khepri_ast/pattern", "khepri_ast/value", "khepri/position", "khepri/parse/common", "khepri/parse/token_parser", "khepri/parse/program_parser", "khepri/parse/value_parser", "khepri/parse/pattern_parser", "khepri/parse/shared"], (function(require, exports, __o, __o0, __o1, ast_declaration, ast_expression, ast_statement, ast_pattern, ast_value, __o2, __o3, __o4, program_parser, __o5, pattern, __o6) {
    "use strict";
    var arrayElement, arrayElements, arrayLiteral, propertyName, propertyInitializer, objectProperties, objectLiteral, curryExpression, primaryExpression, thisExpression, args, argumentList, dotAccessor, bracketAccessor, accessor, memberExpression, newExpression, leftHandSideExpression, leftHandReferenceExpression, unaryOperator, unaryExpression, binaryExpression, conditionalExpression, letExpression, assignmentOperator, assignmentExpression, composeExpression, expression, topLevelExpression;
    var __o = __o,
        always = __o["always"],
        append = __o["append"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        cons = __o["cons"],
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
        reduce = __o1["reduce"],
        ast_declaration = ast_declaration,
        ast_expression = ast_expression,
        ast_statement = ast_statement,
        ast_pattern = ast_pattern,
        ast_value = ast_value,
        __o2 = __o2,
        SourceLocation = __o2["SourceLocation"],
        __o3 = __o3,
        node = __o3["node"],
        nodea = __o3["nodea"],
        precedence = __o3["precedence"],
        __o4 = __o4,
        keyword = __o4["keyword"],
        punctuator = __o4["punctuator"],
        program_parser = program_parser,
        __o5 = __o5,
        identifier = __o5["identifier"],
        booleanLiteral = __o5["booleanLiteral"],
        nullLiteral = __o5["nullLiteral"],
        numericLiteral = __o5["numericLiteral"],
        stringLiteral = __o5["stringLiteral"],
        regularExpressionLiteral = __o5["regularExpressionLiteral"],
        pattern = pattern,
        __o6 = __o6,
        logicalComma = __o6["logicalComma"];
    var sourceElements = (function() {
        var args = arguments; {
            var __o7 = require("khepri/parse/program_parser"),
                sourceElements = __o7["sourceElements"];
            return sourceElements.apply(undefined, args);
        }
    });
    (expression = (function() {
        var args = arguments;
        return expression.apply(undefined, args);
    }));
    (conditionalExpression = (function() {
        var args = arguments;
        return conditionalExpression.apply(undefined, args);
    }));
    (newExpression = (function() {
        var args = arguments;
        return newExpression.apply(undefined, args);
    }));
    (binaryExpression = (function() {
        var args = arguments;
        return binaryExpression.apply(undefined, args);
    }));
    (arrayElement = Parser("Array Element", expression));
    (arrayElements = Parser("Array Elements", eager(sepBy(punctuator(","), expected("array element", arrayElement)))));
    (arrayLiteral = Parser("Array Literal", node(between(punctuator("["), punctuator("]"), arrayElements), ast_expression.ArrayExpression.create)));
    (propertyName = Parser("Property Name", stringLiteral));
    (propertyInitializer = Parser("Property Initializer", nodea(enumeration(propertyName, next(punctuator(":"), expression)), ast_value.ObjectValue.create)));
    (objectProperties = Parser("Object Properties", eager(sepBy(punctuator(","), propertyInitializer))));
    (objectLiteral = Parser("Object Literal", node(between(punctuator("{"), punctuator("}"), objectProperties), ast_expression.ObjectExpression.create)));
    var formalParameterList = pattern.argumentsPattern;
    var functionBody = node(between(punctuator("{"), punctuator("}"), sourceElements), ast_statement.BlockStatement.create);
    var lambdaBody = node(conditionalExpression, (function(loc, x) {
        return ast_statement.BlockStatement.create(loc, [ast_statement.ReturnStatement.create(null, x)]);
    }));
    var lambdaFunctionBody = either(functionBody, lambdaBody);
    var lambdaFunctionExpression = nodea(next(punctuator("\\"), enumeration(formalParameterList, next(punctuator("->"), lambdaFunctionBody))), (function(loc, parameters, body) {
        return ast_expression.FunctionExpression.create(loc, null, parameters, body);
    }));
    var ecmaFunctionExpression = nodea(next(keyword("function"), cons(optional(null, identifier), either(enumeration(between(punctuator("("), punctuator(")"), formalParameterList), functionBody), next(punctuator("\\"), enumeration(formalParameterList, next(punctuator("->"), lambdaFunctionBody)))))), ast_expression.FunctionExpression.create);
    var functionExpression = Parser("Function Expression", either(ecmaFunctionExpression, lambdaFunctionExpression));
    (thisExpression = node(keyword("this"), ast_expression.ThisExpression.create));
    var letIdentifier = expected("Any pattern", pattern.pattern);
    var letBinding = Parser("Let Binding", nodea(enumeration(then(letIdentifier, punctuator("=")), expected.bind(null, "expression")(expression)), ast_declaration.Binding.create));
    (letExpression = Parser("Let Expression", (function() {
        {
            var letBindings = expected("let bindings", sepBy1(punctuator(","), letBinding)),
                letBody = expected.bind(null, "expression")(expression);
            return nodea(next(keyword("let"), enumeration(eager(letBindings), next(keyword("in"), letBody))), ast_expression.LetExpression.create);
        }
    }).call(this)));
    var unaryOperatorExpression = Parser("Unary Operator Expression", bind(either(keyword("typeof"), punctuator("void", "~", "!")), (function(__o7) {
        var __o7 = __o7,
            loc = __o7["loc"],
            value = __o7["value"];
        return always(ast_expression.UnaryOperatorExpression.create(loc, value));
    })));
    var binaryOperatorExpression = Parser("Binary Operator Expression", bind(either(keyword("instanceof"), punctuator("*", "/", "+", "-", "%", "<<", ">>", ">>>", "<", ">", "<=", ">=", "==", "!=", "===", "!==", "&", "^", "|", "||", "&&", "\\>", "|>")), (function(__o7) {
        var __o7 = __o7,
            loc = __o7["loc"],
            value = __o7["value"];
        return always(ast_expression.BinaryOperatorExpression.create(loc, value));
    })));
    var ternayOperatorExpression = Parser("Ternary Operator Expression", bind(punctuator("?"), (function(__o7) {
        var __o7 = __o7,
            loc = __o7["loc"],
            value = __o7["value"];
        return always(ast_expression.TernaryOperatorExpression.create(loc, value));
    })));
    var operatorExpression = Parser("Operator Expression", choice(unaryOperatorExpression, binaryOperatorExpression, ternayOperatorExpression));
    (curryExpression = Parser("Curry Expression", (function() {
        {
            var base = expected("expression", either(attempt(expression), operatorExpression));
            return between(punctuator("("), punctuator(")"), nodea(enumeration(base, optional([], next(punctuator(","), eager(sepBy(punctuator(","), expression))))), (function(loc, base, elements) {
                return (elements.length ? ast_expression.CurryExpression.create(loc, base, elements) : base);
            })));
        }
    }).call(this)));
    var literal = Parser.bind(null, "Literal")(choice(nullLiteral, booleanLiteral, numericLiteral, stringLiteral, regularExpressionLiteral));
    (primaryExpression = Parser("Primary Expression", choice(thisExpression, letExpression, identifier, curryExpression, literal, arrayLiteral, objectLiteral, functionExpression)));
    (argumentList = Parser("Argument List", eager(sepBy(logicalComma, expected("expression", expression)))));
    (args = Parser("Arguments", node(between(punctuator("("), punctuator(")"), argumentList), (function(loc, args) {
        (args.loc = loc);
        (args.argument = true);
        return args;
    }))));
    (dotAccessor = Parser("Dot Accessor", node(next(punctuator("."), identifier), (function(loc, x) {
        return ({
            "loc": loc,
            "property": x,
            "computed": false
        });
    }))));
    (bracketAccessor = Parser("Bracket Accessor", node(between(punctuator("["), punctuator("]"), expression), (function(loc, x) {
        return ({
            "loc": loc,
            "property": x,
            "computed": true
        });
    }))));
    (accessor = Parser("Accessor", either(dotAccessor, bracketAccessor)));
    var accessorReducer = (function(p, c) {
        return ast_expression.MemberExpression.create(SourceLocation.merge(p.loc, c.loc), p, c.property, c.computed);
    });
    (memberExpression = Parser("Member Expression", binds(enumeration(either(newExpression, primaryExpression), many(accessor)), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(always, foldl.bind(null, accessorReducer)))));
    (newExpression = Parser("New Expression", nodea(next(keyword("new"), enumeration(expected.bind(null, "member expression")(memberExpression), optional([], args))), ast_expression.NewExpression.create)));
    (leftHandSideExpression = (function() {
        {
            var reducer = (function(p, c) {
                return ((c && c.hasOwnProperty("argument")) ? ast_expression.CallExpression.create(SourceLocation.merge(p.loc, c.loc), p, c) : accessorReducer(p, c));
            });
            return Parser("Left Hand Side Expression", binds(enumeration(memo(memberExpression), many(either(args, accessor))), (function(f, g) {
                return (function() {
                    return f(g.apply(null, arguments));
                });
            })(always, foldl.bind(null, reducer))));
        }
    }).call(this));
    (leftHandReferenceExpression = Parser("Left Hand Reference Expression", binds(enumeration(either(thisExpression, identifier), many(accessor)), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(always, foldl.bind(null, accessorReducer)))));
    (unaryOperator = Parser("Unary Operator", either(keyword("typeof", "void"), punctuator("+", "-", "~", "!"))));
    (unaryExpression = (function() {
        {
            var reducer = (function(argument, op) {
                return ast_expression.UnaryExpression.create(SourceLocation.merge(op.loc, argument.loc), op.value, argument);
            });
            return Parser("Unary Expression", binds(enumeration(many(unaryOperator), expected.bind(null, "left hand side expression")(leftHandSideExpression)), (function(ops, expression) {
                return always(foldr(reducer, expression, ops));
            })));
        }
    }).call(this));
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
        "sep": relationalOperator,
        "precedence": 4,
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
        "precedence": 12,
        "node": ast_expression.LogicalExpression
    }), ({
        "sep": logicalANDOperator,
        "precedence": 13,
        "node": ast_expression.LogicalExpression
    })];
    (binaryExpression = Parser("Binary Expression", precedence(memo(unaryExpression), precedenceTable)));
    (conditionalExpression = (function() {
        {
            var binExpr = memo(binaryExpression);
            return either(nodea(enumeration(attempt(then(binExpr, punctuator("?"))), then(conditionalExpression, punctuator(":")), conditionalExpression), ast_expression.ConditionalExpression.create), binExpr);
        }
    }).call(this));
    var composeOperator = punctuator("\\>", "\\>>");
    var reverseComposeOperator = punctuator("<\\", "<<\\");
    var pipeOperator = punctuator("|>");
    var reversePipeOperator = punctuator("<|");
    var composePrecedenceTable = [({
        "sep": composeOperator,
        "precedence": 1,
        "node": ast_expression.BinaryExpression
    }), ({
        "sep": reverseComposeOperator,
        "precedence": 1,
        "right": true,
        "node": ast_expression.BinaryExpression
    }), ({
        "sep": pipeOperator,
        "precedence": 2,
        "node": ast_expression.BinaryExpression
    }), ({
        "sep": reversePipeOperator,
        "precedence": 2,
        "right": true,
        "node": ast_expression.BinaryExpression
    })];
    (composeExpression = Parser("Compose Expression", precedence(memo(conditionalExpression), composePrecedenceTable)));
    (assignmentOperator = Parser("Assignment Operator", punctuator("=")));
    (assignmentExpression = Parser("Assignment Expression", nodea(append(attempt(enumeration(leftHandReferenceExpression, assignmentOperator)), enumeration(expected.bind(null, "expression")(expression))), (function(loc, left, op, right) {
        return ast_expression.AssignmentExpression.create(loc, op.value, left, right);
    }))));
    var deleteOperator = keyword("delete");
    var deleteExpression = (function() {
        {
            var reducer = (function(argument, op) {
                return ast_expression.UnaryExpression.create(SourceLocation.merge(op.loc, argument.loc), op.value, argument);
            });
            return Parser("Delete Expression", nodea(enumeration(deleteOperator, expected.bind(null, "reference expression")(leftHandReferenceExpression)), (function(loc, op, expression) {
                return ast_expression.UnaryExpression.create(loc, op.value, expression);
            })));
        }
    }).call(this);
    (expression = composeExpression);
    (topLevelExpression = choice(deleteExpression, assignmentExpression, expression));
    (exports.arrayElement = arrayElement);
    (exports.arrayElements = arrayElements);
    (exports.arrayLiteral = arrayLiteral);
    (exports.propertyName = propertyName);
    (exports.propertyInitializer = propertyInitializer);
    (exports.objectProperties = objectProperties);
    (exports.objectLiteral = objectLiteral);
    (exports.curryExpression = curryExpression);
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
    (exports.composeExpression = composeExpression);
    (exports.expression = expression);
    (exports.topLevelExpression = topLevelExpression);
}))