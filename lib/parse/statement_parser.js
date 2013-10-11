/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define((function(require, exports, module) {
    "use strict";
    var blockStatement, staticStatement, variableStatement, emptyStatement, expressionStatement, ifStatement, iterationStatement, continueStatement, breakStatement, returnStatement, switchStatement, throwStatement, tryStatement, debuggerStatement, statement;
    var parse = require("parse/parse"),
        always = parse["always"],
        attempt = parse["attempt"],
        binds = parse["binds"],
        choice = parse["choice"],
        eager = parse["eager"],
        either = parse["either"],
        enumeration = parse["enumeration"],
        expected = parse["expected"],
        many = parse["many"],
        memo = parse["memo"],
        next = parse["next"],
        optional = parse["optional"],
        Parser = parse["Parser"];
    var __a = require("parse/lang"),
        between = __a["between"],
        sepBy1 = __a["sepBy1"],
        then = __a["then"];
    var __a0 = require("ecma/parse/token_parser"),
        keyword = __a0["keyword"],
        punctuator = __a0["punctuator"];
    var __a1 = require("ecma/parse/common"),
        node = __a1["node"],
        nodea = __a1["nodea"];
    var __a2 = require("khepri_ast/clause"),
        CatchClause = __a2["CatchClause"],
        SwitchCase = __a2["SwitchCase"];
    var __a3 = require("khepri_ast/declaration"),
        StaticDeclarator = __a3["StaticDeclarator"],
        StaticDeclaration = __a3["StaticDeclaration"],
        VariableDeclarator = __a3["VariableDeclarator"],
        VariableDeclaration = __a3["VariableDeclaration"];
    var __a4 = require("khepri_ast/statement"),
        BlockStatement = __a4["BlockStatement"],
        BreakStatement = __a4["BreakStatement"],
        ContinueStatement = __a4["ContinueStatement"],
        DebuggerStatement = __a4["DebuggerStatement"],
        DoWhileStatement = __a4["DoWhileStatement"],
        EmptyStatement = __a4["EmptyStatement"],
        ExpressionStatement = __a4["ExpressionStatement"],
        LabeledStatement = __a4["LabeledStatement"],
        ForStatement = __a4["ForStatement"],
        ForInStatement = __a4["ForInStatement"],
        IfStatement = __a4["IfStatement"],
        ReturnStatement = __a4["ReturnStatement"],
        SwitchStatement = __a4["SwitchStatement"],
        ThrowStatement = __a4["ThrowStatement"],
        TryStatement = __a4["TryStatement"],
        WhileStatement = __a4["WhileStatement"];
    var __a5 = require("khepri/parse/expression_parser"),
        assignmentExpression = __a5["assignmentExpression"],
        expression = __a5["expression"];
    var __a6 = require("khepri/parse/value_parser"),
        identifier = __a6["identifier"];
    (statement = (function() {
        return statement.apply(undefined, arguments);
    }));
    var logicalSemiColon = punctuator(";");
    var statementList = eager(many(statement));
    var topLevelExpression = either(attempt(assignmentExpression), expression);
    (blockStatement = Parser("Block Statement", node(between(punctuator("{"), punctuator("}"), statementList), BlockStatement.create)));
    var staticDeclaration = node(identifier, StaticDeclarator.create);
    var staticDeclarationList = eager(sepBy1(punctuator(","), staticDeclaration));
    (staticStatement = Parser("Static Statement", node(between(keyword("static"), logicalSemiColon, staticDeclarationList), StaticDeclaration.create)));
    var initialiser = next(punctuator("="), topLevelExpression);
    var variableDeclaration = nodea(enumeration(identifier, optional(null, initialiser)), VariableDeclarator.create);
    var variableDeclarationList = eager(sepBy1(punctuator(","), variableDeclaration));
    (variableStatement = Parser("Variable Statement", node(between(keyword("var"), logicalSemiColon, variableDeclarationList), VariableDeclaration.create)));
    (emptyStatement = Parser("Empty Statement", node(punctuator(";"), EmptyStatement.create)));
    (expressionStatement = Parser("Expression Statement", node(then(topLevelExpression, logicalSemiColon), ExpressionStatement.create)));
    (ifStatement = Parser("If Statement", nodea(next(keyword("if"), enumeration(between(punctuator("("), punctuator(")"), topLevelExpression), statement, optional(null, next(keyword("else"), statement)))), IfStatement.create)));
    var whileStatement = Parser("While Statement", nodea(next(keyword("while"), enumeration(between(punctuator("("), punctuator(")"), topLevelExpression), statement)), WhileStatement.create));
    var doWhileStatement = Parser("Do While Statement", nodea(next(keyword("do"), enumeration(then(statement, keyword("while")), between(punctuator("("), punctuator(")"), topLevelExpression), punctuator(";"))), DoWhileStatement.create));
    var forInitExpression = optional(null, either(node(next(keyword("var"), memo(variableDeclarationList)), VariableDeclaration.create), topLevelExpression));
    var forTestExpression = optional(null, topLevelExpression);
    var forUpdateExpression = optional(null, either(attempt(assignmentExpression), topLevelExpression));
    var forStatement = Parser("For Statement", nodea(next(keyword("for"), enumeration(next(punctuator("("), forInitExpression), next(punctuator(";"), forTestExpression), next(punctuator(";"), forUpdateExpression), next(punctuator(")"), statement))), ForStatement.create));
    (iterationStatement = Parser("Iteration Statement", choice(doWhileStatement, whileStatement, forStatement)));
    (continueStatement = Parser("Continue Statement", node(next(keyword("continue"), logicalSemiColon), ContinueStatement.create)));
    (breakStatement = Parser("Break Statement", node(next(keyword("break"), logicalSemiColon), BreakStatement.create)));
    (returnStatement = Parser("Return Statement", node(between(keyword("return"), logicalSemiColon, optional(null, topLevelExpression)), ReturnStatement.create)));
    var caseClause = nodea(next(keyword("case"), enumeration(then(topLevelExpression, punctuator(":")), statementList)), SwitchCase.create);
    var defaultClause = node(next(keyword("default"), next(punctuator(":"), statementList)), (function(loc, consequent) {
        return SwitchCase.create(loc, null, consequent);
    }));
    var caseClauses = eager(many(caseClause));
    var caseBlock = between(punctuator("{"), punctuator("}"), binds(enumeration(optional([], caseClauses), optional(null, defaultClause)), (function(first, defaultClause) {
        return always((defaultClause ? first.concat([defaultClause]) : first));
    })));
    (switchStatement = Parser("Switch Statement", nodea(next(keyword("switch"), enumeration(between(punctuator("("), punctuator(")"), topLevelExpression), caseBlock)), SwitchStatement.create)));
    (throwStatement = Parser("Throw Statement", node(between(keyword("throw"), logicalSemiColon, topLevelExpression), ThrowStatement.create)));
    var catchBlock = nodea(next(keyword("catch"), enumeration(between(punctuator("("), punctuator(")"), identifier), blockStatement)), CatchClause.create);
    var finallyBlock = next(keyword("finally"), blockStatement);
    (tryStatement = Parser("Try Statement", nodea(next(keyword("try"), enumeration(blockStatement, optional(null, catchBlock), optional(null, finallyBlock))), TryStatement.create)));
    (debuggerStatement = Parser("Debugger Statement", node(next(keyword("debugger"), punctuator(";")), DebuggerStatement.create)));
    (statement = Parser("Statement", expected("statement", choice(blockStatement, staticStatement, variableStatement, emptyStatement, ifStatement, iterationStatement, continueStatement, breakStatement, returnStatement, switchStatement, throwStatement, tryStatement, debuggerStatement, expressionStatement))));
    (exports.blockStatement = blockStatement);
    (exports.staticStatement = staticStatement);
    (exports.variableStatement = variableStatement);
    (exports.emptyStatement = emptyStatement);
    (exports.expressionStatement = expressionStatement);
    (exports.ifStatement = ifStatement);
    (exports.iterationStatement = iterationStatement);
    (exports.continueStatement = continueStatement);
    (exports.breakStatement = breakStatement);
    (exports.returnStatement = returnStatement);
    (exports.switchStatement = switchStatement);
    (exports.throwStatement = throwStatement);
    (exports.tryStatement = tryStatement);
    (exports.debuggerStatement = debuggerStatement);
    (exports.statement = statement);
}))