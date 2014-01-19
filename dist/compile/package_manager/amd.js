/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/package_manager/amd.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/pattern",
    "khepri_ast/statement", "khepri_ast/value"
], (function(require, exports, ast_declaration, ast_expression, ast_pattern, ast_statement, ast_value) {
    "use strict";
    var definePackage;
    var ast_declaration = ast_declaration,
        ast_expression = ast_expression,
        ast_pattern = ast_pattern,
        ast_statement = ast_statement,
        ast_value = ast_value;
    var concat = Function.prototype.call.bind(Array.prototype.concat);
    var map = Function.prototype.call.bind(Array.prototype.map);
    (definePackage = (function(loc, exports, imports, targets, body) {
        var exportHeader = (exports.length ? ast_declaration.VariableDeclaration.create(null, map(
            exports, (function(x) {
                return ast_declaration.VariableDeclarator.create(null, ast_value.Identifier
                    .create(null, x));
            }))) : ast_statement.EmptyStatement.create(null)),
            exportBody = map(exports, (function(x) {
                return ast_statement.ExpressionStatement.create(null, ast_expression.AssignmentExpression
                    .create(null, "=", ast_expression.MemberExpression.create(null, ast_value.Identifier
                            .create(null, "exports"), ast_value.Identifier.create(null, x)),
                        ast_value.Identifier.create(null, x)));
            })),
            packageBody = ast_expression.FunctionExpression.create(null, null, ast_pattern.ArgumentsPattern
                .create(null, null, concat(ast_pattern.IdentifierPattern.create(null, ast_value.Identifier
                    .create(null, "require")), ast_pattern.IdentifierPattern.create(null,
                    ast_value.Identifier.create(null, "exports")), map(imports, (function(x) {
                    return targets[x.from];
                })))), ast_statement.BlockStatement.create(body.loc, concat(ast_statement.ExpressionStatement
                    .create(null, ast_value.Literal.create(null, "string", "use strict")),
                    exportHeader, body, exportBody)));
        return ast_statement.ExpressionStatement.create(loc, ast_expression.CallExpression.create(loc,
            ast_value.Identifier.create(null, "define"), [ast_expression.ArrayExpression.create(
                null, concat(ast_value.Literal.create(null, "string", "require"), ast_value.Literal
                    .create(null, "string", "exports"), map(imports, (function(x) {
                        return x.from;
                    })))), packageBody]));
    }));
    (exports.definePackage = definePackage);
}))