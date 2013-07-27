/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
;
define(["require", "parse/parse", "parse/parse_lang", "nu/stream", "ecma/position", "ecma/parse/common", "ecma/parse/token_parser", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/statement", "khepri_ast/pattern", "khepri/parse/program_parser", "khepri/parse/value_parser", "khepri/parse/pattern_parser"], function(require, parse, parse_lang, stream, position, ecma_parse, token, ast_declaration, ast_expression, ast_statement, ast_pattern, program, value, pattern) {
    "use strict";
    var sourceElements = function() {
        return require("khepri/parse/program_parser").sourceElements.apply(undefined, arguments);
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
    var functionBody = ecma_parse.node(sourceElements, ast_statement.BlockStatement.create);
    var arrayElement = parse.Parser("Array Element", parse.either(expression, parse.next(parse.lookahead(token.punctuator(",")), parse.always(null))));
    var arrayElements = parse.Parser("Array Elements", parse.eager(parse_lang.sepBy(token.punctuator(","), parse.expected("array element", arrayElement))));
    var arrayLiteral = parse.Parser("Array Literal", ecma_parse.node(parse_lang.between(token.punctuator("["), token.punctuator("]"), arrayElements), ast_expression.ArrayExpression.create));
    var propertyName = parse.Parser("Property Name", value.stringLiteral);
    var propertySetParameterList = parse.bind(value.identifier, function(x) {
        return parse.always([x]);
    }
    );
    var propertyValueInitializer = parse.Parser("Property Value Initializer", ecma_parse.nodea(parse.sequence(propertyName, token.punctuator(":"), expression), function(loc, name, _, value) {
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
            "value": ast_expression.FunctionExpression.create(loc, null, [], body)
        });
    }
    ));
    var propertySetInitializer = parse.Parser("Property Set Initializer", ecma_parse.nodea(parse.next(token.keyword("set"), parse.sequence(propertyName, parse_lang.between(token.punctuator("("), token.punctuator(")"), propertySetParameterList), parse_lang.between(token.punctuator("{"), token.punctuator("}"), functionBody))), function(loc, name, parameters, body) {
        return ({
            "loc": loc,
            "key": name,
            "kind": "set",
            "value": ast_expression.FunctionExpression.create(loc, null, parameters, body)
        });
    }
    ));
    var propertyInitializer = parse.Parser("Property Initializer", parse.choice(parse.attempt(propertyValueInitializer), propertyGetInitializer, propertySetInitializer));
    var objectProperties = parse.Parser("Object Properties", parse.eager(parse_lang.sepBy(token.punctuator(","), propertyInitializer)));
    var objectLiteral = parse.Parser("Object Literal", ecma_parse.node(parse_lang.between(token.punctuator("{"), token.punctuator("}"), objectProperties), ast_expression.ObjectExpression.create));
    var parameter = parse.expected("Any pattern", pattern.pattern);
    var formalParameterList = ecma_parse.node(parse.eager(parse_lang.sepBy(token.punctuator(","), parameter)), ast_pattern.ParameterList.create);
    var ecmaFunctionExpression = ecma_parse.nodea(parse.next(token.keyword("function"), parse.sequence(parse.optional(null, value.identifier), parse_lang.between(token.punctuator("("), token.punctuator(")"), formalParameterList), parse_lang.between(token.punctuator("{"), token.punctuator("}"), functionBody))), ast_expression.FunctionExpression.create);
    var lambdaFormalParameterList = parse.either(parse_lang.between(token.punctuator("("), token.punctuator(")"), formalParameterList), formalParameterList);
    var lambdaBody = parse.either(parse_lang.between(token.punctuator("{"), token.punctuator("}"), functionBody), ecma_parse.node(expression, function(loc, x) {
        return new ast_statement.BlockStatement(loc, [new ast_statement.ReturnStatement(loc, x)]);
    }
    ));
    var lambdaFunctionExpression = ecma_parse.nodea(parse.next(token.punctuator("\\"), parse.sequence(lambdaFormalParameterList, token.punctuator("->"), lambdaBody)), function(loc, parameters, _, body) {
        return ast_expression.FunctionExpression.create(loc, null, parameters, body);
    }
    );
    var functionExpression = parse.Parser("Function Expression", parse.either(ecmaFunctionExpression, lambdaFunctionExpression));
    var thisExpression = ecma_parse.node(token.keyword("this"), ast_expression.ThisExpression.create);
    var letBinding = parse.Parser("Let Binding", ecma_parse.nodea(parse.sequence(parse_lang.then(value.identifier, token.punctuator("=")), conditionalExpression), ast_declaration.LetBinding.create));
    var letExpression = parse.Parser("Let Expression", ecma_parse.nodea(parse.next(token.keyword("let"), parse.sequence(parse.eager(parse_lang.sepBy1(token.punctuator(","), letBinding)), parse.next(token.keyword("in"), conditionalExpression))), ast_expression.LetExpression.create));
    var primaryExpression = parse.Parser("Primary Expression", parse.choice(thisExpression, letExpression, value.identifier, parse_lang.between(token.punctuator("("), token.punctuator(")"), expression), value.literal, arrayLiteral, objectLiteral, functionExpression));
    var argumentList = parse.Parser("Argument List", parse.eager(parse_lang.sepBy(token.punctuator(","), parse.expected("expression", expression))));
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
        return ast_expression.MemberExpression.create(position.SourceLocation.merge(p.loc, c.loc), p, c.property, c.computed);
    }
    ;
    var memberExpression = function(reducer) {
        return parse.Parser("Member Expression", parse.binds(parse.sequence(parse.either(newExpression, primaryExpression), parse.many(accessor)), function(expression, props) {
            return parse.always(stream.foldl(reducer, expression, props));
        }
        ));
    }
    (function reducer(p, c) {
        return c.reduce(accessorReducer, p);
    }
    );
    (newExpression = parse.Parser("New Expression", ecma_parse.nodea(parse.next(token.keyword("new"), parse.sequence(parse.expected("member expression", memberExpression), parse.optional([], args))), ast_expression.NewExpression.create)));
    var leftHandSideExpression = function(reducer) {
        return parse.Parser("Left Hand Side Expression", parse.binds(parse.sequence(parse.memo(memberExpression), parse.many(parse.either(args, accessor))), function(member, accessors) {
            return parse.always(stream.foldl(reducer, member, accessors));
        }
        ));
    }
    (function reducer(p, c) {
        return ((c && c.hasOwnProperty("argument")) ? ast_expression.CallExpression.create(position.SourceLocation.merge(p.loc, c.loc), p, c) : c.reduce(accessorReducer, p));
    }
    );
    var leftHandReferenceExpression = function(reducer) {
        return parse.Parser("Left Hand Reference Expression", parse.binds(parse.sequence(parse.choice(thisExpression, value.identifier), parse.many(accessor)), function(expression, props) {
            return parse.always(stream.foldl(reducer, expression, props));
        }
        ));
    }
    (function reducer(p, c) {
        return c.reduce(accessorReducer, p);
    }
    );
    var unaryOperator = parse.Parser("Unary Operator", parse.choice(token.keyword("delete"), token.keyword("void"), token.keyword("typeof"), token.punctuator("+"), token.punctuator("-"), token.punctuator("~"), token.punctuator("!")));
    var unaryExpression = function(reducer) {
        return parse.Parser("Unary Expression", parse.binds(parse.sequence(parse.many(unaryOperator), parse.expected("left hand side expression", leftHandSideExpression)), function(ops, expression) {
            return parse.always(stream.foldr(reducer, expression, ops));
        }
        ));
    }
    (function reducer(argument, op) {
        return new ast_expression.UnaryExpression(position.SourceLocation.merge(op.loc, argument.loc), op.value, argument);
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
    var binaryExpression = parse.Parser("Binary Expression", ecma_parse.precedence(unaryExpression, precedenceTable));
    (conditionalExpression = function() {
        var conditionalBody = parse.next(token.punctuator("?"), parse.sequence(parse.expected("expression", expression), token.punctuator(":"), parse.expected("expression", expression)));
        return parse.bind(binaryExpression, function(bin) {
            return parse.either(ecma_parse.nodea(conditionalBody, function(loc, consequent, _1, alternate) {
                return new ast_expression.ConditionalExpression(loc, bin, consequent, alternate);
            }
            ), parse.always(bin));
        }
        );
    }
    ());
    var assignmentOperator = parse.Parser("Assignment Operator", parse.choice(token.punctuator("="), token.punctuator("*="), token.punctuator("*="), token.punctuator("/="), token.punctuator("%="), token.punctuator("+="), token.punctuator("-="), token.punctuator("<<="), token.punctuator(">>="), token.punctuator(">>>="), token.punctuator("&="), token.punctuator("^="), token.punctuator("|=")));
    var assignmentExpression = parse.Parser("Assignment Expression", ecma_parse.nodea(parse.sequence(leftHandReferenceExpression, assignmentOperator, parse.expected("expression", expression)), function(loc, left, op, right) {
        return new ast_expression.AssignmentExpression(loc, op.value, left, right);
    }
    ));
    (expression = conditionalExpression);
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
        "leftHandReferenceExpression": leftHandReferenceExpression,
        "unaryOperator": unaryOperator,
        "unaryExpression": unaryExpression,
        "binaryExpression": binaryExpression,
        "conditionalExpression": conditionalExpression,
        "letExpression": letExpression,
        "assignmentExpression": assignmentExpression,
        "expression": expression
    });
}
);
