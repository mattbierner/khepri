/**
 * @fileOverview AST clause for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define(['ecma/ast/node'], function(node){
"use strict";

/* 
 ******************************************************************************/
/**
 * 
 */
var SwitchCase = function(test, consequent) {
    this.test = (test || null);
    this.consequent = consequent;
};
SwitchCase.prototype = new node.Node;
SwitchCase.prototype.type = "SwitchCase";

/**
 * 
 */
var CatchCase = function(param, guard, body) {
    this.param = param;
    this.guard = (guard || null);
    this.body = body;
};
CatchCase.prototype = new node.Node;
CatchCase.prototype.type = "CatchCase";


/* Export
 ******************************************************************************/
return {
    'SwitchCase': SwitchCase,
    'CatchCase': CatchCase
};

});