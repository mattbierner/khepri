/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/transform.kep'
 * DO NOT EDIT
*/
;
define(["khepri_ast/clause", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/program", "khepri_ast/statement", "khepri_ast/value"], function(ast_clause, ast_declaration, ast_expression, ast_program, ast_statement, ast_value) {
    var concat = Function.prototype.call.bind(Array.prototype.concat);
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var objectPattern = function(base, pattern, key) {
        if (! pattern)return null;
        
        var innerBase = ast_expression.MemberExpression.create(null, base, key, true);
        switch(pattern.type){
            case "IdentifierPattern":
            return ast_declaration.VariableDeclarator.create(null, ast_value.Identifier.create(null, pattern.name), innerBase);
            case "ArrayPattern":
            var elements = map(pattern.elements, function(x, i) {
                return arrayPattern(innerBase, x, i);
            }
            );
            return (pattern.id.gen ? elements : concat([ast_declaration.VariableDeclarator.create(null, pattern.id, innerBase)], elements));
            case "ObjectPattern":
            var elements = map(pattern.elements, function(x, i) {
                return objectPattern(innerBase, x, i);
            }
            );
            return (pattern.id.gen ? elements : concat([ast_declaration.VariableDeclarator.create(null, pattern.id, innerBase)], elements));
            default:
            return null;
        }
    }
    ;
    var arrayPattern = function(base, pattern, index) {
        return objectPattern(base, pattern, ast_value.Literal.create(null, "number", index));
    }
    ;
    var transform = function(node) {
        if (! node)return node;
        
        switch(node.type){
            case "CatchClause":
            return new ast_clause.CatchClause(node.loc, transform(node.param), transform(node.body));
            case "SwitchCase":
            return new ast_clause.SwitchCase(node.loc, transform(node.test), map(node.consequent, transform));
            case "BlockStatement":
            return new ast_statement.BlockStatement(node.loc, map(node.body, transform));
            case "ExpressionStatement":
            return new ast_statement.ExpressionStatement(node.loc, transform(node.expression));
            case "IfStatement":
            return new ast_statement.IfStatement(node.loc, transform(node.test), transform(node.consequent), transform(node.alternate));
            case "SwitchStatement":
            return new ast_statement.SwitchStatement(node.loc, transform(node.discriminant), map(node.cases, transform));
            case "ReturnStatement":
            return new ast_statement.ReturnStatement(node.loc, transform(node.argument));
            case "ThrowStatement":
            return new ast_statement.ThrowStatement(node.loc, transform(node.argument));
            case "TryStatement":
            return new ast_statement.TryStatement(node.loc, transform(node.block), transform(node.handler), transform(node.finalizer));
            case "WhileStatement":
            return new ast_statement.WhileStatement(node.loc, transform(node.test), transform(node.body));
            case "DoWhileStatement":
            return new ast_statement.DoWhileStatment(node.loc, transform(node.body), transform(node.test));
            case "ForStatement":
            return new ast_statement.ForStatement(node.loc, transform(node.init), transform(node.test), transform(node.update), transform(node.body));
            case "AssignmentExpression":
            return new ast_expression.AssignmentExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "UnaryExpression":
            return new ast_expression.UnaryExpression(node.loc, node.operator, transform(node.argument));
            case "BinaryExpression":
            return new ast_expression.BinaryExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "LogicalExpression":
            return new ast_expression.LogicalExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "ConditionalExpression":
            return new ast_expression.ConditionalExpression(node.loc, transform(node.test), transform(node.consequent), transform(node.alternate));
            case "NewExpression":
            return new ast_expression.NewExpression(node.loc, transform(node.callee), map(node.args, transform));
            case "CallExpression":
            return new ast_expression.CallExpression(node.loc, transform(node.callee), node.args.map(transform));
            case "MemberExpression":
            return new ast_expression.MemberExpression(node.loc, transform(node.object), transform(node.property), node.computed);
            case "ArrayExpression":
            return new ast_expression.ArrayExpression(node.loc, map(node.elements, transform));
            case "ObjectExpression":
            return new ast_expression.ObjectExpression(node.loc, map(node.properties, function(x) {
                return ({
                    "kind": x.kind,
                    "key": transform(x.key),
                    "value": transform(x.value)
                });
            }
            ));
            case "LetExpression":
            return node.bindings.reduceRight(function(p, c) {
                return new ast_expression.CallExpression(null, new ast_expression.FunctionExpression(null, null, [c.id], new ast_statement.BlockStatement(null, [new ast_statement.ReturnStatement(null, p)])), [((c.init.type === "FunctionExpression") ? new ast_expression.FunctionExpression(null, (c.init.id || c.id), transform(c.init.params), transform(c.init.body)) : transform(c.init))]);
            }
            , transform(node.body));
            case "FunctionExpression":
            var params = transform(node.params);
            var prefix = reduce(node.params.patterns, function(p, c) {
                switch(c.type){
                    case "ArrayPattern":
                    var base = ast_value.Identifier.create(null, c.id.name);
                    return concat(p, ast_declaration.VariableDeclaration.create(null, reduce(c.elements, function(p, c, i) {
                        return function(val) {
                            return (val ? concat(p, val) : p);
                        }
                        (arrayPattern(base, c, i));
                    }
                    , [])));
                    case "ObjectPattern":
                    var base = ast_value.Identifier.create(null, c.id.name);
                    return concat(p, ast_declaration.VariableDeclaration.create(null, reduce(c.elements, function(p, c) {
                        return function(val) {
                            return (val ? concat(p, val) : p);
                        }
                        (objectPattern(base, c.value, c.key));
                    }
                    , [])));
                }
                return p;
            }
            , []);
            (params = reduce(params, function(p, c) {
                if ((! c || (c.type === "EllipsisPattern")))return p;
                
                return p.concat([c]);
            }
            , []));
            return ast_expression.FunctionExpression.create(node.loc, transform(node.id), params, transform(new ast_statement.BlockStatement(node.body.loc, concat(prefix, node.body.body))));
            case "ParameterList":
            return map(node.patterns, transform);
            case "IdentifierPattern":
            return new ast_value.Identifier(node.loc, node.name);
            case "ArrayPattern":
            return new ast_value.Identifier(node.loc, node.id.name);
            case "ObjectPattern":
            return new ast_value.Identifier(node.loc, node.id.name);
            case "EllipsisPattern":
            return null;
            case "Program":
            return new ast_program.Program(node.loc, map(node.body, transform));
            case "VariableDeclaration":
            return new ast_declaration.VariableDeclaration(node.loc, map(node.declarations, transform));
            case "VariableDeclarator":
            return new ast_declaration.VariableDeclarator(node.loc, node.id, transform(node.init));
            case "StaticDeclaration":
            return new ast_statement.EmptyStatement(node.loc);
        }
        return node;
    }
    ;
    return ({
        "transform": transform
    });
}
);
