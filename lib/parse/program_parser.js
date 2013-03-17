/**
 * @fileOverview Parser for ECMAScript 5.1 Functions and Programs.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'stream/stream',
        'khepri/parse/_common',
        'khepri/parse/expression_parser',
        'khepri/parse/statement_parser', 'khepri/parse/token_parser',
        'ecma/ast/declaration', 'ecma/ast/expression', 'ecma/ast/program', 'ecma/ast/statement'],
function(require,
        parse, parse_eager,
        stream,
        ecma_parse,
        expression,
        statement, token,
        astDeclaration, astExpression, astProgram, astStatement){
"use strict";

/* Circular
 ******************************************************************************/
var statementParser = function() {
    return require('khepri/parse/statement_parser').statement.apply(undefined, arguments);
};

var expressionParser = function() {
    return require('khepri/parse/expression_parser').expression.apply(undefined, arguments);
};

/* Forward declarations
 ******************************************************************************/
var sourceElements = function() {
    return sourceElements.apply(undefined, arguments);
};

/* Parsers
 ******************************************************************************/
// Function Expression
////////////////////////////////////////
/**
 * Parser for the body of a function.
 */
var functionBody = sourceElements;

/**
 * Parser for a function's parameters.
 */
var formalParameterList = parse_eager.sepBy(token.punctuator(','),
    token.anyIdentifier);

var ecmaFunctionExpression = parse.next(token.keyword('function'),
    parse.binda(
        parse.sequence(
            parse.optional(token.anyIdentifier),
            parse.between(token.punctuator('('), token.punctuator(')'), 
                formalParameterList),
            parse.between(token.punctuator('{'), token.punctuator('}'),
                functionBody)),
        function(id, parameters, body) {
            return parse.always(new astExpression.FunctionExpression(
                id,
                parameters,
                new astStatement.BlockStatement(body)));
        }));

var lambdaFormalParameterList = parse.either(
    parse.between(token.punctuator('('), token.punctuator(')'), 
        formalParameterList),
    parse.bind(token.anyIdentifier, function(x) {
        return parse.always([x]);
    }));

var lambdaBody = parse.either(
    parse.between(token.punctuator('{'), token.punctuator('}'),
        functionBody),
    parse.bind(expressionParser, function(x) {
        return parse.always(new astStatement.BlockStatement(new astStatement.ReturnStatement(x)));
    }));

var lambdaFunctionExpression = parse.binda(
    parse.sequence(
        lambdaFormalParameterList,
        token.punctuator('->'),
        lambdaBody),
    function(parameters, _, body) {
        return parse.always(new astExpression.FunctionExpression(null, parameters, body));
    });

/**
 * Parser for an function expression.
 * 
 * May be named or anon.
 */
var functionExpression = parse.Parser('Function Expression',
    ecma_parse.astNode(parse.choice(
        ecmaFunctionExpression,
        lambdaFunctionExpression)));

// Source Elements
////////////////////////////////////////
/**
 * Parser for an ECMAScript source element.
 * 
 * Source Elements are top level nodes that makes up a program.
 */
var sourceElement = statementParser;

/**
 * Parser for a sequence of zero or more source elements.
 */
sourceElements = parse_eager.many(sourceElement);

// Program
////////////////////////////////////////
/**
 * Parser for an ECMAScript 5.1 program.
 */
var program = ecma_parse.astNode(
    ecma_parse.astNode(parse.bind(
        sourceElements,
        function(elements) {
            return parse.always(new astProgram.Program(elements));
        })));

/* Export
 ******************************************************************************/
return {
    'functionExpression': functionExpression,
    'functionBody': functionBody,
    
    'sourceElement': sourceElement,
    'sourceElements': sourceElements,
    
    'program': program
};

});