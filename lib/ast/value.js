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
var Identifier = function(loc, name) {
    node.Node.call(this, loc);
    this.name = name;
};
Identifier.prototype = new node.Node;
Identifier.prototype.type = "Identifier";

/**
 * 
 */
var Literal = function(loc, value, kind) {
    node.Node.call(this, loc);
    this.value = value;
    this.kind = kind
};
Literal.prototype = new node.Node;
Literal.prototype.type = "Literal";



/* Export
 ******************************************************************************/
return {
    'Identifier': Identifier,
    'Literal': Literal
};

});