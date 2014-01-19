/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/package_manager/amd.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/pattern",
    "khepri_ast/program", "khepri_ast/statement", "khepri_ast/value"
], (function(require, exports, khepri_declaration, khepri_expression, khepri_pattern, khepri_program,
    khepri_statement, khepri_value) {
    "use strict";
    var amdPackage;
    var khepri_declaration = khepri_declaration,
        khepri_expression = khepri_expression,
        khepri_pattern = khepri_pattern,
        khepri_program = khepri_program,
        khepri_statement = khepri_statement,
        khepri_value = khepri_value;
    var concat = Function.prototype.call.bind(Array.prototype.concat);
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    (amdPackage = (function(loc, exports, imports, body) {
        var exportHeader = (exports.length ? khepri_declaration.VariableDeclaration.create(null, map(
            exports, (function(x) {
                return khepri_declaration.VariableDeclarator.create(null, khepri_value.Identifier
                    .create(null, x));
            }))) : khepri_statement.EmptyStatement.create(null)),
            exportBody = map(exports, (function(x) {
                return khepri_statement.ExpressionStatement.create(null, khepri_expression.AssignmentExpression
                    .create(null, "=", khepri_expression.MemberExpression.create(null,
                        khepri_value.Identifier.create(null, "exports"), khepri_value.Identifier
                        .create(null, x)), khepri_value.Identifier.create(null, x)));
            })),
            packageBody = khepri_expression.FunctionExpression.create(null, null, khepri_pattern.ArgumentsPattern
                .create(null, null, concat(khepri_pattern.IdentifierPattern.create(null, khepri_value.Identifier
                    .create(null, "require")), khepri_pattern.IdentifierPattern.create(null,
                    khepri_value.Identifier.create(null, "exports")), map(imports, (function(x) {
                    return khepri_pattern.IdentifierPattern.create(null, x.to);
                })))), khepri_statement.BlockStatement.create(body.loc, concat(khepri_statement.ExpressionStatement
                    .create(null, khepri_value.Literal.create(null, "string", "use strict")),
                    exportHeader, body.body, exportBody)));
        return khepri_statement.ExpressionStatement.create(loc, khepri_expression.CallExpression.create(
            loc, khepri_value.Identifier.create(null, "define"), [khepri_expression.ArrayExpression
                .create(null, concat(khepri_value.Literal.create(null, "string", "require"),
                    khepri_value.Literal.create(null, "string", "exports"), map(imports, (
                        function(x) {
                            return khepri_value.Literal.create(null, "string", x.from);
                        })))), packageBody
            ]));
    }));
    (exports.amdPackage = amdPackage);
}))