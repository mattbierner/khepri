/**
 * @fileOverview Parser for ECMAScript 5.1 statements.
 */
define(['parse/parse', 'parse/parse_eager', 'ecma/lang/ast', 'ecma/parse/token', 'ecma/parse/expression'],
function(parse, parse_eager, ast, token, expression){
//"use strict";

/* Forward declarations
 ******************************************************************************/
var statement = function(){ return statement.apply(undefined, arguments); };

/* Parsres
 ******************************************************************************/
var statementList = parse.many(statement);

// Block
////////////////////////////////////////
var BlockStatementNode = function(body) {
    ast.Node.call(this, {
        'body': body
    });
};
BlockStatementNode.prototype = new ast.Node;
BlockStatementNode.prototype.type = "BlockStatement";

var blockStatement = parse.bind(
    parse.between(token.punctuator('{'), token.punctuator('}'), 
        statementList),
    function(body) {
        return parse.always(new BlockStatementNode(body));
    });

// Variable Statement
////////////////////////////////////////
var VariableStatementNode = function(list) {
    ast.Node.call(this, {
        'list': list
    });
};
VariableStatementNode.prototype = new ast.Node;
VariableStatementNode.prototype.type = "VariableStatement";

var VariableDeclarationNode = function(identifier, initialiser) {
    ast.Node.call(this, {
        'identifier': identifier,
        'initialiser': initialiser
    });
};
VariableDeclarationNode.prototype = new ast.Node;
VariableDeclarationNode.prototype.type = "VariableDeclaration";

var initialiser = parse.next(token.punctuator('='),
    expression.assignmentExpression);

var variableDeclaration = parse.binda(
    parse.sequence(
        token.identifier,
        parse.optional(initialiser)),
    function(identifier, initialiser) {
        return parse.always(new VariableDeclarationNode(identifier, initialiser));
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
        return parse.always(new VariableDeclarationNode(identifier, initialiser));
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
    function(list) {
        return parse.always(new VariableStatementNode(list));
    });

// Empty Statement
////////////////////////////////////////
var EmptyStatement = function() { };
EmptyStatement.prototype = new ast.Node;
EmptyStatement.prototype.type = "Empty";

var emptyStatement = parse.bind(token.punctuator(';'), function() {
    return parse.always(new EmptyStatement());
});

// Expression Statement
////////////////////////////////////////
var ExpressionStatement = function(expression) {
    ast.Node.call(this, {
        'expression': expression
    });
};
ExpressionStatement.prototype = new ast.Node;
ExpressionStatement.prototype.type = "ExpressionStatement";

/**
 * Statement of an expression.
 * 
 * TODO: Add lookahead checks.
 */
var expressionStatement = parse.binda(
    parse.sequence(
        expression.expression,
        token.punctuator(';')),
    function(expression) {
        return parse.always(new ExpressionStatement(expression));
    });

// If Statement
////////////////////////////////////////
var IfStatementNode = function(expression, trueStatement, falseStatement) {
    ast.Node.call(this, {
        'expression': expression,
        'trueStatement': trueStatement,
        'falseStatement': falseStatement
    });
};
IfStatementNode.prototype = new ast.Node;
IfStatementNode.prototype.type = "IfStatement";

var ifStatement = parse.binda(
    parse.sequence(
        token.keyword('if'),
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        statement,
        parse.optional(
            parse.next(token.keyword('else'),
                statement))),
    function(_, expression, trueStatement, falseStatement) {
        return parse.always(new IfStatementNode(expression, trueStatement, falseStatement));
    });

// Iteration Statement
////////////////////////////////////////
var IterationStatementNode = function() { };
IterationStatementNode.prototype = new ast.Node;

var DoIterationStatementNode = function(body, condition) {
    ast.Node.call(this, {
        'body': body,
        'condition': condition
    });
};
DoIterationStatementNode.prototype = new IterationStatementNode;
DoIterationStatementNode.prototype.type = "DoIterationStatement";

var WhileIterationStatementNode = function(condition, body) {
    ast.Node.call(this, {
        'body': body,
        'condition': condition
    });
};
WhileIterationStatementNode.prototype = new IterationStatementNode;
WhileIterationStatementNode.prototype.type = "WhileIterationStatement";

var ForIterationStatementNode = function(initialization, condition, iteration, body) {
    ast.Node.call(this, {
        'initialization': initialization,
        'condition': condition,
        'iteration': iteration,
        'body': body
    });
};
ForIterationStatementNode.prototype = new IterationStatementNode;
ForIterationStatementNode.prototype.type = "ForIterationStatement";

var ForInIterationStatementNode = function(leftExpression, inExpression, body) {
    ast.Node.call(this, {
        'leftExpression': leftExpression,
        'inExpression': inExpression,
        'body': body
    });
};
ForInIterationStatementNode.prototype = new IterationStatementNode;
ForInIterationStatementNode.prototype.type = "ForInIterationStatement";

var doIterationStatement = parse.binda(
    parse.sequence(
        token.keyword('do'),
        statement,
        token.keyword('while'),
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        token.punctuator(';')),
    function(_, statement, _, expression) {
        return parse.always(new DoIterationStatementNode(statement, expression));
    });

var whileIterationStatement = parse.binda(
    parse.sequence(
        token.keyword('while'),
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        statement),
    function(_, condition, body) {
        return parse.always(new WhileIterationStatementNode(condition, body));
    });

var forIterationStatement = parse.binda(
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
    function(_, _, initialization, _, condition, _, iteration, _, body) {
        return parse.always(
            new ForIterationStatementNode(initialization, condition, iteration, body));
    });

var forInIterationStatement = parse.binda(
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
    function(_, _, leftExpression, _, inExpression, _, body) {
        return parse.always(
            new ForInIterationStatementNode(leftExpression, inExpression, body));
    });


var iterationStatement = parse.choice(
    doIterationStatement,
    whileIterationStatement,
    parse.attempt(forIterationStatement),
    forInIterationStatement);

// Continue Statement
////////////////////////////////////////
var ContinueStatementNode = function(identifier) {
    ast.Node.call(this, {
        'identifier': identifier,
    });
};
ContinueStatementNode.prototype = new ast.Node;
ContinueStatementNode.prototype.type = "ContinueStatement";

/**
 * TODO: Add no line terminator check.
 */
var continueStatement = parse.bind(
    parse.between(token.keyword('continue'), token.punctuator(';'),
        parse.optional(token.identifier)),
    function(id) {
        return parse.always(new ContinueStatementNode(id));
    });

// Break Statement
////////////////////////////////////////
var BreakStatementNode = function(identifier) {
    ast.Node.call(this, {
        'identifier': identifier,
    });
};
BreakStatementNode.prototype = new ast.Node;
BreakStatementNode.prototype.type = "BreakStatement";

/**
 * TODO: Add no line terminator check.
 */
var breakStatement = parse.bind(
    parse.between(token.keyword('break'), token.punctuator(';'),
        parse.optional(token.identifier)),
    function(id) {
        return parse.always(new BreakStatementNode(id));
    });

// Return Statement
////////////////////////////////////////
var ReturnStatementNode = function(expression) {
    ast.Node.call(this, {
        'expression': expression
    });
};
ReturnStatementNode.prototype = new ast.Node;
ReturnStatementNode.prototype.type = "ReturnStatement";

/**
 * TODO: Add no line terminator check.
 */
var returnStatement = parse.bind(
    parse.between(token.keyword('return'), token.punctuator(';'),
        expression.expression),
    function(expr) {
        return parse.always(new ReturnStatementNode(expr));
    });

// With Statement
////////////////////////////////////////
var WithStatementNode = function(expression, statement) {
    ast.Node.call(this, {
        'expression': expression,
        'statement': statement
    });
};
WithStatementNode.prototype = new ast.Node;
WithStatementNode.prototype.type = "WithStatement";

var withStatement = parse.binda(
    parse.sequence(
        token.keyword('with'),
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression.expression),
        statement),
    function(_, expression, statement) {
        return parse.always(new WithStatementNode(expression, statement));
    });

// Labelled Statement
////////////////////////////////////////
var LabelledStatementNode = function(label, statement) {
    ast.Node.call(this, {
        'label': label,
        'statement': statement
    });
};
LabelledStatementNode.prototype = new ast.Node;
LabelledStatementNode.prototype.type = "LabelledStatement";

var labelledStatement = parse.binda(
    parse.sequence(
        token.identifier,
        token.punctuator(':'),
        statement),
    function(id, _, statement) {
        return parse.always(new LabelledStatementNode(id, statement));
    });

// Switch Statement
////////////////////////////////////////
var SwitchStatementNode = function(expression, caseClauses, defaultClause) {
    ast.Node.call(this, {
        'expression': expression,
        'caseClauses': caseClauses,
        'defaultClause': defaultClause
    });
};
SwitchStatementNode.prototype = new ast.Node;
SwitchStatementNode.prototype.type = "SwitchStatement";

var CaseNode = function(expression, body) {
    ast.Node.call(this, {
        'expression': expression,
        'body': body
    });
};
CaseNode.prototype = new ast.Node;
CaseNode.prototype.type = "Case";

var caseClause = parse.bind(parse.sequence(
    parse.next(token.keyword('case'),
        expression.expression),
    parse.next(token.punctuator(':'),
        statementList)),
    function(seq) {
        return parse.always(new CaseNode(seq[0], seq[1]));
    });

var defaultClause = parse.next(token.keyword('default'),
    parse.next(token.punctuator(':'),
        statementList));

var caseClauses = parse.many(caseClause)

var caseBlock = parse.between(token.punctuator('{'), token.punctuator('}'),
    parse.either(
        parse.attempt(parse.bind(parse.sequence(caseClauses, defaultClause, caseClauses), function(seq) {
            return parse.always({
                'caseBlocks': seq[0].concat(seq[2]),
                'defaultBlock':  seq[1]
            });
        })),
        parse.bind(caseClauses, function(v) {
            return parse.always({'caseBlocks': v});
        })));

var switchStatement = parse.bind(parse.next(token.keyword('switch'), 
    parse.sequence(
         parse.between(token.punctuator('('), token.punctuator(')'),
             expression.expression),
         caseBlock)),
    function(v) {
        return parse.always(new SwitchStatementNode(v[0], v[1].caseBlocks, v[1].defaultBlock));
    });

// Throw Statement
////////////////////////////////////////
var ThrowNode = function(expression) {
    ast.Node.call(this, {
        'expression': expression
    });
};
ThrowNode.prototype = new ast.Node;
ThrowNode.prototype.type = "Throw";

/**
 * TODO: Add no line terminator check.
 */
var throwStatement = parse.bind(parse.between(token.keyword('throw'), token.punctuator(';'),
    expression.expression),
    function(expression) {
        return parse.always(new ThrowNode(expression));
    });

// Try Statement
////////////////////////////////////////
var TryStatement = function(body, catchId, catchBody, finallyBody) {
    ast.Node.call(this, {
        'body': body,
        'catchId': catchId,
        'catchBody': catchBody,
        'finallyBody': finallyBody
    });
};
TryStatement.prototype = new ast.Node;
TryStatement.prototype.type = "Try";

var catchBlock = parse.next(token.keyword('catch'),
    parse.sequence(
        parse.between(token.punctuator('('), token.punctuator(')'),
            token.identifier),
        blockStatement));

var finallyBlock = parse.next(token.keyword('finally'),
    blockStatement);

var tryStatement = parse.bind(parse.next(token.keyword('try'),
    parse.sequence(
        blockStatement,
        parse.optional(catchBlock),
        parse.optional(finallyBlock))),
    function(seq) {
        var catchId = (seq[1].length > 0 ? seq[1][0][0][0] : undefined),
            catchBody = (seq[1].length > 0 ? seq[1][0][1][0] : undefined),
            finallyBody = (seq[2].length > 0 ? seq[2][0] : undefined);
        return parse.always(new TryStatement(seq[0], catchId, catchBody, finallyBody));
    });

// Debugger Statement
////////////////////////////////////////
var DebuggerStatementNode = function(){};
DebuggerStatementNode.prototype = new ast.Node;
DebuggerStatementNode.prototype.type = "Debugger";
    
var debuggerStatement = parse.bind(parse.next(
    token.keyword('debugger'),
    token.punctuator(';')), function() {
        return parse.always(new DebuggerStatementNode());
    });

// statement
////////////////////////////////////////
statement = parse.choice(
    parse.attempt(labelledStatement),
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

    'BlockStatementNode': BlockStatementNode,
    'VariableStatementNode': VariableStatementNode,
    'VariableDeclarationNode': VariableDeclarationNode,
    'DebuggerStatementNode': DebuggerStatementNode
};

});