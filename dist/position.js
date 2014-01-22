/*
 * THIS FILE IS AUTO GENERATED from 'lib/position.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse"], (function(require, exports, parse) {
    "use strict";
    var SourcePosition, SourceLocation;
    var parse = parse;
    (SourcePosition = (function(line, column) {
        (this.line = line);
        (this.column = column);
    }));
    (SourcePosition.prototype = new(parse.Position)());
    (SourcePosition.prototype.constructor = SourcePosition);
    (SourcePosition.initial = new(SourcePosition)(1, 0));
    (SourcePosition.prototype.increment = (function(tok) {
        return ((tok === "\n") ? new(SourcePosition)((this.line + 1), 0) : new(SourcePosition)(this.line, (
            this.column + 1)));
    }));
    (SourcePosition.prototype.toString = (function() {
        return (((("{line:" + this.line) + " col:") + this.column) + "}");
    }));
    (SourcePosition.prototype.compare = (function(pos) {
        return ((this.line === pos.line) ? (this.column - pos.column) : (this.line - pos.line));
    }));
    (SourceLocation = (function(start, end) {
        (this.start = start);
        (this.end = end);
    }));
    (SourceLocation.prototype.toString = (function() {
        return (((("{start:" + this.start) + " end:") + this.end) + "}");
    }));
    (SourceLocation.merge = (function(s1, s2) {
        return new(SourceLocation)(((s1.start.compare(s2.start) > 0) ? s2.start : s1.start), ((s1.end.compare(
            s2.end) > 0) ? s1.end : s2.end));
    }));
    (exports.SourcePosition = SourcePosition);
    (exports.SourceLocation = SourceLocation);
}))