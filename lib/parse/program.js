/**
 * @fileOverview Parser for ECMAScript 5.1 Functions and Programs.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'stream',
        'ecma/parse/statement',
        'ecma/parse/token'],
function(require,
        parse, parse_eager,
        stream,
        statement,
        token){
"use strict";

/* Circular
 ******************************************************************************/
var statementParser = function() {
    return require('ecma/parse/statement').statement.apply(undefined, arguments);
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
    parse.next(token.keyword('function'),
        parse.binda(
            parse.sequence(
                parse.optional(token.anyIdentifier),
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(id, parameters, body, state) {
                return parse.always(new state.ast.expression.FunctionExpression(id, parameters, body));
            })));

// Function Declaration
////////////////////////////////////////
/**
 * Parser for a function declaration.
 * 
 * Requires an identifier.
 */
var functionDeclaration = parse.Parser('Function Declaration',
    parse.next(token.keyword('function'),
        parse.binda(
            parse.sequence(
                token.anyIdentifier,
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(id, params, body, state) {
                return parse.always(new state.ast.declaration.FunctionDeclaration(id, params, body));
            })));

// Function
////////////////////////////////////////
var fn = parse.Parser('Function',
    parse.next(token.keyword('function'),
        parse.binda(
            parse.sequence(
                parse.optional(token.anyIdentifier),
                parse.between(token.punctuator('('), token.punctuator(')'), 
                    formalParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(id, params, body, state) {
                return parse.always(id ? 
                    new state.ast.declaration.FunctionDeclaration(id, params, body) :
                    new state.ast.expression.FunctionExpression(id, params, body));
            })));

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
var program = parse.bind(
    sourceElements,
    function(elements, state) {
        return parse.always(new state.ast.program.Program(elements));
    });

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