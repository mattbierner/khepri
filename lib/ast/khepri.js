/**
 * @fileOverview AST clause for Khepri nodes.
 */
define(['ecma/ast/declaration',
        'ecma/ast/expression',
        'ecma/ast/statement'],
function(declaration,
        expression,
        statement){
"use strict";

/* 
 ******************************************************************************/
/**
 * 
 */
var LetBinding = function(loc, id, init) {
    declaration.Declaration.call(this, loc);
    this.id = id;
    this.init = init;
};
LetBinding.prototype = new declaration.Declaration;
LetBinding.prototype.type = "LetBinding";

/**
 * 
 */
var LetExpression = function(loc, bindings, body) {
    expression.Expression.call(this, loc);
    this.bindings = bindings;
    this.body = body;
};
LetExpression.prototype = new expression.Expression;
LetExpression.prototype.type = "LetExpression";

/**
 * 
 */
var StaticDeclaration = function(loc, declarations) {
    declaration.Declaration.call(this, loc);
    this.declarations = declarations;
};
StaticDeclaration.prototype = new declaration.Declaration;
StaticDeclaration.prototype.type = "StaticDeclaration"

/**
 * @constructor
 */
var AssignmentStatement = function(loc, operator, left, right) {
    statement.Statement.call(this, loc);
    this.operator = operator;
    this.left = left;
    this.right = right;
};
AssignmentStatement.prototype = new statement.Statement;
AssignmentStatement.prototype.type = "AssignmentStatement";

/* Export
 ******************************************************************************/
return {
    'LetBinding': LetBinding,
    'LetExpression': LetExpression,
    
    'StaticDeclaration': StaticDeclaration,
    
    'AssignmentStatement': AssignmentStatement
};

});