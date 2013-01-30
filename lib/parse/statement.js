/**
 * @fileOverview Parser for ECMAScript 5.1 statements.
 */
define(['parse/parse', 'parse/parse_eager',
        'ecma/ast/clause','ecma/ast/declaration', 'ecma/ast/statement',
        'ecma/parse/token', 'ecma/parse/expression'],
function(parse, parse_eager,
        astClause, astDeclaration, astStatement,
        token, expression){
"use strict";

/* Forward declarations
 ******************************************************************************/
var statement = function(){ return statement.apply(undefined, arguments); };

/* Helper 
 ******************************************************************************/
/**
 * Matches a logical semicolon in the grammar.
 * 
 * Based on:
 *    'OMeta: an Object-Oriented Language for Pattern Matching',
 *    Alessandro, Warth, Ian Piumarta 2007
 */
var logicalSemiColon = parse.choice(
    token.punctuator(';'),
    parse.lookahead(token.punctuator('}')),
    token.lineTerminator,
    parse.eof());

var noLineTerminator = function(p) {
    return parse.next(parse.lookahead(parse.token(function(tok) {
        return !tok.lineTerminator;
    })), p);
};

/* Parsers
 ******************************************************************************/
var statementList = parse_eager.many(statement);

// Block
////////////////////////////////////////
/**
 * 
 */
var blockStatement = parse.Parser('Block Statement',
    parse.bind(
        parse.between(token.punctuator('{'), token.punctuator('}'), 
            statementList),
        function(body) {
            return parse.always(new astStatement.BlockStatement(body));
        }));

// Variable Statement
////////////////////////////////////////
var initialiser = parse.next(token.punctuator('='),
    expression.assignmentExpression);

var initialiserNoIn = parse.next(token.punctuator('='),
    expression.assignmentExpressionNoIn);

var variableDeclaration = parse.binda(
    parse.sequence(
        token.identifier,
        parse.optional(initialiser)),
    function(identifier, initialiser) {
        return parse.always(new astDeclaration.VariableDeclarator(identifier, initialiser));
    });

var variableDeclarationNoIn = parse.binda(
    parse.sequence(
        token.identifier,
        parse.optional(initialiserNoIn)),
    function(identifier, initialiser) {
        return parse.always(new astDeclaration.VariableDeclarator(identifier, initialiser));
    });

var variableDeclarationList = parse_eager.sepBy(token.punctuator(','),
    variableDeclaration);

var variableDeclarationListNoIn = parse_eager.sepBy(token.punctuator(','),
    variableDeclarationNoIn);

/**
 * Parser for a variable statement which declares one or more variables with
 * optional initializer values.
 */
var variableStatement = parse.Parser('Variable Statement', 
    parse.bind(
        parse.between(token.keyword('var'), logicalSemiColon,
            variableDeclarationList),
        function(declarations) {
            return parse.always(new astDeclaration.VariableDeclaration(declarations, 'var'));
        }));

// Empty Statement
////////////////////////////////////////
/**
 * 
 */
var emptyStatement = parse.Parser('Empty Statement',
    parse.bind(
        token.punctuator(';'),
        function() {
            return parse.always(new astStatement.EmptyStatement());
        }));

// Expression
////////////////////////////////////////
/**
 * @TODO: Add lookahead not 'function' check?
 */
var expressionStatement = parse.Parser('Expression Statement',
    parse.binda(
        parse.sequence(
            expression.expression,
            logicalSemiColon),
        function(expression) {
            return parse.always(new astStatement.ExpressionStatement(expression));
        }));

// If
////////////////////////////////////////
/**
 * 
 */
var ifStatement = parse.Parser('If Statement',
    parse.next(token.keyword('if'),
        parse.binda(
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement,
                parse.optional(parse.next(token.keyword('else'),
                    statement))),
            function(test, consequent, alternate) {
                return parse.always(new astStatement.IfStatement(test, consequent, alternate));
            })));

// Iteration
////////////////////////////////////////
/**
 * 
 */
var whileStatement = parse.Parser('While Statement',
    parse.next(token.keyword('while'),
        parse.binda(
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement),
            function(test, body) {
                return parse.always(new astStatement.WhileStatement(test, body));
            })));

