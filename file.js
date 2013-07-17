/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
;
define(["parse/parse", "parse/parse_lang", "ecma/parse/statement_parser", "ecma/parse/token_parser", "ecma/parse/common", "khepri/parse/expression_parser", "khepri/parse/value_parser", "khepri/ast/khepri", "ecma/ast/clause", "ecma/ast/declaration", "ecma/ast/statement"], function(parse, parse_lang, ecma_statement, token, ecma_parse, expression, value, astKhepri, astClause, astDeclaration, astStatement) {
    "use strict";
    var statement = function() {
        return statement.apply(undefined, arguments);
    }
    ;
    var logicalSemiColon = token.punctuator(";");
    var statementList = parse.eager(parse.many(statement));
    var topLevelExpression = parse.either(parse.attempt(expression.assignmentExpression), expression.expression);
    var blockStatement = parse.Parser("Block Statement", ecma_parse.node(parse_lang.between(token.punctuator("{"), token.punctuator("}"), statementList), function(loc, body) {
        return new astStatement.BlockStatement(loc, body);
    }
    ));
    var staticDeclaration = ecma_parse.node(value.identifier, function(loc, identifier) {
        return new astKhepri.StaticDeclarator(loc, identifier, null);
    }
    );
    var staticDeclarationList = parse.eager(parse_lang.sepBy1(token.punctuator(","), staticDeclaration));
    var staticStatement = parse.Parser("Static Statement", ecma_parse.node(parse_lang.between(token.keyword("static"), logicalSemiColon, staticDeclarationList), function(loc, declarations) {
        return new astKhepri.StaticDeclaration(loc, declarations);
    }
    ));
    var initialiser = parse.next(token.punctuator("="), topLevelExpression);
    var variableDeclaration = ecma_parse.nodea(parse.sequence(value.identifier, parse.optional(null, initialiser)), function(loc, identifier, initialiser) {
        return new astDeclaration.VariableDeclarator(loc, identifier, initialiser);
    }
    );
    var variableDeclarationList = parse.eager(parse_lang.sepBy1(token.punctuator(","), variableDeclaration));
    var variableStatement = parse.Parser("Variable Statement", ecma_parse.node(parse_lang.between(token.keyword("var"), logicalSemiColon, variableDeclarationList), function(loc, declarations) {
        return new astDeclaration.VariableDeclaration(loc, declarations);
    }
    ));
    var emptyStatement = parse.Parser("Empty Statement", ecma_parse.node(token.punctuator(";"), function(loc) {
        return new astStatement.EmptyStatement(loc);
    }
    ));
    var expressionStatement = parse.Parser("Expression Statement", ecma_parse.node(parse_lang.then(topLevelExpression, logicalSemiColon), function(loc, expression) {
        return new astStatement.ExpressionStatement(loc, expression);
    }
    ));
    var ifStatement = parse.Parser("If Statement", ecma_parse.nodea(parse.next(token.keyword("if"), parse.sequence(parse_lang.between(token.punctuator("("), token.punctuator(")"), topLevelExpression), statement, parse.optional(null, parse.next(token.keyword("else"), statement)))), function(loc, test, consequent, alternate) {
        return new astStatement.IfStatement(loc, test, consequent, alternate);
    }
    ));
    var whileStatement = parse.Parser("While Statement", ecma_parse.nodea(parse.next(token.keyword("while"), parse.sequence(parse_lang.between(token.punctuator("("), token.punctuator(")"), topLevelExpression), statement)), function(loc, test, body) {
        return new astStatement.WhileStatement(loc, test, body);
    }
    ));
    var doWhileStatement = parse.Parser("Do While Statement", ecma_parse.nodea(parse.next(token.keyword("do"), parse.sequence(statement, token.keyword("while"), parse_lang.between(token.punctuator("("), token.punctuator(")"), topLevelExpression), token.punctuator(";"))), function(loc, body, _0, test) {
        return new astStatement.DoWhileStatement(loc, body, test);
    }
    ));
    var forInitExpression = parse.optional(null, parse.either(ecma_parse.node(parse.next(token.keyword("var"), parse.memo(variableDeclarationList)), function(loc, declarations) {
        return new astDeclaration.VariableDeclaration(loc, declarations);
    }
    ), topLevelExpression));
    var forTestExpression = parse.optional(null, topLevelExpression);
    var forUpdateExpression = parse.optional(null, parse.either(parse.attempt(expression.assignmentExpression), topLevelExpression));
    var forStatement = parse.Parser("For Statement", ecma_parse.nodea(parse.next(token.keyword("for"), parse.sequence(token.punctuator("("), forInitExpression, token.punctuator(";"), forTestExpression, token.punctuator(";"), forUpdateExpression, token.punctuator(")"), statement)), function(loc, _1, init, _2, test, _3, update, _4, body) {
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
    var returnStatement = parse.Parser("Return Statement", ecma_parse.node(parse_lang.between(token.keyword("return"), logicalSemiColon, parse.optional(null, topLevelExpression)), function(loc, argument) {
        return new astStatement.ReturnStatement(loc, argument);
    }
    ));
    var caseClause = ecma_parse.nodea(parse.next(token.keyword("case"), parse.sequence(topLevelExpression, token.punctuator(":"), statementList)), function(loc, test, _, consequent) {
        return new astClause.SwitchCase(loc, test, consequent);
    }
    );
    var defaultClause = ecma_parse.node(parse.next(token.keyword("default"), parse.next(token.punctuator(":"), statementList)), function(loc, consequent) {
        return new astClause.SwitchCase(loc, null, consequent);
    }
    );
    var caseClauses = parse.eager(parse.many(caseClause));
    var caseBlock = parse_lang.between(token.punctuator("{"), token.punctuator("}"), parse.binds(parse.sequence(parse.optional([], caseClauses), parse.optional(null, defaultClause)), function(first, defaultClause) {
        return parse.always((defaultClause ? first.concat([defaultClause]) : first));
    }
    ));
    var switchStatement = parse.Parser("Switch Statement", ecma_parse.nodea(parse.next(token.keyword("switch"), parse.sequence(parse_lang.between(token.punctuator("("), token.punctuator(")"), topLevelExpression), caseBlock)), function(loc, discriminant, cases) {
        return new astStatement.SwitchStatement(loc, discriminant, cases);
    }
    ));
    var throwStatement = parse.Parser("Throw Statement", ecma_parse.node(parse_lang.between(token.keyword("throw"), logicalSemiColon, topLevelExpression), function(loc, argument) {
        return new astStatement.ThrowStatement(loc, argument);
    }
    ));
    var catchBlock = ecma_parse.nodea(parse.next(token.keyword("catch"), parse.sequence(parse_lang.between(token.punctuator("("), token.punctuator(")"), value.identifier), blockStatement)), function(loc, param, body) {
        return new astClause.CatchClause(loc, param, body);
    }
    );
    var finallyBlock = parse.next(token.keyword("finally"), blockStatement);
    var tryStatement = parse.Parser("Try Statement", ecma_parse.nodea(parse.next(token.keyword("try"), parse.sequence(blockStatement, parse.optional(null, catchBlock), parse.optional(null, finallyBlock))), function(loc, block, handler, finalizer) {
        return new astStatement.TryStatement(loc, block, handler, finalizer);
    }
    ));
    var debuggerStatement = parse.Parser("Debugger Statement", ecma_parse.node(parse.next(token.keyword("debugger"), token.punctuator(";")), function(loc) {
        return new astStatement.DebuggerStatement(loc);
    }
    ));
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
