/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "khepri-ast/clause", "khepri-ast/declaration",
    "khepri-ast/statement", "./common", "./token_parser", "./expression_parser", "./pattern_parser",
    "./value_parser"
], (function(require, exports, __o, __o0, ast_clause, ast_declaration, ast_statement, __o1, __o2, __o3, __o4, __o5) {
    "use strict";
    var always = __o["always"],
        attempt = __o["attempt"],
        binds = __o["binds"],
        choice = __o["choice"],
        eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        expected = __o["expected"],
        many = __o["many"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        between = __o0["between"],
        sepBy1 = __o0["sepBy1"],
        then = __o0["then"],
        node = __o1["node"],
        nodea = __o1["nodea"],
        keyword = __o2["keyword"],
        punctuator = __o2["punctuator"],
        expression = __o3["expression"],
        topLevelExpression = __o3["topLevelExpression"],
        importPattern = __o4["importPattern"],
        pattern = __o4["pattern"],
        identifier = __o5["identifier"],
        blockStatement, staticStatement, variableStatement, emptyStatement, expressionStatement, ifStatement,
            withStatement, iterationStatement, continueStatement, breakStatement, returnStatement,
            switchStatement, throwStatement, tryStatement, debuggerStatement, statement;
    (statement = (function() {
        var args = arguments;
        return statement.apply(undefined, args);
    }));
    var logicalSemiColon = punctuator(";"),
        statementList = eager(many(statement));
    (blockStatement = Parser("Block Statement", node(between(punctuator("{"), punctuator("}"), statementList),
        ast_statement.BlockStatement.create)));
    (emptyStatement = Parser("Empty Statement", node(punctuator(";"), ast_statement.EmptyStatement.create)));
    (debuggerStatement = Parser("Debugger Statement", node(next(keyword("debugger"), punctuator(";")),
        ast_statement.DebuggerStatement.create)));
    (expressionStatement = Parser("Expression Statement", node(then(topLevelExpression, logicalSemiColon),
        ast_statement.ExpressionStatement.create)));
    (staticStatement = Parser("Static Statement", (function() {
        var staticDeclaration = node(identifier, ast_declaration.StaticDeclarator.create),
            staticDeclarationList = eager(sepBy1(punctuator(","), staticDeclaration));
        return node(between(keyword("static"), logicalSemiColon, staticDeclarationList),
            ast_declaration.StaticDeclaration.create);
    })()));
    var variableDeclarationList = (function() {
        var initialiser = next(punctuator("="), expected("variable initilizer", expression)),
            variableDeclaration = nodea(enumeration(identifier, optional(null, initialiser)),
                ast_declaration.VariableDeclarator.create);
        return eager(sepBy1(punctuator(","), variableDeclaration));
    })();
    (variableStatement = Parser("Variable Statement", node(between(keyword("var"), logicalSemiColon,
        variableDeclarationList), ast_declaration.VariableDeclaration.create)));
    (withStatement = Parser("With Statement", (function() {
        var withIdentifier = expected("pattern", pattern),
            withBinding = either(importPattern, nodea(enumeration(then(withIdentifier, punctuator(
                "=")), expression), ast_declaration.Binding.create)),
            bindings = eager(sepBy1(punctuator(","), withBinding));
        return nodea(next(keyword("with"), enumeration(bindings, next(keyword("in"), blockStatement))),
            ast_statement.WithStatement.create);
    })()));
    (ifStatement = Parser("If Statement", nodea(next(keyword("if"), enumeration(between(punctuator("("),
        punctuator(")"), expected("if condition", expression)), statement, optional(null,
        next(keyword("else"), statement)))), ast_statement.IfStatement.create)));
    (switchStatement = Parser("Switch Statement", (function() {
        var caseClause = nodea(next(keyword("case"), enumeration(then(expression, punctuator(":")),
            statementList)), ast_clause.SwitchCase.create),
            defaultClause = node(next(keyword("default"), next(punctuator(":"), statementList)), (
                function(loc, consequent) {
                    return ast_clause.SwitchCase.create(loc, null, consequent);
                })),
            caseClauses = eager(many(caseClause)),
            caseBlock = between(punctuator("{"), punctuator("}"), binds(enumeration(optional([],
                caseClauses), optional(null, defaultClause)), (function(first,
                defaultClause) {
                return always((defaultClause ? first.concat([defaultClause]) : first));
            })));
        return nodea(next(keyword("switch"), enumeration(between(punctuator("("), punctuator(")"),
                expected("switch discriminant", expression)), caseBlock)), ast_statement.SwitchStatement
            .create);
    })()));
    var whileStatement = Parser("While Statement", nodea(next(keyword("while"), enumeration(between(punctuator(
        "("), punctuator(")"), expression), statement)), ast_statement.WhileStatement.create)),
        doWhileStatement = Parser("Do While Statement", nodea(next(keyword("do"), enumeration(then(statement,
                keyword("while")), between(punctuator("("), punctuator(")"), expression),
            punctuator(";"))), ast_statement.DoWhileStatement.create)),
        forStatement = Parser("For Statement", (function() {
            var forInitExpression = optional(null, either(node(next(keyword("var"),
                    variableDeclarationList), ast_declaration.VariableDeclaration.create),
                topLevelExpression)),
                forTestExpression = optional(null, expression),
                forUpdateExpression = optional(null, topLevelExpression);
            return nodea(next(keyword("for"), enumeration(next(punctuator("("), forInitExpression),
                    next(punctuator(";"), forTestExpression), next(punctuator(";"),
                        forUpdateExpression), next(punctuator(")"), statement))), ast_statement.ForStatement
                .create);
        })());
    (iterationStatement = Parser("Iteration Statement", choice(doWhileStatement, whileStatement, forStatement)));
    (continueStatement = Parser("Continue Statement", node(next(keyword("continue"), logicalSemiColon),
        ast_statement.ContinueStatement.create)));
    (breakStatement = Parser("Break Statement", node(next(keyword("break"), logicalSemiColon), ast_statement.BreakStatement
        .create)));
    (returnStatement = Parser("Return Statement", node(between(keyword("return"), logicalSemiColon, optional(
        null, expression)), ast_statement.ReturnStatement.create)));
    (throwStatement = Parser("Throw Statement", node(between(keyword("throw"), logicalSemiColon, expression),
        ast_statement.ThrowStatement.create)));
    (tryStatement = Parser("Try Statement", (function() {
        var catchBlock = nodea(next(keyword("catch"), enumeration(between(punctuator("("),
            punctuator(")"), identifier), blockStatement)), ast_clause.CatchClause.create),
            finallyBlock = next(keyword("finally"), blockStatement);
        return nodea(next(keyword("try"), enumeration(blockStatement, optional(null, catchBlock),
            optional(null, finallyBlock))), ast_statement.TryStatement.create);
    })()));
    (statement = expected("statement", Parser("Statement", choice(blockStatement, staticStatement,
        variableStatement, emptyStatement, ifStatement, withStatement, iterationStatement,
        continueStatement, breakStatement, returnStatement, switchStatement, throwStatement,
        tryStatement, debuggerStatement, expressionStatement))));
    (exports.blockStatement = blockStatement);
    (exports.staticStatement = staticStatement);
    (exports.variableStatement = variableStatement);
    (exports.emptyStatement = emptyStatement);
    (exports.expressionStatement = expressionStatement);
    (exports.ifStatement = ifStatement);
    (exports.withStatement = withStatement);
    (exports.iterationStatement = iterationStatement);
    (exports.continueStatement = continueStatement);
    (exports.breakStatement = breakStatement);
    (exports.returnStatement = returnStatement);
    (exports.switchStatement = switchStatement);
    (exports.throwStatement = throwStatement);
    (exports.tryStatement = tryStatement);
    (exports.debuggerStatement = debuggerStatement);
    (exports.statement = statement);
}));