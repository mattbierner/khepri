/**
 * @fileOverview Parser for ECMAScript 5.1 statements.
 */
define(['parse/parse', 'parse/parse_eager',
        'ecma/parse/token', 'ecma/parse/expression'],
function(parse, parse_eager,
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
        function(body, state) {
            return parse.always(new state.ast.statement.BlockStatement(body));
        }));

// Variable Statement
////////////////////////////////////////
var initialiser = parse.next(token.punctuator('='),
    expression.assignmentExpression);

var initialiserNoIn = parse.next(token.punctuator('='),
    expression.assignmentExpressionNoIn);

var variableDeclaration = parse.binda(
    parse.sequence(
        token.anyIdentifier,
        parse.optional(initialiser)),
    function(identifier, initialiser, state) {
        return parse.always(new state.ast.declaration.VariableDeclarator(identifier, initialiser));
    });

var variableDeclarationNoIn = parse.binda(
    parse.sequence(
        token.anyIdentifier,
        parse.optional(initialiserNoIn)),
    function(identifier, initialiser, state) {
        return parse.always(new state.ast.declaration.VariableDeclarator(identifier, initialiser));
    });

var variableDeclarationList = parse_eager.sepBy1(token.punctuator(','),
    variableDeclaration);

var variableDeclarationListNoIn = parse_eager.sepBy1(token.punctuator(','),
    variableDeclarationNoIn);

/**
 * Parser for a variable statement which declares one or more variables with
 * optional initializer values.
 */
var variableStatement = parse.Parser('Variable Statement', 
    parse.bind(
        parse.between(token.keyword('var'), logicalSemiColon,
            variableDeclarationList),
        function(declarations, state) {
            return parse.always(new state.ast.declaration.VariableDeclaration(declarations, 'var'));
        }));

// Empty Statement
////////////////////////////////////////
/**
 * 
 */
var emptyStatement = parse.Parser('Empty Statement',
    parse.bind(
        token.punctuator(';'),
        function(_, state) {
            return parse.always(new state.ast.statement.EmptyStatement());
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
        function(expression, _, state) {
            return parse.always(new state.ast.statement.ExpressionStatement(expression));
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
            function(test, consequent, alternate, state) {
                return parse.always(new state.ast.statement.IfStatement(test, consequent, alternate));
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
            function(test, body, state) {
                return parse.always(new state.ast.statement.WhileStatement(test, body));
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
            function(body, _0, test, _1, state) {
                return parse.always(new state.ast.statement.DoStatement(body, test));
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
                        parse.next(token.keyword('var'),
                            parse.memo(variableDeclarationListNoIn)),
                        expression.expressionNoIn)),
                token.punctuator(';'),
                parse.optional(expression.expressionNoIn),
                token.punctuator(';'),
                parse.optional(expression.expressionNoIn),
                token.punctuator(')'),
                statement),
            function(_1, init, _2, test, _3, update, _4, body, state) {
                return parse.always(new state.ast.statement.ForStatement(init, test, update, body));
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
                    parse.next(token.keyword('var'),
                        parse.memo(variableDeclarationListNoIn)),
                    expression.leftHandSideExpression),
                token.keyword('in'),
                expression.expressionNoIn,
                token.punctuator(')'),
                statement),
            function(_1, left, _2, right, _3, body, state) {
                return parse.always(new state.ast.statement.ForInStatement(left, right, body));
            })));

/**
 * 
 */
var iterationStatement = parse.Parser('Iteration Statement',
    parse.backtrack(parse.choice(
        doWhileStatement,
        whileStatement,
        parse.attempt(forInStatement),
        forStatement)));

// Continue
////////////////////////////////////////
/**
 */
var continueStatement = parse.Parser('Continue Statement',
    parse.bind(
        parse.between(token.keyword('continue'), logicalSemiColon,
            parse.optional(noLineTerminator(token.anyIdentifier))),
        function(label, state) {
            return parse.always(new state.ast.statement.ContinueStatement(label));
        }));

// Break
////////////////////////////////////////
/**
 */
var breakStatement = parse.Parser('Break Statement',
    parse.bind(
        parse.between(token.keyword('break'), logicalSemiColon,
            parse.optional(noLineTerminator(token.anyIdentifier))),
        function(label, state) {
            return parse.always(new state.ast.statement.BreakStatement(label));
        }));

// Return
////////////////////////////////////////
/**
 */
var returnStatement = parse.Parser('Return Statement',
    parse.bind(
        parse.between(token.keyword('return'), logicalSemiColon,
            parse.optional(noLineTerminator(expression.expression))),
        function(argument, state) {
            return parse.always(new state.ast.statement.ReturnStatement(argument));
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
            function(object, body, state) {
                return parse.always(new state.ast.statement.WithStatement(object, body));
            })));

// Labeled
////////////////////////////////////////
/**
 * 
 */
var labeledStatement = parse.Parser('Labeled Statement',
    parse.binda(
        parse.sequence(
            token.anyIdentifier,
            token.punctuator(':'),
            statement),
        function(label, _, body, state) {
            return parse.always(new state.ast.statement.LabeledStatement(label, body));
        }));

// Switch
////////////////////////////////////////
var caseClause = parse.binda(
    parse.sequence(
        token.keyword('case'),
        expression.expression,
        token.punctuator(':'),
        statementList),
    function(_0, test, _1, consequent, state) {
        return parse.always(new state.ast.clause.SwitchCase(test, consequent));
    });

var defaultClause = parse.bind(
    parse.next(token.keyword('default'),
        parse.next(token.punctuator(':'),
            statementList)),
    function(consequent, state) {
        return parse.always(new state.ast.clause.CaseClause(null, consequent));
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
            function(discriminant, cases, state) {
                return parse.always(new state.ast.statement.SwitchStatement(discriminant, cases));
            })));

// Throw
////////////////////////////////////////
/**
 */
var throwStatement = parse.Parser('Throw Statement',
    parse.bind(
        parse.between(token.keyword('throw'), logicalSemiColon,
            noLineTerminator(expression.expression)),
        function(argument, state) {
            return parse.always(new state.ast.statement.ThrowStatement(argument));
        }));

// Try
////////////////////////////////////////
var catchBlock = parse.next(token.keyword('catch'),
    parse.binda(
        parse.sequence(
            parse.between(token.punctuator('('), token.punctuator(')'),
                token.anyIdentifier),
            blockStatement),
        function(param, body, state) {
            return parse.always(new state.ast.clause.CatchClause(param, null, body));
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
            function(block, handler, finalizer, state) {
                return parse.always(new state.ast.statement.TryStatement(block, handler, [], finalizer));
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
            function(_, state) {
                return parse.always(new state.ast.statement.DebuggerStatement());
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