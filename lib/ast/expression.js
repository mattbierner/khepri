/**
 * @fileOverview AST expression Nodes for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define(['ecma/ast/node'], function(node){
"use strict";

/**
 * 
 */
var Expression = function() { };
Expression.prototype = new node.Node;

/**
 * 
 */
var ThisExpression = function() { };
ThisExpression.prototype = new Expression;
ThisExpression.prototype.type = "ThisExpression";

/**
 * 
 */
var SequenceExpression = function(expressions) {
    this.expressions = expressions;
};
SequenceExpression.prototype = new Expression;
SequenceExpression.prototype.type = "SequenceExpression";

/**
 * 
 */
var UnaryExpression = function(operator, argument) {
    this.operator = operator;
    this.argument = argument;
};
UnaryExpression.prototype = new Expression;
UnaryExpression.prototype.type = "UnaryExpression";

/**
 * 
 */
var BinaryExpression = function(operator, left, right) {
    this.operator = operator;
    this.left = left;
    this.right = right;
};
BinaryExpression.prototype = new Expression;
BinaryExpression.prototype.type = "BinaryExpression";

/**
 * 
 */
var AssignmentExpression = function(operator, left, right) {
    this.operator = operator;
    this.left = left;
    this.right = right;
};
AssignmentExpression.prototype = new Expression;
AssignmentExpression.prototype.type = "AssignmentExpression";

/**
 * Update, increment or decrement, operator expression.
 */
var UpdateExpression = function(operator, argument, prefix) {
    this.operator = operator;
    this.argument = argument;
    this.prefix = prefix;
};
UpdateExpression.prototype = new Expression;
UpdateExpression.prototype.type = "UpdateExpression";

/**
 * 
 */
var LogicalExpression = function(operator, left, right) {
    this.operator = operator;
    this.left = left;
    this.right = right;
};
LogicalExpression.prototype = new Expression;
LogicalExpression.prototype.type = "LogicalExpression";

/**
 * 
 */
var ConditionalExpression = function(test, consequent, alternate) {
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
};
ConditionalExpression.prototype = new Expression;
ConditionalExpression.prototype.type = "ConditionalExpression";

/**
 * 
 */
var NewExpression = function(callee, args) {
    this.callee = callee;
    this.args = args;
};
NewExpression.prototype = new Expression;
NewExpression.prototype.type = "NewExpression";

/**
 * 
 */
var CallExpression = function(callee, args) {
    this.callee = callee;
    this.args = args;
};
CallExpression.prototype = new Expression;
CallExpression.prototype.type = "CallExpression";

/**
 * 
 */
var MemberExpression = function(object, property, computed) {
    this.object = object;
    this.property = property;
    this.computed = computed;
};
MemberExpression.prototype = new Expression;
MemberExpression.prototype.type = "MemberExpression";

/**
 * 
 */
var FunctionExpression = function(id, params, body) {
    this.id = (id || null);
    this.params = params;
    this.body = body;
};
FunctionExpression.prototype = new Expression;
FunctionExpression.prototype.type = "FunctionExpression";

/**
 * 
 */
var ArrayExpression = function(elements) {
    this.elements = elements;
};
ArrayExpression.prototype = new Expression;
ArrayExpression.prototype.type = "ArrayExpression";

/**
 * 
 */
var ObjectExpression = function(properties) {
    this.properties = properties;
};
ObjectExpression.prototype = new Expression;
ObjectExpression.prototype.type = "ObjectExpression";

/* Export
 ******************************************************************************/
return {
    'Expression': Expression,
    
    'ThisExpression': ThisExpression,
    'SequenceExpression': SequenceExpression,
    'UnaryExpression': UnaryExpression,
    'BinaryExpression': BinaryExpression,
    'AssignmentExpression': AssignmentExpression,
    'UpdateExpression': UpdateExpression,
    'LogicalExpression': LogicalExpression,
    'ConditionalExpression': ConditionalExpression,
    'NewExpression': NewExpression,
    'CallExpression': CallExpression,
    'MemberExpression': MemberExpression,
    
    'FunctionExpression': FunctionExpression,
    'ArrayExpression': ArrayExpression,
    'ObjectExpression': ObjectExpression
};

});