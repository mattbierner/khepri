/**
 * @fileOverview Parser for ECMAScript 5.1 statements.
 */
define(['parse/parse', 'parse/parse_eager',
        'ecma/ast/declaration', 'ecma/ast/statement',
        'ecma/parse/token', 'ecma/parse/expression'],
function(parse, parse_eager,
        astDeclaration, astStatement,
        token, expression){
"use strict";

/* Forward declarations
 ******************************************************************************/
var statement = function(){ return statement.apply(undefined, arguments); };

/* Parsers
 ******************************************************************************/
var statementList = parse_eager.many(statement);

// Block
////////////////////////////////////////
/**
 * 
 */
var blockStatement = parse.bind(
    parse.between(token.punctuator('{'), token.punctuator('}'), 
        statementList),
    function(body) {
        return parse.always(new astStatement.BlockStatement(body));
    });

// Variable Statement
////////////////////////////////////////
var initialiser = parse.next(token.punctuator('='),
    expression.assignmentExpression);

var variableDeclaration = parse.binda(
    parse.sequence(
        token.identifier,
        parse.optional(initialiser)),
    function(identifier, initialiser) {
        return parse.always(new astDeclaration.VariableDeclarator(identifier, initialiser));
    });

var variableDeclarationList = parse_eager.sepBy(token.punctuator(','),
    variableDeclaration);

var initialiserNoIn = parse.next(token.punctuator('='),
    expression.assignmentExpressionNoIn);

var variableDeclarationNoIn = parse.binda(
    parse.sequence(
        token.identifier,
        parse.optional(initialiserNoIn)),
    function(identifier, initialiser) {
        return parse.always(new astDeclaration.VariableDeclarator(identifier, initialiser));
    });

var variableDeclarationListNoIn = parse.sepBy(token.punctuator(','),
    variableDeclarationNoIn);

/**
 * Parser for a variable statement which declares one or more variables with
 * optional initializer values.
 */
var variableStatement = parse.bind(
    parse.between(token.keyword('var'), token.punctuator(';'),
        variableDeclarationList),
    function(declarations) {
        return parse.always(new astDeclaration.VariableDeclaration(declarations, 'var'));
    });


/**
 * 
 */
var emptyStatement = parse.bind(
    token.punctuator(';'),
    function() {
        return parse.always(new astStatement.EmptyStatement());
    });

// Expression
////////////////////////////////////////
/**
 * @TODO: Add lookahead checks.
 */
var expressionStatement = parse.binda(
    parse.sequence(
        expression.expression,
        token.punctuator(';')),
    function(expression) {
        return parse.always(new astStatement.ExpressionStatement(expression));
    });

// If
////////////////////////////////////////
/**
 * 
 */
var ifStatement = parse.binda(
    parse.sequence(
        token.keyword('if'),
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        statement,
        parse.optional(
            parse.next(token.keyword('else'),
                statement))),
    function(_, test, consequent, alternate) {
        return parse.always(new astStatement.IfStatement(test, consequent, alternate));
    });

// Iteration
////////////////////////////////////////
/**
 * 
 */
var whileStatement = parse.binda(
    parse.sequence(
        token.keyword('while'),
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        statement),
    function(_, test, body) {
        return parse.always(new astStatement.WhileStatement(test, body));
    });

/**
 * 
 */
var doWhileStatement = parse.binda(
    parse.sequence(
        token.keyword('do'),
        statement,
        token.keyword('while'),
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        token.punctuator(';')),
    function(_1, body, _2, test) {
        return parse.always(new astStatement.DoStatement(body, test));
    });

/**
 * 
 */
var forStatement = parse.binda(
    parse.sequence(
        token.keyword('for'),
        token.punctuator('('),
        parse.either(
            parse.next(token.keyword('var'),
                variableDeclarationListNoIn),
            parse.optional(expression.expressionNoIn)),
        token.punctuator(';'),
        parse.optional(expression.expressionNoIn),
        token.punctuator(';'),
        parse.optional(expression.expressionNoIn),
        token.punctuator(')'),
        statement),
    function(_1, _2, init, _3, test, _4, update, _5, body) {
        return parse.always(new astStatement.ForStatement(init, test, update, body));
    });

/**
 * 
 */
var forInStatement = parse.binda(
    parse.sequence(
        token.keyword('for'),
        token.punctuator('('),
        parse.either(
            parse.next(token.keyword('var'),
                variableDeclarationListNoIn),
            expression.leftHandSideExpression),
        token.keyword('in'),
        expression.expressionNoIn,
        token.punctuator(')'),
        statement),
    function(_1, _2, left, _3, right, _4, body) {
        return parse.always(new astStatement.ForInStatement(left, right, body));
    });

/**
 * 
 */
var iterationStatement = parse.choice(
    parse.attempt(doWhileStatement),
    parse.attempt(whileStatement),
    parse.attempt(forStatement),
    forInStatement);

// Continue
////////////////////////////////////////
/**
 * TODO: Add no line terminator check.
 */
var continueStatement = parse.bind(
    parse.between(token.keyword('continue'), token.punctuator(';'),
        parse.optional(token.identifier)),
    function(label) {
        return parse.always(new astStatement.ContinueStatement(label));
    });

// Break
////////////////////////////////////////
/**
 * TODO: Add no line terminator check.
 */
var breakStatement = parse.bind(
    parse.between(token.keyword('break'), token.punctuator(';'),
        parse.optional(token.identifier)),
    function(label) {
        return parse.always(new astStatement.BreakStatement(label));
    });

// Return
////////////////////////////////////////
/**
 * TODO: Add no line terminator check.
 */
var returnStatement = parse.bind(
    parse.between(token.keyword('return'), token.punctuator(';'),
        expression.expression),
    function(argument) {
        return parse.always(new astStatement.ReturnStatement(argument));
    });

// With
////////////////////////////////////////
/**
 * 
 */
var withStatement = parse.binda(
    parse.sequence(
        token.keyword('with'),
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        statement),
    function(_, object, body) {
        return parse.always(new astStatement.WhitStatement(object, body));
    });

// Labeled
////////////////////////////////////////
/**
 * 
 */
var labeledStatement = parse.binda(
    parse.sequence(
        token.identifier,
        token.punctuator(':'),
        statement),
    function(label, _, body) {
        return parse.always(new astStatement.LabeledStatement(label, body));
    });

// Switch
////////////////////////////////////////
var caseClause = parse.binda(
    parse.sequence(
        token.keyword('case'),
        expression.expression,
        token.punctuator(':'),
        statementList),
    function(_1, test, _2, consequent) {
        return parse.always(new astClause.CaseClause(test, consequent));
    });

var defaultClause = parse.bind(
    parse.next(token.keyword('default'),
        parse.next(token.punctuator(':'),
            statementList)),
    function(consequent) {
        return parse.always(new astClause.CaseClause(null, consequent));
    });

var caseClauses = parse.many(caseClause);

var caseBlock = parse.between(token.punctuator('{'), token.punctuator('}'),
    parse.binda(
        parse.sequence(
            parse.optional(caseClauses, []),
            parse.optional(defaultClause, []),
            parse.optional(caseClauses, [])),
        function(first, defaultClause, rest) {
            return parse.always(first.concat([defaultClause], rest));
        }));

/**
 * 
 */
var switchStatement = parse.binda(
    parse.sequence(
        token.keyword('switch'), 
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        caseBlock),
    function(_1, discriminant, cases) {
        return parse.always(new astStatement.SwitchStatement(discriminant, cases));
    });

// Throw
////////////////////////////////////////
/**
 * TODO: Add no line terminator check.
 */
var throwStatement = parse.bind(
    parse.between(token.keyword('throw'), token.punctuator(';'),
        expression.expression),
    function(argument) {
        return parse.always(new astStatement.ThrowStatement(argument));
    });

// Try
////////////////////////////////////////
var catchBlock = parse.next(token.keyword('catch'),
    parse_eager.sequence(
        parse.between(token.punctuator('('), token.punctuator(')'),
            token.identifier),
        blockStatement));

var finallyBlock = parse.next(token.keyword('finally'),
    blockStatement);

/**
 * 
 */
var tryStatement = parse.binda(
    parse.sequence(
        token.keyword('try'),
        blockStatement,
        parse.optional(catchBlock),
        parse.optional(finallyBlock)),
    function(_, tryBlock, catchBlock, finallyBlock) {
        var catchId = (catchBlock ? catchBlock[0] : undefined),
            catchBody = (catchBlock ? catchBlock[1] : undefined);
        return parse.always(new astStatement.TryStatement(tryBlock, catchId, catchBody, finallyBlock));
    });

// Debugger
////////////////////////////////////////
/**
 * Parser for a debugger astStatement.
 */
var debuggerStatement = parse.bind(
    parse.sequence(
        token.keyword('debugger'),
        token.punctuator(';')),
    function() {
        return parse.always(new astStatement.DebuggerStatement());
    });

// statement
////////////////////////////////////////
statement = parse.choice(
    parse.attempt(labeledStatement),
    parse.attempt(blockStatement),
    variableStatement,
    emptyStatement,
    expressionStatement,
    ifStatement,
    iterationStatement,
    continueStatement,
    breakStatement,
    returnStatement,
    withStatement,
    switchStatement,
    throwStatement,
    tryStatement,
    debuggerStatement);

/* Export
 ******************************************************************************/
return {
    'statement': statement,
    'blockStatement': blockStatement,
    'variableStatement': variableStatement,
    'debuggerStatement': debuggerStatement,
};

});