/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "khepri-ast/declaration",
    "khepri-ast/expression", "khepri-ast/statement", "khepri-ast/pattern", "khepri-ast/value", "../position",
    "./common", "./token_parser", "./program_parser", "./value_parser", "./pattern_parser"
], (function(require, exports, __o, __o0, __o1, ast_declaration, ast_expression, ast_statement, ast_pattern,
    ast_value, __o2, __o3, __o4, program_parser, __o5, pattern) {
    "use strict";
    var always = __o["always"],
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
        between = __o0["between"],
        sepBy = __o0["sepBy"],
        sepBy1 = __o0["sepBy1"],
        then = __o0["then"],
        foldl = __o1["foldl"],
        foldr = __o1["foldr"],
        SourceLocation = __o2["SourceLocation"],
        node = __o3["node"],
        nodea = __o3["nodea"],
        precedence = __o3["precedence"],
        keyword = __o4["keyword"],
        punctuator = __o4["punctuator"],
        identifier = __o5["identifier"],
        literal = __o5["literal"],
        stringLiteral = __o5["stringLiteral"],
        arrayElement, arrayElements, arrayLiteral, propertyName, propertyInitializer, objectProperties,
            objectLiteral, curryExpression, primaryExpression, args, argumentList, dotAccessor, bracketAccessor,
            accessor, memberExpression, newExpression, leftHandSideExpression, leftHandReferenceExpression,
            unaryOperator, unaryExpression, binaryExpression, conditionalExpression, letExpression,
            assignmentOperator, assignmentExpression, expression, topLevelExpression, sourceElements = (
                function() {
                    var args = arguments,
                        __o6 = require("./program_parser"),
                        sourceElements = __o6["sourceElements"];
                    return sourceElements.apply(undefined, args);
                });
    (expression = (function() {
        var args = arguments;
        return expression.apply(undefined, args);
    }));
    (newExpression = (function() {
        var args = arguments;
        return newExpression.apply(undefined, args);
    }));
    (memberExpression = (function() {
        var args = arguments;
        return memberExpression.apply(undefined, args);
    }));
    (arrayElement = Parser("Array Element", expression));
    (arrayElements = expected("array element", Parser("Array Elements", eager(sepBy(punctuator(","),
        arrayElement)))));
    (arrayLiteral = Parser("Array Literal", node(between(punctuator("["), punctuator("]"), arrayElements),
        ast_expression.ArrayExpression.create)));
    (propertyName = Parser("Property Name", stringLiteral));
    (propertyInitializer = Parser("Property Initializer", nodea(enumeration(then(propertyName, punctuator(":")),
        expression), ast_value.ObjectValue.create)));
    (objectProperties = Parser("Object Properties", eager(sepBy(punctuator(","), propertyInitializer))));
    (objectLiteral = Parser("Object Literal", node(between(punctuator("{"), punctuator("}"), objectProperties),
        ast_expression.ObjectExpression.create)));
    var formalParameterList = pattern.argumentsPattern,
        statementBody = node(between(punctuator("{"), punctuator("}"), sourceElements), ast_statement.BlockStatement
            .create),
        lambdaBody = node(expression, (function(loc, x) {
            return ast_statement.BlockStatement.create(loc, [ast_statement.ReturnStatement.create(null,
                x)]);
        })),
        functionBody = either(statementBody, lambdaBody),
        functionExpression = Parser("Function Expression", nodea(cons(optional(null, next(keyword("function"),
                optional(null, identifier))), next(punctuator("\\"), enumeration(formalParameterList,
                next(punctuator("->"), expected("function body", functionBody))))), ast_expression.FunctionExpression
            .create)),
        letBinding = Parser("Let Binding", nodea(enumeration(then(expected("pattern", pattern.topLevelPattern),
            punctuator("=")), expected("let binding expression", expression)), ast_declaration.Binding.create));
    (letExpression = Parser("Let Expression", (function() {
        var letBindings = expected("let bindings", sepBy1(punctuator(","), letBinding)),
            letBody = expected("let body expression", expression);
        return nodea(next(keyword("let"), enumeration(eager(letBindings), next(keyword("in"),
            letBody))), ast_expression.LetExpression.create);
    })()));
    (conditionalExpression = Parser("Conditional Expression", nodea(next(punctuator("?"), enumeration(
        expression, next(punctuator(":"), expected("conditional consequent expression",
            expression)), next(punctuator(":"), expected("conditional alternate expression",
            expression)))), ast_expression.ConditionalExpression.create)));
    var unaryOperatorExpression = Parser("Unary Operator Expression", bind(either(keyword("typeof"), punctuator(
        "void", "~", "!")), (function(__o6) {
        var loc = __o6["loc"],
            value = __o6["value"];
        return always(ast_expression.UnaryOperatorExpression.create(loc, value));
    }))),
        binaryOperatorExpression = Parser("Binary Operator Expression", bind(either(keyword("instanceof"),
            punctuator("*", "/", "+", "-", "%", "<<", ">>", ">>>", "<", ">", "<=", ">=", "==", "!=",
                "===", "!==", "&", "^", "|", "||", "&&", "\\>", "|>")), (function(__o6) {
            var loc = __o6["loc"],
                value = __o6["value"];
            return always(ast_expression.BinaryOperatorExpression.create(loc, value));
        }))),
        ternayOperatorExpression = Parser("Ternary Operator Expression", bind(punctuator("?"), (function(__o6) {
            var loc = __o6["loc"],
                value = __o6["value"];
            return always(ast_expression.TernaryOperatorExpression.create(loc, value));
        }))),
        operatorExpression = Parser("Operator Expression", choice(unaryOperatorExpression,
            binaryOperatorExpression, ternayOperatorExpression));
    (curryExpression = Parser("Curry Expression", (function() {
        var base = either(expected("expression", attempt(expression)), expected(
            "curryable operator", operatorExpression));
        return between(punctuator("("), punctuator(")"), nodea(enumeration(base, optional([], next(
            punctuator(","), eager(sepBy1(punctuator(","), expression))))), (function(loc,
            base, elements) {
            return (elements.length ? ast_expression.CurryExpression.create(loc, base,
                elements) : base);
        })));
    })()));
    (primaryExpression = Parser("Primary Expression", choice(letExpression, conditionalExpression, identifier,
        curryExpression, literal, arrayLiteral, objectLiteral, functionExpression)));
    (argumentList = Parser("Argument List", (function() {
        var argument = expected("argument", expression);
        return eager(sepBy(punctuator(","), argument));
    })()));
    (args = Parser("Arguments", node(between(punctuator("("), punctuator(")"), argumentList), (function(loc,
        args) {
        (args.loc = loc);
        (args.argument = true);
        return args;
    }))));
    var atExpression = Parser("AtExpression", nodea(next(punctuator("@"), enumeration(memberExpression, eager(
        many(next(optional(null, punctuator(":")), expression))))), ast_expression.CallExpression.create));
    (dotAccessor = Parser("Dot Accessor", node(next(punctuator("."), identifier), (function(loc, x) {
        return ({
            "loc": loc,
            "property": x,
            "computed": false
        });
    }))));
    (bracketAccessor = Parser("Bracket Accessor", node(between(punctuator("["), punctuator("]"), expected(
        "accessor expression", expression)), (function(loc, x) {
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
    (memberExpression = Parser("Member Expression", binds(enumeration(choice(atExpression, newExpression,
        primaryExpression), many(accessor)), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(always, foldl.bind(null, accessorReducer)))));
    (newExpression = Parser("New Expression", nodea(next(keyword("new"), enumeration(expected(
        "member expression", memberExpression), optional([], args))), ast_expression.NewExpression.create)));
    (leftHandSideExpression = Parser("Left Hand Side Expression", (function() {
        var reducer = (function(p, c) {
            return ((c && c.hasOwnProperty("argument")) ? ast_expression.CallExpression.create(
                SourceLocation.merge(p.loc, c.loc), p, c) : accessorReducer(p, c));
        });
        return binds(enumeration(memo(memberExpression), many(either(args, accessor))), (function(f,
            g) {
            return (function() {
                return f(g.apply(null, arguments));
            });
        })(always, foldl.bind(null, reducer)));
    })()));
    (leftHandReferenceExpression = Parser("Left Hand Reference Expression", binds(enumeration(memo(identifier),
        memo(many(accessor))), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(always, foldl.bind(null, accessorReducer)))));
    (unaryOperator = Parser("Unary Operator", either(keyword("typeof", "void"), punctuator("+", "-", "~", "!"))));
    (unaryExpression = Parser("Unary Expression", (function() {
        var reducer0 = (function(argument, op) {
            return ast_expression.UnaryExpression.create(SourceLocation.merge(op.loc, argument.loc),
                op.value, argument);
        });
        return binds(enumeration(many(unaryOperator), expected("unary argument",
            leftHandSideExpression)), (function(ops, expression) {
            return always(foldr(reducer0, expression, ops));
        }));
    })()));
    var multiplicativeOperator = punctuator("*", "/", "%"),
        additiveOperator = punctuator("+", "-"),
        shiftOperator = punctuator("<<", ">>", ">>>"),
        relationalOperator = either(punctuator("<", ">", "<=", ">="), keyword("instanceof")),
        equalityOperator = punctuator("==", "!=", "===", "!=="),
        bitwiseANDOperator = punctuator("&"),
        bitwiseXOROperator = punctuator("^"),
        bitwiseOROperator = punctuator("|"),
        logicalANDOperator = punctuator("&&"),
        logicalOROperator = punctuator("||"),
        composeOperator = punctuator("\\>", "\\>>"),
        reverseComposeOperator = punctuator("<\\", "<<\\"),
        pipeOperator = punctuator("|>"),
        reversePipeOperator = punctuator("<|"),
        precedenceTable = [({
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
        }), ({
            "sep": composeOperator,
            "precedence": 14,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": reverseComposeOperator,
            "precedence": 14,
            "right": true,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": pipeOperator,
            "precedence": 15,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": reversePipeOperator,
            "precedence": 15,
            "right": true,
            "node": ast_expression.BinaryExpression
        })];
    (binaryExpression = Parser("Binary Expression", precedence(memo(unaryExpression), precedenceTable)));
    (assignmentOperator = punctuator("="));
    (assignmentExpression = Parser("Assignment Expression", nodea(append(attempt(enumeration(
        leftHandReferenceExpression, assignmentOperator)), enumeration(expected("expression",
        expression))), (function(loc, left, op, right) {
        return ast_expression.AssignmentExpression.create(loc, op.value, left, right);
    }))));
    var deleteOperator = keyword("delete"),
        deleteExpression = Parser("Delete Expression", nodea(enumeration(deleteOperator, expected(
            "reference expression", leftHandReferenceExpression)), (function(loc, op, expression) {
            return ast_expression.UnaryExpression.create(loc, op.value, expression);
        })));
    (expression = binaryExpression);
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
    (exports.topLevelExpression = topLevelExpression);
}));