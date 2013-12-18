/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/scope.kep'
 * DO NOT EDIT
*/
define(["require", "exports"], (function(require, exports) {
    "use strict";
    var Scope;
    var copy = (function(obj) {
        return Object.keys(obj)
            .reduce((function(p, c) {
                (p[c] = obj[c]);
                return p;
            }), new(obj.constructor)());
    });
    var defineProperty = (function(obj, prop, descriptor) {
        return Object.defineProperty(copy(obj), prop, descriptor);
    });
    (Scope = (function(record, outer, mapping) {
        (this.record = record);
        (this.outer = outer);
        (this.mapping = mapping);
    }));
    (Scope.prototype.hasOwnBinding = (function(id) {
        return Object.prototype.hasOwnProperty.call(this.record, id);
    }));
    (Scope.prototype.hasBinding = (function(id) {
        return (this.hasOwnBinding(id) || (this.outer && this.outer.hasBinding(id)));
    }));
    (Scope.prototype.getBinding = (function(id) {
        return (this.hasOwnBinding(id) ? this.record[id] : (this.outer ? this.outer.getBinding(id) :
            null));
    }));
    (Scope.prototype.hasOwnMapping = (function(id) {
        return Object.prototype.hasOwnProperty.call(this.mapping, id);
    }));
    (Scope.prototype.hasMapping = (function(id) {
        return (this.hasOwnMapping(id) || (this.outer && this.outer.hasMapping(id)));
    }));
    (Scope.prototype.getMapping = (function(id) {
        return (this.hasOwnMapping(id) ? this.mapping[id] : (this.outer && this.outer.getMapping(id)));
    }));
    (Scope.prototype.getUnusedId = (function(id) {
        if (!this.hasBinding(id)) return id;
        for (var i = 0;;
            (i = (i + 1)))
            if (!this.hasBinding((id + i))) return (id + i);
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
}))