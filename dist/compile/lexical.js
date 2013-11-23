/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/lexical.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri_ast/node", "khepri_ast/pattern", "khepri_ast/value"], (function(require, exports, ast_node, ast_pattern, ast_value) {
    "use strict";
    var check;
    var ast_node = ast_node,
        ast_pattern = ast_pattern,
        ast_value = ast_value;
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);
    var copy = (function(obj) {
        return Object.keys(obj).reduce((function(p, c) {
            (p[c] = obj[c]);
            return p;
        }), new(obj.constructor)());
    });
    var defineProperty = (function(obj, prop, descriptor) {
        return Object.defineProperty(copy(obj), prop, descriptor);
    });
    var cont = (function(f, args) {
        var c = [f, args];
        (c._next = true);
        return c;
    });
    var trampoline = (function(f) {
        var value = f;
        while ((value && value._next))(value = value[0].apply(undefined, value[1]));

        return value;
    });
    var State = (function(realScope, scope) {
        (this.realScope = realScope);
        (this.scope = scope);
    });
    (State.setScope = (function(s, scope) {
        return new(State)(s.realScope, scope);
    }));
    (State.setRealScope = (function(s, realScope) {
        return new(State)(realScope, s.scope);
    }));
    var ok = (function(x) {
        return (function(s, ok, _) {
            return ok(x, s);
        });
    });
    var error = (function(x) {
        return (function(s, _, err) {
            return err(x, s);
        });
    });
    var bind = (function(p, f) {
        return (function(s, ok, err) {
            return cont(p, [s, (function(x, s) {
                return f(x)(s, ok, err);
            }), err]);
        });
    });
    var next = (function(p, n) {
        return bind(p, (function() {
            return n;
        }));
    });
    var seqa = (function(arr) {
        return reduceRight(arr, (function(p, c) {
            return next(c, p);
        }), ok());
    });
    var seq = (function() {
        var args = arguments;
        return seqa(args);
    });
    var extract = (function(s, ok, _) {
        return ok(s, s);
    });
    var examineScope = (function(f) {
        return bind(extract, (function(s) {
            return f(s.scope);
        }));
    });
    var examineRealScope = (function(f) {
        return bind(extract, (function(s) {
            return f(s.realScope);
        }));
    });
    var modifyScope = (function(f) {
        return (function(s, ok, err) {
            return (function() {
                {
                    var scope = f(s.scope),
                        newState = State.setScope(s, scope);
                    return ok(scope, newState);
                }
            })();
        });
    });
    var modifyRealScope = (function(f) {
        return (function(s, ok, err) {
            return (function() {
                {
                    var scope = f(s.realScope),
                        newState = State.setRealScope(s, scope);
                    return ok(scope, newState);
                }
            })();
        });
    });
    var setScope = (function(s) {
        return modifyScope((function() {
            return s;
        }));
    });
    var setRealScope = (function(s) {
        return modifyRealScope((function() {
            return s;
        }));
    });
    var Scope = (function(record, outer, mapping) {
        (this.record = record);
        (this.outer = outer);
        (this.mapping = mapping);
    });
    (Scope.prototype.hasOwnBinding = (function(id) {
        return Object.prototype.hasOwnProperty.call(this.record, id);
    }));
    (Scope.prototype.hasBinding = (function(id) {
        return (this.hasOwnBinding(id) || (this.outer && this.outer.hasBinding(id)));
    }));
    (Scope.prototype.getBinding = (function(id) {
        return (this.hasOwnBinding(id) ? this.record[id] : (this.outer ? this.outer.getBinding(id) : null));
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
    var block = (function(body) {
        return examineScope((function(s) {
            return seq(setScope(new(Scope)(({}), s, s.mapping)), body, setScope(s));
        }));
    });
    var emptyBlock = (function(body) {
        return examineScope((function(s) {
            return seq(setScope(new(Scope)(({}), s, ({}))), body, setScope(s));
        }));
    });
    var realBlock = (function(body) {
        return examineRealScope((function(s) {
            return seq(setRealScope(new(Scope)(({}), s, ({}))), emptyBlock(body), setRealScope(s));
        }));
    });
    var checkCanAddOwnBinding = (function(id, loc) {
        return examineScope((function(s) {
            return (s.hasOwnBinding(id) ? error(((((("'" + id) + "' at:") + loc) + " already bound for scope from:") + s.getBinding(id).loc)) : ok());
        }));
    });
    var hasBinding = (function(id, loc) {
        return examineScope((function(s) {
            return (s.hasBinding(id) ? ok() : error(((("Undeclared identifier:'" + id) + "' at:") + loc)));
        }));
    });
    var hasFreeBinding = (function(id, loc) {
        return seq(hasBinding(id, loc), examineScope((function(s) {
            return (function() {
                {
                    var current = s.getBinding(id);
                    return (current.reserved ? error(((("Undeclared identifier:'" + id) + "' at:") + loc)) : ok());
                }
            })();
        })));
    });
    var checkCanAssign = (function(id, loc) {
        return examineScope((function(s) {
            return (s.hasBinding(id) ? (function() {
                {
                    var b = s.getBinding(id);
                    return (b.mutable ? ok() : error(((("Assign to immutable variable:'" + id) + "' at:") + loc)));
                }
            })() : ok());
        }));
    });
    var getUnusedId = (function(id, loc) {
        return examineRealScope((function(s) {
            return ok((s.hasOwnBinding(id) ? s.getUnusedId(id) : id));
        }));
    });
    var addMapping = (function(id, newId) {
        return modifyScope((function(s) {
            return Scope.addMapping(s, id, newId);
        }));
    });
    var addMutableBinding = (function(id, loc) {
        return seq(modifyScope((function(s) {
            return Scope.addMutableBinding(s, id, loc);
        })), modifyRealScope((function(s) {
            return Scope.addMutableBinding(s, id, loc);
        })), addMapping(id, id));
    });
    var addImmutableBinding = (function(id, loc) {
        return seq(modifyScope((function(s) {
            return Scope.addImmutableBinding(s, id, loc);
        })), modifyRealScope((function(s) {
            return Scope.addImmutableBinding(s, id, loc);
        })), addMapping(id, id));
    });
    var addUniqueMutableBinding = (function(id, loc) {
        return next(checkCanAddOwnBinding(id, loc), examineRealScope((function(s) {
            return (s.hasOwnBinding(id) ? (function() {
                {
                    var new_id = s.getUnusedId(id);
                    return seq(addMutableBinding(id, loc), addMutableBinding(new_id, loc), addMapping(id, new_id));
                }
            })() : addMutableBinding(id, loc));
        })));
    });
    var addMutableBindingInRealBlock = (function(id, loc) {
        return next(checkCanAddOwnBinding(id, loc), addUniqueMutableBinding(id, loc));
    });
    var addImmutableBindingInRealBlock = (function(id, loc) {
        return next(checkCanAddOwnBinding(id, loc), addImmutableBinding(id, loc));
    });
    var addUnusedImmutableBinding = (function(id, loc) {
        return seq(examineRealScope((function(s) {
            return (s.hasOwnBinding(id) ? (function() {
                {
                    var new_id = s.getUnusedId(id);
                    return seq(addImmutableBinding(id, loc), addImmutableBinding(new_id, loc), addMapping(id, new_id));
                }
            })() : addImmutableBindingInRealBlock(id, loc));
        })));
    });
    var addUniqueImmutableBinding = (function(id, loc) {
        return seq(checkCanAddOwnBinding(id, loc), addUnusedImmutableBinding(id, loc));
    });
    var addReservedBinding = (function(id, loc) {
        return seq(modifyScope((function(s) {
            return Scope.addReservedBinding(s, id, loc);
        })), modifyRealScope((function(s) {
            return Scope.addReservedBinding(s, id, loc);
        })), addMapping(id, id));
    });
    var _check = (function(node) {
        if ((!node || !(node instanceof ast_node.Node))) return ok();

        switch (node.type) {
            case "BlockStatement":
                return block(seqa(map(node.body, _check)));
            case "ExpressionStatement":
                return _check(node.expression);
            case "IfStatement":
                return seq(_check(node.test), block(_check(node.consequent)), block(_check(node.alternate)));
            case "WithStatement":
                return block(next(seqa(node.bindings.map(_check)), seqa(map(node.body.body, _check))));
            case "SwitchStatement":
                return block(next(_check(node.discriminant), seqa(map(node.cases, _check))));
            case "ReturnStatement":
                return _check(node.argument);
            case "ThrowStatement":
                return _check(node.argument);
            case "TryStatement":
                return seq(_check(node.block), block(_check(node.handler)), block(_check(node.finalizer)));
            case "WhileStatement":
                return next(_check(node.test), block(_check(node.body)));
            case "DoWhileStatement":
                return seq(block(_check(node.body)), block(_check(node.test)));
            case "ForStatement":
                return block(seq(_check(node.init), _check(node.test), _check(node.update), block(_check(node.body))));
            case "UnaryExpression":
                return _check(node.argument);
            case "AssignmentExpression":
                return seq(_check(node.left), ((node.left.type === "Identifier") ? checkCanAssign(node.left.name, node.left.loc.start) : ok()), _check(node.right));
            case "LogicalExpression":
            case "BinaryExpression":
                return seq(_check(node.left), _check(node.right));
            case "ConditionalExpression":
                return seq(_check(node.test), _check(node.consequent), _check(node.alternate));
            case "CallExpression":
            case "NewExpression":
                return seq(_check(node.callee), seqa(map(node.args, _check)));
            case "MemberExpression":
                return seq(_check(node.object), (node.computed ? _check(node.property) : ok()));
            case "ArrayExpression":
                return seqa(map(node.elements, _check));
            case "ObjectExpression":
                return seqa(map(node.properties, (function(x) {
                    return _check(x.value);
                })));
            case "LetExpression":
                return realBlock(next(seqa(node.bindings.map(_check)), _check(node.body)));
            case "CurryExpression":
                return next(_check(node.base), seqa(map(node.args, _check)));
            case "UnaryOperatorExpression":
                return ok();
            case "FunctionExpression":
                return realBlock(seq((node.id ? addImmutableBinding(node.id.name, node.loc) : ok()), _check(node.params), seqa(map(node.body.body, _check))));
            case "Program":
                return (Array.isArray(node.body) ? seqa(map(node.body, _check)) : _check(node.body));
            case "Package":
                return seq(addImmutableBindingInRealBlock("require", null), addImmutableBindingInRealBlock("exports", null), addImmutableBindingInRealBlock("module", null), _check(node.exports), ((node.body.type === "WithStatement") ? next(seqa(map(node.body.bindings, _check)), seqa(map(node.body.body.body, _check))) : seqa(map(node.body.body, _check))));
            case "PackageExports":
                return seqa(map(node.exports, _check));
            case "PackageExport":
                return addMutableBindingInRealBlock(node.id.name, node.loc);
            case "CatchClause":
                return block(next(addImmutableBindingInRealBlock(node.param.name, node.param.loc), seqa(map(node.body.body, _check))));
            case "SwitchCase":
                return seqa(map(node.consequent, _check));
            case "StaticDeclaration":
            case "VariableDeclaration":
                return seqa(map(node.declarations, _check));
            case "StaticDeclarator":
                return addImmutableBindingInRealBlock(node.id.name, node.loc);
            case "VariableDeclarator":
                return seq(addMutableBindingInRealBlock(node.id.name, node.loc), _check(node.id), _check(node.init));
            case "Binding":
                return next(_check(node.pattern), _check(node.value));
            case "EllipsisPattern":
                return ok();
            case "SinkPattern":
                return bind(getUnusedId("_"), (function(x) {
                    (node.id = x);
                    return addReservedBinding(x, node.loc);
                }));
            case "IdentifierPattern":
                return seq(addUniqueImmutableBinding(node.id.name, node.loc), _check(node.init), examineScope((function(s) {
                    if (s.hasMapping(node.id.name))(node.id.name = s.getMapping(node.id.name));

                    return ok();
                })));
            case "ImportPattern":
                return _check(node.pattern);
            case "ArrayPattern":
                return examineScope((function(s) {
                    if (!node.id) {
                        var unused = s.getUnusedId("__a");
                        var id = ast_pattern.IdentifierPattern.create(null, ast_value.Identifier.create(null, unused));
                        (node.id = id);
                        return next(addReservedBinding(unused), seqa(map(node.elements, _check)));
                    }

                    return next(_check(node.id), seqa(map(node.elements, _check)));
                }));
            case "ObjectPattern":
                return examineScope((function(s) {
                    if (!node.id) {
                        var unused = s.getUnusedId("__o");
                        var id = ast_pattern.IdentifierPattern.create(null, ast_value.Identifier.create(null, unused));
                        (node.id = id);
                        return next(addReservedBinding(unused), seqa(map(node.elements, _check)));
                    }

                    return next(_check(node.id), seqa(map(node.elements, _check)));
                }));
            case "ObjectPatternElement":
                return (node.target ? _check(node.target) : _check(node.key));
            case "ArgumentsPattern":
                return next(_check(node.id), seqa(map(node.elements, _check)));
            case "Identifier":
                return examineScope((function(s) {
                    if (s.hasMapping(node.name))(node.name = s.getMapping(node.name));

                    return hasFreeBinding(node.name, node.loc);
                }));
        }
        return ok();
    });
    var builtins = ["Array", "Boolean", "Date", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Error", "eval", "EvalError", "Function", "Infinity", "isFinite", "isNaN", "JSON", "Math", "NaN", "Number", "Object", "parseInt", "parseFloat", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "undefined", "URIError"];
    (check = (function(root, globals) {
        var g = (globals || builtins);
        var scope = g.reduce(Scope.addImmutableBinding, new(Scope)(({}), null, ({})));
        var state = new(State)(scope, scope);
        return trampoline(_check(root)(state, (function(x) {
            return root;
        }), (function(err, s) {
            throw err;
        })));
    }));
    (exports.check = check);
}))