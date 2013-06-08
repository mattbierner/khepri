/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
define(["require", "parse/parse", "parse/parse_lang", "nu/stream", "ecma/parse/common", "ecma/position", "khepri/parse/program_parser", "khepri/parse/value_parser", "ecma/parse/token_parser", "ecma/ast/node", "ecma/ast/expression", "ecma/ast/statement", "ecma/ast/value"], function(require, parse, parse_lang, stream, ecma_parse, position, program, value, token, node, astExpression, astStatement, astValue) {
    "use strict";
    var sourceElements = function() {
        return require("khepri/parse/program_parser").sourceElements.apply(undefined, arguments);
    }
    ;
    var assignmentExpression = function() {
        return assignmentExpression.apply(undefined, arguments);
    }
    ;
    var expression = function() {
        return expression.apply(undefined, arguments);
    }
    ;
    var conditionalExpression = function() {
        return conditionalExpression.apply(undefined, arguments);
    }
    ;
    var newExpression = function() {
        return newExpression.apply(undefined, arguments);
    }
    ;
    var functionBody = ecma_parse.node(sourceElements, function(loc, body) {
        return new astStatement.BlockStatement(loc, body);
    }
    );
    var arrayElement = parse.Parser("Array Element", parse.either(assignmentExpression, parse.next(parse.lookahead(token.punctuator(",")), parse.always(null))));
    var arrayElements = parse.Parser("Array Elements", parse.eager(parse_lang.sepBy(token.punctuator(","), parse.expected("array element", arrayElement))));
    var arrayLiteral = parse.Parser("Array Literal", ecma_parse.node(parse_lang.between(token.punctuator("["), token.punctuator("]"), arrayElements), function(loc, elements) {
        return new astExpression.ArrayExpression(loc, elements);
    }
    ));
    var propertyName = parse.Parser("Property Name", value.stringLiteral);
    var propertySetParameterList = parse.bind(value.identifier, function(x) {
        return parse.always([x]);
    }
    );
    var propertyValueInitializer = parse.Parser("Property Value Initializer", ecma_parse.nodea(parse.sequence(propertyName, token.punctuator(":"), assignmentExpression), function(loc, name, _, value) {
        return ({
            "loc": loc,
            "key": name,
            "kind": "init",
            "value": value
        });
    }
    ));
    var propertyGetInitializer = parse.Parser("Property Get Initializer", ecma_parse.nodea(parse.next(token.keyword("get"), parse.sequence(propertyName, token.punctuator("("), token.punctuator(")"), parse_lang.between(token.punctuator("{"), token.punctuator("}"), functionBody))), function(loc, name, _0, _1, body) {
        return ({
            "loc": loc,
            "key": name,
            "kind": "get",
            "value": new astExpression.FunctionExpression(loc, null, [], body)
        });
    }
    ));
    var propertySetInitializer = parse.Parser("Property Set Initializer", ecma_parse.nodea(parse.next(token.keyword("set"), parse.sequence(propertyName, parse_lang.between(token.punctuator("("), token.punctuator(")"), propertySetParameterList), parse_lang.between(token.punctuator("{"), token.punctuator("}"), functionBody))), function(loc, name, parameters, body) {
        return ({
            "loc": loc,
            "key": name,
            "kind": "set",
            "value": new astExpression.FunctionExpression(loc, null, parameters, body)
        });
    }
    ));
    var propertyInitializer = parse.Parser("Property Initializer", parse.choice(parse.attempt(propertyValueInitializer), propertyGetInitializer, propertySetInitializer));
    var objectProperties = parse.Parser("Object Properties", parse.bind(parse_lang.sepBy(token.punctuator(","), propertyInitializer), function(props) {
        return parse.always(stream.toArray(props));
    }
    ));
    var objectLiteral = parse.Parser("Object Literal", ecma_parse.node(parse_lang.between(token.punctuator("{"), token.punctuator("}"), objectProperties), function(loc, properties) {
        return new astExpression.ObjectExpression(loc, properties);
    }
    ));
    var formalParameterList = parse.eager(parse_lang.sepBy(token.punctuator(","), value.identifier));
    var ecmaFunctionExpression = ecma_parse.nodea(parse.next(token.keyword("function"), parse.sequence(parse.optional(null, value.identifier), parse_lang.between(token.punctuator("("), token.punctuator(")"), formalParameterList), parse_lang.between(token.punctuator("{"), token.punctuator("}"), functionBody))), function(loc, id, parameters, body) {
        return new astExpression.FunctionExpression(loc, id, parameters, body);
    }
    );
    var lambdaFormalParameterList = parse.either(parse_lang.between(token.punctuator("("), token.punctuator(")"), formalParameterList), parse.bind(value.identifier, function(x) {
        return parse.always([x]);
    }
    ));
    var lambdaBody = parse.either(parse_lang.between(token.punctuator("{"), token.punctuator("}"), functionBody), ecma_parse.node(expression, function(loc, x) {
        return new astStatement.BlockStatement(loc, [new astStatement.ReturnStatement(loc, x)]);
    }
    ));
    var lambdaFunctionExpression = ecma_parse.nodea(parse.sequence(lambdaFormalParameterList, token.punctuator("->"), lambdaBody), function(loc, parameters, _, body) {
        return new astExpression.FunctionExpression(loc, null, parameters, body);
    }
    );
    var functionExpression = parse.Parser("Function Expression", parse.either(ecmaFunctionExpression, lambdaFunctionExpression));
    var thisExpression = ecma_parse.node(token.keyword("this"), function(loc) {
        return new astExpression.ThisExpression(loc);
    }
    );
    var letExpression = parse.Parser("Let Expression", ecma_parse.nodea(parse.next(token.keyword("let"), parse.sequence(parse_lang.sepBy1(token.punctuator(","), parse.eager(parse.sequence(parse_lang.then(value.identifier, token.punctuator("=")), conditionalExpression))), token.keyword("in"), conditionalExpression)), function(loc, vals, _2, expr) {
        return stream.foldr(function(p, c) {
            return new astExpression.CallExpression(loc, new astExpression.FunctionExpression(null, null, [c[0]], new astStatement.BlockStatement(null, [p])), [c[1]]);
        }
        , new astStatement.ReturnStatement(null, expr), vals);
    }
    ));
    var primaryExpression = parse.Parser("Primary Expression", parse.choice(thisExpression, letExpression, parse.attempt(parse.bind(parse.either(value.identifier, parse_lang.between(token.punctuator("("), token.punctuator(")"), expression)), function(x) {
        return parse.either(parse.next(token.punctuator("->"), parse.never()), parse.always(x));
    }
    )), value.literal, arrayLiteral, objectLiteral, functionExpression));
    var argumentList = parse.Parser("Argument List", parse.eager(parse_lang.sepBy(token.punctuator(","), parse.expected("assignment expression", assignmentExpression))));
    var args = parse.Parser("Arguments", ecma_parse.node(parse_lang.between(token.punctuator("("), token.punctuator(")"), argumentList), function(loc, args) {
        (args.loc = loc);
        (args.argument = true);
        return args;
    }
    ));
    var dotAccessor = parse.Parser("Dot Accessor", ecma_parse.node(parse.next(token.punctuator("."), value.identifier), function(loc, x) {
        return [({
            "loc": loc,
            "property": x,
            "computed": false
        })];
    }
    ));
    var bracketAccessor = parse.Parser("Bracket Accessor", parse.bind(parse_lang.between(token.punctuator("["), token.punctuator("]"), parse.eager(parse_lang.sepBy1(token.punctuator(","), expression))), function(accessor) {
        return parse.always(accessor.map(function(x) {
            return ({
                "loc": x.loc,
                "property": x,
                "computed": true
            });
        }
        ));
    }
    ));
    var accessor = parse.Parser("Accessor", parse.either(dotAccessor, bracketAccessor));
    var accessorReducer = function(p, c) {
        return new astExpression.MemberExpression(position.SourceLocation.merge(p.loc, c.loc), p, c.property, c.computed);
    }
    ;
    var memberExpression = function(reducer) {
        return parse.Parser("Member Expression", parse.binds(parse.sequence(parse.either(newExpression, primaryExpression), parse.many(accessor)), function(expression, props) {
            return parse.always(stream.foldl(reducer, expression, props));
        }
        ));
    }
    (function(p, c) {
        return c.reduce(accessorReducer, p);
    }
    );
    var newExpression = parse.Parser("New Expression", ecma_parse.nodea(parse.next(token.keyword("new"), parse.sequence(parse.expected("member expression", memberExpression), parse.optional([], args))), function(loc, expression, a) {
        return new astExpression.NewExpression(loc, expression, a);
    }
    ));
    var leftHandSideExpression = function(reducer) {
        return parse.Parser("Left Hand Side Expression", parse.binds(parse.sequence(parse.memo(memberExpression), parse.many(parse.either(args, accessor))), function(member, accessors) {
            return parse.always(stream.foldl(reducer, member, accessors));
        }
        ));
    }
    (function(p, c) {
        return ((c && c.hasOwnProperty("argument")) ? new astExpression.CallExpression(position.SourceLocation.merge(p.loc, c.loc), p, c) : c.reduce(accessorReducer, p));
    }
    );
    var unaryOperator = parse.Parser("Unary Operator", parse.choice(token.keyword("delete"), token.keyword("void"), token.keyword("typeof"), token.punctuator("+"), token.punctuator("-"), token.punctuator("~"), token.punctuator("!")));
    var unaryExpression = function(reducer) {
        return parse.Parser("Unary Expression", parse.binds(parse.sequence(parse.many(unaryOperator), parse.expected("left hand side expression", leftHandSideExpression)), function(ops, expression) {
            return parse.always(stream.foldr(reducer, expression, ops));
        }
        ));
    }
    (function(argument, op) {
        return new astExpression.UnaryExpression(position.SourceLocation.merge(op.loc, argument.loc), op.value, argument);
    }
    );
    var multiplicativeOperator = parse.choice(token.punctuator("*"), token.punctuator("/"), token.punctuator("%"));
    var additiveOperator = parse.either(token.punctuator("+"), token.punctuator("-"));
    var shiftOperator = parse.choice(token.punctuator("<<"), token.punctuator(">>"), token.punctuator(">>>"));
    var relationalOperator = parse.choice(token.punctuator("<"), token.punctuator(">"), token.punctuator("<="), token.punctuator(">="), token.keyword("instanceof"));
    var equalityOperator = parse.choice(token.punctuator("=="), token.punctuator("!="), token.punctuator("==="), token.punctuator("!=="));
    var bitwiseANDOperator = token.punctuator("&");
    var bitwiseXOROperator = token.punctuator("^");
    var bitwiseOROperator = token.punctuator("|");
    var logicalANDOperator = token.punctuator("&&");
    var logicalOROperator = token.punctuator("||");
    var precedenceTable = [({
        "sep": multiplicativeOperator,
        "precedence": 1,
        "node": astExpression.BinaryExpression
    }), ({
        "sep": additiveOperator,
        "precedence": 2,
        "node": astExpression.BinaryExpression
    }), ({
        "sep": shiftOperator,
        "precedence": 3,
        "node": astExpression.BinaryExpression
    }), ({
        "sep": equalityOperator,
        "precedence": 5,
        "node": astExpression.BinaryExpression
    }), ({
        "sep": bitwiseANDOperator,
        "precedence": 6,
        "node": astExpression.BinaryExpression
    }), ({
        "sep": bitwiseXOROperator,
        "precedence": 7,
        "node": astExpression.BinaryExpression
    }), ({
        "sep": bitwiseOROperator,
        "precedence": 8,
        "node": astExpression.BinaryExpression
    }), ({
        "sep": logicalOROperator,
        "precedence": 9,
        "node": astExpression.LogicalExpression
    }), ({
        "sep": logicalANDOperator,
        "precedence": 10,
        "node": astExpression.LogicalExpression
    }), ({
        "sep": relationalOperator,
        "precedence": 4,
        "node": astExpression.BinaryExpression
    })];
    var binaryExpression = parse.Parser("Binary Expression", ecma_parse.precedence(unaryExpression, precedenceTable));
    (conditionalExpression = function() {
        var conditionalBody = parse.next(token.punctuator("?"), parse.sequence(parse.expected("assignment expression", assignmentExpression), token.punctuator(":"), parse.expected("assignment expression", assignmentExpression)));
        return parse.bind(binaryExpression, function(bin) {
            return parse.either(ecma_parse.nodea(conditionalBody, function(loc, consequent, _1, alternate) {
                return new astExpression.ConditionalExpression(loc, bin, consequent, alternate);
            }
            ), parse.always(bin));
        }
        );
    }
    ());
    var assignmentOperator = parse.Parser("Assignment Operator", parse.choice(token.punctuator("="), token.punctuator("*="), token.punctuator("*="), token.punctuator("/="), token.punctuator("%="), token.punctuator("+="), token.punctuator("-="), token.punctuator("<<="), token.punctuator(">>="), token.punctuator(">>>="), token.punctuator("&="), token.punctuator("^="), token.punctuator("|=")));
    (assignmentExpression = parse.RecParser("Assignment Expression", function(self) {
        return parse.backtrack(parse.either(parse.binds(parse.attempt(parse.sequence(parse.memo(leftHandSideExpression), assignmentOperator)), function(left, operator) {
            return parse.bind(parse.expected("assignment expression", self), function(right) {
                return parse.always(new astExpression.AssignmentExpression(position.SourceLocation.merge(left.loc, right.loc), operator.value, left, right));
            }
            );
        }
        ), conditionalExpression));
    }
    ));
    (expression = assignmentExpression);
    return ({
        "arrayElement": arrayElement,
        "arrayElements": arrayElements,
        "arrayLiteral": arrayLiteral,
        "propertyName": propertyName,
        "propertySetParameterList": propertySetParameterList,
        "propertyValueInitializer": propertyValueInitializer,
        "propertyGetInitializer": propertyGetInitializer,
        "propertySetInitializer": propertySetInitializer,
        "propertyInitializer": propertyInitializer,
        "objectProperties": objectProperties,
        "objectLiteral": objectLiteral,
        "primaryExpression": primaryExpression,
        "thisExpression": thisExpression,
        "args": args,
        "argumentList": argumentList,
        "dotAccessor": dotAccessor,
        "bracketAccessor": bracketAccessor,
        "accessor": accessor,
        "memberExpression": memberExpression,
        "newExpression": newExpression,
        "leftHandSideExpression": leftHandSideExpression,
        "unaryOperator": unaryOperator,
        "unaryExpression": unaryExpression,
        "binaryExpression": binaryExpression,
        "conditionalExpression": conditionalExpression,
        "assignmentOperator": assignmentOperator,
        "assignmentExpression": assignmentExpression,
        "letExpression": letExpression,
        "expression": expression
    });
}
);
