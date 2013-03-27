/*
 * THIS FILE IS AUTO GENERATED from '/Users/mattbierner/Projects/js/khepri/lib/parse/program_parser.kep'
 * DO NOT EDIT
*/
define(["require", "parse/parse", "parse/parse_eager", "stream/stream", "khepri/parse/_common", "khepri/parse/expression_parser", "khepri/parse/statement_parser", "khepri/parse/value_parser", "ecma/parse/token_parser", "ecma/ast/declaration", "ecma/ast/expression", "ecma/ast/program", "ecma/ast/statement"], function(require, parse, parse_eager, stream, ecma_parse, expression, statement, value, token, astDeclaration, astExpression, astProgram, astStatement) {
    "use strict";
    var statementParser = function() {
        return require("khepri/parse/statement_parser").statement.apply(undefined, arguments);
    };
    var expressionParser = function() {
        return require("khepri/parse/expression_parser").expression.apply(undefined, arguments);
    };
    var sourceElements = function() {
        return sourceElements.apply(undefined, arguments);
    };
    var functionBody = parse.bind(sourceElements, function(body) {
        return parse.always(new astStatement.BlockStatement(body));
    });
    var formalParameterList = parse_eager.sepBy(token.punctuator(","), value.identifier);
    var ecmaFunctionExpression = parse.next(token.keyword("function"), parse.binda(parse.sequence(parse.optional(value.identifier), parse.between(token.punctuator("("), token.punctuator(")"), formalParameterList), parse.between(token.punctuator("{"), token.punctuator("}"), functionBody)), function(id, parameters, body) {
        return parse.always(new astExpression.FunctionExpression(id, parameters, body));
    }));
    var lambdaFormalParameterList = parse.either(parse.between(token.punctuator("("), token.punctuator(")"), formalParameterList), parse.bind(value.identifier, function(x) {
        return parse.always([x]);
    }));
    var lambdaBody = parse.either(parse.between(token.punctuator("{"), token.punctuator("}"), functionBody), parse.bind(expressionParser, function(x) {
        return parse.always(new astStatement.BlockStatement(new astStatement.ReturnStatement(x)));
    }));
    var lambdaFunctionExpression = parse.binda(parse.sequence(lambdaFormalParameterList, token.punctuator("->"), lambdaBody), function(parameters, _, body) {
        return parse.always(new astExpression.FunctionExpression(null, parameters, body));
    });
    var functionExpression = parse.Parser("Function Expression", ecma_parse.astNode(parse.choice(ecmaFunctionExpression, lambdaFunctionExpression)));
    var sourceElement = statementParser;
    (sourceElements = parse_eager.many(sourceElement));
    var program = ecma_parse.astNode(ecma_parse.astNode(parse.bind(sourceElements, function(elements) {
        return parse.always(new astProgram.Program(elements));
    })));
    return {
        "functionExpression": functionExpression,
        "functionBody": functionBody,
        "sourceElement": sourceElement,
        "sourceElements": sourceElements,
        "program": program
    };
});
