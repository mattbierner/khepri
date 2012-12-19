/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['parse/parse'], function(parse){
//"use strict";

/* Node
 ******************************************************************************/
var Node = function(props) {
    this.keys = Object.keys(props || {});
    for (var i = 0, len = this.keys.length; i < len; ++i) {
        var key = this.keys[i];
        this[key] = props[key];
    }
};

Node.prototype.toString = function() {
    var p = '';
    for (var i = 0, len = this.keys.length; i < len; ++i) {
        var key = this.keys[i],
            value = this[key];
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