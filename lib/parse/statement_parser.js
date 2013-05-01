/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define(["parse/parse", "parse/parse_eager", "ecma/parse/statement_parser", "ecma/parse/token_parser", "ecma/parse/common", "khepri/parse/expression_parser", "khepri/parse/value_parser", "ecma/ast/clause", "ecma/ast/declaration", "ecma/ast/statement"], function(parse, parse_eager, ecma_statement, token, ecma_parse, expression, value, astClause, astDeclaration, astStatement) {
    "use strict";
    var statement = function() {
        return statement.apply(undefined, arguments);
    }
    ;
    var logicalSemiColon = token.punctuator(";");
    var statementList = parse_eager.many(statement);
    var blockStatement = parse.Parser("Block Statement", ecma_parse.node(parse.between(token.punctuator("{"), token.punctuator("}"), statementList), function(loc, body) {
        return new astStatement.BlockStatement(loc, body);
    }
    ));
    var initialiser = parse.next(token.punctuator("="), expression.assignmentExpression);
    var variableDeclaration = ecma_parse.nodea(parse.sequence(value.identifier, parse.optional(initialiser)), function(loc, identifier, initialiser) {
        return new astDeclaration.VariableDeclarator(loc, identifier, initialiser);
    }
    );
    var variableDeclarationList = parse_eager.sepBy1(token.punctuator(","), variableDeclaration);
    var variableStatement = parse.Parser("Variable Statement", ecma_parse.node(parse.between(token.keyword("var"), logicalSemiColon, variableDeclarationList), function(loc, declarations) {
        return new astDeclaration.VariableDeclaration(loc, declarations);
    }
    ));
    var emptyStatement = parse.Parser("Empty Statement", ecma_parse.node(token.punctuator(";"), function(loc) {
        return new astStatement.EmptyStatement(loc);
    }
    ));
    var expressionStatement = parse.Parser("Expression Statement", ecma_parse.node(parse.then(expression.expression, logicalSemiColon), function(loc, expression) {
        return new astStatement.ExpressionStatement(loc, expression);
    }
    ));
    var ifStatement = parse.Parser("If Statement", ecma_parse.nodea(parse.next(token.keyword("if"), parse.sequence(parse.between(token.punctuator("("), token.punctuator(")"), expression.expression), statement, parse.optional(parse.next(token.keyword("else"), statement)))), function(loc, test, consequent, alternate) {
        return new astStatement.IfStatement(loc, test, consequent, alternate);
    }
    ));
    var whileStatement = parse.Parser("While Statement", ecma_parse.nodea(parse.next(token.keyword("while"), parse.sequence(parse.between(token.punctuator("("), token.punctuator(")"), expression.expression), statement)), function(loc, test, body) {
        return new astStatement.WhileStatement(loc, test, body);
    }
    ));
    var doWhileStatement = parse.Parser("Do While Statement", ecma_parse.nodea(parse.next(token.keyword("do"), parse.sequence(statement, token.keyword("while"), parse.between(token.punctuator("("), token.punctuator(")"), expression.expression), token.punctuator(";"))), function(loc, body, _0, test, _1) {
        return new astStatement.DoWhileStatement(loc, body, test);
    }
    ));
    var forStatement = parse.Parser("For Statement", ecma_parse.nodea(parse.next(token.keyword("for"), parse.sequence(token.punctuator("("), parse.optional(parse.either(ecma_parse.node(parse.next(token.keyword("var"), parse.memo(variableDeclarationList)), function(loc, declarations) {
        return new astDeclaration.VariableDeclaration(loc, declarations);
    }
    ), expression.expression)), token.punctuator(";"), parse.optional(expression.expression), token.punctuator(";"), parse.optional(expression.expression), token.punctuator(")"), statement)), function(loc, _1, init, _2, test, _3, update, _4, body) {
        return new astStatement.ForStatement(loc, init, test, update, body);
    }
    ));
    var iterationStatement = parse.Parser("Iteration Statement", parse.choice(doWhileStatement, whileStatement, forStatement));
    var continueStatement = parse.Parser("Continue Statement", ecma_parse.node(parse.next(token.keyword("continue"), logicalSemiColon), function(loc) {
        return new astStatement.ContinueStatement(loc);
    }
    ));
    var breakStatement = parse.Parser("Break Statement", ecma_parse.node(parse.next(token.keyword("break"), logicalSemiColon), function(loc) {
        return new astStatement.BreakStatement(loc);
    }
    ));
    var returnStatement = parse.Parser("Return Statement", ecma_parse.node(parse.between(token.keyword("return"), logicalSemiColon, parse.optional(expression.expression)), function(loc, argument) {
        return new astStatement.ReturnStatement(loc, argument);
    }
    ));
    var caseClause = ecma_parse.nodea(parse.next(token.keyword("case"), parse.sequence(expression.expression, token.punctuator(":"), statementList)), function(loc, test, _, consequent) {
        return new astClause.SwitchCase(loc, test, consequent);
    }
    );
    var defaultClause = ecma_parse.node(parse.next(token.keyword("default"), parse.next(token.punctuator(":"), statementList)), function(loc, consequent) {
        return new astClause.SwitchCase(loc, null, consequent);
    }
    );
    var caseClauses = parse_eager.many(caseClause);
    var caseBlock = parse.between(token.punctuator("{"), token.punctuator("}"), parse.binda(parse.sequence(parse.optional(caseClauses), parse.optional(defaultClause)), function(first, defaultClause) {
        return parse.always((defaultClause ? first.concat([defaultClause]) : first));
    }
    ));
    var switchStatement = parse.Parser("Switch Statement", ecma_parse.nodea(parse.next(token.keyword("switch"), parse.sequence(parse.between(token.punctuator("("), token.punctuator(")"), expression.expression), caseBlock)), function(loc, discriminant, cases) {
        return new astStatement.SwitchStatement(loc, discriminant, cases);
    }
    ));
    var throwStatement = parse.Parser("Throw Statement", ecma_parse.node(parse.between(token.keyword("throw"), logicalSemiColon, expression.expression), function(loc, argument) {
        return new astStatement.ThrowStatement(loc, argument);
    }
    ));
    var catchBlock = ecma_parse.nodea(parse.next(token.keyword("catch"), parse.sequence(parse.between(token.punctuator("("), token.punctuator(")"), value.identifier), blockStatement)), function(loc, param, body) {
        return new astClause.CatchClause(loc, param, null, body);
    }
    );
    var finallyBlock = parse.next(token.keyword("finally"), blockStatement);
    var tryStatement = parse.Parser("Try Statement", ecma_parse.nodea(parse.next(token.keyword("try"), parse.sequence(blockStatement, parse.optional(catchBlock), parse.optional(finallyBlock))), function(loc, block, handler, finalizer) {
        return new astStatement.TryStatement(loc, block, handler, finalizer);
    }
    ));
    var debuggerStatement = parse.Parser("Debugger Statement", ecma_parse.node(parse.next(token.keyword("debugger"), token.punctuator(";")), function(loc) {
        return new astStatement.DebuggerStatement(loc);
    }
    ));
    (statement = parse.Parser("Statement", parse.expected("statement", parse.choice(blockStatement, variableStatement, emptyStatement, ifStatement, iterationStatement, continueStatement, breakStatement, returnStatement, switchStatement, throwStatement, tryStatement, debuggerStatement, expressionStatement))));
    return ({
        "blockStatement": blockStatement,
        "variableStatement": variableStatement,
        "emptyStatement": emptyStatement,
        "expressionStatement": expressionStatement,
        "ifStatement": ifStatement,
        "iterationStatement": iterationStatement,
        "continueStatement": continueStatement,
        "breakStatement": breakStatement,
        "returnStatement": returnStatement,
        "switchStatement": switchStatement,
        "throwStatement": throwStatement,
        "tryStatement": tryStatement,
        "debuggerStatement": debuggerStatement,
        "statement": statement
    });
}
);
