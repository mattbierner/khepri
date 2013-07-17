/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/transform.kep'
 * DO NOT EDIT
*/
define(["ecma/ast/clause", "ecma/ast/declaration", "ecma/ast/expression", "ecma/ast/program", "ecma/ast/statement", "ecma/ast/value", "khepri/ast/khepri"], function(astClause, astDeclaration, astExpression, astProgram, astStatement, astValue, astKhepri) {
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var transform = function(node) {
        if (! node)return node;
        
        switch(node.type){
            case "CatchClause":
            return new astClause.CatchClause(node.loc, transform(node.param), transform(node.body));
            case "SwitchCase":
            return new astClause.SwitchCase(node.loc, transform(node.test), map(node.consequent, transform));
            case "BlockStatement":
            return new astStatement.BlockStatement(node.loc, map(node.body, transform));
            case "ExpressionStatement":
            return new astStatement.ExpressionStatement(node.loc, transform(node.expression));
            case "IfStatement":
            return new astStatement.IfStatement(node.loc, transform(node.test), transform(node.consequent), transform(node.alternate));
            case "SwitchStatement":
            return new astStatement.SwitchStatement(node.loc, transform(node.discriminant), map(node.cases, transform));
            case "ReturnStatement":
            return new astStatement.ReturnStatement(node.loc, transform(node.argument));
            case "ThrowStatement":
            return new astStatement.ThrowStatement(node.loc, transform(node.argument));
            case "TryStatement":
            return new astStatement.TryStatement(node.loc, transform(node.block), transform(node.handler), transform(node.finalizer));
            case "WhileStatement":
            return new astStatement.WhileStatement(node.loc, transform(node.test), transform(node.body));
            case "DoWhileStatement":
            return new astStatement.DoWhileStatment(node.loc, transform(node.body), transform(node.test));
            case "ForStatement":
            return new astStatement.ForStatement(node.loc, transform(node.init), transform(node.test), transform(node.update), transform(node.body));
            case "AssignmentExpression":
            return new astExpression.AssignmentExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "UnaryExpression":
            return new astExpression.UnaryExpression(node.loc, node.operator, transform(node.argument));
            case "BinaryExpression":
            return new astExpression.BinaryExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "LogicalExpression":
            return new astExpression.LogicalExpression(node.loc, node.operator, transform(node.left), transform(node.right));
            case "ConditionalExpression":
            return new astExpression.ConditionalExpression(node.loc, transform(node.test), transform(node.consequent), transform(node.alternate));
            case "NewExpression":
            return new astExpression.NewExpression(node.loc, transform(node.callee), map(node.args, transform));
            case "CallExpression":
            return new astExpression.CallExpression(node.loc, transform(node.callee), node.args.map(transform));
            case "MemberExpression":
            return new astExpression.MemberExpression(node.loc, transform(node.object), transform(node.property), node.computed);
            case "ArrayExpression":
            return new astExpression.ArrayExpression(node.loc, map(node.elements, transform));
            case "ObjectExpression":
            return new astExpression.ObjectExpression(node.loc, map(node.properties, function(x) {
                return ({
                    "kind": x.kind,
                    "key": transform(x.key),
                    "value": transform(x.value)
                });
            }
            ));
            case "LetExpression":
            console.log(node.bindings);
            return node.bindings.reduceRight(function(p, c) {
                return new astExpression.CallExpression(null, new astExpression.FunctionExpression(null, null, [c.id], new astStatement.BlockStatement(null, [new astStatement.ReturnStatement(null, p)])), [((c.init.type === "FunctionExpression") ? new astExpression.FunctionExpression(null, (c.init.id || c.id), c.init.params, c.init.body) : c.init)]);
            }
            , transform(node.body));
            case "FunctionExpression":
            return new astExpression.FunctionExpression(node.loc, node.id, map(node.params, transform), transform(node.body));
            case "Program":
            return new astProgram.Program(node.loc, map(node.body, transform));
            case "VariableDeclaration":
            return new astDeclaration.VariableDeclaration(node.loc, map(node.declarations, transform));
            case "VariableDeclarator":
            return new astDeclaration.VariableDeclarator(node.loc, node.id, transform(node.init));
            case "StaticDeclaration":
            return new astStatement.EmptyStatement(node.loc);
        }
        return node;
    }
    ;
    return ({
        "transform": transform
    });
}
);
