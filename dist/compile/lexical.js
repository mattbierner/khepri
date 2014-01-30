/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/lexical.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "khepri-ast/node", "khepri-ast/expression", "khepri-ast/pattern", "khepri-ast/value",
    "neith/zipper", "neith/tree", "khepri-ast-zipper", "bes/record", "bes/object", "./scope"
], (function(require, exports, ast_node, ast_expression, ast_pattern, ast_value, zipper, tree, __o, record, object,
    __o0) {
    "use strict";
    var setUserData = ast_node["setUserData"],
        khepriZipper = __o["khepriZipper"],
        Scope = __o0["Scope"],
        check, checkStage, map = Function.prototype.call.bind(Array.prototype.map),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight),
        cont = (function(f, args) {
            var c = [f, args];
            (c._next = true);
            return c;
        }),
        trampoline = (function(f) {
            var value = f;
            while ((value && value._next))(value = value[0].apply(undefined, value[1]));
            return value;
        }),
        State = record.declare(null, ["ctx", "realScope", "scope", "vars", "unique"]);
    (State.addVar = (function(s, id, v) {
        return s.setVars(object.setProperty(s.vars, id, v, true));
    }));
    var ok = (function(x) {
        return (function(s, ok, _) {
            return ok(x, s);
        });
    }),
        error = (function(x) {
            return (function(s, _, err) {
                return err(x, s);
            });
        }),
        bind = (function(p, f) {
            return (function(s, ok, err) {
                return cont(p, [s, (function(x, s) {
                    return f(x)(s, ok, err);
                }), err]);
            });
        }),
        next = (function(p, n) {
            return bind(p, (function(_) {
                return n;
            }));
        }),
        seqa = (function(arr) {
            return reduceRight(arr, (function(p, c) {
                return next(c, p);
            }), ok());
        }),
        seq = (function() {
            var args = arguments;
            return seqa(args);
        }),
        extract = (function(s, ok, _) {
            return ok(s, s);
        }),
        setState = (function(s) {
            return (function(_, ok, _0) {
                return ok(s, s);
            });
        }),
        modifyState = (function(f) {
            return bind(extract, (function(s) {
                return setState(f(s));
            }));
        }),
        examineState = (function(f) {
            return bind(extract, (function(s) {
                return f(s);
            }));
        }),
        move = (function(op) {
            return modifyState((function(s) {
                var c = op(s.ctx);
                return State.setCtx(s, c);
            }));
        }),
        examineScope = (function(f) {
            return bind(extract, (function(s) {
                return f(s.scope);
            }));
        }),
        examineRealScope = (function(f) {
            return bind(extract, (function(s) {
                return f(s.realScope);
            }));
        }),
        modifyScope = (function(f) {
            return (function(s, ok, err) {
                var scope = f(s.scope),
                    newState = State.setScope(s, scope);
                return ok(scope, newState);
            });
        }),
        modifyRealScope = (function(f) {
            return (function(s, ok, err) {
                var scope = f(s.realScope),
                    newState = State.setRealScope(s, scope);
                return ok(scope, newState);
            });
        }),
        setScope = (function(s) {
            return modifyScope((function() {
                return s;
            }));
        }),
        setRealScope = (function(s) {
            return modifyRealScope((function() {
                return s;
            }));
        }),
        pass = ok(),
        registerVar = (function(name) {
            return bind(examineState((function(s) {
                return ok(s.unique);
            })), (function(uid) {
                return seq(modifyState((function(s) {
                    return s.setUnique((uid + 1));
                })), ok(uid));
            }));
        }),
        block = (function() {
            var body = arguments;
            return examineScope((function(s) {
                return seq(setScope(new(Scope)(({}), s, s.mapping)), seqa(body), setScope(s));
            }));
        }),
        emptyBlock = (function() {
            var body = arguments;
            return examineScope((function(s) {
                return seq(setScope(new(Scope)(({}), s, ({}))), seqa(body), setScope(s));
            }));
        }),
        realBlock = (function() {
            var body = arguments;
            return examineRealScope((function(s) {
                return seq(setRealScope(new(Scope)(({}), s, ({}))), emptyBlock.apply(undefined,
                    body), setRealScope(s));
            }));
        }),
        checkCanAddOwnBinding = (function(id, loc) {
            return examineScope((function(s) {
                return ((!s.hasOwnBinding(id)) ? pass : (function() {
                    var start = (loc && loc.start),
                        binding = s.getBinding(id),
                        end = (binding.loc && binding.loc.start);
                    return error(((((("'" + id) + "' at:") + start) +
                        " already bound for scope from:") + end));
                })());
            }));
        }),
        hasBinding = (function(id, loc) {
            return examineScope((function(s) {
                return (s.hasBinding(id) ? pass : error(((("Undeclared identifier:'" + id) +
                    "' at:") + loc)));
            }));
        }),
        hasFreeBinding = (function(id, loc) {
            return seq(hasBinding(id, loc), examineScope((function(s) {
                var current = s.getBinding(id);
                return (current.reserved ? error(((("Undeclared identifier:'" + id) + "' at:") +
                    loc)) : pass);
            })));
        }),
        checkCanAssign = (function(id, loc) {
            return examineScope((function(s) {
                return (s.hasBinding(id) ? (function() {
                    var b = s.getBinding(id);
                    return (b.mutable ? pass : error(((("Assign to immutable variable:'" +
                        id) + "' at:") + loc)));
                })() : pass);
            }));
        }),
        getUnusedId = (function(id, loc) {
            return examineRealScope((function(s) {
                return ok((s.hasOwnBinding(id) ? s.getUnusedId(id) : id));
            }));
        }),
        addMapping = (function(id, newId) {
            return modifyScope((function(s) {
                return Scope.addMapping(s, id, newId);
            }));
        }),
        addMutableBinding = (function(id, loc) {
            return seq(modifyScope((function(s) {
                return Scope.addMutableBinding(s, id, loc);
            })), modifyRealScope((function(s) {
                return Scope.addMutableBinding(s, id, loc);
            })), addMapping(id, id));
        }),
        addImmutableBinding = (function(id, loc) {
            return seq(modifyScope((function(s) {
                return Scope.addImmutableBinding(s, id, loc);
            })), modifyRealScope((function(s) {
                return Scope.addImmutableBinding(s, id, loc);
            })), addMapping(id, id));
        }),
        addUniqueMutableBinding = (function(id, loc) {
            return seq(checkCanAddOwnBinding(id, loc), examineRealScope((function(s) {
                return (s.hasOwnBinding(id) ? (function() {
                    var new_id = s.getUnusedId(id);
                    return seq(addMutableBinding(id, loc), addMutableBinding(new_id,
                        loc), addMapping(id, new_id));
                })() : addMutableBinding(id, loc));
            })));
        }),
        addMutableBindingChecked = (function(id, loc) {
            return seq(checkCanAddOwnBinding(id, loc), addUniqueMutableBinding(id, loc));
        }),
        addImmutableBindingChecked = (function(id, loc) {
            return seq(checkCanAddOwnBinding(id, loc), addImmutableBinding(id, loc));
        }),
        addUnusedImmutableBinding = (function(id, loc) {
            return examineRealScope((function(s) {
                return (s.hasOwnBinding(id) ? (function() {
                    var new_id = s.getUnusedId(id);
                    return seq(addImmutableBinding(id, loc), addImmutableBinding(new_id,
                        loc), addMapping(id, new_id));
                })() : addImmutableBindingChecked(id, loc));
            }));
        }),
        addUniqueImmutableBinding = (function(id, loc) {
            return seq(checkCanAddOwnBinding(id, loc), addUnusedImmutableBinding(id, loc));
        }),
        addReservedBinding = (function(id, loc) {
            return seq(modifyScope((function(s) {
                return Scope.addReservedBinding(s, id, loc);
            })), modifyRealScope((function(s) {
                return Scope.addReservedBinding(s, id, loc);
            })), addMapping(id, id));
        }),
        _check, child = (function(f, edge) {
            return seq(move(tree.child.bind(null, edge)), f, move(zipper.up));
        }),
        checkCtx = (function(node) {
            return _check(tree.node(node));
        }),
        checkTop = (function(s, ok, err) {
            return checkCtx(s.ctx)(s, ok, err);
        }),
        checkChild = child.bind(null, checkTop),
        modifyNode = (function(f) {
            return move(tree.modifyNode.bind(null, f));
        }),
        setNode = (function(x) {
            return move(tree.setNode.bind(null, x));
        });
    (_check = (function(node) {
        if (Array.isArray(node)) {
            if ((!node.length)) return pass;
            return seq(move(zipper.down), seqa(map(node, (function(_, i) {
                return ((i === (node.length - 1)) ? checkTop : next(checkTop, move(
                    zipper.right)));
            }))), move(zipper.up));
        }
        if ((!(node instanceof ast_node.Node))) return pass;
        switch (node.type) {
            case "Program":
                return checkChild("body");
            case "Package":
                return seq(addImmutableBindingChecked("require", null), addImmutableBindingChecked(
                    "exports", null), addImmutableBindingChecked("module", null), checkChild(
                    "exports"), ((node.body.type === "WithStatement") ? child(seq(checkChild(
                    "bindings"), child(checkChild("body"), "body")), "body") : child(checkChild(
                    "body"), "body")));
            case "PackageExports":
                return checkChild("exports");
            case "PackageExport":
                return addMutableBindingChecked(node.id.name, node.loc);
            case "CatchClause":
                return block(addImmutableBindingChecked(node.param.name, node.param.loc), child(
                    checkChild("body"), "body"));
            case "SwitchCase":
                return seq(checkChild("test"), checkChild("consequent"));
            case "StaticDeclaration":
            case "VariableDeclaration":
                return checkChild("declarations");
            case "StaticDeclarator":
                return addImmutableBindingChecked(node.id.name, node.loc);
            case "VariableDeclarator":
                return seq(addMutableBindingChecked(node.id.name, node.loc), checkChild("id"),
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
                    checkChild("params"), ((node.body.type === "BlockStatement") ? child(checkChild(
                        "body"), "body") : checkChild("body")));
            case "EllipsisPattern":
                return pass;
            case "SinkPattern":
                return bind(getUnusedId("_"), (function(x) {
                    return seq(modifyNode((function(node) {
                        var n = setUserData(node, (node.ud || ({}))),
                            id = ast_value.Identifier.create(null, x);
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
                    if (((!node.ud) || (!node.ud.id))) {
                        var unused = s.getUnusedId("__o"),
                            id = ast_pattern.IdentifierPattern.create(node.loc, ast_value.Identifier
                                .create(null, unused));
                        (id.reserved = true);
                        var n = setUserData(node, (node.ud || ({})));
                        (n.ud.id = id);
                        return seq(setNode(ast_pattern.AsPattern.create(null, id, node)),
                            checkTop);
                    }
                    return checkChild("elements");
                }));
            case "ObjectPatternElement":
                return seq(checkChild("target"), checkChild("key"));
            case "ArgumentsPattern":
                return seq(checkChild("id"), checkChild("elements"), checkChild("self"));
            case "ObjectValue":
                return checkChild("value");
            case "Identifier":
                {
                    var name = node.name;
                    return examineScope((function(s) {
                        return (s.hasMapping(name) ? (function() {
                            var mappedName = s.getMapping(name);
                            return seq(modifyNode((function(x) {
                                return ast_node.modify(x, ({}), ({
                                    "name": mappedName
                                }));
                            })), hasFreeBinding(mappedName, node.loc));
                        })() : hasFreeBinding(name, node.loc));
                    }));
                }
        }
        return pass;
    }));
    var builtins = ["Array", "Boolean", "Date", "decodeURI", "decodeURIComponent", "encodeURI",
        "encodeURIComponent", "Error", "eval", "EvalError", "Function", "Infinity", "isFinite", "isNaN", "JSON",
        "Math", "NaN", "Number", "Object", "parseInt", "parseFloat", "RangeError", "ReferenceError", "RegExp",
        "String", "SyntaxError", "TypeError", "undefined", "URIError"
    ],
        checkAst = (function(ast, globals) {
            var scope = reduce(globals, Scope.addImmutableBinding, new(Scope)(({}), null, ({}))),
                state = new(State)(khepriZipper(ast), scope, scope);
            return trampoline(checkTop(state, (function(x, s) {
                return tree.node(zipper.root(s.ctx));
            }), (function(err, s) {
                throw err;
            })));
        });
    (check = (function(ast, globals) {
        return checkAst(ast, (globals || builtins));
    }));
    (checkStage = (function(__o1) {
        var options = __o1["options"],
            ast = __o1["ast"];
        return ({
            "ast": check(ast, ((options && options.globals) || builtins)),
            "options": options
        });
    }));
    (exports.check = check);
    (exports.checkStage = checkStage);
}));