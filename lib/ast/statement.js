/**
 * @fileOverview AST statement nodes for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define(['ecma/ast/node'], function(node){
"use strict";

/**
 * Any ECMAScript statement.
 * @constructor
 */
var Statement = function() { };
Statement.prototype = new node.Node;

/**
 * Empty statement.
 * @constructor
 */
var EmptyStatement = function() { };
EmptyStatement.prototype = new Statement;
EmptyStatement.prototype.type = "EmptyStatement";

/**
 * @constructor
 */
var DebuggerStatement = function() { };
DebuggerStatement.prototype = new Statement;
DebuggerStatement.prototype.type = "DebuggerStatement";

/**
 * Block statement.
 * @constructor
 * 
 * A set of statements, the body, inside of a block.
 */
var BlockStatement = function(body) {
    this.body = body;
};
BlockStatement.prototype = new Statement;
BlockStatement.prototype.type = "BlockStatement";

/**
 * @constructor
 */
var ExpressionStatement = function(expression) {
    this.expression = expression;
};
ExpressionStatement.prototype = new Statement;
ExpressionStatement.prototype.type = "ExpressionStatement";

/**
 * @constructor
 */
var IfStatement = function(test, consequent, alternate) {
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
};
IfStatement.prototype = new Statement;
IfStatement.prototype.type = "IfStatement";

/**
 * @constructor
 */
var LabeledStatement = function(label, body) {
    this.label = label;
    this.body = body;
};
LabeledStatement.prototype = new Statement;
LabeledStatement.prototype.type = "LabeledStatement";

/**
 * @constructor
 */
var BreakStatement = function(label) {
    this.label = (label || null);
};
BreakStatement.prototype = new Statement;
BreakStatement.prototype.type = "BreakStatement";

/**
 * @constructor
 */
var ContinueStatement = function(label) {
    this.label = (label || null);
};
ContinueStatement.prototype = new Statement;
ContinueStatement.prototype.type = "ContinueStatement";

/**
 * @constructor
 */
var WithStatement = function(object, body) {
    this.object = object;
    this.body = body;
};
WithStatement.prototype = new Statement;
WithStatement.prototype.type = "WithStatement";

/**
 * @constructor
 */
var SwitchStatement = function(discriminant, cases, lexical) {
    this.discriminant = discriminant;
    this.cases = cases;
    this.lexical = lexical;
};
SwitchStatement.prototype = new Statement;
SwitchStatement.prototype.type = "SwitchStatement";

/**
 * @constructor
 */
var ReturnStatement = function(argument) {
    this.argument = (argument || null);
};
ReturnStatement.prototype = new Statement;
ReturnStatement.prototype.type = "ReturnStatement";

/**
 * @constructor
 */
var ThrowStatement = function(argument) {
    this.argument = argument;
};
ThrowStatement.prototype = new Statement;
ThrowStatement.prototype.type = "ThrowStatement";

/**
 * @constructor
 */
var TryStatement = function(block, handler, guardedHandlers, finalizer) {
    this.block = block;
    this.handler = handler;
    this.guardedHandlers = guardedHandlers;
    this.finalizer = finalizer;
};
TryStatement.prototype = new Statement;
TryStatement.prototype.type = "TryStatement";

/**
 * @constructor
 */
var WhileStatement = function(test, body) {
    this.test = test;
    this.body = body;
};
WhileStatement.prototype = new Statement;
WhileStatement.prototype.type = "WhileStatement";

/**
 * @constructor
 */
var DoWhileStatement = function(body, test) {
    this.test = test;
    this.body = body;
};
DoWhileStatement.prototype = new Statement;
DoWhileStatement.prototype.type = "DoWhileStatement";

/**
 * @constructor
 */
var ForStatement = function(init, test, update, body) {
    this.init = (init || null);
    this.test = (test || null);
    this.update = (update || null);
    this.body = body;
};
ForStatement.prototype = new Statement;
ForStatement.prototype.type = "ForStatement";

/**
 * @constructor
 */
var ForInStatement = function(left, right, body, each) {
    this.left = left;
    this.right = right;
    this.body = body;
    this.each = each;
};
ForInStatement.prototype = new Statement;
ForInStatement.prototype.type = "ForInStatement";


/* Export
 ******************************************************************************/
return {
    'Statement': Statement,
    
    'EmptyStatement': EmptyStatement,
    'DebuggerStatement': DebuggerStatement,
    'BlockStatement': BlockStatement,
    'ExpressionStatement': ExpressionStatement,
    'IfStatement': IfStatement,
    'LabeledStatement': LabeledStatement,
    'BreakStatement': BreakStatement,
    'ContinueStatement': ContinueStatement,
    'WithStatement': WithStatement,
    'SwitchStatement': SwitchStatement,
    'ReturnStatement': ReturnStatement,
    
    'ThrowStatement': ThrowStatement,
    'TryStatement': TryStatement,
    
    'WhileStatement': WhileStatement,
    'DoWhileStatement': DoWhileStatement,
    'ForStatement': ForStatement,
    'ForInStatement': ForInStatement
};

});