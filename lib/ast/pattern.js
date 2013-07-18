/**
 * @fileOverview 
 */
define(['ecma/ast/node'],
function(node){
"use strict";

/* 
 ******************************************************************************/
/**
 * 
 */
var Pattern = function(loc) {
    node.Node.call(this, loc);
};
Pattern.prototype = new node.Node;

/**
 * 
 */
var Identifier = function(loc, name) {
    Pattern.call(this, loc);
    this.name = name;
};
Identifier.prototype = new Pattern;
Identifier.prototype.constructor = Identifier;

Identifier.prototype.type = "IdentifierPattern";

/**
 * 
 */
var Ellipsis = function(loc) {
    Pattern.call(this, loc);
};
Ellipsis.prototype = new Pattern;
Ellipsis.prototype.constructor = Ellipsis;

Ellipsis.prototype.type = "EllipsisPattern";

/**
 * 
 */
var ParameterList = function(loc, patterns) {
    Pattern.call(this, loc);
    this.patterns = patterns;
};
ParameterList.prototype = new Pattern;
ParameterList.prototype.constructor = ParameterList;

ParameterList.prototype.type = "ParameterList";

/* Export
 ******************************************************************************/
return {
    'Pattern': Pattern,
    'Identifier': Identifier,
    'Ellipsis': Ellipsis,
    'ParameterList': ParameterList
};

});