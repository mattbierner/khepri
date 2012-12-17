/**
 * @fileOverview Parser for ECMAScript 5.1 Functions and Programs.
 */
define(['require', 'statement', 'parse', 'ast', 'token'],
function(require, statement, parse, ast, token){
//"use strict";

var sourceElements = function() {
    return sourceElements.apply(undefined, arguments);
};

var statementParser = function() {
    return require('statement').statement.apply(undefined, arguments);
};

/* Parsers
 ******************************************************************************/
// Functions
////////////////////////////////////////
var functionBody = sourceElements;

var formalParameterList = parse.sepBy(token.punctuator(','), token.identifier);

/**
 * Function expression for an named or anon function.
 */
var functionExpression = parse.next(token.keyword('function'),
    parse.sequence(
        parse.optional(token.identifier),
        parse.between(token.punctuator('('), token.punctuator(')'), 
            formalParameterList),
        parse.between(token.punctuator('{'), token.punctuator('}'),
            functionBody)));

/**
 * Function declaration.
 * 
 * Requires an identifier.
 */
var functionDeclaration = parse.bind(parse.next(token.keyword('function'),
    parse.sequence(
        token.identifier,
        parse.between(token.punctuator('('), token.punctuator(')'), 
            formalParameterList),
        parse.between(token.punctuator('{'), token.punctuator('}'),
            functionBody))),
    function(seq) {
        return parse.always(ast.makeNode('FunctionDeclaration', {
            'identifier': seq[0],
            'parameters': seq[1],
            'body': seq[2]
        }));
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
   'program': program,
   'functionExpression': functionExpression,
   'functionDeclaration': functionDeclaration
};

});