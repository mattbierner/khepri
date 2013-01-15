/**
 * @fileOverview AST function Nodes for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define(['ecma/ast/node'], function(node){
"use strict";

/**
 * 
 */
var Function = function(id, params, body) {
    this.id = (id || null);
    this.params = params;
    this.body = body;
};
Function.prototype = new node.Node;
Function.prototype.type = "Function";


/* Export
 ******************************************************************************/
return {
    'Function': Function,
};

});