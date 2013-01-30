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
var Identifier = function(name) {
    this.name = name;
};
Identifier.prototype = new node.Node;
Identifier.prototype.type = "Identifier";

/**
 * 
 */
var Literal = function(value) {
    this.value = value;
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