define(["require", "exports"], (function(require, exports) {
    "use strict";
    var Scope, copy = (function(obj) {
            return Object.keys(obj)
                .reduce((function(p, c) {
                    (p[c] = obj[c]);
                    return p;
                }), new(obj.constructor)());
        }),
        defineProperty = (function(obj, prop, descriptor) {
            return Object.defineProperty(copy(obj), prop, descriptor);
        });
    (Scope = (function(record, outer, mapping) {
        var self = this;
        (self.record = record);
        (self.outer = outer);
        (self.mapping = mapping);
    }));
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
        if (!self.hasBinding(id)) return id;
        for (var i = 0;;
            (i = (i + 1)))
            if (!self.hasBinding((id + i))) return (id + i);
    }));
    (Scope.addBinding = (function(s, id, info) {
        return new(Scope)(defineProperty(s.record, id, ({
            "value": info,
            "enumerable": true,
            "writable": true,
            "configurable": true
        })), s.outer, s.mapping);
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
        return new(Scope)(s.record, s.outer, defineProperty(s.mapping, from, ({
            "value": to,
            "enumerable": true,
            "writable": true,
            "configurable": true
        })));
    }));
    (exports.Scope = Scope);
}));