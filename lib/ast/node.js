/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['parse/parse'], function(parse){
"use strict";

/* Node
 ******************************************************************************/
var Node = function(loc) {
    this.loc = loc;
};

var _nodeValueToString = function(buf, key, value) {
    if (value && !value.hasOwnProperty('toString')) {
        if (Array.isArray(value)) {
            return buf + ' ' + key + ':[' + value + ']';
        } 
    }
    return buf + ' ' + key + ':' + value;
};

Node.prototype.toString = function(start) {
    var buf = (start ? ' ' + start : '');
    var keys = Object.keys(this);
    for (var i = 0, len = keys.length; i < len; ++i) {
        var key = keys[i];
        buf = _nodeValueToString(buf, key, this[key]);
    }
    return "{" + this.type + buf + "}";
};



/* Export
 ******************************************************************************/
return {
    'Node': Node,
};

});