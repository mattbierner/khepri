/**
 * @fileOverview Parser for ECMAScript 5.1 Functions and Programs.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'stream',
        'ecma/parse/statement',
        'ecma/ast/declaration', 'ecma/ast/expression', 'ecma/ast/program',
        'ecma/parse/token'],
function(require, parse, parse_eager, stream, statement, astDeclaration, astExpression, astProgram, token){
//"use strict";

/* Forward declarations
 ******************************************************************************/
var sourceElements = function() {
    return sourceElements.apply(undefined, arguments);
};

var statementParser = function() {
    return require('ecma/parse/statement').statement.apply(undefined, arguments);
};

/* Parsers
 ******************************************************************************/
var functionBody = sourceElements;

var formalParameterList = parse_eager.sepBy(token.punctuator(','),
    token.identifier);

// Function Expression
////////////////////////////////////////
/**
 * Function expression for an named or anon function.
 */
var functionExpression = parse.binda(
    parse.sequence(
        token.keyword('function'),
        parse.optional(token.identifier),
        parse.between(token.punctuator('('), token.punctuator(')'), 
            formalParameterList),
        parse.between(token.punctuator('{'), token.punctuator('}'),
            functionBody)),
    function(_, id, parameters, body) {
        return parse.always(new astExpression.FunctionExpression(id, parameters, body));
    });

// Function Declaration
////////////////////////////////////////
/**
 * Function declaration.
 * 
 * Requires an identifier.
 */
var functionDeclaration = parse.binda(
    parse.sequence(
        token.keyword('function'),
        token.identifier,
        parse.between(token.punctuator('('), token.punctuator(')'), 
            formalParameterList),
        parse.between(token.punctuator('{'), token.punctuator('}'),
            functionBody)),
    function(_, id, params, body) {
        return parse.always(new astDeclaration.FunctionDeclarations(id, parameters, body));
    });

// Source Elements
////////////////////////////////////////
var sourceElement = parse.either(
    parse.attempt(statementParser),
    functionDeclaration);

sourceElements = parse_eager.many(sourceElement);

// Program
////////////////////////////////////////
/**
 * ECMAScript 5.1 program.
 */
var program = parse.bind(
    sourceElements,
    function(elements) {
        return parse.always(new astProgram.Program(elements));
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