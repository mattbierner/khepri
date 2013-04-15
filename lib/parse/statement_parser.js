/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define(["parse/parse", "parse/parse_eager", "ecma/parse/statement_parser", "ecma/parse/token_parser", "khepri/parse/_common", "khepri/parse/expression_parser", "khepri/parse/value_parser", "ecma/ast/clause", "ecma/ast/declaration", "ecma/ast/statement"], function(parse, parse_eager, ecma_statement, token, ecma_parse, expression, value, astClause, astDeclaration, astStatement) {
    "use strict";
    var statement = function() {
        return statement.apply(undefined, arguments);
    }
    ;
    var logicalSemiColon = token.punctuator(";");
    var statementList = parse_eager.many(statement);
    var blockStatement = parse.Parser("Block Statement", ecma_parse.astNode(parse.bind(parse.between(token.punctuator("{"), token.punctuator("}"), statementList), function(body) {
        return parse.always(new astStatement.BlockStatement(body));
    }
    )));
    var initialiser = parse.next(token.punctuator("="), expression.assignmentExpression);
    var variableDeclaration = ecma_parse.astNode(parse.binda(parse.sequence(value.identifier, parse.optional(initialiser)), function(identifier, initialiser) {
        return parse.always(new astDeclaration.VariableDeclarator(identifier, initialiser));
    }
    ));
    var variableDeclarationList = parse_eager.sepBy(token.punctuator(","), variableDeclaration);
    var variableStatement = parse.Parser("Variable Statement", ecma_parse.astNode(parse.bind(parse.between(token.keyword("var"), logicalSemiColon, variableDeclarationList), function(declarations) {
        return parse.always(new astDeclaration.VariableDeclaration(declarations));
    }
    )));
    var emptyStatement = parse.Parser("Empty Statement", ecma_parse.astNode(parse.bind(token.punctuator(";"), function() {
        return parse.always(new astStatement.EmptyStatement());
    }
    )));
    var expressionStatement = parse.Parser("Expression Statement", ecma_parse.astNode(parse.binda(parse.sequence(expression.expression, logicalSemiColon), function(expression) {
        return parse.always(new astStatement.ExpressionStatement(expression));
    }
    )));
    var ifStatement = parse.Parser("If Statement", ecma_parse.astNode(parse.next(token.keyword("if"), parse.binda(parse.sequence(parse.between(token.punctuator("("), token.punctuator(")"), expression.expression), statement, parse.optional(parse.next(token.keyword("else"), statement))), function(test, consequent, alternate) {
        return parse.always(new astStatement.IfStatement(test, consequent, alternate));
    }
    ))));
    var whileStatement = parse.Parser("While Statement", ecma_parse.astNode(parse.next(token.keyword("while"), parse.binda(parse.sequence(parse.between(token.punctuator("("), token.punctuator(")"), expression.expression), statement), function(test, body) {
        return parse.always(new astStatement.WhileStatement(test, body));
    }
    ))));
    var doWhileStatement = parse.Parser("Do While Statement", ecma_parse.astNode(parse.next(token.keyword("do"), parse.binda(parse.sequence(statement, token.keyword("while"), parse.between(token.punctuator("("), token.punctuator(")"), expression.expression), token.punctuator(";")), function(body, _0, test, _1) {
        return parse.always(new astStatement.DoWhileStatement(body, test));
    }
    ))));
    var forStatement = parse.Parser("For Statement", ecma_parse.astNode(parse.next(token.keyword("for"), parse.binda(parse.sequence(token.punctuator("("), parse.optional(parse.either(parse.bind(parse.next(token.keyword("var"), parse.memo(variableDeclarationList)), function(declarations) {
        return parse.always(new astDeclaration.VariableDeclaration(declarations));
    }
    ), expression.expression)), token.punctuator(";"), parse.optional(expression.expression), token.punctuator(";"), parse.optional(expression.expression), token.punctuator(")"), statement), function(_1, init, _2, test, _3, update, _4, body) {
        return parse.always(new astStatement.ForStatement(init, test, update, body));
    }
    ))));
    var iterationStatement = parse.Parser("Iteration Statement", parse.backtrack(parse.choice(doWhileStatement, whileStatement, forStatement)));
    var continueStatement = parse.Parser("Continue Statement", ecma_parse.astNode(parse.bind(parse.next(token.keyword("continue"), logicalSemiColon), function() {
        return parse.always(new astStatement.ContinueStatement());
    }
    )));
    var breakStatement = parse.Parser("Break Statement", ecma_parse.astNode(parse.bind(parse.next(token.keyword("break"), logicalSemiColon), function() {
        return parse.always(new astStatement.BreakStatement());
    }
    )));
    var returnStatement = parse.Parser("Return Statement", ecma_parse.astNode(parse.bind(parse.between(token.keyword("return"), logicalSemiColon, parse.optional(expression.expression)), function(argument) {
        return parse.always(new astStatement.ReturnStatement(argument));
    }
    )));
    var caseClause = parse.binda(parse.sequence(token.keyword("case"), expression.expression, token.punctuator(":"), statementList), function(_0, test, _1, consequent) {
        return parse.always(new astClause.SwitchCase(test, consequent));
    }
    );
    var defaultClause = parse.bind(parse.next(token.keyword("default"), parse.next(token.punctuator(":"), statementList)), function(consequent) {
        return parse.always(new astClause.SwitchCase(null, consequent));
    }
    );
    var caseClauses = parse_eager.many(caseClause);
    var caseBlock = parse.between(token.punctuator("{"), token.punctuator("}"), parse.binda(parse.sequence(parse.optional(caseClauses), parse.optional(defaultClause)), function(first, defaultClause) {
        if (defaultClause){
            (first = first.concat([defaultClause]));
        }
        
        return parse.always(first);
    }
    ));
    var switchStatement = parse.Parser("Switch Statement", ecma_parse.astNode(parse.next(token.keyword("switch"), parse.binda(parse.sequence(parse.between(token.punctuator("("), token.punctuator(")"), expression.expression), caseBlock), function(discriminant, cases) {
        return parse.always(new astStatement.SwitchStatement(discriminant, cases));
    }
    ))));
    var throwStatement = parse.Parser("Throw Statement", ecma_parse.astNode(parse.bind(parse.between(token.keyword("throw"), logicalSemiColon, expression.expression), function(argument) {
        return parse.always(new astStatement.ThrowStatement(argument));
    }
    )));
    var catchBlock = parse.next(token.keyword("catch"), parse.binda(parse.sequence(parse.between(token.punctuator("("), token.punctuator(")"), value.identifier), blockStatement), function(param, body) {
        return parse.always(new astClause.CatchClause(param, null, body));
    }
    ));
    var finallyBlock = parse.next(token.keyword("finally"), blockStatement);
    var tryStatement = parse.Parser("Try Statement", ecma_parse.astNode(parse.next(token.keyword("try"), parse.binda(parse.sequence(blockStatement, parse.optional(catchBlock), parse.optional(finallyBlock)), function(block, handler, finalizer) {
        return parse.always(new astStatement.TryStatement(block, handler, finalizer));
    }
    ))));
    var debuggerStatement = parse.Parser("Debugger Statement", ecma_parse.astNode(parse.next(token.keyword("debugger"), parse.bind(token.punctuator(";"), function() {
        return parse.always(new astStatement.DebuggerStatement());
    }
    ))));
    (statement = parse.Parser("Statement", parse.choice(blockStatement, variableStatement, emptyStatement, ifStatement, iterationStatement, continueStatement, breakStatement, returnStatement, switchStatement, throwStatement, tryStatement, debuggerStatement, expressionStatement)));
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
