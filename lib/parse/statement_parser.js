/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "parse/lang", "ecma/parse/token_parser", "ecma/parse/common", "khepri_ast/clause", "khepri_ast/declaration", "khepri_ast/statement", "khepri/parse/expression_parser", "khepri/parse/value_parser"], function(parse, parse_lang, token, ecma_parse, ast_clause, ast_declaration, ast_statement, expression, value) {
    "use strict";
    var statement = function() {
        return statement.apply(undefined, arguments);
    }
    ;
    var logicalSemiColon = token.punctuator(";");
    var statementList = parse.eager(parse.many(statement));
    var topLevelExpression = parse.either(parse.attempt(expression.assignmentExpression), expression.expression);
    var blockStatement = parse.Parser("Block Statement", ecma_parse.node(parse_lang.between(token.punctuator("{"), token.punctuator("}"), statementList), ast_statement.BlockStatement.create));
    var staticDeclaration = ecma_parse.node(value.identifier, ast_declaration.StaticDeclarator.create);
    var staticDeclarationList = parse.eager(parse_lang.sepBy1(token.punctuator(","), staticDeclaration));
    var staticStatement = parse.Parser("Static Statement", ecma_parse.node(parse_lang.between(token.keyword("static"), logicalSemiColon, staticDeclarationList), ast_declaration.StaticDeclaration.create));
    var initialiser = parse.next(token.punctuator("="), topLevelExpression);
    var variableDeclaration = ecma_parse.nodea(parse.enumeration(value.identifier, parse.optional(null, initialiser)), ast_declaration.VariableDeclarator.create);
    var variableDeclarationList = parse.eager(parse_lang.sepBy1(token.punctuator(","), variableDeclaration));
    var variableStatement = parse.Parser("Variable Statement", ecma_parse.node(parse_lang.between(token.keyword("var"), logicalSemiColon, variableDeclarationList), ast_declaration.VariableDeclaration.create));
    var emptyStatement = parse.Parser("Empty Statement", ecma_parse.node(token.punctuator(";"), ast_statement.EmptyStatement.create));
    var expressionStatement = parse.Parser("Expression Statement", ecma_parse.node(parse_lang.then(topLevelExpression, logicalSemiColon), ast_statement.ExpressionStatement.create));
    var ifStatement = parse.Parser("If Statement", ecma_parse.nodea(parse.next(token.keyword("if"), parse.enumeration(parse_lang.between(token.punctuator("("), token.punctuator(")"), topLevelExpression), statement, parse.optional(null, parse.next(token.keyword("else"), statement)))), ast_statement.IfStatement.create));
    var whileStatement = parse.Parser("While Statement", ecma_parse.nodea(parse.next(token.keyword("while"), parse.enumeration(parse_lang.between(token.punctuator("("), token.punctuator(")"), topLevelExpression), statement)), ast_statement.WhileStatement.create));
    var doWhileStatement = parse.Parser("Do While Statement", ecma_parse.nodea(parse.next(token.keyword("do"), parse.enumeration(statement, token.keyword("while"), parse_lang.between(token.punctuator("("), token.punctuator(")"), topLevelExpression), token.punctuator(";"))), function(loc, body, _0, test) {
        return new ast_statement.DoWhileStatement(loc, body, test);
    }
    ));
    var forInitExpression = parse.optional(null, parse.either(ecma_parse.node(parse.next(token.keyword("var"), parse.memo(variableDeclarationList)), ast_declaration.VariableDeclaration.create), topLevelExpression));
    var forTestExpression = parse.optional(null, topLevelExpression);
    var forUpdateExpression = parse.optional(null, parse.either(parse.attempt(expression.assignmentExpression), topLevelExpression));
    var forStatement = parse.Parser("For Statement", ecma_parse.nodea(parse.next(token.keyword("for"), parse.enumeration(token.punctuator("("), forInitExpression, token.punctuator(";"), forTestExpression, token.punctuator(";"), forUpdateExpression, token.punctuator(")"), statement)), function(loc, _1, init, _2, test, _3, update, _4, body) {
        return new ast_statement.ForStatement(loc, init, test, update, body);
    }
    ));
    var iterationStatement = parse.Parser("Iteration Statement", parse.choice(doWhileStatement, whileStatement, forStatement));
    var continueStatement = parse.Parser("Continue Statement", ecma_parse.node(parse.next(token.keyword("continue"), logicalSemiColon), ast_statement.ContinueStatement.create));
    var breakStatement = parse.Parser("Break Statement", ecma_parse.node(parse.next(token.keyword("break"), logicalSemiColon), ast_statement.BreakStatement.create));
    var returnStatement = parse.Parser("Return Statement", ecma_parse.node(parse_lang.between(token.keyword("return"), logicalSemiColon, parse.optional(null, topLevelExpression)), ast_statement.ReturnStatement.create));
    var caseClause = ecma_parse.nodea(parse.next(token.keyword("case"), parse.enumeration(parse_lang.then(topLevelExpression, token.punctuator(":")), statementList)), ast_clause.SwitchCase.create);
    var defaultClause = ecma_parse.node(parse.next(token.keyword("default"), parse.next(token.punctuator(":"), statementList)), function(loc, consequent) {
        return ast_clause.SwitchCase.create(loc, null, consequent);
    }
    );
    var caseClauses = parse.eager(parse.many(caseClause));
    var caseBlock = parse_lang.between(token.punctuator("{"), token.punctuator("}"), parse.binds(parse.enumeration(parse.optional([], caseClauses), parse.optional(null, defaultClause)), function(first, defaultClause) {
        return parse.always((defaultClause ? first.concat([defaultClause]) : first));
    }
    ));
    var switchStatement = parse.Parser("Switch Statement", ecma_parse.nodea(parse.next(token.keyword("switch"), parse.enumeration(parse_lang.between(token.punctuator("("), token.punctuator(")"), topLevelExpression), caseBlock)), ast_statement.SwitchStatement.create));
    var throwStatement = parse.Parser("Throw Statement", ecma_parse.node(parse_lang.between(token.keyword("throw"), logicalSemiColon, topLevelExpression), ast_statement.ThrowStatement.create));
    var catchBlock = ecma_parse.nodea(parse.next(token.keyword("catch"), parse.enumeration(parse_lang.between(token.punctuator("("), token.punctuator(")"), value.identifier), blockStatement)), ast_clause.CatchClause.create);
    var finallyBlock = parse.next(token.keyword("finally"), blockStatement);
    var tryStatement = parse.Parser("Try Statement", ecma_parse.nodea(parse.next(token.keyword("try"), parse.enumeration(blockStatement, parse.optional(null, catchBlock), parse.optional(null, finallyBlock))), ast_statement.TryStatement.create));
    var debuggerStatement = parse.Parser("Debugger Statement", ecma_parse.node(parse.next(token.keyword("debugger"), token.punctuator(";")), ast_statement.DebuggerStatement.create));
    (statement = parse.Parser("Statement", parse.expected("statement", parse.choice(blockStatement, staticStatement, variableStatement, emptyStatement, ifStatement, iterationStatement, continueStatement, breakStatement, returnStatement, switchStatement, throwStatement, tryStatement, debuggerStatement, expressionStatement))));
    return ({
        "blockStatement": blockStatement,
        "staticStatement": staticStatement,
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
