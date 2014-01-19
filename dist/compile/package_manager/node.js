/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/package_manager/node.kep'
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
            }));
        return khepri_statement.BlockStatement.create(body.loc, concat(khepri_statement.ExpressionStatement
            .create(null, khepri_value.Literal.create(null, "string", "use strict")),
            khepri_statement.WithStatement.create(null, map(imports, (function(x) {
                return khepri_declaration.Binding.create(null, x.pattern,
                    khepri_expression.CallExpression.create(null, khepri_value.Identifier
                        .create(null, "require"), [x.from]));
            })), khepri_statement.BlockStatement.create(null, concat(exportHeader, body.body,
                exportBody)))));
    }));
    (exports.amdPackage = amdPackage);
}))