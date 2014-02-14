define(["require", "exports", "bes/object", "bes/record"], (function(require, exports, __o, record) {
    "use strict";
    var setProperty = __o["setProperty"],
        Scope;
    (Scope = record.declare(null, ["record", "outer", "mapping"]));
    (Scope.prototype.hasOwnBinding = (function(id) {
        var self = this;
        return Object.prototype.hasOwnProperty.call(self.record, id);
    }));
    (Scope.prototype.hasBinding = (function(id) {
        var self = this;
        return (self.hasOwnBinding(id) || (self.outer && self.outer.hasBinding(id)));
    }));
    (Scope.prototype.getBinding = (function(id) {
        var self = this;
        return (self.hasOwnBinding(id) ? self.record[id] : (self.outer ? self.outer.getBinding(id) :
            null));
    }));
    (Scope.prototype.hasOwnMapping = (function(id) {
        var self = this;
        return Object.prototype.hasOwnProperty.call(self.mapping, id);
    }));
    (Scope.prototype.hasMapping = (function(id) {
        var self = this;
        return (self.hasOwnMapping(id) || (self.outer && self.outer.hasMapping(id)));
    }));
    (Scope.prototype.getMapping = (function(id) {
        var self = this;
        return (self.hasOwnMapping(id) ? self.mapping[id] : (self.outer && self.outer.getMapping(id)));
    }));
    (Scope.prototype.getUnusedId = (function(id) {
        var self = this;
        if ((!self.hasBinding(id))) return id;
        for (var i = 0;;
            (i = (i + 1)))
            if ((!self.hasBinding((id + i)))) return (id + i);
    }));
    (Scope.addBinding = (function(s, id, info) {
        return new(Scope)(setProperty(s.record, id, info, true), s.outer, s.mapping);
    }));
    (Scope.addMutableBinding = (function(s, id, loc) {
        return Scope.addBinding(s, id, ({
            "mutable": true,
            "loc": loc
        }));
    }));
    (Scope.addImmutableBinding = (function(s, id, loc) {
        return Scope.addBinding(s, id, ({
            "mutable": false,
            "loc": loc
        }));
    }));
    (Scope.addReservedBinding = (function(s, id, loc) {
        return Scope.addBinding(s, id, ({
            "mutable": false,
            "reserved": true,
            "loc": loc
        }));
    }));
    (Scope.addMapping = (function(s, from, to) {
        return new(Scope)(s.record, s.outer, setProperty(s.mapping, from, to, true));
    }));
    (exports.Scope = Scope);
}));