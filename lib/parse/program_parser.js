/**
 * @fileOverview Parser for ECMAScript 5.1 Functions and Programs.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'stream',
        'ecma/parse/_common',
        'ecma/parse/statement_parser', 'ecma/parse/token_parser',
        'ecma/ast/declaration', 'ecma/ast/expression', 'ecma/ast/program', 'ecma/ast/statement'],
function(require,
        parse, parse_eager,
        stream,
        ecma_parse,
        statement, token,
        astDeclaration, astExpression, astProgram, astStatement){
"use strict";

/* Circular
 ******************************************************************************/
var statementParser = function() {
    return require('ecma/parse/statement_parser').statement.apply(undefined, arguments);
};

/* Forward declarations
 ******************************************************************************/
var sourceElements = function() {
    return sourceElements.apply(undefined, arguments);
};

/* Parsers
 ******************************************************************************/
/**
 * Parser for the body of a function.
 */
var functionBody = sourceElements;

/**
 * Parser for a function's parameters.
 */
var formalParameterList = parse_eager.sepBy(token.punctuator(','),
    token.anyIdentifier);

// Function Expression
////////////////////////////////////////
/**
 * Parser for an function expression.
 * 
 * May be named or anon.
 */
var functionExpression = parse.Parser('Function Expression',
    ecma_parse.astNode(parse.next(token.keyword('function'),
        parse.binda(
            parse.sequence(
                parse.optional(token.anyIdentifier),
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(id, parameters, body) {
                return parse.always(new astExpression.FunctionExpression(id, parameters, body));
            }))));

// Function Declaration
////////////////////////////////////////
/**
 * Parser for a function declaration.
 * 
 * Requires an identifier.
 */
var functionDeclaration = parse.Parser('Function Declaration',
    ecma_parse.astNode(parse.next(token.keyword('function'),
        parse.binda(
            parse.sequence(
                token.anyIdentifier,
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(id, params, body) {
                return parse.always(new astDeclaration.FunctionDeclaration(id, params, body));
            }))));

// Function
////////////////////////////////////////
var fn = parse.Parser('Function',
    ecma_parse.astNode(parse.next(token.keyword('function'),
        parse.binda(
            parse.sequence(
                parse.optional(token.anyIdentifier),
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(id, params, body) {
                return parse.always(id ? 
                    new astDeclaration.FunctionDeclaration(id, params, body) :
                    new astStatement.ExpressionStatement(new astExpression.FunctionExpression(id, params, body)));
            }))));

// Source Elements
////////////////////////////////////////
/**
 * Parser for an ECMAScript source element.
 * 
 * Source Elements are top level nodes that makes up a program.
 */
var sourceElement = parse.either(
    fn,
    statementParser);

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
    'functionBody': functionBody,
    'functionExpression': functionExpression,
    'functionDeclaration': functionDeclaration,
    
    'sourceElement': sourceElement,
    'sourceElements': sourceElements,
    
    'program': program
};

});