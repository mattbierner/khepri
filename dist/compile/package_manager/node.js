/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/package_manager/node.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/statement",
    "khepri_ast/value"
], (function(require, exports, ast_declaration, ast_expression, ast_statement, ast_value) {
    "use strict";
    var definePackage;
    var ast_declaration = ast_declaration,
        ast_expression = ast_expression,
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
            }));
        return ast_statement.BlockStatement.create(body.loc, [ast_statement.ExpressionStatement.create(
                null, ast_value.Literal.create(null, "string", "use strict")), ast_statement.WithStatement
            .create(null, map(imports, (function(x) {
                return ast_declaration.Binding.create(null, x.pattern, ast_expression.CallExpression
                    .create(null, ast_value.Identifier.create(null, "require"), [x.from])
                );
            })), ast_statement.BlockStatement.create(null, concat(exportHeader, body.body,
                exportBody)))
        ]);
    }));
    (exports.definePackage = definePackage);
}))