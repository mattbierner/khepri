/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/package_manager/node.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/statement",
    "khepri_ast/value"
], (function(require, exports, ast_declaration, ast_expression, ast_statement, ast_value) {
    "use strict";
    var definePackage, concat = Function.prototype.call.bind(Array.prototype.concat),
        map = Function.prototype.call.bind(Array.prototype.map),
        path = (function(path) {
            var segs = path.split("::");
            return segs.slice(1)
                .reduce((function(p, c) {
                    return ast_expression.MemberExpression.create(null, p, ast_value.Literal.create(
                        null, "string", c), true);
                }), ast_expression.CallExpression.create(null, ast_value.Identifier.create(null,
                    "require"), [ast_value.Literal.create(null, "string", segs[0])]));
        });
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
                return ast_declaration.Binding.create(null, x.pattern, path(x.from.value));
            })), ast_statement.BlockStatement.create(null, concat(exportHeader, body.body,
                exportBody)))
        ]);
    }));
    (exports.definePackage = definePackage);
}));