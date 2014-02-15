/*
 * THIS FILE IS AUTO GENERATED from 'lib/tail.kep'
 * DO NOT EDIT
*/
"use strict";
var Tail, trampoline;
(Tail = (function(f, s, ok, err) {
    var self = this;
    (self.f = f);
    (self.s = s);
    (self.ok = ok);
    (self.err = err);
}));
(trampoline = (function(f) {
    var value = f;
    while ((value instanceof Tail))(value = value.f(value.s, value.ok, value.err));
    return value;
}));
(exports.Tail = Tail);
(exports.trampoline = trampoline);