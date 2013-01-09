/**
 * @fileOverview Parser for ECMAScript 5.1 Functions and Programs.
 */
define(['require', 'ecma/parse/statement', 'parse/parse', 'ecma/lang/ast', 'ecma/parse/token'],
function(require, statement, parse, ast, token){
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

var formalParameterList = parse.sepBy(token.punctuator(','), token.identifier);

// Function Expression
////////////////////////////////////////
var FunctionExpressionNode = function(id, parameters, body) {
    return ast.Node.call(this, {
        'identifier': id,
        'parameters': parameters,
        'body': body
    });
};
FunctionExpressionNode.prototype = new ast.Node;
FunctionExpressionNode.prototype.type = "FunctionExpression";

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
        return parse.always(new FunctionExpressionNode(id[0], parameters, body));
    });

// Function Declaration
////////////////////////////////////////
var FunctionDeclarationNode = function(id, parameters, body) {
    return ast.Node.call(this, {
        'identifier': id,
        'parameters': parameters,
        'body': body
    });
};
FunctionDeclarationNode.prototype = new ast.Node;
FunctionDeclarationNode.prototype.type = "FunctionDeclaration";

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
    function(_, id, parameters, body) {
        return parse.always(new FunctionDeclarationNode(id, parameters, body));
    });

// Source Elements
////////////////////////////////////////
var sourceElement = parse.either(
    parse.attempt(statementParser),
    functionDeclaration);

sourceElements = parse.many(sourceElement);

// Program
////////////////////////////////////////
var ProgramNode = function(elements) {
    ast.Node.call(this, {
        'elements': elements
    });
};
ProgramNode.prototype = new ast.Node;
ProgramNode.prototype.type = "Program";

/**
 * ECMAScript 5.1 program.
 */
var program = parse.bind(sourceElements, function(elements) {
    return parse.always(new ProgramNode(elements));
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