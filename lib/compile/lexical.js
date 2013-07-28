/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/lexical.kep'
 * DO NOT EDIT
*/
;
define(["khepri_ast/node"], function(ast_node) {
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);
    var copy = function(obj) {
        return Object.keys(obj).reduce(function(p, c) {
            (p[c] = obj[c]);
            return p;
        }
        , new obj.constructor());
    }
    ;
    var defineProperty = function(obj, prop, descriptor) {
        return Object.defineProperty(copy(obj), prop, descriptor);
    }
    ;
    var cont = function(f, args) {
        var c = [f, args];
        (c._next = true);
        return c;
    }
    ;
    var trampoline = function(f) {
        var value = f;
        while((value && value._next))(value = value[0].apply(undefined, value[1]));
        
        return value;
    }
    ;
    var Scope = function(record, outer, mapping) {
        (this.record = record);
        (this.outer = outer);
        (this.mapping = mapping);
    }
    ;
    (Scope.prototype.hasOwnBinding = function(id) {
        return this.record.hasOwnProperty(id);
    }
    );
    (Scope.prototype.hasBinding = function(id) {
        return (this.hasOwnBinding(id) || (this.outer && this.outer.hasBinding(id)));
    }
    );
    (Scope.prototype.getBinding = function(id) {
        return (this.hasOwnBinding(id) ? this.record[id] : (this.outer ? this.outer.getBinding(id) : null));
    }
    );
    (Scope.prototype.hasMapping = function(id) {
        return this.mapping.hasOwnProperty(id);
    }
    );
    (Scope.prototype.getMapping = function(id) {
        return this.mapping[id];
    }
    );
    (Scope.prototype.getUnusedId = function(id) {
        for(var i = 0;
         ;(i = (i + 1)))if (! this.hasBinding((id + i)))return (id + i);
        
        
    }
    );
    (Scope.addBinding = function(s, id, info) {
        return new Scope(defineProperty(s.record, id, ({
            "value": info,
            "enumerable": true,
            "writable": true,
            "configurable": true
        })), s.outer, s.mapping);
    }
    );
    (Scope.addMutableBinding = function(s, id, loc) {
        return Scope.addBinding(s, id, ({
            "mutable": true,
            "loc": loc
        }));
    }
    );
    (Scope.addImmutableBinding = function(s, id, loc) {
        return Scope.addBinding(s, id, ({
            "mutable": false,
            "loc": loc
        }));
    }
    );
    (Scope.addMapping = function(s, from, to) {
        return new Scope(s.record, s.outer, defineProperty(s.mapping, from, ({
            "value": to,
            "enumerable": true,
            "writable": true,
            "configurable": true
        })));
    }
    );
    var ok = function(x) {
        return function(s, ok, err) {
            return ok(x, s);
        }
        ;
    }
    ;
    var error = function(x) {
        return function(s, ok, err) {
            return err(x, s);
        }
        ;
    }
    ;
    var bind = function(p, f) {
        return function(s, ok, err) {
            return cont(p, [s, function(x, s) {
                return f(x)(s, ok, err);
            }
            , err]);
        }
        ;
    }
    ;
    var next = function(p, n) {
        return bind(p, function() {
            return n;
        }
        );
    }
    ;
    var seq = function(arr) {
        return reduceRight(arr, function(p, c) {
            return next(c, p);
        }
        , ok());
    }
    ;
    var extract = function(s, ok, err) {
        return ok(s, s);
    }
    ;
    var examine = function(f) {
        return bind(extract, f);
    }
    ;
    var modify = function(f) {
        return function(scope, ok, err) {
            return function(s) {
                return ok(s, s);
            }
            (f(scope));
        }
        ;
    }
    ;
    var setScope = function(s) {
        return modify(function() {
            return s;
        }
        );
    }
    ;
    var block = function(body) {
        return examine(function(s) {
            return seq([setScope(new Scope(({}), s, s.mapping)), body, setScope(s)]);
        }
        );
    }
    ;
    var checkCanAddOwnBinding = function(id, loc) {
        return examine(function(s) {
            return (s.hasOwnBinding(id) ? error(((((("'" + id) + "' at:") + loc) + " already bound for scope from:") + s.getBinding(id).loc)) : ok());
        }
        );
    }
    ;
    var hasBinding = function(id, loc) {
        return examine(function(s) {
            return (s.hasBinding(id) ? ok() : error(((("Undeclared identifier:'" + id) + "' at:") + loc)));
        }
        );
    }
    ;
    var checkCanAssign = function(id, loc) {
        return examine(function(s) {
            return (s.hasBinding(id) ? function(b) {
                return (b.mutable ? ok() : error(((("Assign to immutable variable:'" + id) + "' at:") + loc)));
            }
            (s.getBinding(id)) : ok());
        }
        );
    }
    ;
    var addMutableBinding = function(id, loc) {
        return modify(function(s) {
            return Scope.addMapping(Scope.addMutableBinding(s, id, loc), id, id);
        }
        );
    }
    ;
    var addUniqueMutableBinding = function(id, loc) {
        return examine(function(s) {
            return (s.hasBinding(id) ? function(new_id) {
                return seq([addMutableBinding(new_id, loc), modify(function(s) {
                    return Scope.addMapping(s, id, new_id);
                }
                )]);
            }
            (s.getUnusedId(id)) : addMutableBinding(id, loc));
        }
        );
    }
    ;
    var tryAddMutableBinding = function(id, loc) {
        return seq([checkCanAddOwnBinding(id, loc), addUniqueMutableBinding(id, loc)]);
    }
    ;
    var addImmutableBindingInRealBlock = function(id, loc) {
        return seq([checkCanAddOwnBinding(id, loc), examine(function(s) {
            return next(setScope(Scope.addMapping(s, id, id)), modify(function(s) {
                return Scope.addImmutableBinding(s, id, loc);
            }
            ));
        }
        )]);
    }
    ;
    var addImmutableBinding = function(id, loc) {
        return seq([checkCanAddOwnBinding(id, loc), examine(function(s) {
            return (s.hasBinding(id) ? function(new_id) {
                return next(setScope(Scope.addMapping(s, id, new_id)), modify(function(s) {
                    return Scope.addImmutableBinding(s, new_id, loc);
                }
                ));
            }
            (s.getUnusedId(id)) : addImmutableBindingInRealBlock(id, loc));
        }
        )]);
    }
    ;
    var _check = function(node) {
        if ((! node || ! (node instanceof ast_node.Node)))return ok();
        
        switch(node.type){
            case "BlockStatement":
            return block(seq(map(node.body, _check)));
            case "ExpressionStatement":
            return _check(node.expression);
            case "IfStatement":
            return seq([_check(node.test), block(_check(node.consequent)), block(_check(node.alternate))]);
            case "SwitchStatement":
            return seq([_check(node.discriminant), block(seq(map(node.cases, _check)))]);
            case "ReturnStatement":
            return _check(node.argument);
            case "ThrowStatement":
            return _check(node.argument);
            case "TryStatement":
            return seq([_check(node.block), block(_check(node.handler)), block(_check(node.finalizer))]);
            case "WhileStatement":
            return seq([_check(node.test), block(_check(node.body))]);
            case "DoWhileStatement":
            return seq([block(_check(node.body)), block(_check(node.test))]);
            case "ForStatement":
            return block(seq([_check(node.init), _check(node.test), _check(node.update), block(_check(node.body))]));
            case "UnaryExpression":
            return _check(node.argument);
            case "AssignmentExpression":
            return seq([_check(node.left), ((node.left.type === "Identifier") ? checkCanAssign(node.left.name, node.left.loc.start) : ok()), _check(node.right)]);
            case "LogicalExpression":
            case "BinaryExpression":
            return seq([_check(node.left), _check(node.right)]);
            case "ConditionalExpression":
            return seq([_check(node.test), _check(node.consequent), _check(node.alternate)]);
            case "CallExpression":
            case "NewExpression":
            return seq([_check(node.callee), seq(map(node.args, _check))]);
            case "MemberExpression":
            return seq([_check(node.object), (node.computed ? _check(node.property) : ok())]);
            case "ArrayExpression":
            return seq(map(node.elements, _check));
            case "ObjectExpression":
            return seq(map(node.properties, function(x) {
                return _check(x.value);
            }
            ));
            case "LetExpression":
            return block(next(seq(node.bindings.map(function(x) {
                return addImmutableBindingInRealBlock(x.id.name, x.id.loc.start);
            }
            )), _check(node.body)));
            case "FunctionExpression":
            return block(seq([(node.id ? addImmutableBindingInRealBlock(node.id.name, node.loc) : ok()), seq(map(node.params.patterns, _check)), seq(map(node.body.body, _check))]));
            case "IdentifierPattern":
            return addImmutableBindingInRealBlock(node.name, node.loc);
            case "ArrayPattern":
            return examine(function(s) {
                var id = (node.id ? node.id.name : s.getUnusedId("__a"));
                (node.name = id);
                return seq([addImmutableBindingInRealBlock(id, node.loc), seq(map(node.elements, _check))]);
            }
            );
            case "EllipsisPattern":
            return ok();
            case "Program":
            return seq(map(node.body, _check));
            case "CatchClause":
            return block(next(addImmutableBindingInRealBlock(node.param.name, node.param.loc), seq(map(node.body.body, _check))));
            case "StaticDeclaration":
            case "VariableDeclaration":
            return seq(map(node.declarations, _check));
            case "StaticDeclarator":
            return examine(function(s) {
                return (s.hasOwnBinding(node.id.name) ? error((((("Binding for:'" + node.id.name) + "' at:") + node.loc.start) + " already exists in scope")) : addImmutableBinding(node.id.name, node.loc));
            }
            );
            case "VariableDeclarator":
            return seq([tryAddMutableBinding(node.id.name, node.loc.start), _check(node.init), examine(function(s) {
                if (s.hasMapping(node.id.name))(node.id.name = s.getMapping(node.id.name));
                
                return ok();
            }
            )]);
            case "Identifier":
            return examine(function(s) {
                if (s.hasMapping(node.name))(node.name = s.getMapping(node.name));
                
                return hasBinding(node.name, node.loc.start);
            }
            );
        }
        return ok();
    }
    ;
    var builtins = ["arguments", "Array", "Boolean", "Date", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Error", "eval", "EvalError", "Function", "Infinity", "isFinite", "isNaN", "JSON", "Math", "NaN", "Number", "Object", "parseInt", "parseFloat", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "undefined", "URIError"];
    var check = function(root, globals) {
        var g = (globals || builtins);
        var scope = g.reduce(Scope.addImmutableBinding, new Scope(({}), null, ({})));
        return trampoline(_check(root)(scope, function(s) {
            return s;
        }
        , function(err, s) {
            throw err;
        }
        ));
    }
    ;
    return ({
        "check": check
    });
}
);
