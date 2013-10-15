/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "khepri_ast/clause", "khepri_ast/declaration", "khepri_ast/statement", "khepri/parse/common", "khepri/parse/token_parser", "khepri/parse/expression_parser", "khepri/parse/pattern_parser", "khepri/parse/value_parser"], (function(require, exports, parse, __o, ast_clause, ast_declaration, ast_statement, __o0, __o1, __o2, __o3, __o4) {
    "use strict";
    var blockStatement, staticStatement, variableStatement, emptyStatement, expressionStatement, ifStatement, withStatement, iterationStatement, continueStatement, breakStatement, returnStatement, switchStatement, throwStatement, tryStatement, debuggerStatement, statement;
    var parse = parse,
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
        Parser = parse["Parser"],
        __o = __o,
        between = __o["between"],
        sepBy1 = __o["sepBy1"],
        then = __o["then"],
        ast_clause = ast_clause,
        ast_declaration = ast_declaration,
        ast_statement = ast_statement,
        __o0 = __o0,
        node = __o0["node"],
        nodea = __o0["nodea"],
        __o1 = __o1,
        keyword = __o1["keyword"],
        punctuator = __o1["punctuator"],
        __o2 = __o2,
        assignmentExpression = __o2["assignmentExpression"],
        expression = __o2["expression"],
        __o3 = __o3,
        importPattern = __o3["importPattern"],
        pattern = __o3["pattern"],
        __o4 = __o4,
        identifier = __o4["identifier"]; {
            (statement = (function() {
                return statement.apply(undefined, arguments);
            }));
            var logicalSemiColon = punctuator(";");
            var statementList = eager(many(statement));
            var topLevelExpression = either(attempt(assignmentExpression), expression);
            (blockStatement = Parser("Block Statement", node(between(punctuator("{"), punctuator("}"), statementList), ast_statement.BlockStatement.create)));
            (emptyStatement = Parser("Empty Statement", node(punctuator(";"), ast_statement.EmptyStatement.create)));
            (debuggerStatement = Parser("Debugger Statement", node(next(keyword("debugger"), punctuator(";")), ast_statement.DebuggerStatement.create)));
            (expressionStatement = Parser("Expression Statement", node(then(topLevelExpression, logicalSemiColon), ast_statement.ExpressionStatement.create)));
            (staticStatement = Parser("Static Statement", (function() {
                {
                    var staticDeclaration = node(identifier, ast_declaration.StaticDeclarator.create),
                        staticDeclarationList = eager(sepBy1(punctuator(","), staticDeclaration)); {
                            return node(between(keyword("static"), logicalSemiColon, staticDeclarationList), ast_declaration.StaticDeclaration.create);
                    }
                }
            })()));
            var variableDeclarationList = (function() {
                {
                    var initialiser = next(punctuator("="), topLevelExpression),
                        variableDeclaration = nodea(enumeration(identifier, optional(null, initialiser)), ast_declaration.VariableDeclarator.create); {
                            return eager(sepBy1(punctuator(","), variableDeclaration));
                    }
                }
            })();
            (variableStatement = Parser("Variable Statement", node(between(keyword("var"), logicalSemiColon, variableDeclarationList), ast_declaration.VariableDeclaration.create)));
            (withStatement = Parser("With Statement", (function() {
                {
                    var withIdentifier = expected("Any pattern", pattern),
                        withBinding = either(importPattern, nodea(enumeration(then(withIdentifier, punctuator("=")), expression), ast_declaration.Binding.create)); {
                            return nodea(next(keyword("with"), enumeration(eager(sepBy1(punctuator(","), withBinding)), next(keyword("in"), blockStatement))), ast_statement.WithStatement.create);
                    }
                }
            })()));
            (ifStatement = Parser("If Statement", nodea(next(keyword("if"), enumeration(between(punctuator("("), punctuator(")"), topLevelExpression), statement, optional(null, next(keyword("else"), statement)))), ast_statement.IfStatement.create)));
            (switchStatement = Parser("Switch Statement", (function() {
                {
                    var caseClause = nodea(next(keyword("case"), enumeration(then(topLevelExpression, punctuator(":")), statementList)), ast_clause.SwitchCase.create),
                        defaultClause = node(next(keyword("default"), next(punctuator(":"), statementList)), (function(loc, consequent) {
                            return ast_clause.SwitchCase.create(loc, null, consequent);
                        })),
                        caseClauses = eager(many(caseClause)),
                        caseBlock = between(punctuator("{"), punctuator("}"), binds(enumeration(optional([], caseClauses), optional(null, defaultClause)), (function(first, defaultClause) {
                            return always((defaultClause ? first.concat([defaultClause]) : first));
                        }))); {
                            return nodea(next(keyword("switch"), enumeration(between(punctuator("("), punctuator(")"), topLevelExpression), caseBlock)), ast_statement.SwitchStatement.create);
                    }
                }
            })()));
            var whileStatement = Parser("While Statement", nodea(next(keyword("while"), enumeration(between(punctuator("("), punctuator(")"), topLevelExpression), statement)), ast_statement.WhileStatement.create));
            var doWhileStatement = Parser("Do While Statement", nodea(next(keyword("do"), enumeration(then(statement, keyword("while")), between(punctuator("("), punctuator(")"), topLevelExpression), punctuator(";"))), ast_statement.DoWhileStatement.create));
            var forStatement = Parser("For Statement", (function() {
                {
                    var forInitExpression = optional(null, either(node(next(keyword("var"), memo(variableDeclarationList)), ast_declaration.VariableDeclaration.create), topLevelExpression)),
                        forTestExpression = optional(null, topLevelExpression),
                        forUpdateExpression = optional(null, either(attempt(assignmentExpression), topLevelExpression)); {
                            return nodea(next(keyword("for"), enumeration(next(punctuator("("), forInitExpression), next(punctuator(";"), forTestExpression), next(punctuator(";"), forUpdateExpression), next(punctuator(")"), statement))), ast_statement.ForStatement.create);
                    }
                }
            })());
            (iterationStatement = Parser("Iteration Statement", choice(doWhileStatement, whileStatement, forStatement)));
            (continueStatement = Parser("Continue Statement", node(next(keyword("continue"), logicalSemiColon), ast_statement.ContinueStatement.create)));
            (breakStatement = Parser("Break Statement", node(next(keyword("break"), logicalSemiColon), ast_statement.BreakStatement.create)));
            (returnStatement = Parser("Return Statement", node(between(keyword("return"), logicalSemiColon, optional(null, topLevelExpression)), ast_statement.ReturnStatement.create)));
            (throwStatement = Parser("Throw Statement", node(between(keyword("throw"), logicalSemiColon, topLevelExpression), ast_statement.ThrowStatement.create)));
            (tryStatement = Parser("Try Statement", (function() {
                {
                    var catchBlock = nodea(next(keyword("catch"), enumeration(between(punctuator("("), punctuator(")"), identifier), blockStatement)), ast_clause.CatchClause.create),
                        finallyBlock = next(keyword("finally"), blockStatement); {
                            return nodea(next(keyword("try"), enumeration(blockStatement, optional(null, catchBlock), optional(null, finallyBlock))), ast_statement.TryStatement.create);
                    }
                }
            })()));
            (statement = Parser("Statement", expected("statement", choice(blockStatement, staticStatement, variableStatement, emptyStatement, ifStatement, withStatement, iterationStatement, continueStatement, breakStatement, returnStatement, switchStatement, throwStatement, tryStatement, debuggerStatement, expressionStatement))));
    }
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
}))