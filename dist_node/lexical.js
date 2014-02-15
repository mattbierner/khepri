/*
 * THIS FILE IS AUTO GENERATED from 'lib/lexical.kep'
 * DO NOT EDIT
*/
"use strict";
var ast_node = require("khepri-ast")["node"],
    setUserData = ast_node["setUserData"],
    ast_expression = require("khepri-ast")["expression"],
    ast_pattern = require("khepri-ast")["pattern"],
    ast_value = require("khepri-ast")["value"],
    zipper = require("neith")["zipper"],
    tree = require("neith")["tree"],
    __o = require("khepri-ast-zipper"),
    khepriZipper = __o["khepriZipper"],
    record = require("bes")["record"],
    object = require("bes")["object"],
    __o0 = require("./scope"),
    Scope = __o0["Scope"],
    check, map = Function.prototype.call.bind(Array.prototype.map),
    reduce = Function.prototype.call.bind(Array.prototype.reduce),
    reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight),
    Tail = (function(f, s, ok, err) {
        var self = this;
        (self.f = f);
        (self.s = s);
        (self.ok = ok);
        (self.err = err);
    }),
    trampoline = (function(f) {
        var value = f;
        while ((value instanceof Tail))(value = value.f(value.s, value.ok, value.err));
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
            return new(Tail)(p, s, (function(x, s) {
                return f(x)(s, ok, err);
            }), err);
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
            return State.setCtx(s, op(s.ctx));
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
    unique = (function(s, ok, err) {
        return ok(s.unique, s.setUnique((s.unique + 1)));
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
            return seq(setScope(new(Scope)(({}), s, s.mapping, s.definitions)), seqa(body), setScope(s));
        }));
    }),
    emptyBlock = (function() {
        var body = arguments;
        return examineScope((function(s) {
            return seq(setScope(new(Scope)(({}), s, ({}), ({}))), seqa(body), setScope(s));
        }));
    }),
    realBlock = (function() {
        var body = arguments;
        return examineRealScope((function(s) {
            return seq(setRealScope(new(Scope)(({}), s, ({}), ({}))), emptyBlock.apply(undefined, body),
                setRealScope(s));
        }));
    }),
    checkCanAddOwnBinding = (function(id, loc) {
        return examineScope((function(s) {
            return ((!s.hasOwnBinding(id)) ? pass : (function() {
                var start = (loc && loc.start),
                    binding = s.getBinding(id),
                    end = (binding.loc && binding.loc.start);
                return error(((((("'" + id) + "' at:") + start) + " already bound for scope from:") +
                    end));
            })());
        }));
    }),
    hasBinding = (function(id, loc) {
        return examineScope((function(s) {
            return (s.hasBinding(id) ? pass : error(((("Undeclared identifier:'" + id) + "' at:") + loc)));
        }));
    }),
    hasFreeBinding = (function(id, loc) {
        return seq(hasBinding(id, loc), examineScope((function(s) {
            var current = s.getBinding(id);
            return (current.reserved ? error(((("Undeclared identifier:'" + id) + "' at:") + loc)) :
                pass);
        })));
    }),
    checkCanAssign = (function(id, loc) {
        return examineScope((function(s) {
            return (s.hasBinding(id) ? (function() {
                var b = s.getBinding(id);
                return (b.mutable ? pass : error(((("Assign to immutable variable:'" + id) +
                    "' at:") + loc)));
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
    addUid = (function(id) {
        return bind(unique, (function(uid) {
            return modifyScope((function(s) {
                return Scope.addUid(s, id, uid);
            }));
        }));
    }),
    addMutableBinding = (function(id, loc) {
        return seq(modifyScope((function(s) {
            return Scope.addMutableBinding(s, id, loc);
        })), modifyRealScope((function(s) {
            return Scope.addMutableBinding(s, id, loc);
        })), addUid(id), addMapping(id, id));
    }),
    addImmutableBinding = (function(id, loc) {
        return seq(modifyScope((function(s) {
            return Scope.addImmutableBinding(s, id, loc);
        })), modifyRealScope((function(s) {
            return Scope.addImmutableBinding(s, id, loc);
        })), addUid(id), addMapping(id, id));
    }),
    addUniqueMutableBinding = (function(id, loc) {
        return seq(checkCanAddOwnBinding(id, loc), examineRealScope((function(s) {
            return (s.hasOwnBinding(id) ? (function() {
                var new_id = s.getUnusedId(id);
                return seq(addMutableBinding(id, loc), addMutableBinding(new_id, loc),
                    addMapping(id, new_id));
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
                return seq(addImmutableBinding(id, loc), addImmutableBinding(new_id, loc),
                    addMapping(id, new_id));
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
        return _check((node && tree.node(node)));
    }),
    checkTop = (function(s, ok, err) {
        return checkCtx(s.ctx)(s, ok, err);
    }),
    inspect = (function(f) {
        return examineState((function(s) {
            return f(tree.node(s.ctx));
        }));
    }),
    checkChild = child.bind(null, checkTop),
    modifyNode = (function(f) {
        return move(tree.modifyNode.bind(null, f));
    }),
    setNode = (function(x) {
        return move(tree.setNode.bind(null, x));
    }),
    up = move(zipper.up),
    down = move(zipper.down),
    left = move(zipper.left),
    right = move(zipper.right),
    checks = ({}),
    addCheck = (function(type, check) {
        if (Array.isArray(type)) type.forEach((function(x) {
            return addCheck(x, check);
        }));
        else(checks[type] = check);
    });
addCheck("Program", checkChild("body"));
addCheck("PackageExports", checkChild("exports"));
addCheck("PackageExport", inspect((function(node) {
    return addMutableBindingChecked(node.id.name, node.loc);
})));
addCheck("Package", seq(addImmutableBindingChecked("require", null), addImmutableBindingChecked("exports", null),
    addImmutableBindingChecked("module", null), checkChild("exports"), inspect((function(node) {
        return ((node.body.type === "WithStatement") ? child(seq(checkChild("bindings"), child(checkChild(
            "body"), "body")), "body") : child(checkChild("body"), "body"));
    }))));
addCheck("SwitchCase", seq(checkChild("test"), checkChild("consequent")));
addCheck("CatchClause", block(inspect((function(node) {
    return addImmutableBindingChecked(node.param.name, node.param.loc);
})), child(checkChild("body"), "body")));
addCheck(["StaticDeclaration", "VariableDeclaration"], checkChild("declarations"));
addCheck("StaticDeclarator", inspect((function(node) {
    return addImmutableBindingChecked(node.id.name, node.loc);
})));
addCheck("VariableDeclarator", seq(inspect((function(node) {
    return addMutableBindingChecked(node.id.name, node.loc);
})), checkChild("id"), checkChild("init")));
addCheck("Binding", seq(checkChild("pattern"), checkChild("value")));
addCheck("BlockStatement", block(checkChild("body")));
addCheck("ExpressionStatement", checkChild("expression"));
addCheck("IfStatement", seq(checkChild("test"), block(checkChild("consequent")), block(checkChild("alternate"))));
addCheck("WithStatement", block(checkChild("bindings"), child(checkChild("body"), "body")));
addCheck("SwitchStatement", block(checkChild("discriminant"), checkChild("cases")));
addCheck(["ReturnStatement", "ThrowStatement"], checkChild("argument"));
addCheck("TryStatement", seq(checkChild("block"), block(checkChild("handler")), block(checkChild("finalizer"))));
addCheck("WhileStatement", seq(checkChild("test"), block(checkChild("body"))));
addCheck("DoWhileStatement", seq(block(checkChild("body")), checkChild("test")));
addCheck("ForStatement", block(checkChild("init"), checkChild("test"), checkChild("update"), block(checkChild("body"))));
addCheck("FunctionExpression", realBlock(inspect((function(node) {
    return (node.id ? addImmutableBinding(node.id.name, node.loc) : pass);
})), checkChild("params"), inspect((function(node) {
    return ((node.body.type === "BlockStatement") ? child(checkChild("body"), "body") : checkChild(
        "body"));
}))));
addCheck("UnaryExpression", checkChild("argument"));
addCheck("AssignmentExpression", seq(checkChild("left"), inspect((function(node) {
    return ((node.left.type === "Identifier") ? checkCanAssign(node.left.name, node.left.loc) : pass);
})), checkChild("right")));
addCheck(["LogicalExpression", "BinaryExpression"], seq(checkChild("left"), checkChild("right")));
addCheck("ConditionalExpression", seq(checkChild("test"), checkChild("consequent"), checkChild("alternate")));
addCheck(["CallExpression", "NewExpression"], seq(checkChild("callee"), checkChild("args")));
addCheck("MemberExpression", seq(checkChild("object"), inspect((function(node) {
    return (node.computed ? checkChild("property") : pass);
}))));
addCheck("ArrayExpression", checkChild("elements"));
addCheck("ObjectExpression", checkChild("properties"));
addCheck("LetExpression", block(checkChild("bindings"), checkChild("body")));
addCheck("CurryExpression", seq(checkChild("base"), checkChild("args")));
addCheck("SinkPattern", bind(getUnusedId("_"), (function(x) {
    return seq(modifyNode((function(node) {
        var n = setUserData(node, (node.ud || ({}))),
            id = ast_value.Identifier.create(null, x);
        (n.ud.id = id);
        return n;
    })), inspect((function(node) {
        return addReservedBinding(x, node.loc);
    })));
})));
addCheck("IdentifierPattern", inspect((function(node) {
    if (node.reserved) return addReservedBinding(node.id.name, node.loc);
    return seq(addUniqueImmutableBinding(node.id.name, node.loc), checkChild("id"), modifyNode((function(
        node) {
        var n = setUserData(node, (node.ud || ({})));
        (n.ud.id = ast_value.Identifier.create(null, node.id.name));
        return n;
    })));
})));
addCheck("ImportPattern", checkChild("pattern"));
addCheck("AsPattern", seq(checkChild("id"), inspect((function(node) {
    return child(seq(modifyNode((function(target) {
        var n = setUserData(target, (target.ud || ({})));
        (n.ud.id = node.id);
        return n;
    })), checkTop), "target");
}))));
addCheck(["ObjectPattern", "ArrayPattern"], inspect((function(node) {
    return examineScope((function(s) {
        if (((!node.ud) || (!node.ud.id))) {
            var unused = s.getUnusedId("__o"),
                id = ast_pattern.IdentifierPattern.create(node.loc, ast_value.Identifier.create(
                    null, unused));
            (id.reserved = true);
            var n = setUserData(node, (node.ud || ({})));
            (n.ud.id = id);
            return seq(setNode(ast_pattern.AsPattern.create(null, id, node)), checkTop);
        }
        return checkChild("elements");
    }));
})));
addCheck("ObjectPatternElement", seq(checkChild("target"), checkChild("key")));
addCheck("ArgumentsPattern", seq(checkChild("id"), checkChild("elements"), checkChild("self")));
addCheck("ObjectValue", checkChild("value"));
addCheck("Identifier", inspect((function(node) {
    var name = node.name;
    return examineScope((function(s) {
        return seq(modifyNode((function(x) {
            return setUserData(x, ({
                "uid": s.getUid(name)
            }));
        })), hasFreeBinding(name, node.loc));
    }));
})));
(_check = (function(node) {
    if (Array.isArray(node)) {
        if ((!node.length)) return pass;
        return seq(down, seqa(map(node, (function(_, i) {
            return ((i === (node.length - 1)) ? checkTop : next(checkTop, right));
        }))), up);
    }
    if (((node instanceof ast_node.Node) && checks[node.type])) return checks[node.type];
    return pass;
}));
var checkAst = (function(ast, globals) {
    var scope = reduce((globals || []), Scope.addImmutableBinding, new(Scope)(({}), null, ({}), ({}))),
        state = new(State)(khepriZipper(ast), scope, scope, ({}), 0);
    return trampoline(checkTop(state, (function(x, s) {
        return tree.node(zipper.root(s.ctx));
    }), (function(err, s) {
        throw err;
    })));
});
(check = (function(ast, globals) {
    return checkAst(ast, globals);
}));
(exports.check = check);