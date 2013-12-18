/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/lexical.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri_ast/node", "khepri_ast/pattern", "khepri_ast/value", "neith/zipper", "neith/tree",
    "khepri_ast_zipper/khepri_zipper", "khepri/compile/scope"
], (function(require, exports, ast_node, ast_pattern, ast_value, zipper, tree, __o, __o0) {
    "use strict";
    var check;
    var ast_node = ast_node,
        ast_node = ast_node,
        setUserData = ast_node["setUserData"],
        ast_pattern = ast_pattern,
        ast_value = ast_value,
        zipper = zipper,
        tree = tree,
        __o = __o,
        khepriZipper = __o["khepriZipper"],
        __o0 = __o0,
        Scope = __o0["Scope"];
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight);
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
    var State = (function(ctx, realScope, scope) {
        (this.ctx = ctx);
        (this.realScope = realScope);
        (this.scope = scope);
    });
    (State.setCtx = (function(s, ctx) {
        return new(State)(ctx, s.realScope, s.scope);
    }));
    (State.setScope = (function(s, scope) {
        return new(State)(s.ctx, s.realScope, scope);
    }));
    (State.setRealScope = (function(s, realScope) {
        return new(State)(s.ctx, realScope, s.scope);
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
        return bind(p, (function(_) {
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
    var setState = (function(s) {
        return (function(_, ok, _0) {
            return ok(s, s);
        });
    });
    var modifyState = (function(f) {
        return bind(extract, (function(s) {
            return setState(f(s));
        }));
    });
    var move = (function(op) {
        return modifyState((function(s) {
            var c = op(s.ctx);
            return State.setCtx(s, c);
        }));
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
            })
                .call(this);
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
            })
                .call(this);
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
    var pass = ok();
    var block = (function() {
        var body = arguments;
        return examineScope((function(s) {
            return seq(setScope(new(Scope)(({}), s, s.mapping)), seqa(body), setScope(s));
        }));
    });
    var emptyBlock = (function() {
        var body = arguments;
        return examineScope((function(s) {
            return seq(setScope(new(Scope)(({}), s, ({}))), seqa(body), setScope(s));
        }));
    });
    var realBlock = (function() {
        var body = arguments;
        return examineRealScope((function(s) {
            return seq(setRealScope(new(Scope)(({}), s, ({}))), emptyBlock.apply(undefined, body),
                setRealScope(s));
        }));
    });
    var checkCanAddOwnBinding = (function(id, loc) {
        return examineScope((function(s) {
            return (!s.hasOwnBinding(id) ? pass : (function() {
                    {
                        var start = (loc && loc.start),
                            binding = s.getBinding(id),
                            end = (binding.loc && binding.loc.start);
                        return error(((((("'" + id) + "' at:") + start) +
                            " already bound for scope from:") + end));
                    }
                })
                .call(this));
        }));
    });
    var hasBinding = (function(id, loc) {
        return examineScope((function(s) {
            return (s.hasBinding(id) ? pass : error(((("Undeclared identifier:'" + id) + "' at:") +
                loc)));
        }));
    });
    var hasFreeBinding = (function(id, loc) {
        return seq(hasBinding(id, loc), examineScope((function(s) {
            return (function() {
                {
                    var current = s.getBinding(id);
                    return (current.reserved ? error(((("Undeclared identifier:'" + id) +
                        "' at:") + loc)) : pass);
                }
            })
                .call(this);
        })));
    });
    var checkCanAssign = (function(id, loc) {
        return examineScope((function(s) {
            return (s.hasBinding(id) ? (function() {
                    {
                        var b = s.getBinding(id);
                        return (b.mutable ? pass : error(((("Assign to immutable variable:'" +
                            id) + "' at:") + loc)));
                    }
                })
                .call(this) : pass);
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
                        return seq(addMutableBinding(id, loc), addMutableBinding(new_id,
                            loc), addMapping(id, new_id));
                    }
                })
                .call(this) : addMutableBinding(id, loc));
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
                        return seq(addImmutableBinding(id, loc), addImmutableBinding(new_id,
                            loc), addMapping(id, new_id));
                    }
                })
                .call(this) : addImmutableBindingInRealBlock(id, loc));
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
    var _check;
    var child = (function(f, edge) {
        return seq(move(tree.child.bind(null, edge)), f, move(zipper.up));
    });
    var checkCtx = (function(node) {
        return _check(tree.node(node));
    });
    var checkTop = (function(s, ok, err) {
        return checkCtx(s.ctx)(s, ok, err);
    });
    var checkChild = child.bind(null, checkTop);
    var modifyNode = (function(f) {
        return move(tree.modifyNode.bind(null, f));
    });
    (_check = (function(node) {
        if (Array.isArray(node)) {
            if (!node.length) return pass;
            return seq(move(zipper.down), seqa(map(node, (function(_, i) {
                return ((i === (node.length - 1)) ? checkTop : next(checkTop, move(
                    zipper.right)));
            }))), move(zipper.up));
        }
        if (!(node instanceof ast_node.Node)) return pass;
        switch (node.type) {
            case "Program":
                return checkChild("body");
            case "Package":
                return seq(addImmutableBindingInRealBlock("require", null),
                    addImmutableBindingInRealBlock("exports", null), addImmutableBindingInRealBlock(
                        "module", null), checkChild("exports"), ((node.body.type === "WithStatement") ?
                        child(seq(checkChild("bindings"), child(checkChild("body"), "body")), "body") :
                        child(checkChild("body"), "body")));
            case "PackageExports":
                return checkChild("exports");
            case "PackageExport":
                return addMutableBindingInRealBlock(node.id.name, node.loc);
            case "CatchClause":
                return block(addImmutableBindingInRealBlock(node.param.name, node.param.loc), child(
                    checkChild("body"), "body"));
            case "SwitchCase":
                return seq(checkChild("test"), checkChild("consequent"));
            case "StaticDeclaration":
            case "VariableDeclaration":
                return checkChild("declarations");
            case "StaticDeclarator":
                return addImmutableBindingInRealBlock(node.id.name, node.loc);
            case "VariableDeclarator":
                return seq(addMutableBindingInRealBlock(node.id.name, node.loc), checkChild("id"),
                    checkChild("init"));
            case "Binding":
                return seq(checkChild("pattern"), checkChild("value"));
            case "BlockStatement":
                return block(checkChild("body"));
            case "ExpressionStatement":
                return checkChild("expression");
            case "IfStatement":
                return seq(checkChild("test"), block(checkChild("consequent")), block(checkChild(
                    "alternate")));
            case "WithStatement":
                return block(checkChild("bindings"), child(checkChild("body"), "body"));
            case "SwitchStatement":
                return block(checkChild("discriminant"), checkChild("cases"));
            case "ReturnStatement":
            case "ThrowStatement":
                return checkChild("argument");
            case "TryStatement":
                return seq(checkChild("block"), block(checkChild("handler")), block(checkChild(
                    "finalizer")));
            case "WhileStatement":
                return seq(checkChild("test"), block(checkChild("body")));
            case "DoWhileStatement":
                return seq(block(checkChild("body")), checkChild("test"));
            case "ForStatement":
                return block(checkChild("init"), checkChild("test"), checkChild("update"), block(
                    checkChild("body")));
            case "UnaryExpression":
                return checkChild("argument");
            case "AssignmentExpression":
                return seq(checkChild("left"), ((node.left.type === "Identifier") ? checkCanAssign(node
                    .left.name, node.left.loc.start) : pass), checkChild("right"));
            case "LogicalExpression":
            case "BinaryExpression":
                return seq(checkChild("left"), checkChild("right"));
            case "ConditionalExpression":
                return seq(checkChild("test"), checkChild("consequent"), checkChild("alternate"));
            case "CallExpression":
            case "NewExpression":
                return seq(checkChild("callee"), checkChild("args"));
            case "MemberExpression":
                return seq(checkChild("object"), (node.computed ? checkChild("property") : pass));
            case "ArrayExpression":
                return checkChild("elements");
            case "ObjectExpression":
                return checkChild("properties");
            case "LetExpression":
                return block(checkChild("bindings"), checkChild("body"));
            case "CurryExpression":
                return seq(checkChild("base"), checkChild("args"));
            case "UnaryOperatorExpression":
            case "BinaryOperatorExpression":
            case "TernaryOperatorExpression":
                return pass;
            case "FunctionExpression":
                return realBlock((node.id ? addImmutableBinding(node.id.name, node.loc) : pass),
                    checkChild("params"), child(checkChild("body"), "body"));
            case "EllipsisPattern":
                return pass;
            case "SinkPattern":
                return bind(getUnusedId("_"), (function(x) {
                    return seq(modifyNode((function(node) {
                        var n = setUserData(node, (node.ud || ({})));
                        var id = ast_value.Identifier.create(null, x);
                        (n.ud.id = id);
                        return n;
                    })), addReservedBinding(x, node.loc));
                }));
            case "IdentifierPattern":
                if (node.reserved) return addReservedBinding(node.id.name, node.loc);
                return seq(addUniqueImmutableBinding(node.id.name, node.loc), checkChild("id"),
                    modifyNode((function(node) {
                        var n = setUserData(node, (node.ud || ({})));
                        (n.ud.id = ast_value.Identifier.create(null, node.id.name));
                        return n;
                    })));
            case "ImportPattern":
                return checkChild("pattern");
            case "AsPattern":
                return seq(checkChild("id"), child(seq(modifyNode((function(target) {
                    var n = setUserData(target, (target.ud || ({})));
                    (n.ud.id = node.id);
                    return n;
                })), checkTop), "target"));
            case "ArrayPattern":
            case "ObjectPattern":
                return examineScope((function(s) {
                    if ((!node.ud || !node.ud.id)) {
                        var unused = s.getUnusedId("__o");
                        var id = ast_pattern.IdentifierPattern.create(node.loc, ast_value.Identifier
                            .create(null, unused));
                        (id.reserved = true);
                        var n = setUserData(node, (node.ud || ({})));
                        (n.ud.id = id);
                        return seq(move(tree.setNode.bind(null, ast_pattern.AsPattern.create(
                            null, id, node))), checkTop);
                    }
                    return checkChild("elements");
                }));
            case "ObjectPatternElement":
                return seq(checkChild("target"), checkChild("key"));
            case "ArgumentsPattern":
                return seq(checkChild("id"), checkChild("elements"));
            case "ObjectValue":
                return checkChild("value");
            case "Identifier":
                return (function() {
                    {
                        var name = node.name;
                        return examineScope((function(s) {
                            return (s.hasMapping(name) ? (function() {
                                    {
                                        var mappedName = s.getMapping(name);
                                        return seq(move(tree.modifyNode.bind(null, (
                                            function(x) {
                                                return ast_node.modify(x, ({}), ({
                                                    "name": mappedName
                                                }));
                                            }))), hasFreeBinding(mappedName, node.loc));
                                    }
                                })
                                .call(this) : hasFreeBinding(name, node.loc));
                        }));
                    }
                })
                    .call(this);
        }
        return pass;
    }));
    var builtins = ["Array", "Boolean", "Date", "decodeURI", "decodeURIComponent", "encodeURI",
        "encodeURIComponent", "Error", "eval", "EvalError", "Function", "Infinity", "isFinite", "isNaN", "JSON",
        "Math", "NaN", "Number", "Object", "parseInt", "parseFloat", "RangeError", "ReferenceError", "RegExp",
        "String", "SyntaxError", "TypeError", "undefined", "URIError"
    ];
    (check = (function(root, globals) {
        var g = (globals || builtins);
        var scope = reduce(g, Scope.addImmutableBinding, new(Scope)(({}), null, ({})));
        var state = new(State)(khepriZipper(root), scope, scope);
        return trampoline(checkTop(state, (function(x, s) {
            return tree.node(zipper.root(s.ctx));
        }), (function(err, s) {
            throw err;
        })));
    }));
    (exports.check = check);
}))