/**
 * 
 */
var doWhileStatement = parse.Parser('Do While Statement',
    parse.next(token.keyword('do'),
        parse.binda(
            parse.sequence(
                statement,
                token.keyword('while'),
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                token.punctuator(';')),
            function(body, _2, test) {
                return parse.always(new astStatement.DoStatement(body, test));
            })));

/**
 * 
 */
var forStatement = parse.Parser('For Statement',
    parse.next(token.keyword('for'),
        parse.binda(
            parse.sequence(
                token.punctuator('('),
                parse.optional(
                    parse.either(
                        parse.attempt(parse.next(token.keyword('var'),
                            parse.memo(variableDeclarationListNoIn))),
                        expression.expressionNoIn)),
                token.punctuator(';'),
                parse.optional(expression.expressionNoIn),
                token.punctuator(';'),
                parse.optional(expression.expressionNoIn),
                token.punctuator(')'),
                statement),
            function(_1, init, _2, test, _3, update, _4, body) {
                return parse.always(new astStatement.ForStatement(init, test, update, body));
            })));

/**
 * 
 */
var forInStatement = parse.Parser('For In Statement',
    parse.next(token.keyword('for'),
        parse.binda(
            parse.sequence(
                token.punctuator('('),
                parse.either(
                    parse.attempt(parse.next(token.keyword('var'),
                        parse.memo(variableDeclarationListNoIn))),
                    expression.leftHandSideExpression),
                token.keyword('in'),
                expression.expressionNoIn,
                token.punctuator(')'),
                statement),
            function(_1, left, _2, right, _3, body) {
                return parse.always(new astStatement.ForInStatement(left, right, body));
            })));

/**
 * 
 */
var iterationStatement = parse.Parser('Iteration Statement',
    parse.choice(
        parse.attempt(doWhileStatement),
        parse.attempt(whileStatement),
        parse.attempt(forStatement),
        forInStatement));

// Continue
////////////////////////////////////////
/**
 */
var continueStatement = parse.Parser('Continue Statement',
    parse.bind(
        parse.between(token.keyword('continue'), logicalSemiColon,
            parse.optional(noLineTerminator(token.identifier))),
        function(label) {
            return parse.always(new astStatement.ContinueStatement(label));
        }));

// Break
////////////////////////////////////////
/**
 */
var breakStatement = parse.Parser('Break Statement',
    parse.bind(
        parse.between(token.keyword('break'), logicalSemiColon,
            parse.optional(noLineTerminator(token.identifier))),
        function(label) {
            return parse.always(new astStatement.BreakStatement(label));
        }));

// Return
////////////////////////////////////////
/**
 */
var returnStatement = parse.Parser('Return Statement',
    parse.bind(
        parse.between(token.keyword('return'), logicalSemiColon,
            parse.optional(noLineTerminator(expression.expression))),
        function(argument) {
            return parse.always(new astStatement.ReturnStatement(argument));
        }));

// With
////////////////////////////////////////
/**
 * 
 */
var withStatement = parse.Parser('With Statement',
    parse.next(token.keyword('with'),
        parse.binda(
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                statement),
            function(object, body) {
                return parse.always(new astStatement.WithStatement(object, body));
            })));

// Labeled
////////////////////////////////////////
/**
 * 
 */
var labeledStatement = parse.Parser('Labeled Statement',
    parse.binda(
        parse.sequence(
            token.identifier,
            token.punctuator(':'),
            statement),
        function(label, _, body) {
            return parse.always(new astStatement.LabeledStatement(label, body));
        }));

