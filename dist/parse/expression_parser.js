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
        chainl1 = __o0["chainl1"],
        chainr1 = __o0["chainr1"],
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
        arrayLiteral, propertyName, propertyInitializer, objectProperties, objectLiteral, functionExpression,
            operatorExpression, primaryExpression, curryExpression, args, applicationExpression, dotAccessor,
            bracketAccessor, accessor, memberExpression, newExpression, leftHandReferenceExpression,
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
    (memberExpression = (function() {
        var args = arguments;
        return memberExpression.apply(undefined, args);
    }));
    (arrayLiteral = Parser("Array Literal", (function() {
        var arrayElement = expression,
            arrayElements = expected("array element", Parser("Array Elements", eager(sepBy(
                punctuator(","), arrayElement))));
        return node(between(punctuator("["), punctuator("]"), arrayElements), ast_expression.ArrayExpression
            .create);
    })()));
    (propertyName = stringLiteral);
    (propertyInitializer = Parser("Property Initializer", nodea(enumeration(then(propertyName, punctuator(":")),
        expression), ast_value.ObjectValue.create)));
    (objectProperties = Parser("Object Properties", eager(sepBy(punctuator(","), propertyInitializer))));
    (objectLiteral = Parser("Object Literal", node(between(punctuator("{"), punctuator("}"), objectProperties),
        ast_expression.ObjectExpression.create)));
    var formalParameterList = pattern.argumentsPattern,
        statementBody = node(between(punctuator("{"), punctuator("}"), sourceElements), ast_statement.BlockStatement
            .create),
        lambdaBody = expression,
        functionBody = either(statementBody, lambdaBody);
    (functionExpression = Parser("Function Expression", nodea(cons(optional(null, next(keyword("function"),
            optional(null, identifier))), next(punctuator("\\"), enumeration(formalParameterList,
            next(punctuator("->"), expected("function body", functionBody))))), ast_expression.FunctionExpression
        .create)));
    var letBinding = Parser("Let Binding", nodea(enumeration(then(expected("pattern", pattern.topLevelPattern),
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
        "void", "~", "!", "++", "--")), (function(__o6) {
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
        })));
    (operatorExpression = Parser("Operator Expression", choice(unaryOperatorExpression,
        binaryOperatorExpression, ternayOperatorExpression)));
    (primaryExpression = Parser("Primary Expression", choice(letExpression, conditionalExpression, identifier,
        literal, arrayLiteral, objectLiteral, functionExpression, attempt(between(punctuator("("),
            punctuator(")"), operatorExpression)), between(punctuator("("), punctuator(")"), expected(
            "expression", expression)))));
    (args = Parser("Arguments", (function() {
        var element = expected("argument", expression);
        return node(between(punctuator("("), punctuator(")"), eager(sepBy(punctuator(","), element))), (
            function(loc, x) {
                (x.loc = loc);
                return x;
            }));
    })()));
    (accessor = Parser("Accessor", node(next(punctuator("."), either(bind(identifier, (function(x) {
        return always([x, false]);
    })), bind(between(punctuator("("), punctuator(")"), expected("accessor expression",
        expression)), (function(x) {
        return always([x, true]);
    })))), (function(loc, __o6) {
        var x = __o6[0],
            computed = __o6[1];
        return ({
            "loc": loc,
            "property": x,
            "computed": computed
        });
    }))));
    (newExpression = Parser("New Expression", nodea(next(keyword("new"), enumeration(expected(
            "member expression", memberExpression), expected("argument list", args))), ast_expression.NewExpression
        .create)));
    var accessorReducer = (function(p, c) {
        return ast_expression.MemberExpression.create(SourceLocation.merge(p.loc, c.loc), p, c.property, c.computed);
    });
    (memberExpression = Parser("Member Expression", binds(enumeration(either(primaryExpression, newExpression),
        many(accessor)), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(always, foldl.bind(null, accessorReducer)))));
    var leftHandSideExpression = Parser("Call Expression", (function() {
        var reducer = (function(p, c) {
            return (c.hasOwnProperty("property") ? ast_expression.MemberExpression.create(
                    SourceLocation.merge(p.loc, c.loc), p, c.property, c.computed) : ast_expression
                .CallExpression.create(SourceLocation.merge(p.loc, c.loc), p, c));
        });
        return binds(enumeration(memberExpression, many(either(args, accessor))), (function(f, g) {
            return (function() {
                return f(g.apply(null, arguments));
            });
        })(always, foldl.bind(null, reducer)));
    })());
    (curryExpression = Parser("Curry Expression", (function() {
        var reducer0 = (function(f, args) {
            return ast_expression.CurryExpression.create(SourceLocation.merge(f.loc, args.loc),
                f, args);
        });
        return binds(enumeration(leftHandSideExpression, many(next(punctuator("@"), either(args,
            leftHandSideExpression)))), (function(f, g) {
            return (function() {
                return f(g.apply(null, arguments));
            });
        })(always, foldl.bind(null, reducer0)));
    })()));
    (applicationExpression = Parser("Call Expression", chainl1(always((function(p, c) {
        return ast_expression.CallExpression.create(SourceLocation.merge(p.loc, c.loc), p, [
            c
        ]);
    })), curryExpression)));
    (unaryOperator = Parser("Unary Operator", either(keyword("typeof", "void"), punctuator("++", "--", "~", "!"))));
    (unaryExpression = Parser("Unary Expression", (function() {
        var reducer1 = (function(argument, op) {
            return ast_expression.UnaryExpression.create(SourceLocation.merge(op.loc, argument.loc),
                op.value, argument);
        });
        return binds(enumeration(many(unaryOperator), expected("unary argument",
            applicationExpression)), (function(ops, expression) {
            return always(foldr(reducer1, expression, ops));
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
            "sep": composeOperator,
            "precedence": 9,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": reverseComposeOperator,
            "precedence": 9,
            "right": true,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": pipeOperator,
            "precedence": 10,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": reversePipeOperator,
            "precedence": 10,
            "right": true,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": logicalOROperator,
            "precedence": 11,
            "node": ast_expression.LogicalExpression
        }), ({
            "sep": logicalANDOperator,
            "precedence": 12,
            "node": ast_expression.LogicalExpression
        })];
    (binaryExpression = Parser("Binary Expression", precedence(memo(unaryExpression), precedenceTable)));
    (expression = binaryExpression);
    (leftHandReferenceExpression = Parser("Left Hand Reference Expression", binds(enumeration(memo(identifier),
        memo(many(accessor))), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(always, foldl.bind(null, accessorReducer)))));
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
    (topLevelExpression = choice(deleteExpression, assignmentExpression, expression));
    (exports.arrayLiteral = arrayLiteral);
    (exports.propertyName = propertyName);
    (exports.propertyInitializer = propertyInitializer);
    (exports.objectProperties = objectProperties);
    (exports.objectLiteral = objectLiteral);
    (exports.functionExpression = functionExpression);
    (exports.operatorExpression = operatorExpression);
    (exports.primaryExpression = primaryExpression);
    (exports.curryExpression = curryExpression);
    (exports.args = args);
    (exports.applicationExpression = applicationExpression);
    (exports.dotAccessor = dotAccessor);
    (exports.bracketAccessor = bracketAccessor);
    (exports.accessor = accessor);
    (exports.memberExpression = memberExpression);
    (exports.newExpression = newExpression);
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