/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['parse/parse'], function(parse){
//"use strict";

/* Node
 ******************************************************************************/
var Node = function() { };

Node.prototype.toString = function() {
    var p = '';
    var keys = Object.keys(this);
    for (var i = 0, len = keys.length; i < len; ++i) {
        var key = keys[i], value = this[key];
        if (Array.isArray(value)) {
            p += ' ' + key + ':[' + value + ']';
        } else {
            p += ' ' + key + ':' + value;
        }
    }
    return "{" + this.type + p + "}";
};



/* Export
 ******************************************************************************/
return {
    'Node': Node,
};

});