// Switch
////////////////////////////////////////
var caseClause = parse.binda(
    parse.sequence(
        token.keyword('case'),
        expression.expression,
        token.punctuator(':'),
        statementList),
    function(_1, test, _2, consequent) {
        return parse.always(new astClause.SwitchCase(test, consequent));
    });

var defaultClause = parse.bind(
    parse.next(token.keyword('default'),
        parse.next(token.punctuator(':'),
            statementList)),
    function(consequent) {
        return parse.always(new astClause.CaseClause(null, consequent));
    });

var caseClauses = parse_eager.many(caseClause);

var caseBlock = parse.between(token.punctuator('{'), token.punctuator('}'),
    parse.binda(
        parse.sequence(
            parse.optional(caseClauses),
            parse.optional(defaultClause),
            parse.optional(caseClauses)),
        function(first, defaultClause, rest) {
            if (defaultClause) {
                first = first.concat([defaultClause]);
            }
            return parse.always(first.concat(rest));
        }));

/**
 * 
 */
var switchStatement = parse.Parser('Switch Statement',
    parse.next(token.keyword('switch'),
        parse.binda(
            parse.sequence(
                parse.between(token.punctuator('('), token.punctuator(')'),
                    expression.expression),
                caseBlock),
            function(discriminant, cases) {
                return parse.always(new astStatement.SwitchStatement(discriminant, cases));
            })));

// Throw
////////////////////////////////////////
/**
 */
var throwStatement = parse.Parser('Throw Statement',
    parse.bind(
        parse.between(token.keyword('throw'), logicalSemiColon,
            noLineTerminator(expression.expression)),
        function(argument) {
            return parse.always(new astStatement.ThrowStatement(argument));
        }));

// Try
////////////////////////////////////////
var catchBlock = parse.next(token.keyword('catch'),
    parse.binda(
        parse.sequence(
            parse.between(token.punctuator('('), token.punctuator(')'),
                token.identifier),
            blockStatement),
        function(param, body) {
            return parse.always(new astClause.CatchClause(param, body));
        }));

var finallyBlock = parse.next(token.keyword('finally'),
    blockStatement);

/**
 * 
 */
var tryStatement = parse.Parser('Try Statement',
    parse.next(token.keyword('try'),
        parse.binda(
            parse.sequence(
                blockStatement,
                parse.optional(catchBlock),
                parse.optional(finallyBlock)),
            function(block, handler, finalizer) {
                return parse.always(new astStatement.TryStatement(block, handler, finalizer));
            })));

// Debugger
////////////////////////////////////////
/**
 * Parser for a debugger statement.
 */
var debuggerStatement = parse.Parser('Debugger Statement',
    parse.next(token.keyword('debugger'),
        parse.bind(
            token.punctuator(';'),
            function() {
                return parse.always(new astStatement.DebuggerStatement());
            })));

// statement
////////////////////////////////////////
/**
 * 
 */
statement = parse.Parser('Statement',
    parse.choice(
        parse.attempt(labeledStatement),
        parse.attempt(blockStatement),
        variableStatement,
        emptyStatement,
        ifStatement,
        iterationStatement,
        continueStatement,
        breakStatement,
        returnStatement,
        withStatement,
        switchStatement,
        throwStatement,
        tryStatement,
        debuggerStatement,
        expressionStatement));

/* Export
 ******************************************************************************/
return {
    'blockStatement': blockStatement,
    'variableStatement': variableStatement,
    'emptyStatement': emptyStatement,
    'expressionStatement': expressionStatement,
    'ifStatement': ifStatement,
    'iterationStatement': iterationStatement,
    'continueStatement': continueStatement,
    'breakStatement': breakStatement,
    'returnStatement': returnStatement,
    'withStatement': withStatement,
    'labeledStatement': labeledStatement,
    'switchStatement': switchStatement,
    'throwStatement': throwStatement,
    'tryStatement': tryStatement,
    'debuggerStatement': debuggerStatement,
    
    'statement': statement,
};

});