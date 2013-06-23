/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/check.kep'
 * DO NOT EDIT
*/
define(["ecma/ast/node"], function(ast_node) {
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
    (Scope.prototype.addBinding = function(id, val) {
        return new Scope(defineProperty(this.record, id, ({
            "value": val,
            "enumerable": true
        })), this.outer, this.mapping);
    }
    );
    (Scope.prototype.addMutableBinding = function(id, loc) {
        return this.addBinding(id, ({
            "mutable": true,
            "loc": loc
        }));
    }
    );
    (Scope.prototype.addImmutableBinding = function(id, loc) {
        return this.addBinding(id, ({
            "mutable": false,
            "loc": loc
        }));
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
    (Scope.prototype.addMapping = function(from, to) {
        return new Scope(this.record, this.outer, defineProperty(this.mapping, from, ({
            "value": to,
            "enumerable": true
        })));
    }
    );
    (Scope.prototype.getUnusedId = function(id) {
        for(var i = 0;
         ;(i = (i + 1))){
            if (! this.hasBinding((id + i)))return (id + i);
            
        }
        
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
            return p(s, function(x, s) {
                return f(x)(s, ok, err);
            }
            , err);
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
            return seq([modify(function(s) {
                return new Scope(({}), s, s.mapping);
            }
            ), body, modify(function(s) {
                return s.outer;
            }
            )]);
        }
        );
    }
    ;
    var addMutableBinding = function(id, loc) {
        return seq([examine(function(s) {
            return (s.hasOwnBinding(id) ? error((((("Binding for:'" + id) + "' at:") + loc) + " already exists in scope")) : ok());
        }
        ), examine(function(s) {
            return (s.hasBinding(id) ? function(new_id) {
                return next(setScope(s.addMapping(id, new_id)), modify(function(s) {
                    return s.addMutableBinding(new_id, loc);
                }
                ));
            }
            (s.getUnusedId(id)) : modify(function(s) {
                return s.addMutableBinding(id, loc);
            }
            ));
        }
        )]);
    }
    ;
    var addImmutableBinding = function(id, loc) {
        return seq([examine(function(s) {
            return (s.hasOwnBinding(id) ? error((((("Binding for:'" + id) + "' at:") + loc) + " already exists in scope")) : ok());
        }
        ), examine(function(s) {
            return (s.hasBinding(id) ? function(new_id) {
                return next(setScope(s.addMapping(id, new_id)), modify(function(s) {
                    return s.addImmutableBinding(new_id, loc);
                }
                ));
            }
            (s.getUnusedId(id)) : modify(function(s) {
                return s.addImmutableBinding(id, loc);
            }
            ));
        }
        )]);
    }
    ;
    var hasBinding = function(id, loc) {
        return examine(function(s) {
            return (s.hasBinding(id) ? ok() : error(((("Undeclared identifier:'" + id) + "' at:") + loc)));
        }
        );
    }
    ;
    var _check = function(node) {
        if ((! node || ! (node instanceof ast_node.Node)))return ok();
        
        switch(node.type){
            case "BlockStatement":
            return block(seq(map(node.body, _check)));
            case "AssignmentStatement":
            return seq([_check(node.left), ((node.left.type === "Identifier") ? examine(function(s) {
                return (s.hasBinding(node.left.name) ? function(b) {
                    return (b.mutable ? ok() : error(((("Assigning immutable variable:'" + node.left.name) + "' at:") + node.left.loc.start)));
                }
                (s.getBinding(node.left.name)) : ok());
            }
            ) : ok()), _check(node.right)]);
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
                return addImmutableBinding(x.id.name);
            }
            )), _check(node.body)));
            case "FunctionExpression":
            return seq([(node.id ? examine(function(s) {
                return (s.hasOwnBinding(node.id.name) ? error((((("Binding for:'" + node.id.name) + "' at:") + node.loc.start) + " already exists in scope")) : addImmutableBinding(node.id.name, node.loc));
            }
            ) : ok()), block(seq([seq(map(node.params, function(x) {
                return addImmutableBinding(x.name);
            }
            )), seq(map(node.body.body, _check))]))]);
            case "Program":
            return seq(map(node.body, _check));
            case "CatchClause":
            return block(next(addImmutableBinding(node.param.name, node.param.loc), seq(map(node.body.body, _check))));
            case "StaticDeclaration":
            case "VariableDeclaration":
            return seq(map(node.declarations, _check));
            case "StaticVariableDeclarator":
            return examine(function(s) {
                return (s.hasOwnBinding(node.id.name) ? error((((("Binding for:'" + node.id.name) + "' at:") + node.loc.start) + " already exists in scope")) : addImmutableBinding(node.id.name, node.loc));
            }
            );
            case "VariableDeclarator":
            return seq([_check(node.init), addMutableBinding(node.id.name, node.loc.start), examine(function(s) {
                if (s.hasMapping(node.id.name)){
                    (node.id.name = s.getMapping(node.id.name));
                }
                
                return ok();
            }
            )]);
            case "Identifier":
            return examine(function(s) {
                if (s.hasMapping(node.name)){
                    (node.name = s.getMapping(node.name));
                }
                
                return hasBinding(node.name);
            }
            );
        }
        return ok();
    }
    ;
    var check = function(root, globals) {
        if (globals){
        }
        
        return _check(root)(new Scope(({}), null, ({})), function(s) {
            return s;
        }
        , function(err, s) {
            throw err;
        }
        );
    }
    ;
    return ({
        "check": check
    });
}
);
