
/*
 * THIS FILE IS AUTO GENERATED from 'lib/stream.kep'
 * DO NOT EDIT
*/
define('nu-stream/stream',["require", "exports"], (function(require, exports) {
    
    var end, NIL, stream, memoStream, cons, append, appendz, concat, from, first, rest, isEmpty, isStream,
            forEach, reverse, foldl, foldr, reduce, reduceRight, toArray, zip, indexed, map, filter, bind;
    var arrayReduce = Function.prototype.call.bind(Array.prototype.reduce);
    var constant = (function(x) {
        return (function() {
            return x;
        });
    });
    var flip = (function(f) {
        return (function(x, y) {
            return f(y, x);
        });
    });
    var memo = (function(f) {
        var value;
        return (function() {
            var args = arguments;
            if ((value === undefined))(value = f.apply(this, args));
            return value;
        });
    });
    (end = null);
    (NIL = end);
    (stream = (function(val, f) {
        return ({
            "first": val,
            "rest": f
        });
    }));
    (memoStream = (function(val, f) {
        return stream(val, memo(f));
    }));
    (first = (function(s) {
        return s.first;
    }));
    (rest = (function(s) {
        return s.rest(first(s));
    }));
    (isEmpty = (function(s) {
        return (s === end);
    }));
    (isStream = (function(s) {
        return (((s && s.hasOwnProperty("first")) && s.hasOwnProperty("rest")) || (s === end));
    }));
    (cons = (function(val, s) {
        return stream(val, constant(s));
    }));
    (appendz = (function(s1, f) {
        return (isEmpty(s1) ? f() : memoStream(first(s1), appendz.bind(null, rest(s1), f)));
    }));
    (append = (function() {
            var reducer = (function(s1, s2) {
                return appendz(s1, constant(s2));
            });
            return (function() {
                var streams = arguments;
                return arrayReduce(streams, reducer, end);
            });
        })
        .call(this));
    (concat = (function(s) {
        return (isEmpty(s) ? s : appendz(first(s), concat.bind(null, rest(s))));
    }));
    (from = (function() {
            var fromImpl = (function(arr, i, len) {
                return ((i >= len) ? end : memoStream(arr[i], fromImpl.bind(null, arr, (i + 1), len)));
            });
            return (function(arr) {
                var length = arr["length"];
                return fromImpl(arr, 0, length);
            });
        })
        .call(this));
    (zip = (function(l1, l2) {
        return ((isEmpty(l1) || isEmpty(l2)) ? end : memoStream([first(l1), first(l2)], zip.bind(null,
            rest(l1), rest(l2))));
    }));
    (indexed = (function() {
            var count = (function(n) {
                return stream(n, (function(f, g) {
                    return (function(x) {
                        return f(g(x));
                    });
                })(count, (function(x, y) {
                        return (x + y);
                    })
                    .bind(null, 1)));
            });
            return zip.bind(null, count(0));
        })
        .call(this));
    (forEach = (function(f, s) {
        for (var head = s; !isEmpty(head);
            (head = rest(head))) f(first(head));
    }));
    (foldl = (function(f, z, s) {
        var r = z;
        forEach((function(x) {
            (r = f(r, x));
        }), s);
        return r;
    }));
    (reverse = foldl.bind(null, flip(cons), end));
    (foldr = (function(f, z, s) {
        return foldl(f, z, reverse(s));
    }));
    (reduce = (function(f, s) {
        return foldl(f, first(s), rest(s));
    }));
    (reduceRight = (function(f, s) {
        return reduce(f, reverse(s));
    }));
    (toArray = (function() {
            var builder = (function(p, c) {
                p.push(c);
                return p;
            });
            return (function(s) {
                return foldl(builder, [], s);
            });
        })
        .call(this));
    (map = (function(f, s) {
        return (isEmpty(s) ? s : memoStream(f(first(s)), map.bind(null, f, rest(s))));
    }));
    (filter = (function(pred, s) {
        var head = s;
        for (; !isEmpty(head);
            (head = rest(head))) {
            var x = first(head);
            if (pred(x)) return memoStream(x, filter.bind(null, pred, rest(head)));
        }
        return head;
    }));
    (bind = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(concat, map));
    (exports.end = end);
    (exports.NIL = NIL);
    (exports.stream = stream);
    (exports.memoStream = memoStream);
    (exports.cons = cons);
    (exports.append = append);
    (exports.appendz = appendz);
    (exports.concat = concat);
    (exports.from = from);
    (exports.first = first);
    (exports.rest = rest);
    (exports.isEmpty = isEmpty);
    (exports.isStream = isStream);
    (exports.forEach = forEach);
    (exports.reverse = reverse);
    (exports.foldl = foldl);
    (exports.foldr = foldr);
    (exports.reduce = reduce);
    (exports.reduceRight = reduceRight);
    (exports.toArray = toArray);
    (exports.zip = zip);
    (exports.indexed = indexed);
    (exports.map = map);
    (exports.filter = filter);
    (exports.bind = bind);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/seshet.kep'
 * DO NOT EDIT
*/
define('seshet',["require", "exports"], (function(require, exports) {
    
    var create, lookup, update, prune;
    var max = (function(x, y) {
        return ((x > y) ? x : y);
    });
    var heightFromChild = (function(child) {
        return (child ? (1 + child.height) : 0);
    });
    var height = (function(root) {
        return (!root ? 0 : max(heightFromChild(root.left), heightFromChild(root.right)));
    });
    var bf = (function(node) {
        return (!node ? 0 : (heightFromChild(node.left) - heightFromChild(node.right)));
    });
    var Cell = (function(id, val, delegate) {
        (this.id = id);
        (this.val = val);
        (this.delegate = delegate);
    });
    (Cell.lookup = (function(base, eq, id) {
        for (var cell = base; cell;
            (cell = cell.delegate))
            if (eq(cell.id, id)) return cell.val;
        return null;
    }));
    var Node = (function(key, cell, l, r, height) {
        (this.key = key);
        (this.cell = cell);
        (this.left = l);
        (this.right = r);
        (this.height = height);
    });
    (Node.setChildren = (function(node, l, r) {
        return new(Node)(node.key, node.cell, l, r, ((l || r) ? (1 + max(height(l), height(r))) : 0));
    }));
    (Node.setLeft = (function(node, l) {
        return Node.setChildren(node, l, node.right);
    }));
    (Node.setRight = (function(node, r) {
        return Node.setChildren(node, node.left, r);
    }));
    (Node.lookup = (function(root, compare, eq, key, id) {
        for (var node = root; node;) {
            var diff = compare(key, node.key);
            if ((diff === 0)) return Cell.lookup(node.cell, eq, id);
            (node = ((diff < 0) ? node.left : node.right));
        }
        return null;
    }));
    (Node.put = (function(node, id, val) {
        return new(Node)(node.key, new(Cell)(id, val, node.cell), node.left, node.right, node.height);
    }));
    var rr = (function(node) {
        return (!node ? node : Node.setLeft(node.right, Node.setRight(node, node.right.left)));
    });
    var ll = (function(node) {
        return (!node ? node : Node.setRight(node.left, Node.setLeft(node, node.left.right)));
    });
    var lr = (function(node) {
        return ll(Node.setLeft(node, rr(node.left)));
    });
    var rl = (function(node) {
        return rr(Node.setRight(node, ll(node.right)));
    });
    var rot = (function(node) {
        var d = bf(node);
        if ((d > 1)) return ((bf(node.left) <= -1) ? lr(node) : ll(node));
        else if ((d < -1)) return ((bf(node.right) >= 1) ? rl(node) : rr(node));
        return node;
    });
    (Node.update = (function(root, compare, key, id, val) {
        if (!root) return new(Node)(key, new(Cell)(id, val, null), null, null, 0);
        var diff = compare(key, root.key);
        if ((diff === 0)) return Node.put(root, id, val);
        return rot(((diff < 0) ? Node.setLeft(root, Node.update(root.left, compare, key, id, val)) :
            Node.setRight(root, Node.update(root.right, compare, key, id, val))));
    }));
    (Node.rebalance = (function(root) {
        return ((Math.abs(bf(root)) <= 1) ? root : rot(Node.setChildren(root, Node.rebalance(root.left),
            Node.rebalance(root.right))));
    }));
    (Node.prune = (function(root, compare, lower, upper) {
        if (!root) return root;
        if ((lower !== undefined)) {
            var dl = compare(root.key, lower);
            if ((dl < 0)) return Node.prune(root.right, compare, lower, upper);
            else if ((dl === 0)) return Node.setChildren(root, null, Node.prune(root.right, compare,
                undefined, upper));
        }
        if (((upper !== undefined) && (compare(root.key, upper) >= 0))) return Node.prune(root.left,
            compare, lower, upper);
        return Node.setChildren(root, Node.prune(root.left, compare, lower, upper), Node.prune(root.right,
            compare, lower, upper));
    }));
    var Memoer = (function(compare, eq, root) {
        (this.compare = compare);
        (this.eq = eq);
        (this.root = root);
    });
    (Memoer.setRoot = (function(m, root) {
        return new(Memoer)(m.compare, m.eq, root);
    }));
    (create = (function() {
            var equals = (function(x, y) {
                return (x === y);
            });
            return (function(compare, eq) {
                return new(Memoer)(compare, (eq || equals), null);
            });
        })
        .call(this));
    (lookup = (function(m, key, id) {
        return Node.lookup(m.root, m.compare, m.eq, key, id);
    }));
    (update = (function(m, key, id, val) {
        return Memoer.setRoot(m, Node.update(m.root, m.compare, key, id, val));
    }));
    (prune = (function(m, lower, upper) {
        return Memoer.setRoot(m, Node.rebalance(Node.prune(m.root, m.compare, lower, upper)));
    }));
    (exports.create = create);
    (exports.lookup = lookup);
    (exports.update = update);
    (exports.prune = prune);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse.kep'
 * DO NOT EDIT
*/
define('bennu/parse',["require", "exports", "nu-stream/stream", "seshet"], (function(require, exports, stream, seshat) {
    
    var NIL = stream["NIL"],
        first = stream["first"],
        isEmpty = stream["isEmpty"],
        rest = stream["rest"],
        foldl = stream["foldl"],
        reduceRight = stream["reduceRight"],
        foldr = stream["foldr"],
        Tail, trampoline, ParserError, ParseError, MultipleError, UnknownError, UnexpectError, ExpectError,
            ParserState, Position, rec, Parser, RecParser, always, never, bind, eof, extract, getParserState,
            setParserState, modifyParserState, getState, setState, modifyState, getInput, setInput, getPosition,
            setPosition, fail, attempt, look, lookahead, next, sequences, sequencea, sequence, either, choices,
            choicea, choice, optional, expected, eager, binds, cons, append, enumerations, enumerationa,
            enumeration, many, many1, token, anyToken, memo, Memoer, exec, parseState, parseStream, parse,
            runState, runStream, run, testState, testStream, test, map = Function.prototype.call.bind(Array.prototype
                .map),
        identity = (function(x) {
            return x;
        }),
        args = (function() {
            var args = arguments;
            return args;
        }),
        constant = (function(x) {
            return (function() {
                return x;
            });
        }),
        throwConstant = (function(err) {
            return (function() {
                throw err;
            });
        }),
        flip = (function(f) {
            return (function(x, y) {
                return f(y, x);
            });
        });
    (Tail = (function(p, state, m, cok, cerr, eok, eerr) {
        var self = this;
        (self.p = p);
        (self.state = state);
        (self.m = m);
        (self.cok = cok);
        (self.cerr = cerr);
        (self.eok = eok);
        (self.eerr = eerr);
    }));
    (trampoline = (function(f) {
        var value = f;
        while ((value instanceof Tail))(value = value.p(value.state, value.m, value.cok, value.cerr,
            value.eok, value.eerr));
        return value;
    }));
    (Memoer = (function(memoer, frames) {
        var self = this;
        (self.memoer = memoer);
        (self.frames = frames);
    }));
    (Memoer.empty = new(Memoer)(seshat.create((function(x, y) {
        return x.compare(y);
    }), (function(x, y) {
        return ((x.id === y.id) && ((x.state === y.state) || (x.state && x.state.eq(y.state))));
    })), []));
    (Memoer.pushWindow = (function(m, lower) {
        return new(Memoer)(m.memoer, [lower].concat(m.frames));
    }));
    (Memoer.popWindow = (function(m) {
        var frames = m["frames"];
        return new(Memoer)(((frames.length === 1) ? seshat.prune(m.memoer, frames[0]) : m.memoer),
            frames.slice(1));
    }));
    (Memoer.prune = (function(m, position) {
        return (m.frames.length ? m : new(Memoer)(seshat.prune(m.memoer, position), m.frames));
    }));
    (Memoer.lookup = (function(m, pos, id) {
        return seshat.lookup(m.memoer, pos, id);
    }));
    (Memoer.update = (function(m, pos, id, val) {
        return new(Memoer)(seshat.update(m.memoer, pos, id, val), m.frames);
    }));
    (Position = (function(i) {
        var self = this;
        (self.index = i);
    }));
    (Position.initial = new(Position)(0));
    (Position.prototype.toString = (function() {
        var self = this;
        return ("" + self.index);
    }));
    (Position.prototype.increment = (function(tok) {
        var self = this;
        return new(Position)((self.index + 1));
    }));
    (Position.prototype.compare = (function(pos) {
        var self = this;
        return (self.index - pos.index);
    }));
    (ParserState = (function(input, position, userState) {
        var self = this;
        (self.input = input);
        (self.position = position);
        (self.userState = userState);
    }));
    (ParserState.prototype.eq = (function(other) {
        var self = this;
        return ((other && (self.input === other.input)) && (self.userState === other.userState));
    }));
    (ParserState.prototype.isEmpty = (function() {
        var self = this;
        return isEmpty(self.input);
    }));
    (ParserState.prototype.first = (function() {
        var self = this;
        return first(self.input);
    }));
    (ParserState.prototype.next = (function(x) {
        var self = this;
        if (!self._next) {
            var s = new(ParserState)(rest(self.input), self.position.increment(x), self.userState);
            (self._next = (function(_, m, cok) {
                return cok(x, s, m);
            }));
        }
        return self._next;
    }));
    (ParserState.prototype.setInput = (function(input) {
        var self = this;
        return new(ParserState)(input, self.position, self.userState);
    }));
    (ParserState.prototype.setPosition = (function(position) {
        var self = this;
        return new(ParserState)(self.input, position, self.userState);
    }));
    (ParserState.prototype.setUserState = (function(userState) {
        var self = this;
        return new(ParserState)(self.input, self.position, userState);
    }));
    (ParserError = (function(msg) {
        var self = this;
        (self.message = msg);
    }));
    (ParserError.prototype = new(Error)());
    (ParserError.prototype.constructor = ParserError);
    (ParserError.prototype.name = "ParserError");
    (ParseError = (function(position, msg) {
        var self = this;
        (self.position = position);
        (self._msg = msg);
    }));
    (ParseError.prototype = new(Error)());
    (ParseError.prototype.constructor = ParseError);
    (ParseError.prototype.name = "ParseError");
    (ParseError.prototype.toString = (function() {
        var self = this;
        return ((self.name + ": ") + self.message);
    }));
    Object.defineProperties(ParseError.prototype, ({
        "message": ({
            "configurable": true,
            "get": (function() {
                var self = this;
                return ((("At position:" + self.position) + " ") + self.errorMessage);
            })
        }),
        "errorMessage": ({
            "configurable": true,
            "get": (function() {
                var self = this;
                return ((self._msg === undefined) ? "" : self._msg);
            })
        })
    }));
    (MultipleError = (function(position, errors) {
        var self = this;
        ParseError.call(self, position);
        (self.errors = (errors || []));
    }));
    (MultipleError.prototype = new(ParseError)());
    (MultipleError.prototype.constructor = MultipleError);
    (MultipleError.prototype.name = "MultipleError");
    Object.defineProperty(MultipleError.prototype, "errorMessage", ({
        "get": (function() {
            var self = this;
            return (("[" + map(self.errors, (function(x) {
                    return x.message;
                }))
                .join(", ")) + "]");
        })
    }));
    var ChoiceError = (function(position, pErr, qErr) {
        var self = this;
        ParseError.call(self, position);
        (self._pErr = pErr);
        (self._qErr = qErr);
    });
    (ChoiceError.prototype = new(MultipleError)());
    (ChoiceError.prototype.constructor = MultipleError);
    (ChoiceError.prototype.name = "ChoiceError");
    Object.defineProperty(ChoiceError.prototype, "errors", ({
        "get": (function() {
            var self = this;
            return [self._pErr].concat(self._qErr.errors);
        })
    }));
    (UnknownError = (function(position) {
        var self = this;
        ParseError.call(self, position);
    }));
    (UnknownError.prototype = new(ParseError)());
    (UnknownError.prototype.constructor = UnknownError);
    (UnknownError.prototype.name = "UnknownError");
    Object.defineProperty(UnknownError.prototype, "errorMessage", ({
        "value": "unknown error"
    }));
    (UnexpectError = (function(position, unexpected) {
        var self = this;
        ParseError.call(self, position);
        (self.unexpected = unexpected);
    }));
    (UnexpectError.prototype = new(ParseError)());
    (UnexpectError.prototype.constructor = UnexpectError);
    (UnexpectError.prototype.name = "UnexpectError");
    Object.defineProperty(UnexpectError.prototype, "errorMessage", ({
        "get": (function() {
            var self = this;
            return ("Unexpected:" + self.unexpected);
        })
    }));
    (ExpectError = (function(position, expected, found) {
        var self = this;
        ParseError.call(self, position);
        (self.expected = expected);
        (self.found = found);
    }));
    (ExpectError.prototype = new(ParseError)());
    (ExpectError.prototype.constructor = ExpectError);
    (ExpectError.prototype.name = "ExpectError");
    Object.defineProperty(ExpectError.prototype, "errorMessage", ({
        "get": (function() {
            var self = this;
            return (("Expected:" + self.expected) + (self.found ? (" Found:" + self.found) : ""));
        })
    }));
    (rec = (function(def) {
        var value = def((function() {
            var args = arguments;
            return value.apply(undefined, args);
        }));
        return value;
    }));
    (Parser = (function(name, p) {
        return (p.hasOwnProperty("displayName") ? Parser(name, (function() {
            var args = arguments;
            return p.apply(undefined, args);
        })) : Object.defineProperty(p, "displayName", ({
            "value": name,
            "writable": false
        })));
    }));
    (RecParser = (function(name, p) {
        return Parser(name, rec(p));
    }));
    (always = (function(x) {
        return (function ALWAYS(state, m, _, _0, eok, _1) {
            return eok(x, state, m);
        });
    }));
    (never = (function(x) {
        return (function NEVER(state, m, _, _0, _1, eerr) {
            return eerr(x, state, m);
        });
    }));
    (bind = (function(p, f) {
        return (function BIND(state, m, cok, cerr, eok, eerr) {
            return new(Tail)(p, state, m, (function(x, state, m) {
                return new(Tail)(f(x), state, m, cok, cerr, cok, cerr);
            }), cerr, (function(x, state, m) {
                return new(Tail)(f(x), state, m, cok, cerr, eok, eerr);
            }), eerr);
        });
    }));
    (modifyParserState = (function(f) {
        return (function MODIFY_PARSER_STATE(state, m, _, _0, eok, _1) {
            var newState = f(state);
            return eok(newState, newState, m);
        });
    }));
    (getParserState = Parser("Get Parser State", modifyParserState(identity)));
    (setParserState = (function(s) {
        return modifyParserState(constant(s));
    }));
    (extract = (function(f) {
        return (function EXTRACT(state, m, _, _0, eok, _1) {
            return eok(f(state), state, m);
        });
    }));
    (modifyState = (function(f) {
        return modifyParserState((function(state) {
            return state.setUserState(f(state.userState));
        }));
    }));
    (getState = Parser("Get State", extract((function(s) {
        return s.userState;
    }))));
    (setState = (function(s) {
        return modifyState(constant(s));
    }));
    (getPosition = Parser("Get Position", extract((function(s) {
        return s.position;
    }))));
    (setPosition = (function(position) {
        return modifyParserState((function(s) {
            return s.setPosition(position);
        }));
    }));
    (getInput = Parser("Get Input", extract((function(s) {
        return s.input;
    }))));
    (setInput = (function(input) {
        return modifyParserState((function(s) {
            return s.setInput(input);
        }));
    }));
    var _binary = (function(p1, p2, f) {
        return bind(p1, (function(v1) {
            return bind(p2, (function(v2) {
                return f(v1, v2);
            }));
        }));
    }),
        _fail = (function(e) {
            return bind(getPosition, (function(pos) {
                return never(e(pos));
            }));
        });
    (fail = (function(msg) {
        var e = (msg ? ParseError : UnknownError);
        return _fail((function(pos) {
            return new(e)(pos, msg);
        }));
    }));
    (eof = Parser("EOF", (function() {
            var end = always(NIL);
            return bind(getParserState, (function(s) {
                return (s.isEmpty() ? end : _fail((function(pos) {
                    return new(ExpectError)(pos, "end of input", s.first());
                })));
            }));
        })
        .call(this)));
    (attempt = (function(p) {
        return (function ATTEMPT(state, m, cok, cerr, eok, eerr) {
            var peerr = (function(x, s, m) {
                return eerr(x, s, Memoer.popWindow(m));
            });
            return new(Tail)(p, state, Memoer.pushWindow(m, state.position), (function(x, s, m) {
                return cok(x, s, Memoer.popWindow(m));
            }), peerr, (function(x, s, m) {
                return eok(x, s, Memoer.popWindow(m));
            }), peerr);
        });
    }));
    var cnothing = (function(p) {
        return (function LOOK(state, m, cok, cerr, eok, eerr) {
            return new(Tail)(p, state, m, eok, cerr, eok, eerr);
        });
    });
    (look = (function(p) {
        return cnothing(bind(getParserState, (function(state) {
            return bind(p, (function(x) {
                return next(setParserState(state), always(x));
            }));
        })));
    }));
    (lookahead = (function(p) {
        return cnothing(_binary(getInput, getPosition, (function(input, pos) {
            return bind(p, (function(x) {
                return sequence(setPosition(pos), setInput(input), always(x));
            }));
        })));
    }));
    (next = (function(p, q) {
        return bind(p, constant(q));
    }));
    (sequences = reduceRight.bind(null, flip(next)));
    (sequencea = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(sequences, stream.from));
    (sequence = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(sequencea, args));
    var _either = (function(e) {
        return (function(p, q) {
            return (function EITHER(state, m, cok, cerr, eok, eerr) {
                var position = state["position"],
                    peerr = (function(errFromP, _, mFromP) {
                        var qeerr = (function(errFromQ, _, mFromQ) {
                            return eerr(e(position, errFromP, errFromQ), state, mFromQ);
                        });
                        return new(Tail)(q, state, mFromP, cok, cerr, eok, qeerr);
                    });
                return new(Tail)(p, state, m, cok, cerr, eok, peerr);
            });
        });
    });
    (either = _either((function(pos, pErr, qErr) {
        return new(MultipleError)(pos, [pErr, qErr]);
    })));
    (choices = foldr.bind(null, flip(_either((function(pos, pErr, qErr) {
        return new(ChoiceError)(pos, pErr, qErr);
    }))), bind(getPosition, (function(pos) {
        return never(new(MultipleError)(pos, []));
    }))));
    (choicea = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(choices, stream.from));
    (choice = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(choicea, args));
    (optional = (function(x, p) {
        return either(p, always(x));
    }));
    (expected = (function(expect, p) {
        return (function EXPECTED(state, m, cok, cerr, eok, eerr) {
            return p(state, m, cok, cerr, eok, (function(x, state, m) {
                return eerr(new(ExpectError)(state.position, expect), state, m);
            }));
        });
    }));
    var _end = always(NIL),
        _optionalValueParser = optional.bind(null, NIL),
        _joinParser = (function(joiner) {
            return (function(p1, p2) {
                return bind(p1, (function(v1) {
                    return bind(p2, (function(v2) {
                        return always(joiner(v1, v2));
                    }));
                }));
            });
        }),
        toArray = (function(x) {
            return always(stream.toArray(x));
        });
    (eager = (function(p) {
        return bind(p, toArray);
    }));
    (binds = (function(p, f) {
        return bind(eager(p), (function(x) {
            return f.apply(undefined, x);
        }));
    }));
    (cons = _joinParser(stream.cons));
    (append = _joinParser(stream.append));
    (enumerations = foldr.bind(null, flip(cons), _end));
    (enumerationa = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(enumerations, stream.from));
    (enumeration = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(enumerationa, args));
    var manyError = throwConstant(new(ParserError)(
        "Many parser applied to a parser that accepts an empty string"));
    (many = (function(p) {
        var safeP = (function(state, m, cok, cerr, eok, eerr) {
            return new(Tail)(p, state, m, cok, cerr, manyError, eerr);
        });
        return rec((function(self) {
            return _optionalValueParser(cons(safeP, self));
        }));
    }));
    (many1 = (function(p) {
        return cons(p, many(p));
    }));
    var defaultErr = (function(pos, tok) {
        return new(UnexpectError)(pos, ((tok === null) ? "end of input" : tok));
    });
    (token = (function(consume, onErr) {
        var errorHandler = (onErr || defaultErr);
        return (function TOKEN(state, m, cok, cerr, eok, eerr) {
            var position = state["position"];
            if (state.isEmpty()) {
                return eerr(errorHandler(position, null), state, m);
            } else {
                var tok = state.first();
                if (consume(tok)) {
                    var pcok = (function(x, s, m) {
                        var position = s["position"];
                        return cok(x, s, Memoer.prune(m, position));
                    });
                    return new(Tail)(state.next(tok), state, m, pcok, cerr, pcok, cerr);
                }
                return eerr(errorHandler(position, tok), state, m);
            }
        });
    }));
    (anyToken = Parser("Any Token", token(constant(true))));
    (memo = (function(p) {
        return (function(state, m, cok, cerr, eok, eerr) {
            var position = state["position"],
                key = ({
                    "id": p,
                    "state": state
                }),
                entry = Memoer.lookup(m, position, key);
            if (entry) {
                switch (entry[0]) {
                    case "cok":
                        return cok(entry[1], entry[2], m);
                    case "ceerr":
                        return cerr(entry[1], entry[2], m);
                    case "eok":
                        return eok(entry[1], entry[2], m);
                    case "eerr":
                        return eerr(entry[1], entry[2], m);
                }
            }
            return new(Tail)(p, state, m, (function(x, pstate, pm) {
                return cok(x, pstate, Memoer.update(pm, position, key, ["cok", x, pstate]));
            }), (function(x, pstate, pm) {
                return cerr(x, pstate, Memoer.update(pm, position, key, ["cerr", x, pstate]));
            }), (function(x, pstate, pm) {
                return eok(x, pstate, Memoer.update(pm, position, key, ["eok", x, pstate]));
            }), (function(x, pstate, pm) {
                return eerr(x, pstate, Memoer.update(pm, position, key, ["eerr", x, pstate]));
            }));
        });
    }));
    (exec = (function(p, state, m, cok, cerr, eok, eerr) {
        return trampoline(p(state, m, cok, cerr, eok, eerr));
    }));
    (parseState = (function(p, state, ok, err) {
        return exec(p, state, Memoer.empty, ok, err, ok, err);
    }));
    (parseStream = (function(p, s, ud, ok, err) {
        return parseState(p, new(ParserState)(s, Position.initial, ud), ok, err);
    }));
    (parse = (function(p, input, ud, ok, err) {
        return parseStream(p, stream.from(input), ud, ok, err);
    }));
    var ok = (function(x) {
        return x;
    }),
        err = (function(x) {
            throw x;
        });
    (runState = (function(p, state) {
        return parseState(p, state, ok, err);
    }));
    (runStream = (function(p, s, ud) {
        return runState(p, new(ParserState)(s, Position.initial, ud));
    }));
    (run = (function(p, input, ud) {
        return runStream(p, stream.from(input), ud);
    }));
    var ok0 = constant(true),
        err0 = constant(false);
    (testState = (function(p, state) {
        return parseState(p, state, ok0, err0);
    }));
    (testStream = (function(p, s, ud) {
        return testState(p, new(ParserState)(s, Position.initial, ud));
    }));
    (test = (function(p, input, ud) {
        return testStream(p, stream.from(input), ud);
    }));
    (exports.Tail = Tail);
    (exports.trampoline = trampoline);
    (exports.ParserError = ParserError);
    (exports.ParseError = ParseError);
    (exports.MultipleError = MultipleError);
    (exports.UnknownError = UnknownError);
    (exports.UnexpectError = UnexpectError);
    (exports.ExpectError = ExpectError);
    (exports.ParserState = ParserState);
    (exports.Position = Position);
    (exports.rec = rec);
    (exports.Parser = Parser);
    (exports.RecParser = RecParser);
    (exports.always = always);
    (exports.never = never);
    (exports.bind = bind);
    (exports.eof = eof);
    (exports.extract = extract);
    (exports.getParserState = getParserState);
    (exports.setParserState = setParserState);
    (exports.modifyParserState = modifyParserState);
    (exports.getState = getState);
    (exports.setState = setState);
    (exports.modifyState = modifyState);
    (exports.getInput = getInput);
    (exports.setInput = setInput);
    (exports.getPosition = getPosition);
    (exports.setPosition = setPosition);
    (exports.fail = fail);
    (exports.attempt = attempt);
    (exports.look = look);
    (exports.lookahead = lookahead);
    (exports.next = next);
    (exports.sequences = sequences);
    (exports.sequencea = sequencea);
    (exports.sequence = sequence);
    (exports.either = either);
    (exports.choices = choices);
    (exports.choicea = choicea);
    (exports.choice = choice);
    (exports.optional = optional);
    (exports.expected = expected);
    (exports.eager = eager);
    (exports.binds = binds);
    (exports.cons = cons);
    (exports.append = append);
    (exports.enumerations = enumerations);
    (exports.enumerationa = enumerationa);
    (exports.enumeration = enumeration);
    (exports.many = many);
    (exports.many1 = many1);
    (exports.token = token);
    (exports.anyToken = anyToken);
    (exports.memo = memo);
    (exports.Memoer = Memoer);
    (exports.exec = exec);
    (exports.parseState = parseState);
    (exports.parseStream = parseStream);
    (exports.parse = parse);
    (exports.runState = runState);
    (exports.runStream = runStream);
    (exports.run = run);
    (exports.testState = testState);
    (exports.testStream = testStream);
    (exports.test = test);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/gen.kep'
 * DO NOT EDIT
*/
define('nu-stream/gen',["require", "exports", "./stream"], (function(require, exports, __o) {
    
    var NIL = __o["NIL"],
        memoStream = __o["memoStream"];
    var repeat, range;
    (repeat = (function(times, x) {
        return ((times <= 0) ? NIL : memoStream(x, repeat.bind(null, (times - 1), x)));
    }));
    (range = (function() {
            var rangeImpl = (function(lower, upper, step) {
                return (((step > 0) ? (upper <= lower) : (upper >= lower)) ? NIL : memoStream(lower,
                    rangeImpl.bind(null, (lower + step), upper, step)));
            });
            return (function(lower, upper, step) {
                var rangeLower = (isNaN(lower) ? Infinity : +lower),
                    rangeStep = (isNaN(step) ? 1 : +step);
                return (isNaN(upper) ? rangeImpl(0, rangeLower, rangeStep) : rangeImpl(rangeLower,
                    upper, rangeStep));
            });
        })
        .call(this));
    (exports.repeat = repeat);
    (exports.range = range);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/lang.kep'
 * DO NOT EDIT
*/
define('bennu/lang',["require", "exports", "nu-stream/stream", "nu-stream/gen", "./parse"], (function(require, exports, __o, __o0,
    __o1) {
    
    var NIL = __o["NIL"],
        repeat = __o0["repeat"],
        append = __o1["append"],
        always = __o1["always"],
        bind = __o1["bind"],
        cons = __o1["cons"],
        either = __o1["either"],
        enumerations = __o1["enumerations"],
        many = __o1["many"],
        many1 = __o1["many1"],
        next = __o1["next"],
        optional = __o1["optional"],
        ParserError = __o1["ParserError"],
        rec = __o1["rec"];
    var times, atMostTimes, betweenTimes, then, between, sepBy1, sepBy, sepEndBy1, sepEndBy, endBy1, endBy,
            chainl1, chainl, chainr1, chainr;
    var _end = always(NIL);
    var _optionalValueParser = optional.bind(null, NIL);
    (times = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(enumerations, repeat));
    (atMostTimes = (function(n, p) {
        return ((n <= 0) ? _end : _optionalValueParser(bind(p, (function(x) {
            return cons(always(x), atMostTimes((n - 1), p));
        }))));
    }));
    (betweenTimes = (function(min, max, p) {
        if ((max < min)) throw new(ParserError)("between max < min");
        return append(times(min, p), atMostTimes((max - min), p));
    }));
    (then = (function(p, q) {
        return bind(p, (function(x) {
            return next(q, always(x));
        }));
    }));
    (between = (function(open, close, p) {
        return next(open, then(p, close));
    }));
    (sepBy1 = (function(sep, p) {
        return cons(p, many(next(sep, p)));
    }));
    (sepBy = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(optional.bind(null, NIL), sepBy1));
    (sepEndBy1 = (function(sep, p) {
        return rec((function(self) {
            return cons(p, _optionalValueParser(next(sep, _optionalValueParser(self))));
        }));
    }));
    (sepEndBy = (function(sep, p) {
        return either(sepEndBy1(sep, p), next(optional(null, sep), always(NIL)));
    }));
    (endBy1 = (function(sep, p) {
        return many1(then(p, sep));
    }));
    (endBy = (function(sep, p) {
        return many(then(p, sep));
    }));
    (chainl1 = (function(op, p) {
        return bind(p, rec((function(self) {
            return (function(x) {
                return optional(x, bind(op, (function(f) {
                    return bind(p, (function(y) {
                        return self(f(x, y));
                    }));
                })));
            });
        })));
    }));
    (chainl = (function(op, x, p) {
        return optional(x, chainl1(op, p));
    }));
    (chainr1 = (function(op, p) {
        return rec((function(self) {
            return bind(p, (function(x) {
                return optional(x, bind(op, (function(f) {
                    return bind(self, (function(y) {
                        return always(f(x, y));
                    }));
                })));
            }));
        }));
    }));
    (chainr = (function(op, x, p) {
        return optional(x, chainr1(op, p));
    }));
    (exports.times = times);
    (exports.atMostTimes = atMostTimes);
    (exports.betweenTimes = betweenTimes);
    (exports.then = then);
    (exports.between = between);
    (exports.sepBy1 = sepBy1);
    (exports.sepBy = sepBy);
    (exports.sepEndBy1 = sepEndBy1);
    (exports.sepEndBy = sepEndBy);
    (exports.endBy1 = endBy1);
    (exports.endBy = endBy);
    (exports.chainl1 = chainl1);
    (exports.chainl = chainl);
    (exports.chainr1 = chainr1);
    (exports.chainr = chainr);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/serialization.kep'
 * DO NOT EDIT
*/
define('khepri_ast/serialization',["require", "exports", "khepri_ast/node"], (function(require, exports, khepri_node) {
    
    var registerNode, serialize, unserialize;
    var khepri_node = khepri_node;
    var keys = Object.keys;
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var id = (function(x) {
        return x;
    });
    var typeMap = ({});
    (registerNode = (function(type, ctor) {
        (typeMap[type] = ctor);
    }));
    (serialize = (function() {
            var _serialize = (function(node, locSerializer, udSerializer) {
                if (!node) return node;
                if (Array.isArray(node)) return map(node, (function(x) {
                    return _serialize(x, locSerializer, udSerializer);
                }));
                if (!(node instanceof khepri_node.Node)) return node;
                return ({
                    "type": node.type,
                    "loc": locSerializer(node.loc),
                    "ud": udSerializer(node.ud),
                    "children": reduce(node.children, (function(o, childKey) {
                        (o[childKey] = _serialize(node[childKey], locSerializer,
                            udSerializer));
                        return o;
                    }), ({})),
                    "attributes": reduce(node.attributes, (function(o, key) {
                        (o[key] = node[key]);
                        return o;
                    }), ({}))
                });
            });
            return (function(node, locSerializer, udSerializer) {
                var program = _serialize(node, (locSerializer || id), (udSerializer || id));
                return ({
                    "version": "2.1.0",
                    "kind": "ecma",
                    "program": program
                });
            });
        })
        .call(this));
    (unserialize = (function() {
            var _unserialize = (function(data, locUnserializer, udUnserializer) {
                if (!data) return data;
                if (Array.isArray(data)) return map(data, (function(x) {
                    return _unserialize(x, locUnserializer, udUnserializer);
                }));
                var ctor = typeMap[data.type];
                if (!ctor) return data;
                var loc = locUnserializer(data.loc),
                    ud = udUnserializer(data.ud);
                var children = reduce(keys(data.children), (function(o, c) {
                    (o[c] = _unserialize(data.children[c], locUnserializer, udUnserializer));
                    return o;
                }), ({}));
                var attributes = reduce(keys(data.attributes), (function(o, c) {
                    (o[c] = data.attributes[c]);
                    return o;
                }), ({}));
                return khepri_node.construct(ctor.prototype, loc, ud, children, attributes);
            });
            return (function(data, locSerializer, udSerializer) {
                return _unserialize(data.program, (locSerializer || id), (udSerializer || id));
            });
        })
        .call(this));
    (exports.registerNode = registerNode);
    (exports.serialize = serialize);
    (exports.unserialize = unserialize);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/node.kep'
 * DO NOT EDIT
*/
define('khepri_ast/node',["require", "exports", "khepri_ast/serialization"], (function(require, exports, __o) {
    
    var Node, construct, reconstruct, modify, setLoc, setUserData, getData, modifyData, setData, defineNode;
    var __o = __o,
        registerNode = __o["registerNode"];
    var concatArgs = (function() {
        var id = (function(x) {
            return x;
        });
        return (function(arr, args) {
            return arr.concat([].map.call(args, id));
        });
    })
        .call(this);
    var keys = Object.keys;
    var map = Function.prototype.call.bind(Array.prototype.map);
    var reduce = Function.prototype.call.bind(Array.prototype.reduce);
    var copy = (function(obj) {
        var out = Object.create(Object.getPrototypeOf(obj));
        Object.getOwnPropertyNames(obj)
            .forEach((function(i) {
                (out[i] = obj[i]);
            }));
        return out;
    });
    var defineProperty = (function(obj, prop, descriptor) {
        return Object.defineProperty(copy(obj), prop, descriptor);
    });
    (Node = (function(loc, ud) {
        Object.defineProperties(this, ({
            "loc": ({
                "value": loc,
                "enumerable": false
            }),
            "ud": ({
                "value": (ud || null),
                "enumerable": false
            })
        }));
    }));
    (construct = (function(proto, loc, ud, children, attributes) {
        var properties = ({});
        Object.keys(children)
            .forEach((function(key) {
                (properties[key] = ({
                    "value": children[key],
                    "enumerable": true,
                    "configurable": true
                }));
            }));
        proto.children.forEach((function(key) {
            (properties[key] = (properties[key] || ({
                "value": null,
                "enumerable": true,
                "configurable": true
            })));
        }));
        Object.keys(attributes)
            .forEach((function(key) {
                (properties[key] = ({
                    "value": attributes[key],
                    "enumerable": true,
                    "configurable": true
                }));
            }));
        (properties.loc = ({
            "value": loc,
            "enumerable": false
        }));
        (properties.ud = ({
            "value": ud,
            "enumerable": false
        }));
        return Object.create(proto, properties);
    }));
    (reconstruct = (function(base, children, attributes) {
        return construct(Object.getPrototypeOf(base), base.loc, base.ud, children, attributes);
    }));
    (modify = (function(base, children, attributes) {
        var allChildren = ({}),
            allAttributes = ({});
        base.children.forEach((function(key) {
            (allChildren[key] = base[key]);
        }));
        Object.keys(children)
            .forEach((function(key) {
                (allChildren[key] = children[key]);
            }));
        base.attributes.forEach((function(key) {
            (allAttributes[key] = base[key]);
        }));
        Object.keys(attributes)
            .forEach((function(key) {
                (allAttributes[key] = attributes[key]);
            }));
        return reconstruct(base, allChildren, allAttributes);
    }));
    (setLoc = (function(base, loc) {
        return construct(Object.getPrototypeOf(base), loc, base.ud, reduce(base.children, (function(o,
            key) {
            (o[key] = base[key]);
            return o;
        }), ({})), reduce(base.attributes, (function(o, key) {
            (o[key] = base[key]);
            return o;
        }), ({})));
    }));
    (setUserData = (function(base, ud) {
        return construct(Object.getPrototypeOf(base), base.loc, ud, reduce(base.children, (function(o,
            key) {
            (o[key] = base[key]);
            return o;
        }), ({})), reduce(base.attributes, (function(o, key) {
            (o[key] = base[key]);
            return o;
        }), ({})));
    }));
    (getData = (function(node, key) {
        return (node.ud ? node.ud[key] : null);
    }));
    (modifyData = (function(node, key, f) {
        return setUserData(node, defineProperty((node.ud || ({})), key, ({
            "value": f(getData(node, key)),
            "enumerable": true
        })));
    }));
    (setData = (function(node, key, value) {
        return modifyData(node, key, (function() {
            return value;
        }));
    }));
    (defineNode = (function(parent, type, children, attributes, ctor) {
        (ctor.type = type);
        (ctor.prototype = new(parent)());
        (ctor.prototype.constructor = ctor);
        (ctor.prototype.children = children);
        (ctor.prototype.attributes = attributes);
        (ctor.prototype.type = ctor.type);
        (ctor.create = (function() {
            var args = arguments;
            return new(ctor.bind.apply(ctor, concatArgs([null], args)))();
        }));
        registerNode(type, ctor);
        return ctor;
    }));
    (exports.Node = Node);
    (exports.construct = construct);
    (exports.reconstruct = reconstruct);
    (exports.modify = modify);
    (exports.setLoc = setLoc);
    (exports.setUserData = setUserData);
    (exports.getData = getData);
    (exports.modifyData = modifyData);
    (exports.setData = setData);
    (exports.defineNode = defineNode);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/token.kep'
 * DO NOT EDIT
*/
define('khepri_ast/token',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Token, StringToken, NumberToken, RegularExpressionToken, BooleanToken, NullToken, IdentifierToken,
            KeywordToken, PunctuatorToken, CommentToken, WhitespaceToken, LineTerminatorToken;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (Token = (function(loc, value) {
        Node.call(this, loc);
        (this.value = value);
    }));
    (Token.prototype = new(Node)());
    (StringToken = defineNode(Token, "String", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (NumberToken = defineNode(Token, "Number", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (RegularExpressionToken = defineNode(Token, "RegularExpression", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (BooleanToken = defineNode(Token, "Boolean", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (NullToken = defineNode(Token, "Null", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (IdentifierToken = defineNode(Token, "Identifier", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (KeywordToken = defineNode(Token, "Keyword", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (PunctuatorToken = defineNode(Token, "Punctuator", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (CommentToken = defineNode(Token, "Comment", [], ["value", "multiline", "linebreak"], (function(loc, value,
        multiline, linebreak) {
        Token.call(this, loc, value);
        (this.multiline = !!multiline);
        (this.linebreak = !!linebreak);
    })));
    (WhitespaceToken = defineNode(Token, "Whitespace", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (LineTerminatorToken = defineNode(Token, "LineTerminator", [], ["value"], (function(loc, value) {
        Token.call(this, loc, value);
    })));
    (exports.Token = Token);
    (exports.StringToken = StringToken);
    (exports.NumberToken = NumberToken);
    (exports.RegularExpressionToken = RegularExpressionToken);
    (exports.BooleanToken = BooleanToken);
    (exports.NullToken = NullToken);
    (exports.IdentifierToken = IdentifierToken);
    (exports.KeywordToken = KeywordToken);
    (exports.PunctuatorToken = PunctuatorToken);
    (exports.CommentToken = CommentToken);
    (exports.WhitespaceToken = WhitespaceToken);
    (exports.LineTerminatorToken = LineTerminatorToken);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/position.kep'
 * DO NOT EDIT
*/
define('khepri/position',["require", "exports", "bennu/parse"], (function(require, exports, parse) {
    
    var SourcePosition, SourceLocation;
    (SourcePosition = (function(line, column) {
        var self = this;
        (self.line = line);
        (self.column = column);
    }));
    (SourcePosition.prototype = new(parse.Position)());
    (SourcePosition.prototype.constructor = SourcePosition);
    (SourcePosition.initial = new(SourcePosition)(1, 0));
    (SourcePosition.prototype.increment = (function(tok) {
        var self = this;
        return ((tok === "\n") ? new(SourcePosition)((self.line + 1), 0) : new(SourcePosition)(self.line, (
            self.column + 1)));
    }));
    (SourcePosition.prototype.toString = (function() {
        var self = this;
        return (((("{line:" + self.line) + " col:") + self.column) + "}");
    }));
    (SourcePosition.prototype.compare = (function(pos) {
        var self = this;
        return ((self.line === pos.line) ? (self.column - pos.column) : (self.line - pos.line));
    }));
    (SourceLocation = (function(start, end) {
        var self = this;
        (self.start = start);
        (self.end = end);
    }));
    (SourceLocation.prototype.toString = (function() {
        var self = this;
        return (((("{start:" + self.start) + " end:") + self.end) + "}");
    }));
    (SourceLocation.merge = (function(s1, s2) {
        return new(SourceLocation)(((s1.start.compare(s2.start) > 0) ? s2.start : s1.start), ((s1.end.compare(
            s2.end) > 0) ? s1.end : s2.end));
    }));
    (exports.SourcePosition = SourcePosition);
    (exports.SourceLocation = SourceLocation);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/text.kep'
 * DO NOT EDIT
*/
define('bennu/text',["require", "exports", "./parse"], (function(require, exports, __o) {
    
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        either = __o["either"],
        ExpectError = __o["ExpectError"],
        next = __o["next"],
        Parser = __o["Parser"],
        token = __o["token"],
        character, characters, string, trie, match, anyChar, letter, space, digit, join = Function.prototype.call
            .bind(Array.prototype.join),
        map = Function.prototype.call.bind(Array.prototype.map),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        reduceRight = Function.prototype.call.bind(Array.prototype.reduceRight),
        expectError = (function(msg) {
            return (function(pos, tok) {
                return new(ExpectError)(pos, msg, ((tok === null) ? "end of input" : tok));
            });
        }),
        StringError = (function(position, string, index, expected, found) {
            var self = this;
            ExpectError.call(self, position, expected, found);
            (self.string = string);
            (self.index = index);
        });
    (StringError.prototype = new(ExpectError)());
    (StringError.prototype.constructor = StringError);
    Object.defineProperty(StringError.prototype, "errorMessage", ({
        "get": (function() {
            var self = this;
            return ((((((("In string:'" + self.string) + "' at index:") + self.index) +
                ", Expected:") + self.expected) + " Found:") + (self.found ? self.found :
                "end of input"));
        })
    }));
    var _character = (function() {
        var pred = (function(l) {
            var x = l.valueOf();
            return (function(r) {
                return (x === r.valueOf());
            });
        });
        return (function(c, err) {
            return token(pred(c), err);
        });
    })
        .call(this);
    (character = (function(c) {
        return _character(c, expectError(c));
    }));
    (characters = (function(chars) {
        var lookup = map(chars, (function(x) {
            return x.valueOf();
        })),
            pred = (function(r) {
                return (lookup.indexOf(r.valueOf()) !== -1);
            });
        return token(pred, expectError(join(chars, " or ")));
    }));
    var reducer = (function(p, c, i, s) {
        return next(_character(c, (function(pos, tok) {
            return new(StringError)(pos, s, i, c, tok);
        })), p);
    });
    (string = (function(s) {
        return attempt(reduceRight(s, reducer, always((s + ""))));
    }));
    var wordReduce = (function(parent, l) {
        (parent[l] = (parent[l] || ({})));
        return parent[l];
    }),
        wordsReduce = (function(trie, word) {
            var node = reduce(word, wordReduce, trie);
            (node[""] = word);
            return trie;
        }),
        makeTrie = (function(words) {
            return reduce(words, wordsReduce, ({}));
        }),
        _trie = (function(trie) {
            var keys = Object.keys(trie),
                paths = reduce(keys, (function(p, c) {
                    if (c.length)(p[c] = _trie(trie[c]));
                    return p;
                }), ({})),
                select = attempt(bind(characters(keys), (function(x) {
                    return paths[x];
                })));
            return (trie.hasOwnProperty("") ? either(select, always(trie[""])) : select);
        });
    (trie = (function(words) {
        return attempt(_trie(makeTrie(words), ""));
    }));
    (match = (function(pattern, expected) {
        return token(RegExp.prototype.test.bind(pattern), expectError(expected));
    }));
    (anyChar = Parser("Any Character", match(/^.$/, "any character")));
    (letter = Parser("Any Letter", match(/^[a-z]$/i, "any letter character")));
    (space = Parser("Any Whitespace", match(/^\s$/i, "any space character")));
    (digit = Parser("Any Digit", match(/^[0-9]$/i, "any digit character")));
    (exports.character = character);
    (exports.characters = characters);
    (exports.string = string);
    (exports.trie = trie);
    (exports.match = match);
    (exports.anyChar = anyChar);
    (exports.letter = letter);
    (exports.space = space);
    (exports.digit = digit);
}));
define('khepri/lex/boolean_lexer',["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    
    var always = __o["always"],
        either = __o["either"],
        next = __o["next"],
        Parser = __o["Parser"],
        string = __o0["string"],
        trueLiteral, falseLiteral, booleanLiteral;
    (trueLiteral = Parser("True Literal Lexer", next(string("true"), always(true))));
    (falseLiteral = Parser("False Literal Lexer", next(string("false"), always(false))));
    (booleanLiteral = Parser("Boolean Literal Lexer", either(trueLiteral, falseLiteral)));
    (exports.trueLiteral = trueLiteral);
    (exports.falseLiteral = falseLiteral);
    (exports.booleanLiteral = booleanLiteral);
}));
define('khepri/lex/line_terminator_lexer',["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    
    var always = __o["always"],
        choice = __o["choice"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        token = __o["token"],
        character = __o0["character"],
        characters = __o0["characters"],
        lf, cr, ls, ps, lineTerminator, lineTerminatorSequence, lfChar = "\n",
        crChar = "\r",
        lsChar = "\u2028",
        psChar = "\u2029";
    (lf = Parser("Line Feed Lexer", character(lfChar)));
    (cr = Parser("Carriage Return Lexer", character(crChar)));
    (ls = Parser("Line Separator Lexer", character(lsChar)));
    (ps = Parser("Paragraph Separator Lexer", character(psChar)));
    (lineTerminator = Parser("Line Terminator Lexer", characters([lfChar, crChar, lsChar, psChar])));
    (lineTerminatorSequence = Parser("Line Terminator Sequence Lexer", choice(lf, ls, ps, next(cr, optional(
        crChar, next(lf, always((crChar + lfChar))))))));
    (exports.lf = lf);
    (exports.cr = cr);
    (exports.ls = ls);
    (exports.ps = ps);
    (exports.lineTerminator = lineTerminator);
    (exports.lineTerminatorSequence = lineTerminatorSequence);
}));
define('khepri/lex/comment_lexer',["require", "exports", "bennu/parse", "bennu/text", "nu-stream/stream", "khepri/lex/line_terminator_lexer"], (
    function(require, exports, __o, __o0, __o1, __o2) {
        
        var anyToken = __o["anyToken"],
            always = __o["always"],
            bind = __o["bind"],
            cons = __o["cons"],
            either = __o["either"],
            many = __o["many"],
            next = __o["next"],
            Parser = __o["Parser"],
            RecParser = __o["RecParser"],
            test = __o["test"],
            token = __o["token"],
            character = __o0["character"],
            string = __o0["string"],
            foldl = __o1["foldl"],
            NIL = __o1["NIL"],
            lineTerminator = __o2["lineTerminator"],
            singleLineCommentMarker, singleLineCommentChar, singleLineCommentChars, singleLineComment,
                multiLineCommentStartMarker, multiLineCommentEndMarker, multiLineCommentChars, multiLineComment,
                comment, join = (function(p) {
                    return bind(p, (function(f, g) {
                        return (function(x) {
                            return f(g(x));
                        });
                    })(always, foldl.bind(null, (function(x, y) {
                        return (x + y);
                    }), "")));
                });
        (singleLineCommentMarker = string("//"));
        (singleLineCommentChar = token((function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })((function(x) {
            return !x;
        }), test.bind(null, lineTerminator))));
        (singleLineCommentChars = many(singleLineCommentChar));
        (singleLineComment = Parser("Single Line Comment Lexer", next(singleLineCommentMarker, join(
            singleLineCommentChars))));
        (multiLineCommentStartMarker = string("/*"));
        (multiLineCommentEndMarker = string("*/"));
        (multiLineCommentChars = RecParser("Multi Line Comment Characters Lexer", (function(self) {
            return either(next(character("*"), either(next(character("/"), always(NIL)), cons(always(
                "*"), self))), cons(anyToken, self));
        })));
        (multiLineComment = Parser("Multi Line Comment Lexer", next(multiLineCommentStartMarker, join(
            multiLineCommentChars))));
        (comment = Parser("Comment Lexer", either(singleLineComment, multiLineComment)));
        (exports.singleLineCommentMarker = singleLineCommentMarker);
        (exports.singleLineCommentChar = singleLineCommentChar);
        (exports.singleLineCommentChars = singleLineCommentChars);
        (exports.singleLineComment = singleLineComment);
        (exports.multiLineCommentStartMarker = multiLineCommentStartMarker);
        (exports.multiLineCommentEndMarker = multiLineCommentEndMarker);
        (exports.multiLineCommentChars = multiLineCommentChars);
        (exports.multiLineComment = multiLineComment);
        (exports.comment = comment);
    }));
define('khepri/lex/null_lexer',["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    
    var always = __o["always"],
        next = __o["next"],
        Parser = __o["Parser"],
        string = __o0["string"],
        nullLiteral;
    (nullLiteral = Parser("Null Lexer", next(string("null"), always(null))));
    (exports.nullLiteral = nullLiteral);
}));
define('khepri/lex/reserved_word_lexer',["require", "exports", "bennu/parse", "bennu/text", "khepri/lex/boolean_lexer", "khepri/lex/null_lexer"], (
    function(require, exports, parse, __o, __o0, __o1) {
        
        var attempt = parse["attempt"],
            choice = parse["choice"],
            Parser = parse["Parser"],
            string = __o["string"],
            trie = __o["trie"],
            booleanLiteral = __o0["booleanLiteral"],
            nullLiteral = __o1["nullLiteral"],
            reservedWord, futureReservedWord, breakKeyword, caseKeyword, catchKeyword, continueKeyword,
                debuggerKeyword, defaultKeyword, deleteKeyword, doKeyword, elseKeyword, finallyKeyword, forKeyword,
                functionKeyword, ifKeyword, inKeyword, instanceofKeyword, typeofKeyword, newKeyword, Keyword,
                returnKeyword, voidKeyword, switchKeyword, whileKeyword, thisKeyword, withKeyword, throwKeyword,
                tryKeyword, keyword, getKeyword, setKeyword, classKeyword, enumKeyword, extendsKeyword,
                superKeyword, constKeyword, exportKeyword, importKeyword, implementsKeyword, letKeyword,
                privateKeyword, publicKeyword, interfaceKeyword, packageKeyword, protectedKeyword, staticKeyword,
                yieldKeyword, keywordList = ["break", "case", "catch", "continue", "debugger", "default", "delete",
                    "do", "else", "finally", "for", "function", "if", "in", "instanceof", "typeof", "new", "var",
                    "return", "void", "switch", "while", "this", "with", "throw", "try", "export", "package",
                    "class", "enum", "interface", "extends", "implements", "private", "public", "protected",
                    "super", "const", "yield", "import", "let", "static", "_"
            ];
        (breakKeyword = string("break"));
        (caseKeyword = string("case"));
        (catchKeyword = string("catch"));
        (continueKeyword = string("continue"));
        (debuggerKeyword = string("debugger"));
        (defaultKeyword = string("default"));
        (deleteKeyword = string("delete"));
        (doKeyword = string("do"));
        (elseKeyword = string("else"));
        (finallyKeyword = string("finally"));
        (forKeyword = string("for"));
        (functionKeyword = string("function"));
        (ifKeyword = string("if"));
        (inKeyword = string("in"));
        (instanceofKeyword = string("instanceof"));
        (typeofKeyword = string("typeof"));
        (newKeyword = string("new"));
        (Keyword = string(""));
        (returnKeyword = string("return"));
        (voidKeyword = string("void"));
        (switchKeyword = string("switch"));
        (whileKeyword = string("while"));
        (thisKeyword = string("this"));
        (withKeyword = string("with"));
        (throwKeyword = string("throw"));
        (tryKeyword = string("try"));
        (getKeyword = string("get"));
        (setKeyword = string("set"));
        (keyword = choice(attempt(breakKeyword), attempt(caseKeyword), attempt(catchKeyword), attempt(
                continueKeyword), attempt(debuggerKeyword), attempt(defaultKeyword), attempt(deleteKeyword),
            attempt(doKeyword), attempt(elseKeyword), attempt(finallyKeyword), attempt(forKeyword), attempt(
                functionKeyword), attempt(ifKeyword), attempt(inKeyword), attempt(instanceofKeyword), attempt(
                typeofKeyword), attempt(newKeyword), attempt(Keyword), attempt(returnKeyword), attempt(
                voidKeyword), attempt(switchKeyword), attempt(whileKeyword), attempt(thisKeyword), attempt(
                withKeyword), attempt(throwKeyword), attempt(tryKeyword)));
        (classKeyword = string("class"));
        (enumKeyword = string("enum"));
        (extendsKeyword = string("extends"));
        (superKeyword = string("super"));
        (constKeyword = string("const"));
        (exportKeyword = string("export"));
        (importKeyword = string("import"));
        (implementsKeyword = string("implements"));
        (letKeyword = string("let"));
        (privateKeyword = string("private"));
        (publicKeyword = string("public"));
        (interfaceKeyword = string("interface"));
        (packageKeyword = string("package"));
        (protectedKeyword = string("protected"));
        (staticKeyword = string("static"));
        (yieldKeyword = string("yield"));
        (futureReservedWord = choice(attempt(classKeyword), attempt(enumKeyword), attempt(extendsKeyword), attempt(
                superKeyword), attempt(constKeyword), attempt(exportKeyword), attempt(importKeyword), attempt(
                implementsKeyword), attempt(letKeyword), attempt(privateKeyword), attempt(publicKeyword),
            attempt(interfaceKeyword), attempt(packageKeyword), attempt(protectedKeyword), attempt(
                staticKeyword), yieldKeyword));
        (reservedWord = Parser("ReservedWordLexer", choice(trie(keywordList), nullLiteral, booleanLiteral)));
        (exports.reservedWord = reservedWord);
        (exports.futureReservedWord = futureReservedWord);
        (exports.breakKeyword = breakKeyword);
        (exports.caseKeyword = caseKeyword);
        (exports.catchKeyword = catchKeyword);
        (exports.continueKeyword = continueKeyword);
        (exports.debuggerKeyword = debuggerKeyword);
        (exports.defaultKeyword = defaultKeyword);
        (exports.deleteKeyword = deleteKeyword);
        (exports.doKeyword = doKeyword);
        (exports.elseKeyword = elseKeyword);
        (exports.finallyKeyword = finallyKeyword);
        (exports.forKeyword = forKeyword);
        (exports.functionKeyword = functionKeyword);
        (exports.ifKeyword = ifKeyword);
        (exports.inKeyword = inKeyword);
        (exports.instanceofKeyword = instanceofKeyword);
        (exports.typeofKeyword = typeofKeyword);
        (exports.newKeyword = newKeyword);
        (exports.Keyword = Keyword);
        (exports.returnKeyword = returnKeyword);
        (exports.voidKeyword = voidKeyword);
        (exports.switchKeyword = switchKeyword);
        (exports.whileKeyword = whileKeyword);
        (exports.thisKeyword = thisKeyword);
        (exports.withKeyword = withKeyword);
        (exports.throwKeyword = throwKeyword);
        (exports.tryKeyword = tryKeyword);
        (exports.keyword = keyword);
        (exports.getKeyword = getKeyword);
        (exports.setKeyword = setKeyword);
        (exports.classKeyword = classKeyword);
        (exports.enumKeyword = enumKeyword);
        (exports.extendsKeyword = extendsKeyword);
        (exports.superKeyword = superKeyword);
        (exports.constKeyword = constKeyword);
        (exports.exportKeyword = exportKeyword);
        (exports.importKeyword = importKeyword);
        (exports.implementsKeyword = implementsKeyword);
        (exports.letKeyword = letKeyword);
        (exports.privateKeyword = privateKeyword);
        (exports.publicKeyword = publicKeyword);
        (exports.interfaceKeyword = interfaceKeyword);
        (exports.packageKeyword = packageKeyword);
        (exports.protectedKeyword = protectedKeyword);
        (exports.staticKeyword = staticKeyword);
        (exports.yieldKeyword = yieldKeyword);
    }));
define('khepri/lex/number_lexer',["require", "exports", "bennu/parse", "bennu/lang", "bennu/text", "nu-stream/stream"], (function(require,
    exports, __o, __o0, __o1, __o2) {
    
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        expected = __o["expected"],
        many = __o["many"],
        many1 = __o["many1"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        then = __o0["then"],
        character = __o1["character"],
        characters = __o1["characters"],
        match = __o1["match"],
        string = __o1["string"],
        foldl = __o2["foldl"],
        decimal, negativeSign, positiveSign, exponentIndicator, hexIndicator, decimalDigit, nonZeroDigit,
            hexDigit, decimalDigits, hexDigits, unsignedInteger, signedInteger, exponentPart, hexIntegerLiteral,
            decimalIntegerLiteral, decimalLiteral, numericLiteral, join = (function(p) {
                return bind(p, (function(f, g) {
                    return (function(x) {
                        return f(g(x));
                    });
                })(always, foldl.bind(null, (function(x, y) {
                    return (x + y);
                }), "")));
            });
    (decimal = Parser("Decimal Lexer", character(".")));
    (negativeSign = Parser("Negative Sign Lexer", character("-")));
    (positiveSign = Parser("Positive Sign Lexer", character("+")));
    (exponentIndicator = Parser("Exponent Indicator Lexer", characters("eE")));
    (hexIndicator = Parser("Hex Indicator Lexer", either(string("0x"), string("0X"))));
    (decimalDigit = Parser("Decimal Digit Lexer", characters("0123456789")));
    (nonZeroDigit = Parser("Non Zero Digit Lexer", characters("123456789")));
    (hexDigit = Parser("Hex Digit Lexer", characters("0123456789abcdefABCDEF")));
    (decimalDigits = Parser("Decimal Digits Lexer", join(many1(decimalDigit))));
    (hexDigits = Parser("Hex Digits Lexer", join(many1(hexDigit))));
    (unsignedInteger = Parser("Unsigned Integer Lexer", bind(decimalDigits, (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(always, parseInt))));
    (signedInteger = Parser("Signed Integer Lexer", either(next(negativeSign, bind(unsignedInteger, (function(f,
        g) {
        return (function(x) {
            return f(g(x));
        });
    })(always, (function(x, y) {
            return (x - y);
        })
        .bind(null, 0)))), next(optional(null, positiveSign), unsignedInteger))));
    var hexIntegerLiteralDigits = Parser("Hex Integer Literal Digits Lexer", bind(hexDigits, (function(num) {
        return always(parseInt(num, 16));
    })));
    (exponentPart = Parser("Exponent Part Lexer", next(exponentIndicator, signedInteger)));
    (hexIntegerLiteral = Parser("Hex Integer Literal Lexer", next(hexIndicator, hexIntegerLiteralDigits)));
    (decimalIntegerLiteral = Parser("Decimal Integer Literal", bind(decimalDigits, (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(always, parseInt))));
    (decimalLiteral = Parser("Decimal Literal Lexer", binds(enumeration(binds(enumeration(decimalDigits,
        optional(0, next(decimal, optional(0, decimalDigits)))), (function(whole,
        fractional) {
        return always(parseFloat(((whole + ".") + fractional)));
    })), optional(0, exponentPart)), (function(num, exp) {
        return always((num * Math.pow(10, parseInt(exp))));
    }))));
    (numericLiteral = Parser("Numeric Literal Lexer", either(next(attempt(hexIndicator), expected("hex digits",
        hexIntegerLiteralDigits)), decimalLiteral)));
    (exports.decimal = decimal);
    (exports.negativeSign = negativeSign);
    (exports.positiveSign = positiveSign);
    (exports.exponentIndicator = exponentIndicator);
    (exports.hexIndicator = hexIndicator);
    (exports.decimalDigit = decimalDigit);
    (exports.nonZeroDigit = nonZeroDigit);
    (exports.hexDigit = hexDigit);
    (exports.decimalDigits = decimalDigits);
    (exports.hexDigits = hexDigits);
    (exports.unsignedInteger = unsignedInteger);
    (exports.signedInteger = signedInteger);
    (exports.exponentPart = exponentPart);
    (exports.hexIntegerLiteral = hexIntegerLiteral);
    (exports.decimalIntegerLiteral = decimalIntegerLiteral);
    (exports.decimalLiteral = decimalLiteral);
    (exports.numericLiteral = numericLiteral);
}));
define('khepri/lex/string_lexer',["require", "exports", "bennu/parse", "bennu/text", "bennu/lang", "nu-stream/stream",
    "khepri/lex/line_terminator_lexer", "khepri/lex/number_lexer"
], (function(require, exports, __o, __o0, __o1, __o2, __o3, __o4) {
    
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        choice = __o["choice"],
        either = __o["either"],
        eof = __o["eof"],
        many = __o["many"],
        next = __o["next"],
        sequence = __o["sequence"],
        Parser = __o["Parser"],
        test = __o["test"],
        token = __o["token"],
        character = __o0["character"],
        between = __o1["between"],
        times = __o1["times"],
        foldl = __o2["foldl"],
        lineTerminatorSequence = __o3["lineTerminatorSequence"],
        lineTerminator = __o3["lineTerminator"],
        decimalDigit = __o4["decimalDigit"],
        hexDigit = __o4["hexDigit"],
        doubleQuote, escape, singleQuote, lineContinuation, unicodeEscapeSequence, hexEscapeSequence,
            characterEscapeSequence, escapeSequence, singleStringCharacter, singleStringCharacters,
            singleStringLiteral, doubleStringCharacter, doubleStringCharacters, doubleStringLiteral,
            stringLiteral, join = foldl.bind(null, (function(x, y) {
                return (x + y);
            }), ""),
        fromCharCodeParser = (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(always, (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(String.fromCharCode, (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })((function(x) {
            return parseInt(x, 16);
        }), join)));
    (doubleQuote = Parser("Double Quote Lexer", character("\"")));
    (singleQuote = Parser("Single Quote Lexer", character("'")));
    (escape = Parser("String Escape Lexer", character("\\")));
    (lineContinuation = Parser("String Line Continuation Lexer", sequence(escape, lineTerminatorSequence,
        always(""))));
    var singleEscapeCharacter = choice(character("'"), character("\""), character("\\"), next(character("b"),
        always("\b")), next(character("f"), always("\f")), next(character("n"), always("\n")), next(
        character("r"), always("\r")), next(character("t"), always("\t")), next(character("v"), always(
        "\u000b"))),
        escapeCharacter = choice(singleEscapeCharacter, decimalDigit, character("u"), character("x")),
        nonEscapeCharacter = token((function(tok) {
            return !(test(escapeCharacter, tok) || test(lineTerminator, tok));
        }));
    (hexEscapeSequence = next(character("x"), bind(times(2, hexDigit), fromCharCodeParser)));
    (unicodeEscapeSequence = next(character("u"), bind(times(4, hexDigit), fromCharCodeParser)));
    (characterEscapeSequence = either(singleEscapeCharacter, nonEscapeCharacter));
    (escapeSequence = choice(characterEscapeSequence, sequence(character("0"), either(eof, token((function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(x) {
        return !x;
    }), test.bind(null, decimalDigit)))), always("\u0000")), hexEscapeSequence, unicodeEscapeSequence));
    (singleStringCharacter = choice(attempt(lineContinuation), next(escape, escapeSequence), token((function(
        tok) {
        return !((test(singleQuote, tok) || test(escape, tok)) || test(lineTerminator, tok));
    }))));
    (singleStringCharacters = many(singleStringCharacter));
    (singleStringLiteral = Parser("Single String Literal", between(singleQuote, singleQuote, bind(
        singleStringCharacters, (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(always, join)))));
    (doubleStringCharacter = choice(attempt(lineContinuation), next(escape, escapeSequence), token((function(
        tok) {
        return !((test(doubleQuote, tok) || test(escape, tok)) || test(lineTerminator, tok));
    }))));
    (doubleStringCharacters = many(doubleStringCharacter));
    (doubleStringLiteral = Parser("Double String Literal", between(doubleQuote, doubleQuote, bind(
        doubleStringCharacters, (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(always, join)))));
    (stringLiteral = Parser("Sting Literal Lexer", either(singleStringLiteral, doubleStringLiteral)));
    (exports.doubleQuote = doubleQuote);
    (exports.escape = escape);
    (exports.singleQuote = singleQuote);
    (exports.lineContinuation = lineContinuation);
    (exports.unicodeEscapeSequence = unicodeEscapeSequence);
    (exports.hexEscapeSequence = hexEscapeSequence);
    (exports.characterEscapeSequence = characterEscapeSequence);
    (exports.escapeSequence = escapeSequence);
    (exports.singleStringCharacter = singleStringCharacter);
    (exports.singleStringCharacters = singleStringCharacters);
    (exports.singleStringLiteral = singleStringLiteral);
    (exports.doubleStringCharacter = doubleStringCharacter);
    (exports.doubleStringCharacters = doubleStringCharacters);
    (exports.doubleStringLiteral = doubleStringLiteral);
    (exports.stringLiteral = stringLiteral);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/identifier_lexer.kep'
 * DO NOT EDIT
*/
define('khepri/lex/identifier_lexer',["require", "exports", "bennu/parse", "bennu/text", "nu-stream/stream", "khepri/lex/reserved_word_lexer",
    "khepri/lex/string_lexer"
], (function(require, exports, __o, __o0, __o1, __o2, __o3) {
    
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        cons = __o["cons"],
        choice = __o["choice"],
        either = __o["either"],
        eof = __o["eof"],
        fail = __o["fail"],
        many = __o["many"],
        never = __o["never"],
        next = __o["next"],
        Parser = __o["Parser"],
        testStream = __o["testStream"],
        token = __o["token"],
        character = __o0["character"],
        characters = __o0["characters"],
        digit = __o0["digit"],
        letter = __o0["letter"],
        string = __o0["string"],
        foldl = __o1["foldl"],
        reservedWord = __o2["reservedWord"],
        escape = __o3["escape"],
        unicodeEscapeSequence = __o3["unicodeEscapeSequence"],
        zwnj, zwj, unicodeLetter, unicodeDigit, unicodeConnectorPunctuation, unicodeCombiningMark,
            identifierStart, identifierPart, identifierParts, identifierName, identifier, join = foldl.bind(
                null, (function(x, y) {
                    return (x + y);
                }), "");
    (zwnj = character("‌"));
    (zwj = character("‍"));
    (unicodeLetter = letter);
    (unicodeDigit = digit);
    (unicodeConnectorPunctuation = characters(["_", "‿", "⁀", "⁔", "︳", "︴", "﹍", "﹎", "﹏", "＿"]));
    (unicodeCombiningMark = never());
    (identifierStart = choice(unicodeLetter, characters("$_"), next(escape, unicodeEscapeSequence)));
    (identifierPart = choice(attempt(identifierStart), unicodeCombiningMark, unicodeDigit,
        unicodeConnectorPunctuation, zwnj, zwj));
    (identifierParts = many(identifierPart));
    (identifierName = cons(identifierStart, identifierParts));
    var reservedWordTest = next(reservedWord, eof);
    (identifier = Parser("Identifier Lexer", bind(identifierName, (function(name) {
        return (testStream(reservedWordTest, name) ? fail() : always(join(name)));
    }))));
    (exports.zwnj = zwnj);
    (exports.zwj = zwj);
    (exports.unicodeLetter = unicodeLetter);
    (exports.unicodeDigit = unicodeDigit);
    (exports.unicodeConnectorPunctuation = unicodeConnectorPunctuation);
    (exports.unicodeCombiningMark = unicodeCombiningMark);
    (exports.identifierStart = identifierStart);
    (exports.identifierPart = identifierPart);
    (exports.identifierParts = identifierParts);
    (exports.identifierName = identifierName);
    (exports.identifier = identifier);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/punctuator_lexer.kep'
 * DO NOT EDIT
*/
define('khepri/lex/punctuator_lexer',["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    
    var Parser = __o["Parser"],
        character = __o0["character"],
        string = __o0["string"],
        trie = __o0["trie"],
        openBrace, closeBrace, openParenthesis, closeParenthesis, openBracket, closeBracket, period, semicolon,
            comma, colon, questionMark, logicalAnd, logicalOr, leftShift, signedRightShift, unsignedRightShift,
            lessThanOrEqualTo, lessThan, greaterThanOrEqualTo, greaterThan, strictEquals, strictDoesNotEqual,
            equals, doesNotEqual, and, or, xor, assign, logicalNot, bitwiseNot, addition, subtration,
            multiplication, mod, division, compose, composeNary, reverseCompose, reverseComposeNary, pipe,
            reversePipe, ellipsis, as, argumentList, lambda, punctuator, punctuators = ["{", "}", "(", ")", "[",
                "]", ",", ".", ";", ":", "?", "&&", "||", "<<", ">>", ">>>", "<=", "<", ">=", ">", "===", "!==",
                "==", "!=", "=", "!", "~", "&", "|", "^", "+", "-", "*", "/", "%", "@", "\\>", "\\>>", "<\\",
                "<<\\", "|>", "<|", "...", "#", "\\", "->"
        ];
    (openBrace = character("{"));
    (closeBrace = character("}"));
    (openParenthesis = character("("));
    (closeParenthesis = character(")"));
    (openBracket = character("["));
    (closeBracket = character("]"));
    (period = character("."));
    (semicolon = character(";"));
    (comma = character(","));
    (colon = character(":"));
    (questionMark = character("?"));
    (logicalAnd = string("&&"));
    (logicalOr = string("||"));
    (leftShift = string("<<"));
    (signedRightShift = string(">>"));
    (unsignedRightShift = string(">>>"));
    (lessThanOrEqualTo = string("<="));
    (lessThan = character("<"));
    (greaterThanOrEqualTo = string(">="));
    (greaterThan = character(">"));
    (strictEquals = string("==="));
    (strictDoesNotEqual = string("!=="));
    (equals = string("=="));
    (doesNotEqual = string("!="));
    (assign = character("="));
    (logicalNot = character("!"));
    (bitwiseNot = character("~"));
    (and = character("&"));
    (or = character("|"));
    (xor = character("^"));
    (addition = character("+"));
    (subtration = character("-"));
    (multiplication = character("*"));
    (division = character("/"));
    (mod = character("%"));
    (as = character("#"));
    (ellipsis = string("..."));
    (argumentList = character("\\"));
    (lambda = string("->"));
    (punctuator = Parser("Punctuator Lexer", trie(punctuators)));
    (exports.openBrace = openBrace);
    (exports.closeBrace = closeBrace);
    (exports.openParenthesis = openParenthesis);
    (exports.closeParenthesis = closeParenthesis);
    (exports.openBracket = openBracket);
    (exports.closeBracket = closeBracket);
    (exports.period = period);
    (exports.semicolon = semicolon);
    (exports.comma = comma);
    (exports.colon = colon);
    (exports.questionMark = questionMark);
    (exports.logicalAnd = logicalAnd);
    (exports.logicalOr = logicalOr);
    (exports.leftShift = leftShift);
    (exports.signedRightShift = signedRightShift);
    (exports.unsignedRightShift = unsignedRightShift);
    (exports.lessThanOrEqualTo = lessThanOrEqualTo);
    (exports.lessThan = lessThan);
    (exports.greaterThanOrEqualTo = greaterThanOrEqualTo);
    (exports.greaterThan = greaterThan);
    (exports.strictEquals = strictEquals);
    (exports.strictDoesNotEqual = strictDoesNotEqual);
    (exports.equals = equals);
    (exports.doesNotEqual = doesNotEqual);
    (exports.and = and);
    (exports.or = or);
    (exports.xor = xor);
    (exports.assign = assign);
    (exports.logicalNot = logicalNot);
    (exports.bitwiseNot = bitwiseNot);
    (exports.addition = addition);
    (exports.subtration = subtration);
    (exports.multiplication = multiplication);
    (exports.mod = mod);
    (exports.division = division);
    (exports.compose = compose);
    (exports.composeNary = composeNary);
    (exports.reverseCompose = reverseCompose);
    (exports.reverseComposeNary = reverseComposeNary);
    (exports.pipe = pipe);
    (exports.reversePipe = reversePipe);
    (exports.ellipsis = ellipsis);
    (exports.as = as);
    (exports.argumentList = argumentList);
    (exports.lambda = lambda);
    (exports.punctuator = punctuator);
}));
define('khepri/lex/whitespace_lexer',["require", "exports", "bennu/parse", "bennu/text", "nu-stream/stream"], (function(require, exports, __o, __o0,
    __o1) {
    
    var always = __o["always"],
        bind = __o["bind"],
        many1 = __o["many1"],
        Parser = __o["Parser"],
        character = __o0["character"],
        characters = __o0["characters"],
        match = __o0["match"],
        foldl = __o1["foldl"],
        tab, vt, ff, sp, nbsp, bom, usp, whitespace, join = (function(p) {
            return bind(p, (function(f, g) {
                return (function(x) {
                    return f(g(x));
                });
            })(always, foldl.bind(null, (function(x, y) {
                return (x + y);
            }), "")));
        }),
        tabChar = "\t",
        vtChar = "\u000b",
        ffChar = "\f",
        spChar = " ",
        nbspChar = " ",
        bomChar = "﻿";
    (tab = character(tabChar));
    (vt = character(vtChar));
    (ff = character(ffChar));
    (sp = character(spChar));
    (nbsp = character(nbspChar));
    (bom = character(bomChar));
    (usp = match(/^\s$/));
    (whitespace = Parser("Whitespace Character Lexer", characters([tabChar, vtChar, ffChar, spChar, nbspChar,
        bomChar
    ])));
    (exports.tab = tab);
    (exports.vt = vt);
    (exports.ff = ff);
    (exports.sp = sp);
    (exports.nbsp = nbsp);
    (exports.bom = bom);
    (exports.usp = usp);
    (exports.whitespace = whitespace);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/regular_expression_lexer.kep'
 * DO NOT EDIT
*/
define('khepri/lex/regular_expression_lexer',["require", "exports", "bennu/parse", "bennu/lang", "bennu/text", "nu-stream/stream",
    "khepri/lex/identifier_lexer", "khepri/lex/line_terminator_lexer"
], (function(require, exports, __o, __o0, __o1, __o2, __o3, __o4) {
    
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        cons = __o["cons"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        many = __o["many"],
        next = __o["next"],
        Parser = __o["Parser"],
        token = __o["token"],
        test = __o["test"],
        between = __o0["between"],
        character = __o1["character"],
        foldl = __o2["foldl"],
        identifierPart = __o3["identifierPart"],
        lineTerminator = __o4["lineTerminator"],
        regularExpressionNonTerminator, regularExpressionBackslashSequence, regularExpressionClassChar,
            regularExpressionClassChars, regularExpressionClass, regularExpressionChar, regularExpressionChars,
            regularExpressionFirstChar, regularExpressionFlags, regularExpressionBody, regularExpressionLiteral,
            join = foldl.bind(null, (function(x, y) {
                return (x + y);
            }), "");
    (regularExpressionNonTerminator = token((function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(x) {
        return !x;
    }), test.bind(null, lineTerminator))));
    (regularExpressionBackslashSequence = next(character("\\"), bind(regularExpressionNonTerminator, (function(
        f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(always, (function(x, y) {
            return (x + y);
        })
        .bind(null, "\\")))));
    (regularExpressionClassChar = either(attempt(token((function(tok) {
        return ((!test(lineTerminator, tok) && (tok !== "]")) && (tok !== "\\"));
    }))), regularExpressionBackslashSequence));
    (regularExpressionClassChars = many(regularExpressionClassChar));
    (regularExpressionClass = between(character("["), character("]"), bind(regularExpressionClassChars, (
        function(body) {
            return always((("[" + join(body)) + "]"));
        }))));
    (regularExpressionFirstChar = choice(token((function(tok) {
        return ((((!test(lineTerminator, tok) && (tok !== "*")) && (tok !== "\\")) && (tok !==
            "`")) && (tok !== "["));
    })), regularExpressionBackslashSequence, regularExpressionClass));
    (regularExpressionChar = choice(token((function(tok) {
        return (((!test(lineTerminator, tok) && (tok !== "\\")) && (tok !== "`")) && (tok !==
            "["));
    })), regularExpressionBackslashSequence, regularExpressionClass));
    (regularExpressionChars = many(regularExpressionChar));
    (regularExpressionFlags = many(identifierPart));
    (regularExpressionBody = bind(cons(regularExpressionFirstChar, regularExpressionChars), (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(always, join)));
    (regularExpressionLiteral = Parser("Regular Expression Lexer", binds(enumeration(between(character("`"),
        character("`"), regularExpressionBody), regularExpressionFlags), (function(body, flags) {
        return always(new(RegExp)(body, join(flags)));
    }))));
    (exports.regularExpressionNonTerminator = regularExpressionNonTerminator);
    (exports.regularExpressionBackslashSequence = regularExpressionBackslashSequence);
    (exports.regularExpressionClassChar = regularExpressionClassChar);
    (exports.regularExpressionClassChars = regularExpressionClassChars);
    (exports.regularExpressionClass = regularExpressionClass);
    (exports.regularExpressionChar = regularExpressionChar);
    (exports.regularExpressionChars = regularExpressionChars);
    (exports.regularExpressionFirstChar = regularExpressionFirstChar);
    (exports.regularExpressionFlags = regularExpressionFlags);
    (exports.regularExpressionBody = regularExpressionBody);
    (exports.regularExpressionLiteral = regularExpressionLiteral);
}));
define('khepri/lex/lexer',["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "khepri_ast/token", "khepri/position",
    "khepri/lex/boolean_lexer", "khepri/lex/comment_lexer", "khepri/lex/identifier_lexer",
    "khepri/lex/line_terminator_lexer", "khepri/lex/null_lexer", "khepri/lex/number_lexer",
    "khepri/lex/punctuator_lexer", "khepri/lex/reserved_word_lexer", "khepri/lex/string_lexer",
    "khepri/lex/whitespace_lexer", "khepri/lex/regular_expression_lexer"
], (function(require, exports, parse, __o, __o0, lexToken, __o1, __o2, __o3, __o4, __o5, __o6, __o7, __o8, __o9,
    __o10, __o11, __o12) {
    
    var always = parse["always"],
        attempt = parse["attempt"],
        binds = parse["binds"],
        bind = parse["bind"],
        choice = parse["choice"],
        either = parse["either"],
        eof = parse["eof"],
        getPosition = parse["getPosition"],
        enumeration = parse["enumeration"],
        extract = parse["extract"],
        expected = parse["expected"],
        next = parse["next"],
        many = parse["many"],
        runState = parse["runState"],
        Parser = parse["Parser"],
        ParserState = parse["ParserState"],
        then = __o["then"],
        memoStream = __o0["memoStream"],
        NIL = __o0["NIL"],
        streamFrom = __o0["from"],
        SourceLocation = __o1["SourceLocation"],
        SourcePosition = __o1["SourcePosition"],
        booleanLiteral = __o2["booleanLiteral"],
        comment = __o3["comment"],
        identifier = __o4["identifier"],
        identifierName = __o4["identifierName"],
        lineTerminator = __o5["lineTerminator"],
        nullLiteral = __o6["nullLiteral"],
        numericLiteral = __o7["numericLiteral"],
        punctuator = __o8["punctuator"],
        reservedWord = __o9["reservedWord"],
        stringLiteral = __o10["stringLiteral"],
        whitespace = __o11["whitespace"],
        regularExpressionLiteral = __o12["regularExpressionLiteral"],
        literal, token, inputElement, lexer, lexManyState, lex, makeToken = (function(type, p) {
            return bind(p, (function(value) {
                return always([type, value]);
            }));
        }),
        buildToken = (function(p) {
            return binds(enumeration(getPosition, p, getPosition), (function(start, __o13, end) {
                var type = __o13[0],
                    value = __o13[1];
                return always(new(type)(new(SourceLocation)(start, end), value));
            }));
        }),
        literalImpl = choice(expected("string literal", makeToken(lexToken.StringToken, stringLiteral)),
            expected("regular expression literal", makeToken(lexToken.RegularExpressionToken,
                regularExpressionLiteral)), expected("boolean literal", makeToken(lexToken.BooleanToken,
                booleanLiteral)), expected("null literal", makeToken(lexToken.NullToken, nullLiteral)),
            expected("number literal", makeToken(lexToken.NumberToken, numericLiteral))),
        tokenImpl = choice(expected("identifier", attempt(makeToken(lexToken.IdentifierToken, identifier))),
            attempt(literalImpl), expected("reserved word", attempt(makeToken(lexToken.KeywordToken,
                reservedWord))), expected("puctuator", makeToken(lexToken.PunctuatorToken, punctuator))),
        inputElementImpl = choice(expected("comment", makeToken(lexToken.CommentToken, comment)), expected(
            "whitespace", makeToken(lexToken.WhitespaceToken, whitespace)), expected("line terminator",
            makeToken(lexToken.LineTerminatorToken, lineTerminator)), tokenImpl);
    (literal = buildToken(literalImpl));
    (token = buildToken(tokenImpl));
    (inputElement = buildToken(inputElementImpl));
    (lexer = then(many(inputElement), eof));
    (lex = (function(input) {
        return runState(lexer, new(ParserState)(streamFrom(input), SourcePosition.initial));
    }));
    (exports.literal = literal);
    (exports.token = token);
    (exports.inputElement = inputElement);
    (exports.lexer = lexer);
    (exports.lexManyState = lexManyState);
    (exports.lex = lex);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/program.kep'
 * DO NOT EDIT
*/
define('khepri_ast/program',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Program;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (Program = defineNode(Node, "Program", ["body"], [], (function(loc, body) {
        Node.call(this, loc);
        (this.body = body);
    })));
    (exports.Program = Program);
}));
define('khepri/parse/common',["require", "exports", "bennu/parse", "khepri/position", "nu-stream/stream"], (function(require, exports, parse,
    __o, stream) {
    
    var always = parse["always"],
        bind = parse["bind"],
        SourceLocation = __o["SourceLocation"],
        NIL = stream["NIL"],
        precedence, node, nodea, positionParser;
    (precedence = (function(p, table) {
        var sep = parse.choicea(table.map((function(entry) {
            return bind(entry.sep, (function(__o0) {
                var value = __o0["value"];
                return always(({
                    "value": value,
                    "node": entry.node,
                    "precedence": entry.precedence,
                    "right": entry.right
                }), value);
            }));
        })));
        return bind(parse.eager(parse.rec((function(self) {
            return parse.cons(p, parse.optional(NIL, parse.cons(sep, parse.expected(
                "binary expression", self))));
        }))), (function(list) {
            var stack = [],
                out = [];
            while ((list.length > 0)) {
                var tok = list.shift();
                if (tok.type) {
                    out.push(tok);
                } else {
                    while ((stack.length > 0)) {
                        var o2 = stack[(stack.length - 1)];
                        if (((!tok.right && (o2.precedence === tok.precedence)) || (o2.precedence <
                            tok.precedence))) {
                            stack.pop();
                            var rt = out.pop(),
                                lf = out.pop();
                            out.push(new(o2.node)(SourceLocation.merge(lf.loc, rt.loc), o2.value,
                                lf, rt));
                        } else {
                            break;
                        }
                    }
                    stack.push(tok);
                }
            }
            while ((stack.length > 0)) {
                var o = stack.pop(),
                    rt0 = out.pop(),
                    lf0 = out.pop();
                out.push(new(o.node)(SourceLocation.merge(lf0.loc, rt0.loc), o.value, lf0, rt0));
            }
            return parse.always(out.pop());
        }));
    }));
    (positionParser = parse.extract((function(__o0) {
        var position = __o0["position"];
        return position;
    })));
    var locParser = parse.extract((function(__o0) {
        var loc = __o0["loc"];
        return loc;
    })),
        prevEnd = parse.extract((function(__o0) {
            var _prevEnd = __o0["_prevEnd"];
            return _prevEnd;
        }));
    (node = (function(p, f) {
        return parse.binds(parse.enumeration(locParser, p, prevEnd), (function(o, x, c) {
            return always(f(new(SourceLocation)((o && o.start), c), x));
        }));
    }));
    (nodea = (function(p, f) {
        return parse.binds(parse.enumeration(locParser, p, prevEnd), (function(o, x, c) {
            return always(f.apply(undefined, stream.toArray(stream.cons(new(SourceLocation)((o &&
                o.start), c), x))));
        }));
    }));
    (exports.precedence = precedence);
    (exports.node = node);
    (exports.nodea = nodea);
    (exports.positionParser = positionParser);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/clause.kep'
 * DO NOT EDIT
*/
define('khepri_ast/clause',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Clause, SwitchCase, CatchClause;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (Clause = (function() {}));
    (Clause.prototype = new(Node)());
    (SwitchCase = defineNode(Clause, "SwitchCase", ["test", "consequent"], [], (function(loc, test, consequent) {
        Node.call(this, loc);
        (this.test = (test || null));
        (this.consequent = consequent);
    })));
    (CatchClause = defineNode(Clause, "CatchClause", ["param", "body"], [], (function(loc, param, body) {
        Node.call(this, loc);
        (this.param = param);
        (this.body = body);
    })));
    (exports.Clause = Clause);
    (exports.SwitchCase = SwitchCase);
    (exports.CatchClause = CatchClause);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/declaration.kep'
 * DO NOT EDIT
*/
define('khepri_ast/declaration',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Declaration, VariableDeclaration, VariableDeclarator, Binding, StaticDeclaration, StaticDeclarator;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (Declaration = (function() {}));
    (Declaration.prototype = new(Node)());
    (VariableDeclaration = defineNode(Declaration, "VariableDeclaration", ["declarations"], [], (function(loc,
        declarations) {
        Node.call(this, loc);
        (this.declarations = declarations);
    })));
    (VariableDeclarator = defineNode(Declaration, "VariableDeclarator", ["id", "init"], [], (function(loc, id,
        init) {
        Node.call(this, loc);
        (this.id = id);
        (this.init = (init || null));
    })));
    (Binding = defineNode(Declaration, "Binding", ["pattern", "value"], [], (function(loc, pattern, value) {
        Node.call(this, loc);
        (this.pattern = pattern);
        (this.value = value);
    })));
    (StaticDeclaration = defineNode(Declaration, "StaticDeclaration", ["declarations"], [], (function(loc,
        declarations) {
        Node.call(this, loc);
        (this.declarations = declarations);
    })));
    (StaticDeclarator = defineNode(Declaration, "StaticDeclarator", ["id", "init"], [], (function(loc, id, init) {
        Node.call(this, loc);
        (this.id = id);
        (this.init = init);
    })));
    (exports.Declaration = Declaration);
    (exports.VariableDeclaration = VariableDeclaration);
    (exports.VariableDeclarator = VariableDeclarator);
    (exports.Binding = Binding);
    (exports.StaticDeclaration = StaticDeclaration);
    (exports.StaticDeclarator = StaticDeclarator);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/statement.kep'
 * DO NOT EDIT
*/
define('khepri_ast/statement',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Statement, EmptyStatement, DebuggerStatement, WithStatement, BlockStatement, ExpressionStatement,
            IfStatement, BreakStatement, ContinueStatement, SwitchStatement, ReturnStatement, ThrowStatement,
            TryStatement, WhileStatement, DoWhileStatement, ForStatement;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (Statement = (function() {}));
    (Statement.prototype = new(Node)());
    (EmptyStatement = defineNode(Statement, "EmptyStatement", [], [], (function(loc) {
        Node.call(this, loc);
    })));
    (DebuggerStatement = defineNode(Statement, "DebuggerStatement", [], [], (function(loc) {
        Node.call(this, loc);
    })));
    (BlockStatement = defineNode(Statement, "BlockStatement", ["body"], [], (function(loc, body) {
        Node.call(this, loc);
        (this.body = body);
    })));
    (ExpressionStatement = defineNode(Statement, "ExpressionStatement", ["expression"], [], (function(loc,
        expression) {
        Node.call(this, loc);
        (this.expression = expression);
    })));
    (IfStatement = defineNode(Statement, "IfStatement", ["test", "consequent", "alternate"], [], (function(loc,
        test, consequent, alternate) {
        Node.call(this, loc);
        (this.test = test);
        (this.consequent = consequent);
        (this.alternate = (alternate || null));
    })));
    (WithStatement = defineNode(Statement, "WithStatement", ["bindings", "body"], [], (function(loc, bindings,
        body) {
        Node.call(this, loc);
        (this.bindings = bindings);
        (this.body = body);
    })));
    (BreakStatement = defineNode(Statement, "BreakStatement", [], [], (function(loc) {
        Node.call(this, loc);
    })));
    (ContinueStatement = defineNode(Statement, "ContinueStatement", [], [], (function(loc) {
        Node.call(this, loc);
    })));
    (SwitchStatement = defineNode(Statement, "SwitchStatement", ["discriminant", "cases"], [], (function(loc,
        discriminant, cases) {
        Node.call(this, loc);
        (this.discriminant = discriminant);
        (this.cases = cases);
    })));
    (ReturnStatement = defineNode(Statement, "ReturnStatement", ["argument"], [], (function(loc, argument) {
        Node.call(this, loc);
        (this.argument = (argument || null));
    })));
    (ThrowStatement = defineNode(Statement, "ThrowStatement", ["argument"], [], (function(loc, argument) {
        Node.call(this, loc);
        (this.argument = argument);
    })));
    (TryStatement = defineNode(Statement, "TryStatement", ["block", "handler", "finalizer"], [], (function(loc,
        block, handler, finalizer) {
        Node.call(this, loc);
        (this.block = block);
        (this.handler = handler);
        (this.finalizer = finalizer);
    })));
    (WhileStatement = defineNode(Statement, "WhileStatement", ["test", "body"], [], (function(loc, test, body) {
        Node.call(this, loc);
        (this.test = test);
        (this.body = body);
    })));
    (DoWhileStatement = defineNode(Statement, "DoWhileStatement", ["body", "test"], [], (function(loc, body,
        test) {
        Node.call(this, loc);
        (this.test = test);
        (this.body = body);
    })));
    (ForStatement = defineNode(Statement, "ForStatement", ["init", "test", "update", "body"], [], (function(loc,
        init, test, update, body) {
        Node.call(this, loc);
        (this.init = (init || null));
        (this.test = (test || null));
        (this.update = (update || null));
        (this.body = body);
    })));
    (exports.Statement = Statement);
    (exports.EmptyStatement = EmptyStatement);
    (exports.DebuggerStatement = DebuggerStatement);
    (exports.WithStatement = WithStatement);
    (exports.BlockStatement = BlockStatement);
    (exports.ExpressionStatement = ExpressionStatement);
    (exports.IfStatement = IfStatement);
    (exports.BreakStatement = BreakStatement);
    (exports.ContinueStatement = ContinueStatement);
    (exports.SwitchStatement = SwitchStatement);
    (exports.ReturnStatement = ReturnStatement);
    (exports.ThrowStatement = ThrowStatement);
    (exports.TryStatement = TryStatement);
    (exports.WhileStatement = WhileStatement);
    (exports.DoWhileStatement = DoWhileStatement);
    (exports.ForStatement = ForStatement);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/token_parser.kep'
 * DO NOT EDIT
*/
define('khepri/parse/token_parser',["require", "exports", "bennu/parse"], (function(require, exports, parse) {
    
    var punctuator, keyword, identifier, anyIdentifier, nullLiteral, booleanLiteral, numericLiteral,
            stringLiteral, regularExpressionLiteral, indexOf = Function.prototype.call.bind(Array.prototype.indexOf),
        join = Function.prototype.call.bind(Array.prototype.join),
        expectError = (function(msg) {
            return (function(pos, tok) {
                return new(parse.ExpectError)(pos, msg, ((tok === null) ? "end of input" : tok.value));
            });
        }),
        typeParser = (function(type, msg) {
            return parse.token((function(tok) {
                return (tok.type === type);
            }), expectError(msg));
        }),
        selectAny = (function(type) {
            return (function() {
                var options = arguments;
                return parse.token((function(tok) {
                    return ((tok.type === type) && (indexOf(options, tok.value) >= 0));
                }), expectError(join(options, ", ")));
            });
        });
    (punctuator = selectAny("Punctuator"));
    (keyword = selectAny("Keyword"));
    (anyIdentifier = typeParser("Identifier", "any identifier"));
    (identifier = selectAny("Identifier"));
    (nullLiteral = typeParser("Null", "Null literal"));
    (booleanLiteral = typeParser("Boolean", "boolean literal"));
    (numericLiteral = typeParser("Number", "numeric literal"));
    (stringLiteral = typeParser("String", "string literal"));
    (regularExpressionLiteral = typeParser("RegularExpression", "regular expression literal"));
    (exports.punctuator = punctuator);
    (exports.keyword = keyword);
    (exports.identifier = identifier);
    (exports.anyIdentifier = anyIdentifier);
    (exports.nullLiteral = nullLiteral);
    (exports.booleanLiteral = booleanLiteral);
    (exports.numericLiteral = numericLiteral);
    (exports.stringLiteral = stringLiteral);
    (exports.regularExpressionLiteral = regularExpressionLiteral);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/expression.kep'
 * DO NOT EDIT
*/
define('khepri_ast/expression',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Expression, ThisExpression, UnaryExpression, BinaryExpression, AssignmentExpression, LogicalExpression,
            ConditionalExpression, NewExpression, CallExpression, MemberExpression, FunctionExpression,
            ArrayExpression, ObjectExpression, LetExpression, CurryExpression, UnaryOperatorExpression,
            BinaryOperatorExpression, TernaryOperatorExpression;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (Expression = (function() {}));
    (Expression.prototype = new(Node)());
    (ThisExpression = defineNode(Expression, "ThisExpression", [], [], (function(loc) {
        Node.call(this, loc);
    })));
    (UnaryExpression = defineNode(Expression, "UnaryExpression", ["argument"], ["operator"], (function(loc,
        operator, argument) {
        Node.call(this, loc);
        (this.operator = operator);
        (this.argument = argument);
    })));
    (BinaryExpression = defineNode(Expression, "BinaryExpression", ["left", "right"], ["operator"], (function(
        loc, operator, left, right) {
        Node.call(this, loc);
        (this.operator = operator);
        (this.left = left);
        (this.right = right);
    })));
    (AssignmentExpression = defineNode(Expression, "AssignmentExpression", ["left", "right"], ["operator"], (
        function(loc, operator, left, right) {
            Node.call(this, loc);
            (this.operator = operator);
            (this.left = left);
            (this.right = right);
        })));
    (LogicalExpression = defineNode(Expression, "LogicalExpression", ["left", "right"], ["operator"], (function(
        loc, operator, left, right) {
        Node.call(this, loc);
        (this.operator = operator);
        (this.left = left);
        (this.right = right);
    })));
    (ConditionalExpression = defineNode(Expression, "ConditionalExpression", ["test", "consequent", "alternate"], [], (
        function(loc, test, consequent, alternate) {
            Node.call(this, loc);
            (this.test = test);
            (this.consequent = consequent);
            (this.alternate = alternate);
        })));
    (NewExpression = defineNode(Expression, "NewExpression", ["callee", "args"], [], (function(loc, callee,
        args) {
        Node.call(this, loc);
        (this.callee = callee);
        (this.args = args);
    })));
    (CallExpression = defineNode(Expression, "CallExpression", ["callee", "args"], [], (function(loc, callee,
        args) {
        Node.call(this, loc);
        (this.callee = callee);
        (this.args = args);
    })));
    (MemberExpression = defineNode(Expression, "MemberExpression", ["object", "property"], ["computed"], (
        function(loc, object, property, computed) {
            Node.call(this, loc);
            (this.object = object);
            (this.property = property);
            (this.computed = computed);
        })));
    (FunctionExpression = defineNode(Expression, "FunctionExpression", ["id", "params", "body"], [], (function(
        loc, id, params, body) {
        Node.call(this, loc);
        (this.id = (id || null));
        (this.params = params);
        (this.body = body);
    })));
    (ArrayExpression = defineNode(Expression, "ArrayExpression", ["elements"], [], (function(loc, elements) {
        Node.call(this, loc);
        (this.elements = elements);
    })));
    (ObjectExpression = defineNode(Expression, "ObjectExpression", ["properties"], [], (function(loc,
        properties) {
        Node.call(this, loc);
        (this.properties = properties);
    })));
    (LetExpression = defineNode(Expression, "LetExpression", ["bindings", "body"], [], (function(loc, bindings,
        body) {
        Node.call(this, loc);
        (this.bindings = bindings);
        (this.body = body);
    })));
    (CurryExpression = defineNode(Expression, "CurryExpression", ["base", "args"], [], (function(loc, base,
        args) {
        Node.call(this, loc);
        (this.base = base);
        (this.args = args);
    })));
    (UnaryOperatorExpression = defineNode(Expression, "UnaryOperatorExpression", [], ["op"], (function(loc, op) {
        Node.call(this, loc);
        (this.op = op);
    })));
    (BinaryOperatorExpression = defineNode(Expression, "BinaryOperatorExpression", [], ["op"], (function(loc,
        op) {
        Node.call(this, loc);
        (this.op = op);
    })));
    (TernaryOperatorExpression = defineNode(Expression, "TernaryOperatorExpression", [], ["op"], (function(loc,
        op) {
        Node.call(this, loc);
        (this.op = op);
    })));
    (exports.Expression = Expression);
    (exports.ThisExpression = ThisExpression);
    (exports.UnaryExpression = UnaryExpression);
    (exports.BinaryExpression = BinaryExpression);
    (exports.AssignmentExpression = AssignmentExpression);
    (exports.LogicalExpression = LogicalExpression);
    (exports.ConditionalExpression = ConditionalExpression);
    (exports.NewExpression = NewExpression);
    (exports.CallExpression = CallExpression);
    (exports.MemberExpression = MemberExpression);
    (exports.FunctionExpression = FunctionExpression);
    (exports.ArrayExpression = ArrayExpression);
    (exports.ObjectExpression = ObjectExpression);
    (exports.LetExpression = LetExpression);
    (exports.CurryExpression = CurryExpression);
    (exports.UnaryOperatorExpression = UnaryOperatorExpression);
    (exports.BinaryOperatorExpression = BinaryOperatorExpression);
    (exports.TernaryOperatorExpression = TernaryOperatorExpression);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/pattern.kep'
 * DO NOT EDIT
*/
define('khepri_ast/pattern',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Pattern, IdentifierPattern, EllipsisPattern, SinkPattern, ImportPattern, ArrayPattern,
            ObjectPatternElement, ObjectPattern, ArgumentsPattern, SubPattern, AsPattern;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (Pattern = (function(loc) {
        Node.call(this, loc);
    }));
    (Pattern.prototype = new(Node)());
    (IdentifierPattern = defineNode(Pattern, "IdentifierPattern", ["id"], [], (function(loc, id) {
        Pattern.call(this, loc);
        (this.id = id);
    })));
    (EllipsisPattern = defineNode(Pattern, "EllipsisPattern", [], ["id"], (function(loc, id) {
        Pattern.call(this, loc);
        (this.id = (id || null));
    })));
    (SinkPattern = defineNode(Pattern, "SinkPattern", [], [], (function(loc) {
        Pattern.call(this, loc);
    })));
    (ImportPattern = defineNode(Node, "ImportPattern", ["from", "pattern"], [], (function(loc, from, pattern) {
        Node.call(this, loc);
        (this.from = from);
        (this.pattern = pattern);
    })));
    (ArrayPattern = defineNode(Pattern, "ArrayPattern", ["elements"], [], (function(loc, elements) {
        Pattern.call(this, loc);
        (this.elements = elements);
    })));
    (ObjectPatternElement = defineNode(Pattern, "ObjectPatternElement", ["key", "target"], [], (function(loc,
        key, target) {
        Pattern.call(this, loc);
        (this.key = key);
        (this.target = (target || null));
    })));
    (ObjectPattern = defineNode(Pattern, "ObjectPattern", ["elements"], [], (function(loc, elements) {
        Pattern.call(this, loc);
        (this.elements = elements);
    })));
    (AsPattern = defineNode(Pattern, "AsPattern", ["id", "target"], [], (function(loc, id, target) {
        Pattern.call(this, loc);
        (this.id = id);
        (this.target = target);
    })));
    (SubPattern = defineNode(Pattern, "SubPattern", ["id", "elements"], [], (function(loc, id, elements) {
        Pattern.call(this, loc);
        (this.id = id);
        (this.elements = elements);
    })));
    (ArgumentsPattern = defineNode(Pattern, "ArgumentsPattern", ["id", "elements", "self"], [], (function(loc,
        id, elements, self) {
        Pattern.call(this, loc);
        (this.id = id);
        (this.elements = elements);
        (this.self = self);
    })));
    (exports.Pattern = Pattern);
    (exports.IdentifierPattern = IdentifierPattern);
    (exports.EllipsisPattern = EllipsisPattern);
    (exports.SinkPattern = SinkPattern);
    (exports.ImportPattern = ImportPattern);
    (exports.ArrayPattern = ArrayPattern);
    (exports.ObjectPatternElement = ObjectPatternElement);
    (exports.ObjectPattern = ObjectPattern);
    (exports.ArgumentsPattern = ArgumentsPattern);
    (exports.SubPattern = SubPattern);
    (exports.AsPattern = AsPattern);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/value.kep'
 * DO NOT EDIT
*/
define('khepri_ast/value',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Identifier, Literal, ObjectValue;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (Identifier = defineNode(Node, "Identifier", [], ["name"], (function(loc, name) {
        Node.call(this, loc);
        (this.name = name);
    })));
    (Literal = defineNode(Node, "Literal", [], ["kind", "value"], (function(loc, kind, value) {
        Node.call(this, loc);
        (this.kind = kind);
        (this.value = value);
    })));
    (ObjectValue = defineNode(Node, "ObjectValue", ["key", "value"], [], (function(loc, key, value) {
        Node.call(this, loc);
        (this.key = key);
        (this.value = value);
    })));
    (exports.Identifier = Identifier);
    (exports.Literal = Literal);
    (exports.ObjectValue = ObjectValue);
}));
define('khepri/parse/value_parser',["require", "exports", "bennu/parse", "khepri_ast/value", "khepri/parse/token_parser"], (function(require,
    exports, __o, ast_value, token) {
    
    var always = __o["always"],
        bind = __o["bind"],
        choice = __o["choice"],
        Parser = __o["Parser"],
        literal, nullLiteral, booleanLiteral, numericLiteral, stringLiteral, regularExpressionLiteral,
            identifier, literalParser = (function(kind, p) {
                return bind(p, (function(x) {
                    return always(ast_value.Literal.create(x.loc, kind, x.value));
                }));
            });
    (nullLiteral = Parser("Null Literal", literalParser("null", token.nullLiteral)));
    (booleanLiteral = Parser("Boolean Literal", literalParser("boolean", token.booleanLiteral)));
    (numericLiteral = Parser("Numeric Literal", literalParser("number", token.numericLiteral)));
    (stringLiteral = Parser("String Literal", literalParser("string", token.stringLiteral)));
    (regularExpressionLiteral = Parser("Regular Expression Literal", literalParser("regexp", token.regularExpressionLiteral)));
    (literal = Parser("Literal", choice(nullLiteral, booleanLiteral, numericLiteral, stringLiteral,
        regularExpressionLiteral)));
    (identifier = Parser("Identifier", bind(token.anyIdentifier, (function(x) {
        return always(ast_value.Identifier.create(x.loc, x.value));
    }))));
    (exports.literal = literal);
    (exports.nullLiteral = nullLiteral);
    (exports.booleanLiteral = booleanLiteral);
    (exports.numericLiteral = numericLiteral);
    (exports.stringLiteral = stringLiteral);
    (exports.regularExpressionLiteral = regularExpressionLiteral);
    (exports.identifier = identifier);
}));
define('khepri/parse/pattern_parser',["require", "exports", "bennu/parse", "bennu/lang", "khepri_ast/pattern", "khepri/parse/common",
    "khepri/parse/token_parser", "khepri/parse/value_parser"
], (function(require, exports, __o, __o0, ast_pattern, __o1, __o2, __o3) {
    
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        eager = __o["eager"],
        either = __o["either"],
        expected = __o["expected"],
        enumeration = __o["enumeration"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        between = __o0["between"],
        sepBy = __o0["sepBy"],
        sepBy1 = __o0["sepBy1"],
        then = __o0["then"],
        node = __o1["node"],
        nodea = __o1["nodea"],
        keyword = __o2["keyword"],
        punctuator = __o2["punctuator"],
        identifier = __o3["identifier"],
        stringLiteral = __o3["stringLiteral"],
        pattern, topLevelPattern, identifierPattern, sinkPattern, ellipsisPattern, importPattern, arrayPattern,
            objectPattern, argumentList, argumentsPattern, asPattern, subPattern;
    (topLevelPattern = (function() {
        var args = arguments;
        return topLevelPattern.apply(undefined, args);
    }));
    (asPattern = (function() {
        var args = arguments;
        return asPattern.apply(undefined, args);
    }));
    (objectPattern = (function() {
        var args = arguments;
        return objectPattern.apply(undefined, args);
    }));
    (subPattern = (function() {
        var args = arguments;
        return subPattern.apply(undefined, args);
    }));
    var sep = optional(null, punctuator(","));
    (identifierPattern = Parser("Identifier Pattern", bind(identifier, (function(x) {
        return always(ast_pattern.IdentifierPattern.create(x.loc, x));
    }))));
    (sinkPattern = Parser("Sink Pattern", bind(keyword("_"), (function(x) {
        return always(ast_pattern.SinkPattern.create(x.loc));
    }))));
    (ellipsisPattern = Parser("Ellipsis Pattern", bind(punctuator("..."), (function(x) {
        return always(ast_pattern.EllipsisPattern.create(x.loc));
    }))));
    (arrayPattern = Parser("Array Pattern", node(between(punctuator("["), punctuator("]"), expected(
        "array pattern element", eager(sepBy1(sep, topLevelPattern)))), ast_pattern.ArrayPattern.create)));
    var objectPatternElement = either(nodea(enumeration(stringLiteral, next(punctuator(":"), choice(
            arrayPattern, objectPattern, asPattern, identifierPattern))), ast_pattern.ObjectPatternElement.create),
        node(either(asPattern, identifierPattern), (function(loc, key) {
            return ast_pattern.ObjectPatternElement.create(loc, key, null);
        })));
    (objectPattern = Parser("Object Pattern", node(between(punctuator("{"), punctuator("}"), expected(
            "object pattern element", eager(sepBy1(sep, objectPatternElement)))), ast_pattern.ObjectPattern
        .create)));
    (asPattern = Parser("As Pattern", nodea(enumeration(attempt(then(identifierPattern, punctuator("#"))),
            expected("object or array pattern", choice(arrayPattern, objectPattern))), ast_pattern.AsPattern
        .create)));
    (importPattern = Parser("Import Pattern", next(keyword("import"), nodea(enumeration(stringLiteral, choice(
        sinkPattern, objectPattern, asPattern, identifierPattern)), ast_pattern.ImportPattern.create))));
    (topLevelPattern = Parser("Top Level Pattern", choice(ellipsisPattern, sinkPattern, arrayPattern,
        objectPattern, asPattern, identifierPattern)));
    var subPatternElements = eager(sepBy1(sep, either(topLevelPattern, subPattern)));
    (subPattern = Parser("Sub Pattern", attempt(nodea(enumeration(identifierPattern, between(punctuator("("),
        punctuator(")"), subPatternElements)), ast_pattern.ArgumentsPattern.create))));
    var argumentElements = eager(sepBy(sep, topLevelPattern)),
        selfPattern = next(punctuator("="), identifierPattern);
    (argumentList = Parser("Argument List", nodea(enumeration(argumentElements, optional(null, selfPattern)), (
        function(loc, elements, self) {
            return ast_pattern.ArgumentsPattern.create(loc, null, elements, self);
        }))));
    (argumentsPattern = Parser("Arguments Pattern", either(nodea(enumeration(attempt(then(optional(null,
            identifierPattern), punctuator("("))), then(argumentElements, punctuator(")")),
        optional(null, selfPattern)), ast_pattern.ArgumentsPattern.create), argumentList)));
    (pattern = Parser("Pattern", choice(importPattern, topLevelPattern)));
    (exports.pattern = pattern);
    (exports.topLevelPattern = topLevelPattern);
    (exports.identifierPattern = identifierPattern);
    (exports.sinkPattern = sinkPattern);
    (exports.ellipsisPattern = ellipsisPattern);
    (exports.importPattern = importPattern);
    (exports.arrayPattern = arrayPattern);
    (exports.objectPattern = objectPattern);
    (exports.argumentList = argumentList);
    (exports.argumentsPattern = argumentsPattern);
    (exports.asPattern = asPattern);
    (exports.subPattern = subPattern);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
define('khepri/parse/expression_parser',["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "khepri_ast/declaration",
    "khepri_ast/expression", "khepri_ast/statement", "khepri_ast/pattern", "khepri_ast/value", "khepri/position",
    "khepri/parse/common", "khepri/parse/token_parser", "khepri/parse/program_parser", "khepri/parse/value_parser",
    "khepri/parse/pattern_parser"
], (function(require, exports, __o, __o0, __o1, ast_declaration, ast_expression, ast_statement, ast_pattern,
    ast_value, __o2, __o3, __o4, program_parser, __o5, pattern) {
    
    var always = __o["always"],
        append = __o["append"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        cons = __o["cons"],
        eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        expected = __o["expected"],
        lookahead = __o["lookahead"],
        many = __o["many"],
        memo = __o["memo"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        between = __o0["between"],
        sepBy = __o0["sepBy"],
        sepBy1 = __o0["sepBy1"],
        then = __o0["then"],
        foldl = __o1["foldl"],
        foldr = __o1["foldr"],
        SourceLocation = __o2["SourceLocation"],
        node = __o3["node"],
        nodea = __o3["nodea"],
        precedence = __o3["precedence"],
        keyword = __o4["keyword"],
        punctuator = __o4["punctuator"],
        identifier = __o5["identifier"],
        literal = __o5["literal"],
        stringLiteral = __o5["stringLiteral"],
        arrayElement, arrayElements, arrayLiteral, propertyName, propertyInitializer, objectProperties,
            objectLiteral, curryExpression, primaryExpression, args, argumentList, dotAccessor, bracketAccessor,
            accessor, memberExpression, newExpression, leftHandSideExpression, leftHandReferenceExpression,
            unaryOperator, unaryExpression, binaryExpression, conditionalExpression, letExpression,
            assignmentOperator, assignmentExpression, expression, topLevelExpression, sourceElements = (
                function() {
                    var args = arguments,
                        __o6 = require("khepri/parse/program_parser"),
                        sourceElements = __o6["sourceElements"];
                    return sourceElements.apply(undefined, args);
                });
    (expression = (function() {
        var args = arguments;
        return expression.apply(undefined, args);
    }));
    (newExpression = (function() {
        var args = arguments;
        return newExpression.apply(undefined, args);
    }));
    (memberExpression = (function() {
        var args = arguments;
        return memberExpression.apply(undefined, args);
    }));
    (arrayElement = Parser("Array Element", expression));
    (arrayElements = expected("array element", Parser("Array Elements", eager(sepBy(punctuator(","),
        arrayElement)))));
    (arrayLiteral = Parser("Array Literal", node(between(punctuator("["), punctuator("]"), arrayElements),
        ast_expression.ArrayExpression.create)));
    (propertyName = Parser("Property Name", stringLiteral));
    (propertyInitializer = Parser("Property Initializer", nodea(enumeration(then(propertyName, punctuator(":")),
        expression), ast_value.ObjectValue.create)));
    (objectProperties = Parser("Object Properties", eager(sepBy(punctuator(","), propertyInitializer))));
    (objectLiteral = Parser("Object Literal", node(between(punctuator("{"), punctuator("}"), objectProperties),
        ast_expression.ObjectExpression.create)));
    var formalParameterList = pattern.argumentsPattern,
        statementBody = node(between(punctuator("{"), punctuator("}"), sourceElements), ast_statement.BlockStatement
            .create),
        lambdaBody = node(expression, (function(loc, x) {
            return ast_statement.BlockStatement.create(loc, [ast_statement.ReturnStatement.create(null,
                x)]);
        })),
        functionBody = either(statementBody, lambdaBody),
        functionExpression = Parser("Function Expression", nodea(cons(optional(null, next(keyword("function"),
                optional(null, identifier))), next(punctuator("\\"), enumeration(formalParameterList,
                next(punctuator("->"), expected("function body", functionBody))))), ast_expression.FunctionExpression
            .create)),
        letBinding = Parser("Let Binding", nodea(enumeration(then(expected("pattern", pattern.topLevelPattern),
            punctuator("=")), expected("let binding expression", expression)), ast_declaration.Binding.create));
    (letExpression = Parser("Let Expression", (function() {
        var letBindings = expected("let bindings", sepBy1(punctuator(","), letBinding)),
            letBody = expected("let body expression", expression);
        return nodea(next(keyword("let"), enumeration(eager(letBindings), next(keyword("in"),
            letBody))), ast_expression.LetExpression.create);
    })()));
    (conditionalExpression = Parser("Conditional Expression", nodea(next(punctuator("?"), enumeration(
        expression, next(punctuator(":"), expected("conditional consequent expression",
            expression)), next(punctuator(":"), expected("conditional alternate expression",
            expression)))), ast_expression.ConditionalExpression.create)));
    var unaryOperatorExpression = Parser("Unary Operator Expression", bind(either(keyword("typeof"), punctuator(
        "void", "~", "!")), (function(__o6) {
        var loc = __o6["loc"],
            value = __o6["value"];
        return always(ast_expression.UnaryOperatorExpression.create(loc, value));
    }))),
        binaryOperatorExpression = Parser("Binary Operator Expression", bind(either(keyword("instanceof"),
            punctuator("*", "/", "+", "-", "%", "<<", ">>", ">>>", "<", ">", "<=", ">=", "==", "!=",
                "===", "!==", "&", "^", "|", "||", "&&", "\\>", "|>")), (function(__o6) {
            var loc = __o6["loc"],
                value = __o6["value"];
            return always(ast_expression.BinaryOperatorExpression.create(loc, value));
        }))),
        ternayOperatorExpression = Parser("Ternary Operator Expression", bind(punctuator("?"), (function(__o6) {
            var loc = __o6["loc"],
                value = __o6["value"];
            return always(ast_expression.TernaryOperatorExpression.create(loc, value));
        }))),
        operatorExpression = Parser("Operator Expression", choice(unaryOperatorExpression,
            binaryOperatorExpression, ternayOperatorExpression));
    (curryExpression = Parser("Curry Expression", (function() {
        var base = either(expected("expression", attempt(expression)), expected(
            "curryable operator", operatorExpression));
        return between(punctuator("("), punctuator(")"), nodea(enumeration(base, optional([], next(
            punctuator(","), eager(sepBy1(punctuator(","), expression))))), (function(loc,
            base, elements) {
            return (elements.length ? ast_expression.CurryExpression.create(loc, base,
                elements) : base);
        })));
    })()));
    (primaryExpression = Parser("Primary Expression", choice(letExpression, conditionalExpression, identifier,
        curryExpression, literal, arrayLiteral, objectLiteral, functionExpression)));
    (argumentList = Parser("Argument List", (function() {
        var argument = expected("argument", expression);
        return eager(sepBy(punctuator(","), argument));
    })()));
    (args = Parser("Arguments", node(between(punctuator("("), punctuator(")"), argumentList), (function(loc,
        args) {
        (args.loc = loc);
        (args.argument = true);
        return args;
    }))));
    var atExpression = Parser("AtExpression", nodea(next(punctuator("@"), enumeration(memberExpression, eager(
        many(next(optional(null, punctuator(":")), expression))))), ast_expression.CallExpression.create));
    (dotAccessor = Parser("Dot Accessor", node(next(punctuator("."), identifier), (function(loc, x) {
        return ({
            "loc": loc,
            "property": x,
            "computed": false
        });
    }))));
    (bracketAccessor = Parser("Bracket Accessor", node(between(punctuator("["), punctuator("]"), expected(
        "accessor expression", expression)), (function(loc, x) {
        return ({
            "loc": loc,
            "property": x,
            "computed": true
        });
    }))));
    (accessor = Parser("Accessor", either(dotAccessor, bracketAccessor)));
    var accessorReducer = (function(p, c) {
        return ast_expression.MemberExpression.create(SourceLocation.merge(p.loc, c.loc), p, c.property, c.computed);
    });
    (memberExpression = Parser("Member Expression", binds(enumeration(choice(atExpression, newExpression,
        primaryExpression), many(accessor)), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(always, foldl.bind(null, accessorReducer)))));
    (newExpression = Parser("New Expression", nodea(next(keyword("new"), enumeration(expected(
        "member expression", memberExpression), optional([], args))), ast_expression.NewExpression.create)));
    (leftHandSideExpression = Parser("Left Hand Side Expression", (function() {
        var reducer = (function(p, c) {
            return ((c && c.hasOwnProperty("argument")) ? ast_expression.CallExpression.create(
                SourceLocation.merge(p.loc, c.loc), p, c) : accessorReducer(p, c));
        });
        return binds(enumeration(memo(memberExpression), many(either(args, accessor))), (function(f,
            g) {
            return (function() {
                return f(g.apply(null, arguments));
            });
        })(always, foldl.bind(null, reducer)));
    })()));
    (leftHandReferenceExpression = Parser("Left Hand Reference Expression", binds(enumeration(memo(identifier),
        memo(many(accessor))), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(always, foldl.bind(null, accessorReducer)))));
    (unaryOperator = Parser("Unary Operator", either(keyword("typeof", "void"), punctuator("+", "-", "~", "!"))));
    (unaryExpression = Parser("Unary Expression", (function() {
        var reducer0 = (function(argument, op) {
            return ast_expression.UnaryExpression.create(SourceLocation.merge(op.loc, argument.loc),
                op.value, argument);
        });
        return binds(enumeration(many(unaryOperator), expected("unary argument",
            leftHandSideExpression)), (function(ops, expression) {
            return always(foldr(reducer0, expression, ops));
        }));
    })()));
    var multiplicativeOperator = punctuator("*", "/", "%"),
        additiveOperator = punctuator("+", "-"),
        shiftOperator = punctuator("<<", ">>", ">>>"),
        relationalOperator = either(punctuator("<", ">", "<=", ">="), keyword("instanceof")),
        equalityOperator = punctuator("==", "!=", "===", "!=="),
        bitwiseANDOperator = punctuator("&"),
        bitwiseXOROperator = punctuator("^"),
        bitwiseOROperator = punctuator("|"),
        logicalANDOperator = punctuator("&&"),
        logicalOROperator = punctuator("||"),
        composeOperator = punctuator("\\>", "\\>>"),
        reverseComposeOperator = punctuator("<\\", "<<\\"),
        pipeOperator = punctuator("|>"),
        reversePipeOperator = punctuator("<|"),
        precedenceTable = [({
            "sep": multiplicativeOperator,
            "precedence": 1,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": additiveOperator,
            "precedence": 2,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": shiftOperator,
            "precedence": 3,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": relationalOperator,
            "precedence": 4,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": equalityOperator,
            "precedence": 5,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": bitwiseANDOperator,
            "precedence": 6,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": bitwiseXOROperator,
            "precedence": 7,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": bitwiseOROperator,
            "precedence": 8,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": logicalOROperator,
            "precedence": 12,
            "node": ast_expression.LogicalExpression
        }), ({
            "sep": logicalANDOperator,
            "precedence": 13,
            "node": ast_expression.LogicalExpression
        }), ({
            "sep": composeOperator,
            "precedence": 14,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": reverseComposeOperator,
            "precedence": 14,
            "right": true,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": pipeOperator,
            "precedence": 15,
            "node": ast_expression.BinaryExpression
        }), ({
            "sep": reversePipeOperator,
            "precedence": 15,
            "right": true,
            "node": ast_expression.BinaryExpression
        })];
    (binaryExpression = Parser("Binary Expression", precedence(memo(unaryExpression), precedenceTable)));
    (assignmentOperator = punctuator("="));
    (assignmentExpression = Parser("Assignment Expression", nodea(append(attempt(enumeration(
        leftHandReferenceExpression, assignmentOperator)), enumeration(expected("expression",
        expression))), (function(loc, left, op, right) {
        return ast_expression.AssignmentExpression.create(loc, op.value, left, right);
    }))));
    var deleteOperator = keyword("delete"),
        deleteExpression = Parser("Delete Expression", nodea(enumeration(deleteOperator, expected(
            "reference expression", leftHandReferenceExpression)), (function(loc, op, expression) {
            return ast_expression.UnaryExpression.create(loc, op.value, expression);
        })));
    (expression = binaryExpression);
    (topLevelExpression = choice(deleteExpression, assignmentExpression, expression));
    (exports.arrayElement = arrayElement);
    (exports.arrayElements = arrayElements);
    (exports.arrayLiteral = arrayLiteral);
    (exports.propertyName = propertyName);
    (exports.propertyInitializer = propertyInitializer);
    (exports.objectProperties = objectProperties);
    (exports.objectLiteral = objectLiteral);
    (exports.curryExpression = curryExpression);
    (exports.primaryExpression = primaryExpression);
    (exports.args = args);
    (exports.argumentList = argumentList);
    (exports.dotAccessor = dotAccessor);
    (exports.bracketAccessor = bracketAccessor);
    (exports.accessor = accessor);
    (exports.memberExpression = memberExpression);
    (exports.newExpression = newExpression);
    (exports.leftHandSideExpression = leftHandSideExpression);
    (exports.leftHandReferenceExpression = leftHandReferenceExpression);
    (exports.unaryOperator = unaryOperator);
    (exports.unaryExpression = unaryExpression);
    (exports.binaryExpression = binaryExpression);
    (exports.conditionalExpression = conditionalExpression);
    (exports.letExpression = letExpression);
    (exports.assignmentOperator = assignmentOperator);
    (exports.assignmentExpression = assignmentExpression);
    (exports.expression = expression);
    (exports.topLevelExpression = topLevelExpression);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/statement_parser.kep'
 * DO NOT EDIT
*/
define('khepri/parse/statement_parser',["require", "exports", "bennu/parse", "bennu/lang", "khepri_ast/clause", "khepri_ast/declaration",
    "khepri_ast/statement", "khepri/parse/common", "khepri/parse/token_parser", "khepri/parse/expression_parser",
    "khepri/parse/pattern_parser", "khepri/parse/value_parser"
], (function(require, exports, __o, __o0, ast_clause, ast_declaration, ast_statement, __o1, __o2, __o3, __o4, __o5) {
    
    var always = __o["always"],
        attempt = __o["attempt"],
        binds = __o["binds"],
        choice = __o["choice"],
        eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        expected = __o["expected"],
        many = __o["many"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        between = __o0["between"],
        sepBy1 = __o0["sepBy1"],
        then = __o0["then"],
        node = __o1["node"],
        nodea = __o1["nodea"],
        keyword = __o2["keyword"],
        punctuator = __o2["punctuator"],
        expression = __o3["expression"],
        topLevelExpression = __o3["topLevelExpression"],
        importPattern = __o4["importPattern"],
        pattern = __o4["pattern"],
        identifier = __o5["identifier"],
        blockStatement, staticStatement, variableStatement, emptyStatement, expressionStatement, ifStatement,
            withStatement, iterationStatement, continueStatement, breakStatement, returnStatement,
            switchStatement, throwStatement, tryStatement, debuggerStatement, statement;
    (statement = (function() {
        var args = arguments;
        return statement.apply(undefined, args);
    }));
    var logicalSemiColon = punctuator(";"),
        statementList = eager(many(statement));
    (blockStatement = Parser("Block Statement", node(between(punctuator("{"), punctuator("}"), statementList),
        ast_statement.BlockStatement.create)));
    (emptyStatement = Parser("Empty Statement", node(punctuator(";"), ast_statement.EmptyStatement.create)));
    (debuggerStatement = Parser("Debugger Statement", node(next(keyword("debugger"), punctuator(";")),
        ast_statement.DebuggerStatement.create)));
    (expressionStatement = Parser("Expression Statement", node(then(topLevelExpression, logicalSemiColon),
        ast_statement.ExpressionStatement.create)));
    (staticStatement = Parser("Static Statement", (function() {
        var staticDeclaration = node(identifier, ast_declaration.StaticDeclarator.create),
            staticDeclarationList = eager(sepBy1(punctuator(","), staticDeclaration));
        return node(between(keyword("static"), logicalSemiColon, staticDeclarationList),
            ast_declaration.StaticDeclaration.create);
    })()));
    var variableDeclarationList = (function() {
        var initialiser = next(punctuator("="), expected("variable initilizer", expression)),
            variableDeclaration = nodea(enumeration(identifier, optional(null, initialiser)),
                ast_declaration.VariableDeclarator.create);
        return eager(sepBy1(punctuator(","), variableDeclaration));
    })();
    (variableStatement = Parser("Variable Statement", node(between(keyword("var"), logicalSemiColon,
        variableDeclarationList), ast_declaration.VariableDeclaration.create)));
    (withStatement = Parser("With Statement", (function() {
        var withIdentifier = expected("pattern", pattern),
            withBinding = either(importPattern, nodea(enumeration(then(withIdentifier, punctuator(
                "=")), expression), ast_declaration.Binding.create)),
            bindings = eager(sepBy1(punctuator(","), withBinding));
        return nodea(next(keyword("with"), enumeration(bindings, next(keyword("in"), blockStatement))),
            ast_statement.WithStatement.create);
    })()));
    (ifStatement = Parser("If Statement", nodea(next(keyword("if"), enumeration(between(punctuator("("),
        punctuator(")"), expected("if condition", expression)), statement, optional(null,
        next(keyword("else"), statement)))), ast_statement.IfStatement.create)));
    (switchStatement = Parser("Switch Statement", (function() {
        var caseClause = nodea(next(keyword("case"), enumeration(then(expression, punctuator(":")),
            statementList)), ast_clause.SwitchCase.create),
            defaultClause = node(next(keyword("default"), next(punctuator(":"), statementList)), (
                function(loc, consequent) {
                    return ast_clause.SwitchCase.create(loc, null, consequent);
                })),
            caseClauses = eager(many(caseClause)),
            caseBlock = between(punctuator("{"), punctuator("}"), binds(enumeration(optional([],
                caseClauses), optional(null, defaultClause)), (function(first,
                defaultClause) {
                return always((defaultClause ? first.concat([defaultClause]) : first));
            })));
        return nodea(next(keyword("switch"), enumeration(between(punctuator("("), punctuator(")"),
                expected("switch discriminant", expression)), caseBlock)), ast_statement.SwitchStatement
            .create);
    })()));
    var whileStatement = Parser("While Statement", nodea(next(keyword("while"), enumeration(between(punctuator(
        "("), punctuator(")"), expression), statement)), ast_statement.WhileStatement.create)),
        doWhileStatement = Parser("Do While Statement", nodea(next(keyword("do"), enumeration(then(statement,
                keyword("while")), between(punctuator("("), punctuator(")"), expression),
            punctuator(";"))), ast_statement.DoWhileStatement.create)),
        forStatement = Parser("For Statement", (function() {
            var forInitExpression = optional(null, either(node(next(keyword("var"),
                    variableDeclarationList), ast_declaration.VariableDeclaration.create),
                topLevelExpression)),
                forTestExpression = optional(null, expression),
                forUpdateExpression = optional(null, topLevelExpression);
            return nodea(next(keyword("for"), enumeration(next(punctuator("("), forInitExpression),
                    next(punctuator(";"), forTestExpression), next(punctuator(";"),
                        forUpdateExpression), next(punctuator(")"), statement))), ast_statement.ForStatement
                .create);
        })());
    (iterationStatement = Parser("Iteration Statement", choice(doWhileStatement, whileStatement, forStatement)));
    (continueStatement = Parser("Continue Statement", node(next(keyword("continue"), logicalSemiColon),
        ast_statement.ContinueStatement.create)));
    (breakStatement = Parser("Break Statement", node(next(keyword("break"), logicalSemiColon), ast_statement.BreakStatement
        .create)));
    (returnStatement = Parser("Return Statement", node(between(keyword("return"), logicalSemiColon, optional(
        null, expression)), ast_statement.ReturnStatement.create)));
    (throwStatement = Parser("Throw Statement", node(between(keyword("throw"), logicalSemiColon, expression),
        ast_statement.ThrowStatement.create)));
    (tryStatement = Parser("Try Statement", (function() {
        var catchBlock = nodea(next(keyword("catch"), enumeration(between(punctuator("("),
            punctuator(")"), identifier), blockStatement)), ast_clause.CatchClause.create),
            finallyBlock = next(keyword("finally"), blockStatement);
        return nodea(next(keyword("try"), enumeration(blockStatement, optional(null, catchBlock),
            optional(null, finallyBlock))), ast_statement.TryStatement.create);
    })()));
    (statement = Parser("Statement", expected("statement", choice(blockStatement, staticStatement,
        variableStatement, emptyStatement, ifStatement, withStatement, iterationStatement,
        continueStatement, breakStatement, returnStatement, switchStatement, throwStatement,
        tryStatement, debuggerStatement, expressionStatement))));
    (exports.blockStatement = blockStatement);
    (exports.staticStatement = staticStatement);
    (exports.variableStatement = variableStatement);
    (exports.emptyStatement = emptyStatement);
    (exports.expressionStatement = expressionStatement);
    (exports.ifStatement = ifStatement);
    (exports.withStatement = withStatement);
    (exports.iterationStatement = iterationStatement);
    (exports.continueStatement = continueStatement);
    (exports.breakStatement = breakStatement);
    (exports.returnStatement = returnStatement);
    (exports.switchStatement = switchStatement);
    (exports.throwStatement = throwStatement);
    (exports.tryStatement = tryStatement);
    (exports.debuggerStatement = debuggerStatement);
    (exports.statement = statement);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/package.kep'
 * DO NOT EDIT
*/
define('khepri_ast/package',["require", "exports", "khepri_ast/node"], (function(require, exports, __o) {
    
    var Package, PackageExport, PackageExports;
    var __o = __o,
        defineNode = __o["defineNode"],
        Node = __o["Node"];
    (PackageExport = defineNode(Node, "PackageExport", ["id", "alias"], [], (function(loc, id, alias) {
        Node.call(this, loc);
        (this.id = id);
        (this.alias = alias);
    })));
    (PackageExports = defineNode(Node, "PackageExports", ["exports"], [], (function(loc, exports) {
        Node.call(this, loc);
        (this.exports = exports);
    })));
    (Package = defineNode(Node, "Package", ["exports", "body"], [], (function(loc, exports, body) {
        Node.call(this, loc);
        (this.exports = exports);
        (this.body = body);
    })));
    (exports.Package = Package);
    (exports.PackageExport = PackageExport);
    (exports.PackageExports = PackageExports);
}));
define('khepri/parse/package_parser',["require", "exports", "bennu/parse", "bennu/lang", "khepri_ast/package", "khepri/parse/common",
    "khepri/parse/token_parser", "khepri/parse/value_parser", "khepri/parse/statement_parser"
], (function(require, exports, __o, __o0, ast_package, __o1, __o2, __o3, _) {
    
    var eager = __o["eager"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        expected = __o["expected"],
        next = __o["next"],
        optional = __o["optional"],
        Parser = __o["Parser"],
        between = __o0["between"],
        sepBy = __o0["sepBy"],
        node = __o1["node"],
        nodea = __o1["nodea"],
        keyword = __o2["keyword"],
        punctuator = __o2["punctuator"],
        identifier = __o3["identifier"],
        khepriPackage, withStatement = (function() {
            var args = arguments,
                __o4 = require("khepri/parse/statement_parser"),
                withStatement = __o4["withStatement"];
            return withStatement.apply(undefined, args);
        }),
        blockStatement = (function() {
            var args = arguments,
                __o4 = require("khepri/parse/statement_parser"),
                blockStatement = __o4["blockStatement"];
            return blockStatement.apply(undefined, args);
        }),
        packageExport = Parser("Package Export", node(identifier, ast_package.PackageExport.create)),
        packageExports = Parser("Package Exports", node(between(punctuator("("), punctuator(")"), eager(sepBy(
            optional(null, punctuator(",")), packageExport))), ast_package.PackageExports.create)),
        packageBody = Parser("Package Body", either(withStatement, blockStatement));
    (khepriPackage = Parser("Package", nodea(next(keyword("package"), enumeration(expected(
        "package export list", packageExports), packageBody)), ast_package.Package.create)));
    (exports.khepriPackage = khepriPackage);
}));
define('khepri/parse/program_parser',["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "khepri_ast/program",
    "khepri/parse/common", "khepri/parse/statement_parser", "khepri/parse/package_parser"
], (function(require, exports, __o, __o0, __o1, ast_program, __o2, _, _0) {
    
    var always = __o["always"],
        cons = __o["cons"],
        eager = __o["eager"],
        either = __o["either"],
        eof = __o["eof"],
        many = __o["many"],
        next = __o["next"],
        Parser = __o["Parser"],
        rec = __o["rec"],
        then = __o0["then"],
        NIL = __o1["NIL"],
        node = __o2["node"],
        sourceElement, sourceElements, program, statementParser = (function() {
            var args = arguments,
                __o3 = require("khepri/parse/statement_parser"),
                statement = __o3["statement"];
            return statement.apply(undefined, args);
        }),
        khepriPackage = (function() {
            var args = arguments,
                __o3 = require("khepri/parse/package_parser"),
                khepriPackage = __o3["khepriPackage"];
            return khepriPackage.apply(undefined, args);
        });
    (sourceElement = statementParser);
    (sourceElements = eager(many(sourceElement)));
    (program = Parser("Program", node(either(then(khepriPackage, eof), eager(rec((function(self) {
        return either(next(eof, always(NIL)), cons(sourceElement, self));
    })))), ast_program.Program.create)));
    (exports.sourceElement = sourceElement);
    (exports.sourceElements = sourceElements);
    (exports.program = program);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/parser.kep'
 * DO NOT EDIT
*/
define('khepri/parse/parser',["require", "exports", "bennu/parse", "nu-stream/stream", "khepri/position", "khepri/parse/program_parser"], (
    function(require, exports, parse, stream, __o, __o0) {
        
        var first = stream["first"],
            filter = stream["filter"],
            isEmpty = stream["isEmpty"],
            rest = stream["rest"],
            NIL = stream["NIL"],
            streamFrom = stream["from"],
            SourceLocation = __o["SourceLocation"],
            SourcePosition = __o["SourcePosition"],
            program = __o0["program"],
            parserStream, ParserPosition, ParserState, parseInput, parseStream;
        (parserStream = filter.bind(null, (function(x) {
            switch (x.type) {
                case "Whitespace":
                case "LineTerminator":
                case "Comment":
                    return false;
                default:
                    return true;
            }
        })));
        (ParserPosition = (function(tokenPosition, sourcePosition) {
            var self = this;
            (self.tokenPosition = tokenPosition);
            (self.sourcePosition = sourcePosition);
        }));
        (ParserPosition.prototype = new(parse.Position)());
        (ParserPosition.prototype.constructor = ParserPosition);
        (ParserPosition.initial = new(ParserPosition)(parse.Position.initial, SourcePosition.initial));
        (ParserPosition.prototype.increment = (function(tok, end) {
            var self = this;
            return new(ParserPosition)(self.tokenPosition.increment(tok), end);
        }));
        (ParserPosition.prototype.toString = (function() {
            var self = this;
            return ("" + self.sourcePosition);
        }));
        (ParserPosition.prototype.compare = (function(pos) {
            var self = this;
            return self.tokenPosition.compare(pos.tokenPosition);
        }));
        (ParserState = (function(input, pos, prevEnd) {
            var self = this;
            parse.ParserState.call(self, input, pos);
            (self._prevEnd = prevEnd);
        }));
        (ParserState.prototype = new(parse.ParserState)());
        (ParserState.initial = new(ParserState)(NIL, ParserPosition.initial, SourcePosition.initial));
        (ParserState.prototype.setInput = (function(input) {
            var self = this;
            return new(ParserState)(input, self.position, self._prevEnd);
        }));
        (ParserState.prototype.setPosition = (function(position) {
            var self = this;
            return new(ParserState)(self.input, position, self._prevEnd);
        }));
        (ParserState.prototype.next = (function(tok) {
            var self = this;
            if (!self._next) {
                var r = rest(self.input),
                    end = (isEmpty(r) ? tok.loc.end : first(r)
                        .loc.start),
                    s = new(ParserState)(r, self.position.increment(tok, end), self.loc.end);
                (self._next = (function(_, m, cok) {
                    return cok(tok, s, m);
                }));
            }
            return self._next;
        }));
        Object.defineProperty(ParserState.prototype, "loc", ({
            "get": (function() {
                var self = this;
                return (isEmpty(self.input) ? new(SourceLocation)(self._prevEnd, self._prevEnd) : first(
                        self.input)
                    .loc);
            })
        }));
        (parseStream = (function(s) {
            return parse.runState(program, new(ParserState)(parserStream(s), ParserPosition.initial));
        }));
        (parseInput = (function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })(parseStream, streamFrom));
        (exports.parserStream = parserStream);
        (exports.ParserPosition = ParserPosition);
        (exports.ParserState = ParserState);
        (exports.parseInput = parseInput);
        (exports.parseStream = parseStream);
    }));
/**
 * @fileOverview Node serialization
 */
define('ecma_ast/serialization',['exports',
        'ecma_ast/node'],
function(exports,
        ecma_node){
//

var keys = Object.keys;
    
var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);

var id = function(x) { return x; };

/* Internal
 ******************************************************************************/
var typeMap = {};

var registerNode = function(type, ctor) {
    typeMap[type] = ctor;
};

/* Serialization
 ******************************************************************************/
/**
 * Serialize a given node to a JSON data structure.
 * 
 * @param node Root node to serialize.
 * @param [locSerializer] Function that serializes location data.
 * @param [udSerializer] Function that serializes user data objects.
 */
var serialize = (function(){
    var _serialize = function(node, locSerializer, udSerializer) {
        if (!node)
            return node;
        
        if (Array.isArray(node))
            return map(node, function(x) { return _serialize(x, locSerializer, udSerializer); });
        
        if (!(node instanceof ecma_node.Node))
            return node;
        
        return {
            'type': node.type,
            'loc': locSerializer(node.loc),
            'ud': udSerializer(node.ud),
            'children': reduce(node.children, function(o, childKey) {
                o[childKey] = _serialize(node[childKey], locSerializer, udSerializer);
                return o;
            }, {}),
            'attributes': reduce(node.attributes, function(o, key) {
                o[key] = node[key];
                return o;
            }, {})
        }
    };
    
    return function(node, locSerializer, udSerializer) {
        var program = _serialize(
            node,
            locSerializer || id,
            udSerializer || id);
        return {
            'version': '2.1.0',
            'kind': 'ecma',
            'program': program
        };
    };
}());

/**
 * Unserialize a data to an AST.
 * 
 * @param data Object to unserialize.
 * @param [locSerializer] Function that unserializes location data.
 * @param [udSerializer] Function that unserializes user data objects.
 */
var unserialize = (function(){
    var _unserialize = function(data, locUnserializer, udUnserializer) {
        if (!data)
            return data;
        
        if (Array.isArray(data))
            return map(data, function(x) { return _unserialize(x, locUnserializer, udUnserializer); });
        
        var ctor = typeMap[data.type];
        if (!ctor)
            return data;
        
        var loc = locUnserializer(data.loc),
            ud = udUnserializer(data.ud);
        
        var children = reduce(
            keys(data.children),
            function(o, c) {
                o[c] = _unserialize(data.children[c], locUnserializer, udUnserializer);
                return o;
            }, {});
        
        var attributes = reduce(
            keys(data.attributes),
            function(o, c) {
                o[c] = data.attributes[c];
                return o;
            }, {});
        
        return ecma_node.construct(
            ctor.prototype,
            loc,
            ud,
            children,
            attributes);
    };
    
    return function(data, locSerializer, udSerializer) {
        return _unserialize(
            data.program,
            locSerializer || id,
            udSerializer || id);
    };
}());


/* Export
 ******************************************************************************/
// Internal
exports.registerNode = registerNode;

// Public
exports.serialize = serialize;
exports.unserialize = unserialize;
});
/**
 * @fileOverview Node serialization
 */
define('ecma_ast/node',['require', 'exports', 'ecma_ast/serialization'],
function(require, exports){
//

var concatArgs = (function(){
    var map = function(x) { return x; };
    
    return function(arr, args) {
        return arr.concat([].map.call(args, map));
    };
}());

var keys = Object.keys;
    
var map = Function.prototype.call.bind(Array.prototype.map);
var reduce = Function.prototype.call.bind(Array.prototype.reduce);

var copy = function(obj) {
    var out = new (Object.getPrototypeOf(obj).constructor)();
    for (var i in obj)
        out[i] = obj[i];
    return out;
};

var defineProperty = function(obj, prop, descriptor) {
    return Object.defineProperty(copy(obj), prop, descriptor);
};

/* Node
 ******************************************************************************/
/**
 * Base class for nodes
 * 
 * @param loc Location.
 * @param ud UserData
 */
var Node = function(loc, ud) {
    Object.defineProperties(this, {
        'loc': {
            'value': loc,
            'enumerable': false
        },
        'ud': {
            'value': (ud || null),
            'enumerable': false
        }
    });
};

/* Operations
 ******************************************************************************/
/**
 * Construct a node with given attributes and children.
 * 
 * Nulls all undefined children.
 * 
 * @param proto Node prototype.
 * @param loc Location.
 * @param ud Userdata.
 * @param children Object mappings keys to children values.
 * @param attributes Object mappings keys to attribute values.
 * 
 * @return New node.
 */
var construct = function(proto, loc, ud, children, attributes) {
    var properties = {};
    
    // Copy explicit children
    Object.keys(children).forEach(function(key) {
        properties[key] = {
            'value': children[key],
            'enumerable': true,
            'configurable': true
        };
    });
    
    // Null remaining children
    proto.children.forEach(function(key) {
        properties[key] = (properties[key] || {
            'value': null,
            'enumerable': true,
            'configurable': true
        });
    });
    
    Object.keys(attributes).forEach(function(key) {
        properties[key] = {
            'value': attributes[key],
            'enumerable': true,
            'configurable': true
        };
    });
    
    // Shallow copy other props
    properties.loc = {
        'value': loc,
        'enumerable': false
    };
    properties.ud = {
        'value': ud,
        'enumerable': false
    };
    
    return Object.create(
        proto,
        properties);
};

/**
 * Reconstruct a node with new attributes and children.
 * 
 * @param base Node to reconstruct.
 * @param children Object mappings keys to children values.
 * @param attributes Object mappings keys to attribute values.
 * 
 * @return Reconstructed node.
 */
var reconstruct = function(base, children, attributes) {
    return construct(
        Object.getPrototypeOf(base),
        base.loc,
        base.ud,
        children,
        attributes);
};

/**
 * Create a new node from a base with children and attributes included from
 * `children` and `attributes`.
 * 
 * Unlike `reconstruct`, `children` and `attributes` are not the list of all
 * properties the node will have, but difference with the current node.
 * 
 * @param base Base node to transform.
 * @param children Object mappings keys to children values.
 * @param attributes Object mappings keys to attribute values.
 * 
 * @return Modified node.
 */
var modify = function(base, children, attributes) {
    var allChildren = {},
        allAttributes = {};
    
    base.children.forEach(function(key) {
        allChildren[key] = base[key];
    });
    Object.keys(children).forEach(function(key) {
        allChildren[key] = children[key];
    });
    
    base.attributes.forEach(function(key) {
        allAttributes[key] = base[key];
    });
    Object.keys(attributes).forEach(function(key) {
        allAttributes[key] = attributes[key];
    });
    
    return reconstruct(
        base,
        allChildren,
        allAttributes);
};

/**
 * Set the loc of a node.
 * 
 * @param base Base node to transform.
 * @param loc New loc.
 * 
 * @return Transformed node.
 */
var setLoc = function(base, loc) {
    return construct(
        Object.getPrototypeOf(base),
        loc,
        base.ud,
        reduce(base.children, function(o, key) { o[key] = base[key]; return o; }, {}),
        reduce(base.attributes, function(o, key) { o[key] = base[key]; return o; }, {}));
};

/**
 * Set the user data of a node.
 * 
 * @param base Base node to transform.
 * @param ud New user data.
 * 
 * @return Transformed node.
 */
var setUserData = function(base, ud) {
    return construct(
        Object.getPrototypeOf(base),
        base.loc,
        ud,
        reduce(base.children, function(o, key) { o[key] = base[key]; return o; }, {}),
        reduce(base.attributes, function(o, key) { o[key] = base[key]; return o; }, {}));
};

/* User Data
 ******************************************************************************/
/**
 * Get a user data entry.
 * 
 * @param node Node to transform.
 * @param key Targeted user data key.
 * 
 * @return Value or null if none.
 */
var getData = function(node, key) {
    return (node.ud ?
        node.ud[key] :
        null);
};

/**
 * Modifies a user data entry.
 * 
 * @param node Node to transform.
 * @param key Targeted user data key.
 * @param f Function mapping current value to new value.
 * 
 * @return Transformed node.
 */
var modifyData = function(node, key, f) {
    return setUserdata(
        node,
        defineProperty(
            (node.ud || {}),
            key, {
                'value': f(getData(node, key)),
                'enumerable': true
            }));
};

/**
 * Set a user data entry.
 * 
 * @param node Node to transform.
 * @param key Targeted user data key.
 * @param value New value.
 * 
 * @return Transformed node.
 */
var setData = function(node, key, value) {
    return modifyData(node, key, function() { return value; });
};

/* Creation
 ******************************************************************************/
var defineNode = function(parent, type, children, attributes, ctor) {
    ctor.type = type;
    ctor.prototype = new parent;
    ctor.prototype.constructor = ctor;
    ctor.prototype.children = children;
    ctor.prototype.attributes = attributes;
    ctor.prototype.type = ctor.type;
    ctor.create = function(/*...*/) {
        return new (ctor.bind.apply(ctor, concatArgs([null], arguments)));
    };
    
    require('ecma_ast/serialization').registerNode(type, ctor);
    return ctor;
};


/* Export
 ******************************************************************************/
exports.Node = Node;

exports.construct = construct;
exports.reconstruct = reconstruct;
exports.modify = modify;
exports.setLoc = setLoc;
exports.setUserData = setUserData;

exports.getData = getData;
exports.modifyData = modifyData;
exports.setData = setData;

exports.defineNode = defineNode;

});
/**
 * @fileOverview ECMAScript clause AST nodes.
 */
define('ecma_ast/clause',['ecma_ast/node'],
function(node){


/**
 * @constructor
 */
var Clause = function() { };
Clause.prototype = new node.Node;

/* Instances
 ******************************************************************************/
/**
 * @constructor
 */
var SwitchCase = node.defineNode(Clause, 'SwitchCase',
    ['test', 'consequent'],
    [],
    function(loc, test, consequent) {
        node.Node.call(this, loc);
        this.test = (test || null);
        this.consequent = consequent;
    });

/**
 * @constructor
 */
var CatchClause = node.defineNode(Clause, 'CatchClause',
    ['param', 'body'],
    [],
    function(loc, param, body) {
        node.Node.call(this, loc);
        this.param = param;
        this.body = body;
    });

/* Export
 ******************************************************************************/
return {
    'SwitchCase': SwitchCase,
    'CatchClause': CatchClause
};

});
/**
 * @fileOverview ECMASscript declaration AST nodes.
 */
define('ecma_ast/declaration',['ecma_ast/node'],
function(node){


/**
 * @constructor
 */
var Declaration = function() { };
Declaration.prototype = new node.Node;

/* Instances
 ******************************************************************************/
/**
 * @constructor
 */
var FunctionDeclaration = node.defineNode(Declaration, 'FunctionDeclaration',
    ['params', 'body'],
    [],
    function(loc, id, params, body) {
        node.Node.call(this, loc);
        this.id = id;
        this.params = params;
        this.body = body;
    });

/**
 * @constructor
 */
var VariableDeclaration = node.defineNode(Declaration, 'VariableDeclaration',
    ['declarations'],
    [],
    function(loc, declarations) {
        node.Node.call(this, loc);
        this.declarations = declarations;
    });

/**
 * VariableDeclarator
 */
var VariableDeclarator = node.defineNode(Declaration, 'VariableDeclarator',
    ['id', 'init'],
    [],
    function(loc, id, init) {
        node.Node.call(this, loc);
        this.id = id;
        this.init = (init || null);
    });

/* Export
 ******************************************************************************/
return {
    'Declaration': Declaration,
    
    'FunctionDeclaration': FunctionDeclaration,
    
    'VariableDeclaration': VariableDeclaration,
    'VariableDeclarator': VariableDeclarator
};

});
/**
 * @fileOverview AST expression Nodes for ECMAScript 5.1 based on the
 *   SpiderMonkey Parser API.
 */
define('ecma_ast/expression',['ecma_ast/node'],
function(node){



/**
 * @constructor
 */
var Expression = function() { };
Expression.prototype = new node.Node;

/* Instances
 ******************************************************************************/
/**
 * @constructor
 */
var ThisExpression = node.defineNode(Expression, 'ThisExpression',
    [],
    [],
    function(loc) {
        node.Node.call(this, loc);
    });

/**
 * @constructor
 */
var SequenceExpression = node.defineNode(Expression, 'SequenceExpression',
    ['expressions'],
    [],
    function(loc, expressions) {
        node.Node.call(this, loc);
        this.expressions = expressions;
    });

/**
 * @constructor
 */
var UnaryExpression = node.defineNode(Expression, 'UnaryExpression',
    ['argument'],
    ['operator'],
    function(loc, operator, argument) {
        node.Node.call(this, loc);
        this.operator = operator;
        this.argument = argument;
    });

/**
 * @constructor
 */
var BinaryExpression = node.defineNode(Expression, 'BinaryExpression',
    ['left', 'right'],
    ['operator'],
    function(loc, operator, left, right) {
        node.Node.call(this, loc);
        this.operator = operator;
        this.left = left;
        this.right = right;
    });

/**
 * @constructor
 */
var AssignmentExpression = node.defineNode(Expression, 'AssignmentExpression',
    ['left', 'right'],
    ['operator'],
    function(loc, operator, left, right) {
        node.Node.call(this, loc);
        this.operator = operator;
        this.left = left;
        this.right = right;
    });

/**
 * @constructor
 */
var UpdateExpression = node.defineNode(Expression, 'UpdateExpression',
    ['argument'],
    ['operator', 'prefix'],
    function(loc, operator, argument, prefix) {
        node.Node.call(this, loc);
        this.operator = operator;
        this.argument = argument;
        this.prefix = prefix;
    });

/**
 * @constructor
 */
var LogicalExpression = node.defineNode(Expression, 'LogicalExpression',
    ['left', 'right'],
    ['operator'],
    function(loc, operator, left, right) {
        node.Node.call(this, loc);
        this.operator = operator;
        this.left = left;
        this.right = right;
    });

/**
 * @constructor
 */
var ConditionalExpression = node.defineNode(Expression, 'ConditionalExpression',
    ['test', 'consequent', 'alternate'],
    [],
    function(loc, test, consequent, alternate) {
        node.Node.call(this, loc);
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    });

/**
 * @constructor
 */
var NewExpression = node.defineNode(Expression, 'NewExpression',
    ['callee', 'args'],
    [],
    function(loc, callee, args) {
        node.Node.call(this, loc);
        this.callee = callee;
        this.args = args;
    });

/**
 * @constructor
 */
var CallExpression = node.defineNode(Expression, 'CallExpression',
    ['callee', 'args'],
    [],
    function(loc, callee, args) {
        node.Node.call(this, loc);
        this.callee = callee;
        this.args = args;
    });

/**
 * @constructor
 */
var MemberExpression = node.defineNode(Expression, 'MemberExpression',
    ['object', 'property'],
    ['computed'],
    function(loc, object, property, computed) {
        node.Node.call(this, loc);
        this.object = object;
        this.property = property;
        this.computed = computed;
    });

/**
 * @constructor
 */
var FunctionExpression = node.defineNode(Expression, 'FunctionExpression',
    ['id', 'params', 'body'],
    [],
    function(loc, id, params, body) {
        node.Node.call(this, loc);
        this.id = (id || null);
        this.params = params;
        this.body = body;
    });

/**
 * @constructor
 */
var ArrayExpression = node.defineNode(Expression, 'ArrayExpression',
    ['elements'],
    [],
    function(loc, elements) {
        node.Node.call(this, loc);
        this.elements = elements;
    });

/**
 * @constructor
 */
var ObjectExpression = node.defineNode(Expression, 'ObjectExpression',
    ['properties'],
    [],
    function(loc, properties) {
        node.Node.call(this, loc);
        this.properties = properties;
    });

/* Export
 ******************************************************************************/
return {
    'Expression': Expression,
    
    'ThisExpression': ThisExpression,
    'SequenceExpression': SequenceExpression,
    'UnaryExpression': UnaryExpression,
    'BinaryExpression': BinaryExpression,
    'AssignmentExpression': AssignmentExpression,
    'UpdateExpression': UpdateExpression,
    'LogicalExpression': LogicalExpression,
    'ConditionalExpression': ConditionalExpression,
    'NewExpression': NewExpression,
    'CallExpression': CallExpression,
    'MemberExpression': MemberExpression,
    
    'FunctionExpression': FunctionExpression,
    'ArrayExpression': ArrayExpression,
    'ObjectExpression': ObjectExpression
};

});
/**
 * @fileOverview ECMAScript program AST nodes.
 */
define('ecma_ast/program',['ecma_ast/node'],
function(node){


/**
 * @constructor
 */
var Program = node.defineNode(node.Node, 'Program',
    ['body'],
    [],
    function(loc, body) {
        node.Node.call(this, loc);
        this.body = body;
    });

/* Export
 ******************************************************************************/
return {
    'Program': Program,
};

});
/**
 * @fileOverview AST statement nodes for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define('ecma_ast/statement',['ecma_ast/node'],
function(node){


/**
 * @constructor
 */
var Statement = function() { };
Statement.prototype = new node.Node;

/* Instances
 ******************************************************************************/
/**
 * @constructor
 */
var EmptyStatement = node.defineNode(Statement, "EmptyStatement",
    [],
    [],
    function(loc) {
        node.Node.call(this, loc);
    });

/**
 * @constructor
 */
var DebuggerStatement = node.defineNode(Statement, "DebuggerStatement",
    [],
    [],
    function(loc) {
        node.Node.call(this, loc);
    });

/**
 * @constructor
 */
var BlockStatement = node.defineNode(Statement, "BlockStatement",
    ['body'],
    [],
    function(loc, body) {
        node.Node.call(this, loc);
        this.body = body;
    });

/**
 * @constructor
 */
var ExpressionStatement =  node.defineNode(Statement, "ExpressionStatement",
    ['expression'],
    [],
    function(loc, expression) {
        node.Node.call(this, loc);
        this.expression = expression;
    });

/**
 * @constructor
 */
var IfStatement = node.defineNode(Statement, "IfStatement",
    ['test', 'consequent', 'alternate'],
    [],
    function(loc, test, consequent, alternate) {
        node.Node.call(this, loc);
        this.test = test;
        this.consequent = consequent;
        this.alternate = (alternate || null);
    });

/**
 * @constructor
 */
var LabeledStatement = node.defineNode(Statement, "LabeledStatement",
    ['body'],
    [],
    function(loc, label, body) {
        node.Node.call(this, loc);
        this.label = label;
        this.body = body;
    });

/**
 * @constructor
 */
var BreakStatement = node.defineNode(Statement, "BreakStatement",
    ['label'],
    [],
    function(loc, label) {
        node.Node.call(this, loc);
        this.label = (label || null);
    });

/**
 * @constructor
 */
var ContinueStatement = node.defineNode(Statement, "ContinueStatement",
    ['label'],
    [],
    function(loc, label) {
        node.Node.call(this, loc);
        this.label = (label || null);
    });

/**
 * @constructor
 */
var WithStatement = node.defineNode(Statement, "WithStatement",
    ['object', 'body'],
    [],
    function(loc, object, body) {
        node.Node.call(this, loc);
        this.object = object;
        this.body = body;
    });

/**
 * @constructor
 */
var SwitchStatement = node.defineNode(Statement, "SwitchStatement",
    ['discriminant', 'cases'],
    [],
    function(loc, discriminant, cases) {
        node.Node.call(this, loc);
        this.discriminant = discriminant;
        this.cases = cases;
    });

/**
 * @constructor
 */
var ReturnStatement = node.defineNode(Statement, "ReturnStatement",
    ['argument'],
    [],
    function(loc, argument) {
        node.Node.call(this, loc);
        this.argument = (argument || null);
    });

/**
 * @constructor
 */
var ThrowStatement = node.defineNode(Statement, "ThrowStatement",
    ['argument'],
    [],
    function(loc, argument) {
        node.Node.call(this, loc);
        this.argument = argument;
    });

/**
 * @constructor
 */
var TryStatement = node.defineNode(Statement, "TryStatement",
    ['block', 'handler', 'finalizer'],
    [],
    function(loc, block, handler, finalizer) {
        node.Node.call(this, loc);
        this.block = block;
        this.handler = handler;
        this.finalizer = finalizer;
    });

/**
 * @constructor
 */
var WhileStatement = node.defineNode(Statement, "WhileStatement",
    ['test', 'body'],
    [],
    function(loc, test, body) {
        node.Node.call(this, loc);
        this.test = test;
        this.body = body;
    });

/**
 * @constructor
 */
var DoWhileStatement = node.defineNode(Statement, "DoWhileStatement",
    ['body', 'test'],
    [],
    function(loc, body, test) {
        node.Node.call(this, loc);
        this.test = test;
        this.body = body;
    });

/**
 * @constructor
 */
var ForStatement = node.defineNode(Statement, "ForStatement",
    ['init', 'test', 'update', 'body'],
    [],
    function(loc, init, test, update, body) {
        node.Node.call(this, loc);
        this.init = (init || null);
        this.test = (test || null);
        this.update = (update || null);
        this.body = body;
    });

/**
 * @constructor
 */
var ForInStatement = node.defineNode(Statement, "ForInStatement",
    ['left', 'right', 'body'],
    [],
    function(loc, left, right, body) {
        node.Node.call(this, loc);
        this.left = left;
        this.right = right;
        this.body = body;
    });

/* Export
 ******************************************************************************/
return {
    'Statement': Statement,
    
    'EmptyStatement': EmptyStatement,
    'DebuggerStatement': DebuggerStatement,
    'BlockStatement': BlockStatement,
    'ExpressionStatement': ExpressionStatement,
    'IfStatement': IfStatement,
    'LabeledStatement': LabeledStatement,
    'BreakStatement': BreakStatement,
    'ContinueStatement': ContinueStatement,
    'WithStatement': WithStatement,
    'SwitchStatement': SwitchStatement,
    'ReturnStatement': ReturnStatement,
    
    'ThrowStatement': ThrowStatement,
    'TryStatement': TryStatement,
    
    'WhileStatement': WhileStatement,
    'DoWhileStatement': DoWhileStatement,
    'ForStatement': ForStatement,
    'ForInStatement': ForInStatement
};

});
/**
 * @fileOverview AST clause for ECMAScript 5.1 based on the
 * SpiderMonkey Parser API.
 */
define('ecma_ast/value',['ecma_ast/node'],
function(node){


/* 
 ******************************************************************************/
/**
 * @constructor
 */
var Identifier = node.defineNode(node.Node, 'Identifier',
    [],
    ['name'],
    function(loc, name) {
        node.Node.call(this, loc);
        this.name = name;
    });

/**
 * @constructor
 */
var Literal = node.defineNode(node.Node, 'Literal',
    [],
    ['kind', 'value'],
    function(loc, kind, value) {
        node.Node.call(this, loc);
        this.kind = kind
        this.value = value;
    });

/**
 * @constructor
 */
var ObjectValue = node.defineNode(node.Node, 'ObjectValue',
    ['key', 'value'],
    [],
    function(loc, key, value) {
        node.Node.call(this, key, value);
        this.key = key;
        this.value = value;
    });

/**
 * @constructor
 */
var ObjectGetter = node.defineNode(node.Node, 'ObjectGetter',
    ['key', 'value'],
    [],
    function(loc, key, value) {
        node.Node.call(this, key, value);
        this.key = key;
        this.value = value;
    });

/**
 * @constructor
 */
var ObjectSetter = node.defineNode(node.Node, 'ObjectSetter',
    ['key', 'value'],
    [],
    function(loc, key, value) {
        node.Node.call(this, key, value);
        this.key = key;
        this.value = value;
    });

/* 
 ******************************************************************************/

/* Export
 ******************************************************************************/
return {
    'Identifier': Identifier,
    'Literal': Literal,
    
    'ObjectValue': ObjectValue,
    'ObjectGetter': ObjectGetter,
    'ObjectSetter': ObjectSetter
};

});
/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/package_manager/amd.kep'
 * DO NOT EDIT
*/
define('khepri/compile/package_manager/amd',["require", "exports", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/pattern",
    "khepri_ast/statement", "khepri_ast/value"
], (function(require, exports, ast_declaration, ast_expression, ast_pattern, ast_statement, ast_value) {
    
    var definePackage, concat = Function.prototype.call.bind(Array.prototype.concat),
        map = Function.prototype.call.bind(Array.prototype.map),
        path = (function(path) {
            return path.split("::")
                .join("/");
        });
    (definePackage = (function(loc, exports, imports, targets, body) {
        var exportHeader = ast_declaration.VariableDeclaration.create(null, map(exports, (function(x) {
            return ast_declaration.VariableDeclarator.create(null, ast_value.Identifier.create(
                null, x));
        }))),
            exportBody = map(exports, (function(x) {
                return ast_statement.ExpressionStatement.create(null, ast_expression.AssignmentExpression
                    .create(null, "=", ast_expression.MemberExpression.create(null, ast_value.Identifier
                            .create(null, "exports"), ast_value.Identifier.create(null, x)),
                        ast_value.Identifier.create(null, x)));
            })),
            packageBody = ast_expression.FunctionExpression.create(null, null, ast_pattern.ArgumentsPattern
                .create(null, null, concat(ast_pattern.IdentifierPattern.create(null, ast_value.Identifier
                    .create(null, "require")), ast_pattern.IdentifierPattern.create(null,
                    ast_value.Identifier.create(null, "exports")), map(imports, (function(x) {
                    return targets[x.from.value];
                })))), ast_statement.BlockStatement.create(body.loc, concat(ast_statement.ExpressionStatement
                    .create(null, ast_value.Literal.create(null, "string", "use strict")),
                    exportHeader, body, exportBody)));
        return ast_statement.ExpressionStatement.create(loc, ast_expression.CallExpression.create(loc,
            ast_value.Identifier.create(null, "define"), [ast_expression.ArrayExpression.create(
                null, concat(ast_value.Literal.create(null, "string", "require"), ast_value.Literal
                    .create(null, "string", "exports"), map(imports, (function(x) {
                        return ast_value.Literal.create(null, "string", path(x.from.value));
                    })))), packageBody]));
    }));
    (exports.definePackage = definePackage);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/package_manager/node.kep'
 * DO NOT EDIT
*/
define('khepri/compile/package_manager/node',["require", "exports", "khepri_ast/declaration", "khepri_ast/expression", "khepri_ast/statement",
    "khepri_ast/value"
], (function(require, exports, ast_declaration, ast_expression, ast_statement, ast_value) {
    
    var definePackage, concat = Function.prototype.call.bind(Array.prototype.concat),
        map = Function.prototype.call.bind(Array.prototype.map),
        path = (function(path) {
            var segs = path.split("::");
            return segs.slice(1)
                .reduce((function(p, c) {
                    return ast_expression.MemberExpression.create(null, p, ast_value.Literal.create(
                        null, "string", c), true);
                }), ast_expression.CallExpression.create(null, ast_value.Identifier.create(null,
                    "require"), [ast_value.Literal.create(null, "string", segs[0])]));
        });
    (definePackage = (function(loc, exports, imports, targets, body) {
        var exportHeader = ast_declaration.VariableDeclaration.create(null, map(exports, (function(x) {
            return ast_declaration.VariableDeclarator.create(null, ast_value.Identifier.create(
                null, x));
        }))),
            exportBody = map(exports, (function(x) {
                return ast_statement.ExpressionStatement.create(null, ast_expression.AssignmentExpression
                    .create(null, "=", ast_expression.MemberExpression.create(null, ast_value.Identifier
                            .create(null, "exports"), ast_value.Identifier.create(null, x)),
                        ast_value.Identifier.create(null, x)));
            }));
        return ast_statement.BlockStatement.create(body.loc, [ast_statement.ExpressionStatement.create(
                null, ast_value.Literal.create(null, "string", "use strict")), ast_statement.WithStatement
            .create(null, map(imports, (function(x) {
                return ast_declaration.Binding.create(null, x.pattern, path(x.from.value));
            })), ast_statement.BlockStatement.create(null, concat(exportHeader, body.body,
                exportBody)))
        ]);
    }));
    (exports.definePackage = definePackage);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/transform.kep'
 * DO NOT EDIT
*/
define('khepri/compile/transform',["require", "exports", "ecma_ast/clause", "ecma_ast/declaration", "ecma_ast/expression", "ecma_ast/node",
    "ecma_ast/program", "ecma_ast/statement", "ecma_ast/value", "khepri_ast/clause", "khepri_ast/declaration",
    "khepri_ast/expression", "khepri_ast/node", "khepri_ast/pattern", "khepri_ast/program", "khepri_ast/statement",
    "khepri_ast/value", "khepri/compile/package_manager/amd", "khepri/compile/package_manager/node"
], (function(require, exports, ecma_clause, ecma_declaration, ecma_expression, ecma_node, ecma_program,
    ecma_statement, ecma_value, khepri_clause, khepri_declaration, khepri_expression, khepri_node,
    khepri_pattern, khepri_program, khepri_statement, khepri_value, _, _0) {
    
    var setUserData = khepri_node["setUserData"],
        transform, transformStage, concat = Function.prototype.call.bind(Array.prototype.concat),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        filter = (function(f, a) {
            return Array.prototype.filter.call(a, f);
        }),
        map = (function(f, a) {
            return Array.prototype.map.call(a, f);
        }),
        flatten = (function(x) {
            return (Array.isArray(x) ? reduce(x, (function(p, c, _) {
                return p.concat(c);
            }), []) : x);
        }),
        isStrict = (function(elems) {
            if (((elems && elems.length) && (elems[0].type === "ExpressionStatement"))) {
                var first = elems[0].expression;
                return (((first && (first.type === "Literal")) && (first.kind === "string")) && (first.value ===
                    "use strict"));
            }
            return false;
        }),
        expressionStatement, _transform, identifier = (function(loc, name) {
            return ecma_value.Identifier.create(loc, name);
        }),
        stringLiteral = (function(loc, value) {
            return ecma_value.Literal.create(loc, "string", value);
        }),
        nullLiteral = (function(loc) {
            return ecma_value.Literal.create(loc, "null", null);
        }),
        variableDeclaration = (function(loc, declarations) {
            return ecma_declaration.VariableDeclaration.create(loc, _transform(declarations));
        }),
        variableDeclarator = (function(loc, id, init) {
            return ecma_declaration.VariableDeclarator.create(loc, _transform(id), _transform(init));
        }),
        innerPattern = (function() {
            var objectElementUnpack = (function(base, pattern, key, f) {
                var innerBase = khepri_expression.MemberExpression.create(null, base, key, true);
                return (pattern ? flatten(innerPattern(innerBase, pattern, f)) : f(identifier(null, key
                    .value), innerBase));
            });
            return (function(base, pattern, f) {
                switch (pattern.type) {
                    case "IdentifierPattern":
                        return f(identifier(null, pattern.id.name), base);
                    case "AsPattern":
                        return concat(f(pattern.id, base), flatten(innerPattern(pattern.id, pattern.target,
                            f)));
                    case "ObjectPattern":
                        return flatten(map((function(__o) {
                            var target = __o["target"],
                                key = __o["key"];
                            return objectElementUnpack(pattern.ud.id, target, key, f);
                        }), pattern.elements));
                    default:
                        return [];
                }
            });
        })(),
        unpack = (function() {
            var make = variableDeclarator.bind(null, null);
            return (function(pattern, value) {
                return flatten(innerPattern(value, pattern, make));
            });
        })(),
        identifierPattern = (function(loc, name) {
            return identifier(loc, name);
        }),
        callExpression = (function(loc, callee, args) {
            return ecma_expression.CallExpression.create(loc, _transform(callee), _transform(args));
        }),
        memberExpression = (function(loc, object, property, computed) {
            return ecma_expression.MemberExpression.create(loc, _transform(object), _transform(property),
                computed);
        }),
        blockStatement = (function(loc, body) {
            return ecma_statement.BlockStatement.create(loc, _transform(body));
        });
    (expressionStatement = (function(loc, expression) {
        return ecma_statement.ExpressionStatement.create(loc, _transform(expression));
    }));
    var returnStatement = (function(loc, argument) {
        return ecma_statement.ReturnStatement.create(loc, _transform(argument));
    }),
        withStatement = (function(loc, bindings, body) {
            var vars = flatten(map((function(imp) {
                var base = ((imp.type === "ImportPattern") ? callExpression(null, identifier(
                    null, "require"), [imp.from]) : imp.value);
                return unpack(imp.pattern, base);
            }), bindings)),
                prefix = variableDeclaration(null, vars);
            return blockStatement(loc, concat(prefix, body.body));
        }),
        functionExpression = (function(loc, id, parameters, body) {
            var params = _transform(filter((function(x) {
                return (x.type !== "EllipsisPattern");
            }), parameters.elements)),
                elementsPrefix = flatten(map((function(x) {
                    switch (x.type) {
                        case "IdentifierPattern":
                            return [];
                        case "AsPattern":
                            return innerPattern(_transform(x.id), x.target, variableDeclarator.bind(
                                null, null));
                        default:
                            return innerPattern(_transform(x), x, variableDeclarator.bind(null,
                                null));
                    }
                }), parameters.elements)),
                argumentsPrefix = concat((parameters.self ? variableDeclarator(null, _transform(parameters.self),
                    ecma_expression.ThisExpression.create(null)) : []), (parameters.id ?
                    variableDeclarator(null, _transform(parameters.id), identifier(null, "arguments")) : []
                )),
                strict = isStrict(body.body),
                prefix = concat(elementsPrefix, argumentsPrefix);
            return ecma_expression.FunctionExpression.create(loc, _transform(id), params, blockStatement(
                body.loc, concat((strict ? khepri_statement.ExpressionStatement.create(null,
                        khepri_value.Literal.create(null, "string", "use strict")) : []),
                    variableDeclaration(null, prefix), (function() {
                        var block = _transform(body)
                            .body;
                        return (strict ? block.slice(1) : block);
                    })())));
        }),
        letExpression = (function(loc, bindings, body) {
            return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(
                null, null, []), blockStatement(null, [withStatement(null, bindings, blockStatement(
                null, [returnStatement(null, body)]))])), []);
        }),
        curryExpression = (function(loc, base, args) {
            return callExpression(null, memberExpression(null, base, identifier(null, "bind")), concat(
                nullLiteral(null), args));
        }),
        assignmentExpression = (function(loc, operator, left, right) {
            return ecma_expression.AssignmentExpression.create(loc, operator, _transform(left), _transform(
                right));
        }),
        pipeline = (function(loc, value, target) {
            return callExpression(loc, target, [value]);
        }),
        singleCompose = (function(loc, f, g) {
            return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(
                null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "f")),
                    khepri_pattern.IdentifierPattern.create(null, identifier(null, "g"))
                ]), blockStatement(null, [returnStatement(null, functionExpression(null, null,
                khepri_pattern.ArgumentsPattern.create(null, null, [khepri_pattern.IdentifierPattern
                    .create(null, identifier(null, "x"))
                ]), blockStatement(null, [returnStatement(null, callExpression(null,
                    identifier(null, "f"), [callExpression(null, identifier(
                        null, "g"), [identifier(null, "x")])]))])))])), [f, g]);
        }),
        multiCompose = (function(loc, f, g) {
            return callExpression(loc, functionExpression(null, null, khepri_pattern.ArgumentsPattern.create(
                null, null, [khepri_pattern.IdentifierPattern.create(null, identifier(null, "f")),
                    khepri_pattern.IdentifierPattern.create(null, identifier(null, "g"))
                ]), blockStatement(null, [returnStatement(null, functionExpression(null, null,
                khepri_pattern.ArgumentsPattern.create(null, null, []), blockStatement(
                    null, [returnStatement(null, callExpression(null, identifier(null,
                        "f"), [callExpression(null, memberExpression(null,
                        identifier(null, "g"), identifier(null,
                            "apply")), [nullLiteral(null),
                        identifier(null, "arguments")
                    ])]))])))])), [f, g]);
        }),
        packageManager, packageBlock = (function(loc, exports, body) {
            var imports = ((body.type === "WithStatement") ? filter((function(x) {
                return (x.type === "ImportPattern");
            }), body.bindings) : []),
                exportedNames = map((function(x) {
                    return x.id.name;
                }), exports.exports),
                targets = reduce(imports, (function(p, c) {
                    (p[c.from.value] = c.pattern);
                    return p;
                }), ({})),
                fBody = ((body.type === "WithStatement") ? khepri_statement.WithStatement.create(null,
                    filter((function(x) {
                        return (x.type !== "ImportPattern");
                    }), body.bindings), body.body) : body);
            return _transform(packageManager.definePackage(loc, exportedNames, imports, targets, fBody));
        }),
        transformers = ({}),
        addTransform = (function(target, f) {
            (transformers[target] = f);
        });
    addTransform("VariableDeclaration", (function(node) {
        return variableDeclaration(node.loc, node.declarations);
    }));
    addTransform("VariableDeclarator", (function(node) {
        return variableDeclarator(node.loc, node.id, node.init);
    }));
    addTransform("StaticDeclaration", (function(node) {
        return ecma_statement.EmptyStatement.create(node.loc);
    }));
    addTransform("CatchClause", (function(node) {
        return ecma_clause.CatchClause.create(node.loc, _transform(node.param), _transform(node.body));
    }));
    addTransform("SwitchCase", (function(node) {
        return ecma_clause.SwitchCase.create(node.loc, _transform(node.test), _transform(node.consequent));
    }));
    addTransform("BlockStatement", (function(node) {
        return blockStatement(node.loc, node.body);
    }));
    addTransform("ExpressionStatement", (function(node) {
        return expressionStatement(node.loc, node.expression);
    }));
    addTransform("IfStatement", (function(node) {
        return ecma_statement.IfStatement.create(node.loc, _transform(node.test), _transform(node.consequent),
            _transform(node.alternate));
    }));
    addTransform("WithStatement", (function(node) {
        return withStatement(node.loc, node.bindings, node.body);
    }));
    addTransform("SwitchStatement", (function(node) {
        return ecma_statement.SwitchStatement.create(node.loc, _transform(node.discriminant),
            _transform(node.cases));
    }));
    addTransform("ReturnStatement", (function(node) {
        return returnStatement(node.loc, node.argument);
    }));
    addTransform("ThrowStatement", (function(node) {
        return ecma_statement.ThrowStatement.create(node.loc, _transform(node.argument));
    }));
    addTransform("BreakStatement", (function(node) {
        return ecma_statement.BreakStatement.create(node.loc, null);
    }));
    addTransform("ContinueStatement", (function(node) {
        return ecma_statement.ThrowStatement.create(node.loc, null);
    }));
    addTransform("TryStatement", (function(node) {
        return ecma_statement.TryStatement.create(node.loc, _transform(node.block), _transform(node.handler),
            _transform(node.finalizer));
    }));
    addTransform("WhileStatement", (function(node) {
        return ecma_statement.WhileStatement.create(node.loc, _transform(node.test), _transform(node.body));
    }));
    addTransform("DoWhileStatement", (function(node) {
        return ecma_statement.DoWhileStatement.create(node.loc, _transform(node.body), _transform(node.test));
    }));
    addTransform("ForStatement", (function(node) {
        return ecma_statement.ForStatement.create(node.loc, _transform(node.init), _transform(node.test),
            _transform(node.update), _transform(node.body));
    }));
    addTransform("AssignmentExpression", (function(node) {
        return assignmentExpression(node.loc, node.operator, node.left, node.right);
    }));
    addTransform("UnaryExpression", (function(node) {
        return ecma_expression.UnaryExpression.create(node.loc, node.operator, _transform(node.argument));
    }));
    addTransform("BinaryExpression", (function(node) {
        switch (node.operator) {
            case "\\>":
                return singleCompose(node.loc, node.right, node.left);
            case "\\>>":
                return multiCompose(node.loc, node.right, node.left);
            case "<\\":
                return singleCompose(node.loc, node.left, node.right);
            case "<<\\":
                return multiCompose(node.loc, node.left, node.right);
            case "|>":
                return pipeline(node.loc, node.left, node.right);
            case "<|":
                return pipeline(node.loc, node.right, node.left);
            default:
                return ecma_expression.BinaryExpression.create(node.loc, node.operator, _transform(node
                    .left), _transform(node.right));
        }
    }));
    addTransform("LogicalExpression", (function(node) {
        return ecma_expression.LogicalExpression.create(node.loc, node.operator, _transform(node.left),
            _transform(node.right));
    }));
    addTransform("ConditionalExpression", (function(node) {
        return ecma_expression.ConditionalExpression.create(node.loc, _transform(node.test), _transform(
            node.consequent), _transform(node.alternate));
    }));
    addTransform("NewExpression", (function(node) {
        return ecma_expression.NewExpression.create(node.loc, _transform(node.callee), _transform(node.args));
    }));
    addTransform("CallExpression", (function(node) {
        return callExpression(node.loc, node.callee, node.args);
    }));
    addTransform("MemberExpression", (function(node) {
        return ecma_expression.MemberExpression.create(node.loc, _transform(node.object), _transform(
            node.property), node.computed);
    }));
    addTransform("LetExpression", (function(node) {
        return letExpression(node.loc, node.bindings, node.body);
    }));
    addTransform("CurryExpression", (function(node) {
        return curryExpression(node.loc, node.base, node.args);
    }));
    addTransform("UnaryOperatorExpression", (function(node) {
        return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "x"))
        ]), blockStatement(null, [returnStatement(null, khepri_expression.UnaryExpression.create(
            null, node.op, identifier(null, "x")))]));
    }));
    addTransform("BinaryOperatorExpression", (function(node) {
        var kind = (((node.op === "||") || (node.op === "&&")) ? khepri_expression.LogicalExpression :
            khepri_expression.BinaryExpression);
        return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "y"))
        ]), blockStatement(null, [returnStatement(null, kind.create(null, node.op, identifier(null,
            "x"), identifier(null, "y")))]));
    }));
    addTransform("TernaryOperatorExpression", (function(node) {
        return functionExpression(node.loc, null, khepri_pattern.ArgumentsPattern.create(null, null, [
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "x")),
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "y")),
            khepri_pattern.IdentifierPattern.create(null, identifier(null, "z"))
        ]), blockStatement(null, [returnStatement(null, khepri_expression.ConditionalExpression.create(
            null, identifier(null, "x"), identifier(null, "y"), identifier(null, "z")))]));
    }));
    addTransform("FunctionExpression", (function(node) {
        return functionExpression(node.loc, node.id, node.params, node.body);
    }));
    addTransform("ArrayExpression", (function(node) {
        return ecma_expression.ArrayExpression.create(node.loc, _transform(node.elements));
    }));
    addTransform("ObjectExpression", (function(node) {
        return ecma_expression.ObjectExpression.create(node.loc, _transform(node.properties));
    }));
    addTransform("ObjectValue", (function(node) {
        return ecma_value.ObjectValue.create(node.loc, _transform(node.key), _transform(node.value));
    }));
    addTransform("ArgumentsPattern", (function(node) {
        return identifier(node.loc, node.id.name);
    }));
    addTransform("IdentifierPattern", (function(node) {
        return identifier(node.loc, node.id.name);
    }));
    addTransform("AsPattern", (function(node) {
        return _transform(node.id);
    }));
    addTransform("ArrayPattern", (function(node) {
        return _transform(node.ud.id);
    }));
    addTransform("ObjectPattern", (function(node) {
        return _transform(node.ud.id);
    }));
    addTransform("EllipsisPattern", (function(node) {
        return ((node.ud && node.ud.id) ? _transform(node.ud.id) : null);
    }));
    addTransform("SinkPattern", (function(node) {
        return ((node.ud && node.ud.id) ? _transform(node.ud.id) : null);
    }));
    addTransform("Program", (function(node) {
        return ecma_program.Program.create(node.loc, (Array.isArray(node.body) ? _transform(node.body) : [
            _transform(node.body)
        ]));
    }));
    addTransform("Package", (function(node) {
        return packageBlock(node.loc, node.exports, node.body);
    }));
    (_transform = (function(node) {
        if (!node) return node;
        if (Array.isArray(node)) return map(_transform, node);
        if (!(node instanceof khepri_node.Node)) return node;
        var t = transformers[node.type];
        if (!t) return node;
        return t(node);
    }));
    (transform = (function(__o) {
        var options = __o["options"],
            ast = __o["ast"];
        (packageManager = require("khepri/compile/package_manager/amd"));
        if ((options.package_manager === "node"))(packageManager = require(
            "khepri/compile/package_manager/node"));
        return ({
            "options": options,
            "ast": _transform(ast)
        });
    }));
    (exports.transform = transform);
    (exports.transformStage = transformStage);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/select.kep'
 * DO NOT EDIT
*/
define('nu-stream/select',["require", "exports", "./stream"], (function(require, exports, __o) {
    
    var NIL = __o["NIL"],
        first = __o["first"],
        isEmpty = __o["isEmpty"],
        map = __o["map"],
        stream = __o["stream"],
        rest = __o["rest"],
        indexed = __o["indexed"];
    var takeWhile, take, skipWhile, skip;
    var value = (function(__o0) {
        var i = __o0[0],
            x = __o0[1];
        return x;
    });
    var index = (function(__o0) {
        var i = __o0[0],
            x = __o0[1];
        return i;
    });
    (takeWhile = (function(pred, s) {
        return (isEmpty(s) ? s : (function() {
                var x = first(s);
                return (pred(x) ? stream(x, takeWhile.bind(null, pred, rest(s))) : NIL);
            })
            .call(this));
    }));
    (take = (function(count, s) {
        return ((isNaN(count) || (count < 0)) ? s : map(value, takeWhile((function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })((function(x, y) {
                return (x > y);
            })
            .bind(null, count), index), indexed(s))));
    }));
    (skipWhile = (function(pred, s) {
        for (var head = s; !isEmpty(head);
            (head = rest(head)))
            if (!pred(first(head))) return head;
        return NIL;
    }));
    (skip = (function(count, s) {
        return ((isNaN(count) || (count <= 0)) ? s : map(value, skipWhile((function(f, g) {
            return (function(x) {
                return f(g(x));
            });
        })((function(x, y) {
                return (x > y);
            })
            .bind(null, count), index), indexed(s))));
    }));
    (exports.takeWhile = takeWhile);
    (exports.take = take);
    (exports.skipWhile = skipWhile);
    (exports.skip = skip);
}));
define('neith/zipper',["require", "exports", "nu-stream/stream", "nu-stream/select"], (function(require, exports, __o, __o0) {
    
    var path, lefts, rights, children, parent, hasChildren, hasParent, isRoot, isChild, isLeaf, isFirst, isLast,
            up, down, left, right, root, leftmost, rightmost, leftLeaf, rightLeaf, nextUpDfs, nextDfs, prevDfs,
            extract, replace, modify, remove, setLefts, modifyLefts, setRights, modifyRights, insertLeft,
            insertRight, insertChild, appendChild, zipper;
    var __o = __o,
        append = __o["append"],
        cons = __o["cons"],
        first = __o["first"],
        rest = __o["rest"],
        isEmpty = __o["isEmpty"],
        NIL = __o["NIL"],
        foldl = __o["foldl"],
        reverse = __o["reverse"],
        __o0 = __o0,
        skip = __o0["skip"];
    var flip = (function(f) {
        return (function(x, y) {
            return f(y, x);
        });
    });
    var Context = (function(loc, children, constructNode) {
        (this.loc = loc);
        (this.children = children);
        (this.constructNode = constructNode);
    });
    (Context.setLoc = (function(ctx, loc) {
        return new(Context)(loc, ctx.children, ctx.constructNode);
    }));
    var Loc = (function(focus, parent, path, left, right) {
        (this.focus = focus);
        (this.parent = parent);
        (this.path = path);
        (this.left = left);
        (this.right = right);
    });
    (Loc.empty = new(Loc)(null, null, NIL, NIL, NIL));
    (Loc.setFocus = (function(loc, focus) {
        return new(Loc)(focus, loc.parent, loc.path, loc.left, loc.right);
    }));
    (Loc.setLeft = (function(loc, left) {
        return new(Loc)(loc.focus, loc.parent, loc.path, left, loc.right);
    }));
    (Loc.setRight = (function(loc, right) {
        return new(Loc)(loc.focus, loc.parent, loc.path, loc.left, right);
    }));
    (Loc.setSurround = (function(loc, left, focus, right) {
        return Loc.setRight(Loc.setLeft(Loc.setFocus(loc, focus), left), right);
    }));
    var getLoc = (function(ctx) {
        return ctx.loc;
    });
    var setLoc = (function(ctx, loc) {
        return Context.setLoc(ctx, loc);
    });
    var modifyLoc = (function(ctx, f) {
        return setLoc(ctx, f(getLoc(ctx)));
    });
    var setFocus = (function(ctx, f) {
        return modifyLoc(ctx, (function(loc) {
            return Loc.setFocus(loc, f);
        }));
    });
    var getPath = (function(ctx) {
        return getLoc(ctx)
            .path;
    });
    var pushPath = (function(x, ctx) {
        return cons(x, getPath(ctx));
    });
    var construct = (function(ctx, parent, children) {
        return ctx.constructNode(parent, children);
    });
    var constructParent = (function(ctx) {
        return construct(ctx, parent(ctx)
            .focus, append(reverse(lefts(ctx)), cons(extract(ctx), NIL), rights(ctx)));
    });
    (extract = (function(ctx) {
        return getLoc(ctx)
            .focus;
    }));
    (path = (function(ctx) {
        return cons(extract(ctx), getPath(ctx));
    }));
    (lefts = (function(ctx) {
        return getLoc(ctx)
            .left;
    }));
    (rights = (function(ctx) {
        return getLoc(ctx)
            .right;
    }));
    (children = (function(ctx) {
        return ctx.children(extract(ctx));
    }));
    (parent = (function(ctx) {
        return getLoc(ctx)
            .parent;
    }));
    (hasChildren = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(x) {
        return !x;
    }), isEmpty), children));
    (hasParent = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(x, y) {
            return (x !== y);
        })
        .bind(null, null), parent));
    (isRoot = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(x) {
        return !x;
    }), hasParent));
    (isChild = hasParent);
    (isLeaf = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(x) {
        return !x;
    }), hasChildren));
    (isFirst = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(isEmpty, lefts));
    (isLast = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(isEmpty, rights));
    (up = (function(ctx) {
        return (isRoot(ctx) ? null : setLoc(ctx, Loc.setFocus(parent(ctx), constructParent(ctx))));
    }));
    (down = (function(ctx) {
        return (isLeaf(ctx) ? null : setLoc(ctx, (function() {
                var cs = children(ctx);
                return new(Loc)(first(cs), getLoc(ctx), pushPath(extract(ctx), ctx), NIL, rest(
                    cs));
            })
            .call(this)));
    }));
    (left = (function(ctx) {
        return (isFirst(ctx) ? null : setLoc(ctx, (function() {
                var ls = lefts(ctx);
                return Loc.setSurround(getLoc(ctx), rest(ls), first(ls), cons(extract(ctx),
                    rights(ctx)));
            })
            .call(this)));
    }));
    (right = (function(ctx) {
        return (isLast(ctx) ? null : setLoc(ctx, (function() {
                var rs = rights(ctx);
                return Loc.setSurround(getLoc(ctx), cons(extract(ctx), lefts(ctx)), first(rs),
                    rest(rs));
            })
            .call(this)));
    }));
    (root = (function(ctx) {
        var parent = up(ctx);
        return (parent ? root(parent) : ctx);
    }));
    (leftmost = (function(ctx) {
        var l = left(ctx);
        return (l ? leftmost(l) : ctx);
    }));
    (rightmost = (function(ctx) {
        var r = right(ctx);
        return (r ? rightmost(r) : ctx);
    }));
    (leftLeaf = (function(ctx) {
        var child = down(ctx);
        return (child ? leftLeaf(child) : ctx);
    }));
    (rightLeaf = (function(ctx) {
        var child = down(ctx);
        return (child ? rightLeaf(rightmost(child)) : ctx);
    }));
    (nextUpDfs = (function(ctx) {
        var parent = up(ctx);
        return (parent ? (right(parent) || nextUpDfs(parent)) : parent);
    }));
    (nextDfs = (function(ctx) {
        return ((down(ctx) || right(ctx)) || nextUpDfs(ctx));
    }));
    (prevDfs = (function(ctx) {
        var l = left(ctx);
        return (l ? rightLeaf(l) : up(ctx));
    }));
    (replace = flip(setFocus));
    (modify = (function(f, ctx) {
        return replace(f(extract(ctx)), ctx);
    }));
    (remove = (function(ctx) {
        return (isLast(ctx) ? (isFirst(ctx) ? (hasParent(ctx) ? constructParent(ctx) : null) :
            setRights(NIL, left(ctx))) : modifyLefts(skip.bind(null, 2), right(ctx)));
    }));
    (setLefts = (function(ls, ctx) {
        return modifyLoc(ctx, (function(loc) {
            return Loc.setLeft(loc, ls);
        }));
    }));
    (modifyLefts = (function(f, ctx) {
        return setLefts(f(lefts(ctx)), ctx);
    }));
    (setRights = (function(rs, ctx) {
        return modifyLoc(ctx, (function(loc) {
            return Loc.setRight(loc, rs);
        }));
    }));
    (modifyRights = (function(f, ctx) {
        return setRights(f(rights(ctx)), ctx);
    }));
    (insertLeft = (function(node, ctx) {
        return modifyLefts(cons.bind(null, node), ctx);
    }));
    (insertRight = (function(node, ctx) {
        return modifyRights(cons.bind(null, node), ctx);
    }));
    (insertChild = (function(node, ctx) {
        return (hasChildren(ctx) ? up(insertLeft(node, down(ctx))) : replace(construct(ctx, extract(ctx),
            cons(node, NIL)), ctx));
    }));
    (appendChild = (function(node, ctx) {
        return (hasChildren(ctx) ? up(insertRight(node, rightmost(down(ctx)))) : insertChild(node, ctx));
    }));
    (zipper = (function(children, constructNode, focus) {
        return new(Context)(Loc.setFocus(Loc.empty, focus), children, constructNode);
    }));
    (exports.path = path);
    (exports.lefts = lefts);
    (exports.rights = rights);
    (exports.children = children);
    (exports.parent = parent);
    (exports.hasChildren = hasChildren);
    (exports.hasParent = hasParent);
    (exports.isRoot = isRoot);
    (exports.isChild = isChild);
    (exports.isLeaf = isLeaf);
    (exports.isFirst = isFirst);
    (exports.isLast = isLast);
    (exports.up = up);
    (exports.down = down);
    (exports.left = left);
    (exports.right = right);
    (exports.root = root);
    (exports.leftmost = leftmost);
    (exports.rightmost = rightmost);
    (exports.leftLeaf = leftLeaf);
    (exports.rightLeaf = rightLeaf);
    (exports.nextUpDfs = nextUpDfs);
    (exports.nextDfs = nextDfs);
    (exports.prevDfs = prevDfs);
    (exports.extract = extract);
    (exports.replace = replace);
    (exports.modify = modify);
    (exports.remove = remove);
    (exports.setLefts = setLefts);
    (exports.modifyLefts = modifyLefts);
    (exports.setRights = setRights);
    (exports.modifyRights = modifyRights);
    (exports.insertLeft = insertLeft);
    (exports.insertRight = insertRight);
    (exports.insertChild = insertChild);
    (exports.appendChild = appendChild);
    (exports.zipper = zipper);
}));
define('neith/tree',["require", "exports", "./zipper", "nu-stream/stream", "nu-stream/select"], (function(require, exports, zipper,
    stream, __o) {
    
    var edgePath, nodePath, node, edge, childNode, parentNode, childNodes, child, nthChild, sibling, setNode,
            modifyNode, setEdge, modifyEdge, insertLeft, insertRight, insertChild, appendChild, treeZipper;
    var zipper = zipper,
        right = zipper["right"],
        left = zipper["left"],
        up = zipper["up"],
        down = zipper["down"],
        stream = stream,
        cons = stream["cons"],
        first = stream["first"],
        foldl = stream["foldl"],
        indexed = stream["indexed"],
        isStream = stream["isStream"],
        map = stream["map"],
        toArray = stream["toArray"],
        __o = __o,
        skip = __o["skip"];
    var toStream = (function(s) {
        return (isStream(s) ? s : stream.from(s));
    });
    var indexOf = (function(e, s) {
        return foldl((function(p, __o0) {
            var i = __o0[0],
                c = __o0[1];
            return ((p >= 0) ? p : ((c === e) ? i : p));
        }), -1, indexed(s));
    });
    var Pair = (function(key, value) {
        return ({
            "key": key,
            "value": value
        });
    });
    var key = (function(__o0) {
        var key = __o0["key"];
        return key;
    });
    var value = (function(__o0) {
        var value = __o0["value"];
        return value;
    });
    (node = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(value, zipper.extract));
    (edge = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(key, zipper.extract));
    (edgePath = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(map.bind(null, key), zipper.path));
    (nodePath = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(map.bind(null, value), zipper.path));
    (parentNode = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(value, zipper.parent));
    (childNodes = (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(map.bind(null, value), zipper.children));
    (childNode = (function(edge, ctx) {
        var c = child(edge, ctx);
        return (c ? node(c) : null);
    }));
    (nthChild = (function() {
            var goRight = (function(ctx, count) {
                return ((count <= 0) ? ctx : goRight(right(ctx), (count - 1)));
            });
            return (function(index, ctx) {
                var child = down(ctx);
                return (child ? goRight(child, index) : null);
            });
        })
        .call(this));
    (child = (function(edge, ctx) {
        return (!ctx ? null : (function() {
                var children = zipper.children(ctx),
                    index = indexOf(edge, map(key, children));
                return ((index === -1) ? null : nthChild(index, ctx));
            })
            .call(this));
    }));
    (sibling = (function(edge, ctx) {
        return child(edge, up(ctx));
    }));
    (setNode = (function(node, ctx) {
        return zipper.replace(Pair(key(zipper.extract(ctx)), node), ctx);
    }));
    (modifyNode = (function(f, ctx) {
        return setNode(f(node(ctx)), ctx);
    }));
    (setEdge = (function(edge, ctx) {
        return zipper.replace(Pair(key(zipper.extract(ctx)), node), ctx);
    }));
    (modifyEdge = (function(f, ctx) {
        return setNode(f(edge(ctx)), ctx);
    }));
    (insertLeft = (function(edge, node, ctx) {
        return zipper.insertLeft(Pair(edge, node), ctx);
    }));
    (insertRight = (function(edge, node, ctx) {
        return zipper.insertRight(Pair(edge, node), ctx);
    }));
    (insertChild = (function(edge, node, ctx) {
        return zipper.insertChild(Pair(edge, node), ctx);
    }));
    (appendChild = (function(edge, node, ctx) {
        return zipper.appendChild(Pair(edge, node), ctx);
    }));
    (treeZipper = (function() {
            var reducer = (function(p, __o0) {
                var key = __o0["key"],
                    value = __o0["value"];
                (p[key] = value);
                return p;
            });
            return (function(edges, getChild, constructNode, focus) {
                var children = (function(__o0) {
                    var value = __o0["value"];
                    return map((function(x) {
                        return Pair(x, getChild(value, x));
                    }), toStream(edges(value)));
                }),
                    _constructNode = (function(parent, children) {
                        return Pair(key(parent), constructNode(value(parent), children, toArray(map(
                            key, children)), foldl(reducer, ({}), children)));
                    });
                return zipper.zipper(children, _constructNode, Pair(null, focus));
            });
        })
        .call(this));
    (exports.edgePath = edgePath);
    (exports.nodePath = nodePath);
    (exports.node = node);
    (exports.edge = edge);
    (exports.childNode = childNode);
    (exports.parentNode = parentNode);
    (exports.childNodes = childNodes);
    (exports.child = child);
    (exports.nthChild = nthChild);
    (exports.sibling = sibling);
    (exports.setNode = setNode);
    (exports.modifyNode = modifyNode);
    (exports.setEdge = setEdge);
    (exports.modifyEdge = modifyEdge);
    (exports.insertLeft = insertLeft);
    (exports.insertRight = insertRight);
    (exports.insertChild = insertChild);
    (exports.appendChild = appendChild);
    (exports.treeZipper = treeZipper);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/khepri_zipper.kep'
 * DO NOT EDIT
*/
define('khepri_ast_zipper/khepri_zipper',["require", "exports", "neith/tree", "khepri_ast/node"], (function(require, exports, __o, __o0) {
    
    var khepriZipper;
    var __o = __o,
        treeZipper = __o["treeZipper"],
        __o0 = __o0,
        Node = __o0["Node"],
        modify = __o0["modify"];
    var range = (function(end) {
        var a = [];
        for (var i = 0;
            (i < end);
            (i = (i + 1)))(a[i] = i);
        return a;
    });
    var joinKeys = (function(children, values) {
        return children.reduce((function(p, c) {
            (p[c] = values[c]);
            return p;
        }), []);
    });
    (khepriZipper = treeZipper.bind(null, (function(node) {
        return (!node ? [] : (Array.isArray(node) ? range(node.length) : node.children));
    }), (function(n, k) {
        return n[k];
    }), (function(node, _, children, values) {
        return ((node instanceof Node) ? modify(node, values, ({})) : joinKeys(children, values));
    })));
    (exports.khepriZipper = khepriZipper);
}));
define('bes/object',["require", "exports"], (function(require, exports) {
    
    var setProperty, setProperties, deleteProperty, copyProps = (function(obj) {
            var names = Object.getOwnPropertyNames(obj),
                length = names["length"],
                props = ({});
            for (var i = 0;
                (i < length);
                (i = (i + 1))) {
                var key = names[i];
                (props[key] = Object.getOwnPropertyDescriptor(obj, key));
            }
            return props;
        });
    (setProperty = (function(obj, prop, value, enumerable) {
        var props = copyProps(obj),
            current = props[prop];
        (props[prop] = ({
            "value": value,
            "enumerable": ((!current || (enumerable !== undefined)) ? enumerable : current.enumerable)
        }));
        return Object.create(Object.getPrototypeOf(obj), props);
    }));
    (setProperties = (function(obj, properties) {
        var props = copyProps(obj),
            keys = Object.keys(obj);
        for (var i = 0, len = keys.length;
            (i < len);
            (i = (i + 1))) {
            var key = keys[i],
                current = props[key],
                value = properties[key].value,
                enumerable = properties[key].enumerable;
            (props[key] = ({
                "value": value,
                "enumerable": ((!current || (enumerable !== undefined)) ? enumerable : current.enumerable)
            }));
        }
        return Object.create(Object.getPrototypeOf(obj), props);
    }));
    (deleteProperty = (function(obj, name) {
        var props = copyProps(obj);
        delete props[name];
        return Object.create(Object.getPrototypeOf(obj), props);
    }));
    (exports.setProperty = setProperty);
    (exports.setProperties = setProperties);
    (exports.deleteProperty = deleteProperty);
}));
define('bes/record',["require", "exports", "./object"], (function(require, exports, __o) {
    
    var setProperty = __o["setProperty"],
        declare, extend, concat = Function.prototype.call.bind(Array.prototype.concat),
        map = Function.prototype.call.bind(Array.prototype.map),
        propertyCase = (function(name) {
            return name.match(/\w\S*/g)
                .map((function(str) {
                    var first = str[0];
                    return (first.toUpperCase() + str.slice(1));
                }))
                .join("");
        }),
        wrapConstructor = (function(ctor) {
            return (function() {
                var self = this,
                    args = arguments;
                return ctor.apply(self, args);
            });
        }),
        defaultConstructor = (function(keys) {
            var length = keys["length"];
            return (function() {
                var self = this,
                    args = arguments;
                for (var i = 0;
                    (i < length);
                    (i = (i + 1)))(self[keys[i]] = args[i]);
            });
        }),
        makeSetter = (function(key) {
            return (function(x) {
                var self = this;
                return setProperty(self, key, x);
            });
        }),
        makeCtorSetter = (function(key) {
            return Function.prototype.call.bind(makeSetter(key));
        });
    (declare = (function(proto, keys, ctor) {
        var construct = (ctor || defaultConstructor(keys));
        (construct.__keys = keys);
        (construct.prototype = Object.create((proto || new(Object)())));
        (construct.prototype.constructor = construct);
        keys.forEach((function(key) {
            var setterName = ("set" + propertyCase((key + "")));
            (construct[setterName] = makeCtorSetter(key));
            (construct.prototype[setterName] = makeSetter(key));
        }));
        var Fwd = (function(args) {
            var self = this;
            return construct.apply(self, args);
        });
        (Fwd.prototype = construct.prototype);
        (construct.create = (function() {
            var args = arguments;
            return new(Fwd)(args);
        }));
        return construct;
    }));
    (extend = (function(base, keys, ctor) {
        return ((keys && keys.length) ? declare(new(base)(), concat(base.__keys, keys), ctor) : declare(
            new(base)(), base.__keys, (ctor || wrapConstructor(base))));
    }));
    (exports.declare = declare);
    (exports.extend = extend);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/scope.kep'
 * DO NOT EDIT
*/
define('khepri/compile/scope',["require", "exports"], (function(require, exports) {
    
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
/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/lexical.kep'
 * DO NOT EDIT
*/
define('khepri/compile/lexical',["require", "exports", "khepri_ast/node", "khepri_ast/pattern", "khepri_ast/value", "neith/zipper", "neith/tree",
    "khepri_ast_zipper/khepri_zipper", "bes/record", "bes/object", "khepri/compile/scope"
], (function(require, exports, ast_node, ast_pattern, ast_value, zipper, tree, __o, record, object, __o0) {
    
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
                return (!s.hasOwnBinding(id) ? pass : (function() {
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
                    checkChild("params"), child(checkChild("body"), "body"));
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
                    if ((!node.ud || !node.ud.id)) {
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
define('khepri/compile/khepri_peep',["require", "exports", "neith/tree", "neith/zipper", "khepri_ast_zipper/khepri_zipper", "khepri_ast/node",
    "khepri_ast/statement", "khepri_ast/expression", "khepri_ast/pattern", "khepri_ast/value"
], (function(require, exports, tree, zipper, __o, __o0, ast_statement, ast_expression, ast_pattern, ast_value) {
    
    var khepriZipper = __o["khepriZipper"],
        modify = __o0["modify"],
        Node = __o0["Node"],
        setUserData = __o0["setUserData"],
        optimize, concat = (function() {
            var args = arguments;
            return [].concat.apply([], args);
        }),
        map = (function(f, x) {
            return [].map.call(x, f);
        }),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        flatten = (function(x) {
            return (Array.isArray(x) ? reduce(x, (function(p, c) {
                return p.concat(c);
            }), []) : x);
        }),
        peepholes = ({}),
        addPeephole = (function(type, condition, f) {
            var entry = ({
                "condition": condition,
                "map": f
            });
            (peepholes[type] = (peepholes[type] ? peepholes[type].concat(entry) : [entry]));
        });
    addPeephole("ReturnStatement", (function(node) {
        return (node.argument && (node.argument.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.argument.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ReturnStatement.create(node.loc, node.argument.body)]));
    }));
    addPeephole("ExpressionStatement", (function(node) {
        return (node.expression && (node.expression.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.expression.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ExpressionStatement.create(node.loc, node.expression.body)]));
    }));
    addPeephole("ExpressionStatement", (function(node) {
        return ((node.expression && (node.expression.type === "AssignmentExpression")) && (node.expression
            .right.type === "LetExpression"));
    }), (function(node) {
        return ast_statement.WithStatement.create(null, node.expression.right.bindings, ast_statement.BlockStatement
            .create(null, [ast_statement.ExpressionStatement.create(node.loc, ast_expression.AssignmentExpression
                .create(node.expression.loc, node.expression.operator, node.expression.left,
                    node.expression.right.body))]));
    }));
    addPeephole("ArrayPattern", (function(_) {
        return true;
    }), (function(__o1) {
        var loc = __o1["loc"],
            elements = __o1["elements"],
            ud = __o1["ud"];
        return setUserData(ast_pattern.ObjectPattern.create(loc, map((function(x, i) {
            return ast_pattern.ObjectPatternElement.create(null, ast_value.Literal.create(
                null, "number", i), x);
        }), elements)), ud);
    }));
    addPeephole("ObjectPatternElement", (function(node) {
        return !node.target;
    }), (function(node) {
        var loc = node["loc"],
            key = node["key"];
        switch (key.type) {
            case "IdentifierPattern":
                return ast_pattern.ObjectPatternElement.create(null, ast_value.Literal.create(null,
                    "string", key.id.name), key);
            case "AsPattern":
                return ast_pattern.ObjectPatternElement.create(null, ast_value.Literal.create(null,
                    "string", key.id.id.name), key);
            default:
                return node;
        }
    }));
    addPeephole("CurryExpression", (function(node) {
        return !node.args.length;
    }), (function(node) {
        return node.base;
    }));
    addPeephole("BinaryExpression", (function(node) {
        return ((node.operator === "|>") && ((((node.right.type === "CurryExpression") || (node.right.type ===
                "BinaryOperatorExpression")) || (node.right.type === "UnaryOperatorExpression")) ||
            (node.right.type === "TernaryOperatorExpression")));
    }), (function(node) {
        return ast_expression.CallExpression.create(null, ((node.right.type === "CurryExpression") ?
            node.right.base : node.right), concat((node.right.args || []), node.left));
    }));
    addPeephole("BinaryExpression", (function(__o1) {
        var operator = __o1["operator"],
            left = __o1["left"];
        return ((operator === "<|") && ((((left.type === "CurryExpression") || (left.type ===
            "BinaryOperatorExpression")) || (left.type === "UnaryOperatorExpression")) || (left
            .type === "TernaryOperatorExpression")));
    }), (function(node) {
        return ast_expression.CallExpression.create(null, ((node.left.type === "CurryExpression") ?
            node.left.base : node.left), concat((node.left.args || []), node.right));
    }));
    var opt = (function(z) {
        var t = tree.modifyNode((function(node) {
            if (!node) return node;
            var transforms = (peepholes[node.type] || [])
                .filter((function(x) {
                    return x.condition(node);
                }));
            return transforms.reduce((function(p, c) {
                return c.map(p);
            }), node);
        }), z),
            next = zipper.nextDfs(t);
        return (next ? opt(next) : t);
    });
    (optimize = (function(__o1) {
        var options = __o1["options"],
            ast = __o1["ast"];
        return ({
            "options": options,
            "ast": tree.node(zipper.root(opt(khepriZipper(ast))))
        });
    }));
    (exports.optimize = optimize);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/ecma_zipper.kep'
 * DO NOT EDIT
*/
define('ecma_ast_zipper/ecma_zipper',["require", "exports", "neith/tree", "ecma_ast/node"], (function(require, exports, __o, __o0) {
    
    var ecmaZipper;
    var __o = __o,
        treeZipper = __o["treeZipper"],
        __o0 = __o0,
        Node = __o0["Node"],
        modify = __o0["modify"];
    var range = (function(end) {
        var a = [];
        for (var i = 0;
            (i < end);
            (i = (i + 1)))(a[i] = i);
        return a;
    });
    var joinKeys = (function(children, values) {
        return children.reduce((function(p, c) {
            (p[c] = values[c]);
            return p;
        }), []);
    });
    (ecmaZipper = treeZipper.bind(null, (function(node) {
        return (!node ? [] : (Array.isArray(node) ? range(node.length) : node.children));
    }), (function(n, k) {
        return n[k];
    }), (function(node, _, children, values) {
        return ((node instanceof Node) ? modify(node, values, ({})) : joinKeys(children, values));
    })));
    (exports.ecmaZipper = ecmaZipper);
}));
/*
 * THIS FILE IS AUTO GENERATED from 'lib/compile/ecma_peep.kep'
 * DO NOT EDIT
*/
define('khepri/compile/ecma_peep',["require", "exports", "neith/tree", "neith/zipper", "ecma_ast_zipper/ecma_zipper", "ecma_ast/node",
    "ecma_ast/value", "ecma_ast/declaration", "ecma_ast/statement", "ecma_ast/expression"
], (function(require, exports, tree, zipper, __o, __o0, ast_value, ast_declaration, ast_statement, ast_expression) {
    
    var ecmaZipper = __o["ecmaZipper"],
        modify = __o0["modify"],
        Node = __o0["Node"],
        optimize, concat = (function() {
            var args = arguments;
            return [].concat.apply([], args);
        }),
        map = (function(f, x) {
            return [].map.call(x, f);
        }),
        reduce = Function.prototype.call.bind(Array.prototype.reduce),
        flatten = (function(x) {
            return (Array.isArray(x) ? [].concat.apply([], x.map(flatten)) : x);
        }),
        peepholes = ({}),
        addPeephole = (function(types, up, condition, f) {
            var entry = ({
                "condition": condition,
                "map": f,
                "up": up
            });
            types.forEach((function(type) {
                (peepholes[type] = (peepholes[type] ? peepholes[type].concat(entry) : [entry]));
            }));
        });
    addPeephole(["VariableDeclaration"], false, (function(_) {
        return true;
    }), (function(node) {
        var declarations = node.declarations.filter((function(x) {
            return !!x;
        }));
        return modify(node, ({
            "declarations": declarations
        }), ({}));
    }));
    addPeephole(["VariableDeclaration"], true, (function(node) {
        return !node.declarations.length;
    }), (function(_) {
        return null;
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": flatten(node.body.map((function(x) {
                return ((x && (x.type === "BlockStatement")) ? x.body : x);
            })))
        }), ({}));
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": node.body.reduceRight((function(p, c) {
                return ((((c && (c.type === "VariableDeclaration")) && p.length) && (p[
                    0].type === "VariableDeclaration")) ? concat(modify(c, ({
                    "declarations": concat(c.declarations, p[0].declarations)
                }), ({})), p.slice(1)) : concat(c, p));
            }), [])
        }), ({}));
    }));
    addPeephole(["Program", "BlockStatement"], true, (function(_) {
        return true;
    }), (function(node) {
        return modify(node, ({
            "body": flatten(node.body.map((function(x) {
                return ((!x || (x.type === "EmptyStatement")) ? [] : x);
            })))
        }), ({}));
    }));
    var arithmetic = ({
        "+": (function(x, y) {
            return (x + y);
        }),
        "-": (function(x, y) {
            return (x - y);
        }),
        "*": (function(x, y) {
            return (x * y);
        }),
        "/": (function(x, y) {
            return (x / y);
        }),
        "%": "%",
        "<<": (function(x, y) {
            return (x << y);
        }),
        ">>": (function(x, y) {
            return (x >> y);
        }),
        ">>>": (function(x, y) {
            return (x >>> y);
        }),
        "<": (function(x, y) {
            return (x < y);
        }),
        ">": (function(x, y) {
            return (x > y);
        }),
        "<=": (function(x, y) {
            return (x <= y);
        }),
        ">=": (function(x, y) {
            return (x >= y);
        }),
        "||": (function(x, y) {
            return (x || y);
        }),
        "&&": (function(x, y) {
            return (x && y);
        })
    }),
        isPrimitive = (function(node) {
            return ((node.type === "Literal") && ((((node.kind === "string") || (node.kind === "number")) ||
                (node.kind === "boolean")) || (node.kind === "null")));
        });
    addPeephole(["BinaryExpression", "LogicalExpression"], true, (function(__o1) {
        var operator = __o1["operator"],
            left = __o1["left"],
            right = __o1["right"];
        return ((arithmetic[operator] && isPrimitive(left)) && isPrimitive(right));
    }), (function(__o1) {
        var operator = __o1["operator"],
            left = __o1["left"],
            right = __o1["right"],
            value = arithmetic[operator](left.value, right.value);
        return ast_value.Literal.create(null, typeof value, value);
    }));
    var arithmetic0 = ({
        "!": (function(x) {
            return !x;
        }),
        "~": (function(x) {
            return~ x;
        }),
        "typeof": (function(x) {
            return typeof x;
        }),
        "+": (function(x) {
            return +x;
        }),
        "-": (function(x) {
            return -x;
        })
    }),
        isPrimitive0 = (function(node) {
            return ((node.type === "Literal") && ((((node.kind === "string") || (node.kind === "number")) ||
                (node.kind === "boolean")) || (node.kind === "null")));
        });
    addPeephole(["UnaryExpression"], true, (function(__o1) {
        var operator = __o1["operator"],
            argument = __o1["argument"];
        return (arithmetic0[operator] && isPrimitive0(argument));
    }), (function(__o1) {
        var operator = __o1["operator"],
            argument = __o1["argument"],
            value = arithmetic0[operator](argument.value);
        return ast_value.Literal.create(null, typeof value, value);
    }));
    var transform = (function(node) {
        var transforms = (peepholes[node.type] || [])
            .filter((function(x) {
                return x.condition(node);
            })),
            down = transforms.filter((function(x) {
                return !x.up;
            })),
            up = transforms.filter((function(x) {
                return x.up;
            }));
        return down.reduce((function(p, c) {
            return c.map(p, transform);
        }), node);
    }),
        transformDown = (function(node) {
            var transforms = (peepholes[node.type] || [])
                .filter((function(x) {
                    return (!x.up && x.condition(node));
                }));
            return transforms.reduce((function(p, c) {
                return c.map(p, transformDown);
            }), node);
        }),
        transformUp = (function(node) {
            var transforms = (peepholes[node.type] || [])
                .filter((function(x) {
                    return (x.up && x.condition(node));
                }));
            return transforms.reduce((function(p, c) {
                return c.map(p, transformUp);
            }), node);
        }),
        opt = (function(z) {
            var t = tree.modifyNode((function(node) {
                return (node && transformDown(node));
            }), z);
            if (zipper.isLeaf(t)) {
                do {
                    (t = tree.modifyNode((function(node) {
                        return (node && transformUp(node));
                    }), t));
                    if (zipper.isLast(t)) {
                        if (zipper.isRoot(t)) return t;
                        (t = zipper.up(t));
                    } else return opt(zipper.right(t));
                }
                while (true);
            }
            return opt(zipper.down(t));
        });
    (optimize = (function(__o1) {
        var options = __o1["options"],
            ast = __o1["ast"];
        return ({
            "options": options,
            "ast": tree.node(zipper.root(opt(ecmaZipper(ast))))
        });
    }));
    (exports.optimize = optimize);
}));
define('khepri/compile/compile',["require", "exports", "khepri/compile/lexical", "khepri/compile/transform", "khepri/compile/khepri_peep",
    "khepri/compile/ecma_peep"
], (function(require, exports, lexical, transform, khepri_peep, ecma_peep) {
    
    var compile;
    (compile = (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })((function(__o) {
        var ast = __o["ast"];
        return ast;
    }), (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(ecma_peep.optimize, (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(transform.transform, (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(khepri_peep.optimize, (function(f, g) {
        return (function() {
            return f(g.apply(null, arguments));
        });
    })(lexical.checkStage, (function(root, options) {
        return ({
            "ast": root,
            "options": (options || ({}))
        });
    })))))));
    (exports.compile = compile);
}));
/**
 * @fileOverview ECMAScript 5.1 lex tokens.
 */
define('ecma_ast/token',['ecma_ast/node'],
function(node){


/**
 * @constructor
 */
var Token = function(loc, value) {
    node.Node.call(this, loc);
    this.value = value;
};
Token.prototype = new node.Node;

/* Instances
 ******************************************************************************/
/**
 * @constructor
 */
var StringToken = node.defineNode(Token, 'String',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * @constructor
 */
var NumberToken = node.defineNode(Token, 'Number',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * @constructor
 */
var RegularExpressionToken = node.defineNode(Token, 'RegularExpression',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * @constructor
 */
var BooleanToken = node.defineNode(Token, 'Boolean',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * @constructor
 */
var NullToken = node.defineNode(Token, 'Null',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * 
 */
var IdentifierToken = node.defineNode(Token, 'Identifier',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * @constructor
 */
var KeywordToken = node.defineNode(Token, 'Keyword',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * 
 */
var PunctuatorToken = node.defineNode(Token, 'Punctuator',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * @constructor
 */
var CommentToken = node.defineNode(Token, 'Comment',
    [],
    ['value', 'multiline', 'linebreak'],
    function(loc, value, multiline, linebreak) {
        Token.call(this, loc, value);
        this.multiline = !!multiline;
        this.linebreak = !!linebreak;
    });

/**
 * @constructor
 */
var WhitespaceToken = node.defineNode(Token, 'Whitespace',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/**
 * @constructor
 */
var LineTerminatorToken = node.defineNode(Token, 'LineTerminator',
    [],
    ['value'],
    function(loc, value) {
        Token.call(this, loc, value);
    });

/* Export
 ******************************************************************************/
return {
    'Token': Token,
    
    'StringToken': StringToken,
    'NumberToken': NumberToken,
    'RegularExpressionToken': RegularExpressionToken,
    'BooleanToken': BooleanToken,
    'NullToken': NullToken,
    
    'IdentifierToken': IdentifierToken,
    'KeywordToken': KeywordToken,
    'PunctuatorToken': PunctuatorToken,
    
    'CommentToken': CommentToken,
    'WhitespaceToken': WhitespaceToken,
    'LineTerminatorToken': LineTerminatorToken
};

});
/**
 * @fileOverview Transforming an AST into a stream of tokens.
 */
define('ecma-unparse/unparse',['nu-stream/stream',
        'nu-stream/gen',
        'ecma_ast/token',
        'ecma_ast/node'],
function(stream,
        gen,
        token,
        node){

var slice = Array.prototype.slice;

/* Stream Utilities
 ******************************************************************************/
/**
 * Joins an array of objects into a stream with a given joiner object.
 */
var join = function(arr, joiner) {
    if (arr.length === 0) {
        return stream.end;
    } else if (arr.length === 1) {
        return arr[0];
    } else {
        return stream.append(arr[0], stream.cons(joiner, join(arr.slice(1), joiner)));
    }
};

/**
 * Joins an array of objects into a stream with a stream joiner object.
 */
var joins = function(arr, joiner) {
    if (arr.length === 0) {
        return stream.end;
    } else if (arr.length === 1) {
        return arr[0];
    } else {
        return stream.append(arr[0], stream.append(joiner, joins(arr.slice(1), joiner)));
    }
};

/* Token
 ******************************************************************************/
var keyword = function(x) {
    return new token.KeywordToken(null, x);
};

var identifier = function(x) {
    return new token.IdentifierToken(null, x);
};

var lineTerminator = function(x) {
    return new token.LineTerminatorToken(null, (x === undefined ? '\n' : x));
};

var punctuator = function(x) {
    return new token.PunctuatorToken(null, x);
};

var whitespace = function(x) {
    return new token.WhitespaceToken(null, (x === undefined ? ' ' : x));
};

/* 
 ******************************************************************************/
var seq = function(/*...*/) {
    if (arguments.length === 0) {
        return stream.end;
    }
    
    var first = arguments[0],
        rest = seq.apply(undefined, slice.call(arguments, 1));

    if (first === undefined || stream.isEmpty(first)) {
        return rest;
    } else if (stream.isStream(first)) {
        return stream.append(first, rest);
    } else {
        return stream.cons(first, rest)
    }
};

/* 
 ******************************************************************************/
var statement = function(/*...*/) {
    return seq(
        seq.apply(undefined, arguments),
        lineTerminator());
};

var expression = function(/*...*/) {
    return seq.apply(undefined, arguments);
};

var declaration = function(/*...*/) {
    return seq.apply(undefined, arguments);
};

var clause = function(/*...*/) {
    return seq(
        seq.apply(undefined, arguments),
        lineTerminator());
};

var value = function(/*...*/) {
    return seq.apply(undefined, arguments);
};


/* Unparsing
 ******************************************************************************/
var program = function(body) {
    return seq.apply(undefined, body);
}; 

var variableDeclaration = function(declarations) {
    return statement(
        keyword('var'),
        whitespace(),
        join(declarations, punctuator(',')),
        punctuator(';'));
};

var variableDeclarator = function(id, init) {
    return declaration(
        id,
        (init ?
            seq(
                whitespace(),
                punctuator('='),
                whitespace(),
                init) :
            stream.end));
};

var functionExpression = function(id, params, body) {
    return expression(
        punctuator('('),
        keyword('function'),
        (id ?
            seq(
                whitespace(),
                id):
            stream.end),
        punctuator('('),
        joins(params, seq(
            punctuator(','),
            whitespace())),
        punctuator(')'),
        whitespace(),
        body,
        punctuator(')'));
};

var functionDeclaration = function(id, params, body) {
    return functionExpression(id, params, body);
};

var switchCase = function(test, consequent) {
    return seq(
        (test ?
            seq(
                keyword('case'),
                whitespace(),
                test) :
            keyword('default')),
        punctuator(':'),
            lineTerminator(),
            seq.apply(undefined, consequent));
};

var catchClause = function(param, body) {
    return seq(
        keyword('catch'),
        punctuator('('),
        param,
        punctuator(')'),
        body);
};

/* Statement Unparsing
 ******************************************************************************/
var emptyStatement = function(){
    return statement(
        punctuator(';'));
};

var debuggerStatement = function() {
    return statement(
        keyword('debugger'),
        punctuator(';'));
};

var blockStatement = function(body) {
    return statement(
        punctuator('{'),
        lineTerminator(),
        seq.apply(undefined, body),
        punctuator('}'));
};

var expressionStatement = function(expression) {
    return statement(
        expression,
        punctuator(';'));
};

var ifStatement = function(test, consequent, alternate) {
    return statement(
        keyword('if'),
        whitespace(),
        punctuator('('),
        test,
        punctuator(')'),
        consequent,
        (!alternate ? stream.end :
            seq(
                keyword('else'),
                whitespace(),
                alternate)));
};

var labeledStatement = function(label, body) {
    return statement(
        identifier(label),
        punctuator(':'),
        body);
};

var breakStatement = function(label) {
    return statement(
        keyword('break'),
        whitespace(),
        label,
        punctuator(';'));
};

var continueStatement = function(label) {
    return statement(
        keyword('continue'),
        whitespace(),
        label,
        punctuator(';'));
};

var withStatement = function(obj, body) {
    return statement(
        keyword('with'),
        punctuator('('),
        object,
        punctuator(')'),
        punctuator('{'),
        body,
        punctuator('}'));
};

var switchStatement = function(discriminant, cases) {
    return statement(
        keyword('switch'),
        punctuator('('),
        discriminant,
        punctuator(')'),
        punctuator('{'),
        lineTerminator(),
        seq.apply(undefined, cases),
        punctuator('}'));
};

var returnStatement = function(argument) {
    return statement(
        keyword('return'),
        whitespace(),
        argument,
        punctuator(';'));
};

var throwStatement = function(argument) {
    return statement(
        keyword('throw'),
        whitespace(),
        argument,
        punctuator(';'));
};

var tryStatement = function(block, handler, finalizer) {
    return statement(
        keyword('try'),
        block,
        (handler ?
            handler:
            stream.end),
        (finalizer ?
            seq(
                keyword('finally'),
                finalizer) :
            stream.end));
};

var whileStatement = function(test, body) { 
    return statement(
        keyword('while'),
        punctuator('('),
        test,
        punctuator(')'),
        body);
};

var doWhileStatement = function(body, test) {
    return statement(
        keyword('do'),
        body,
        keyword('while'),
        punctuator('('),
        test,
        punctuator(')'),
        punctuator(';'));
};

var forDeclarationStatement = function(init, test, update, body) {
    return statement(
        keyword('for'),
        punctuator('('),
        init,
        whitespace(),
        test,
        punctuator(';'),
        update,
        punctuator(')'),
        body);
};

var forStatement = function(init, test, update, body) {
    return statement(
        keyword('for'),
        punctuator('('),
        init,
        punctuator(';'),
        test,
        punctuator(';'),
        update,
        punctuator(')'),
        body);
};

var forInStatement = function(left, right) {
    return statement(
        keyword('for'),
        punctuator('('),
        node.left,
        punctuator('in'),
        node.right,
        punctuator(')'),
        node.body);
};



/* Expression Unparsing
 ******************************************************************************/
var thisExpression = function() {
    return expression(
        keyword('this'));
};

var sequenceExpression = function(expressions) {
    return expression(
        join(expressions, punctuator(',')));
};

var unaryExpression = function(op, arg) {
    return expression(
        op,
        whitespace(),
        arg);
};

var binaryExpression = function(op, left, right) {
    return expression(
        punctuator('('),
        left,
        whitespace(),
        op,
        whitespace(),
        right,
        punctuator(')'));
};
    
var updateExpression = function(op, arg, prefix){
    return (prefix ?
        expression(op, arg) :
        expression(arg, op));
};

var conditionalExpression = function(test, consequent, alternate) {
    return expression(
        punctuator('('),
        test,
        whitespace(),
        punctuator('?'),
        whitespace(),
        consequent,
        whitespace(),
        punctuator(':'),
        whitespace(),
        alternate,
        punctuator(')'));
};

var newExpression = function(callee, args) {
    return expression(
        keyword('new'),
        whitespace(),
        punctuator('('),
        callee,
        punctuator(')'),
        (args ?
            seq(
                punctuator('('),
                joins(args, seq(
                    punctuator(','),
                    whitespace())),
                punctuator(')')) :
            stream.end));
};

var callExpression = function(callee, args) {
    return expression(
        callee,
        punctuator('('),
        joins(args, seq(
            punctuator(','),
            whitespace())),
        punctuator(')'));
};

var memberExpression = function(obj, property, computed) {
    return (computed ?
        expression(
            obj,
            punctuator('['),
            property,
            punctuator(']')) :
        expression(
            obj,
            punctuator('.'),
                property));
};
 
var arrayExpression = function(elements) {
    return expression(
        punctuator('['),
        joins(elements, seq(
            punctuator(','),
            whitespace())),
        punctuator(']'));
};

var objectExpression = function(props) {
     return expression(
        punctuator('('),
        punctuator('{'),
        (props && props.length ? 
            seq(
                lineTerminator(),
                joins(props, seq(
                    punctuator(','),
                    lineTerminator())),
                lineTerminator()) :
            stream.end),
        punctuator('}'),
        punctuator(')'));
};

var objectGetExpression = function(key, body) {
    return seq(
        identifier('get'),
        whitespace(),
        key,
        punctuator('('),
        punctuator(')'),
        whitespace(),
        body);
};

var objectSetExpression = function(key, params, body) {
    return seq(
        identifier('set'),
        whitespace(),
        key,
        punctuator('('),
        seq.apply(undefined, params),
        punctuator(')'),
        whitespace(),
        body);
};

var objectValueExpression = function(key, value) {
    return seq(
        key,
        punctuator(':'),
        whitespace(),
        value);
};

/* Value Unparsers
 ******************************************************************************/
var identifier = function(name) {
    return value(new token.IdentifierToken(null, name));
}

var string = function(x) {
    return value(new token.StringToken(null, x));
};

var number= function(x) {
    return value(new token.NumberToken(null, x));
};

var nil = function(x) {
    return value(new token.NullToken(null, x));
};

var boolean = function(x) {
    return value(new token.BooleanToken(null, x));
};

var regexp = function(x) {
    return value(new token.RegularExpressionToken(null, x));
};


/* Unparsing
 ******************************************************************************/
/**
 * Transforms a AST node to a stream of tokens.
 */
var _unparse = function(node) {
    if (!node) {
        return stream.end;
    }
        
    switch (node.type) {
// clauses
    case 'SwitchCase':
        return switchCase(
            (node.test ?
                _unparse(node.test) :
                null),
            node.consequent.map(_unparse));
   
    case 'CatchClause':
        return catchClause(
            _unparse(node.param),
            _unparse(node.body));
    
// Statement
    case 'EmptyStatement':
        return emptyStatement()
        
    case 'DebuggerStatement':
        return debuggerStatement();
    
    case 'BlockStatement':
        return blockStatement(
            node.body.map(_unparse));
        
    case 'ExpressionStatement':
        return expressionStatement(
            _unparse(node.expression));
    
    case 'IfStatement':
        return ifStatement(
            _unparse(node.test),
            _unparse(node.consequent),
            (node.alternate ?
                _unparse(node.alternate) :
                null));
        
    case 'LabeledStatement':
        return labeledStatement(
            _unparse(node.label),
            _unparse(node.body));
        
    case 'BreakStatement':
        return breakStatement(
           _unparse(node.label));
        
    case 'ContinueStatement':
        return continueStatement(
            _unparse(node.label));
        
    case 'WithStatement':
        return withStatement(
            _unparse(node.object),
            _unparse(node.body));
    
    case 'SwitchStatement':
        return switchStatement(
            _unparse(node.discriminant),
            node.cases.map(_unparse));
    
    case'ReturnStatement':
        return returnStatement(
            _unparse(node.argument));
    
    case 'ThrowStatement':
        return throwStatement(
            _unparse(node.argument));
    
    case 'TryStatement':
        return tryStatement(
            _unparse(node.block),
            (node.handler ?
                _unparse(node.handler) :
                null),
            (node.finalizer ?
                _unparse(node.finalizer) :
                null));
    
    case 'WhileStatement':
        return whileStatement(
            _unparse(node.test),
            _unparse(node.body));
    
    case 'DoWhileStatement':
        return doWhileStatement(
            _unparse(node.body),
            _unparse(node.test));
    
    case 'ForStatement':
        var init = (node.init ? _unparse(node.init) : null);
        var test = (node.test ? _unparse(node.test) : null);
        var update = (node.update ? _unparse(node.update) : null);
        var body = _unparse(node.body);
        return (node.init && node.init.type ===  "VariableDeclaration" ?
            forDeclarationStatement(init, test, update, body) :
            forStatement(init, test, update, body));
        
    case 'ForInStatement':
        return forInStatement(
            _unparse(node.left),
            _unparse(node.right),
            _unparse(node.body));
        
// Expression
    case 'ThisExpression':
        return thisExpression();

    case 'SequenceExpression':
        return sequenceExpression(node.expressions.map(_unparse));
    
    case 'UnaryExpression':
        return unaryExpression(
            punctuator(node.operator),
            _unparse(node.argument));
        
    case 'BinaryExpression':
    case 'LogicalExpression':
    case 'AssignmentExpression':
        return binaryExpression(
            punctuator(node.operator),
            _unparse(node.left),
            _unparse(node.right));

    case 'UpdateExpression':
        return updateExpression(
            punctuator(node.operator),
            _unparse(node.argument),
            node.prefix);
        
    case 'ConditionalExpression':
        return conditionalExpression(
            _unparse(node.test),
            _unparse(node.consequent),
            _unparse(node.alternate));
    
    case 'NewExpression':
        return newExpression(
            _unparse(node.callee),
            (node.args ?
                node.args.map(_unparse) :
                null));
    
    case 'CallExpression':
        return callExpression(
            _unparse(node.callee),
            node.args.map(_unparse));
        
    case 'MemberExpression':
        return memberExpression(
            _unparse(node.object),
            _unparse(node.property),
            node.computed);
        
    case 'ArrayExpression':
        return arrayExpression(node.elements.map(_unparse));
    
    case 'ObjectExpression':
        return objectExpression(node.properties.map(_unparse));
    
    case 'ObjectValue':
        return objectValueExpression(_unparse(node.key), _unparse(node.value));
    
    case 'ObjectGetter':
        return objectGetExpression(_unparse(node.key), _unparse(node.value.body));
        
    case 'ObjectSetter':
        return objectSetExpression(_unparse(node.key), node.value.params.map(_unparse), _unparse(node.value.body));

// Function
    case 'FunctionExpression':
        return functionExpression(
            (node.id ?
                _unparse(node.id) :
                null),
            node.params.map(_unparse),
            _unparse(node.body));
        
    case 'FunctionDeclaration':
        return functionDeclaration(
            _unparse(node.id),
            node.params.map(_unparse),
            _unparse(node.body));

// Program
    case 'Program':
        return program(node.body.map(_unparse));

// Declarations
    case 'VariableDeclaration':
        return variableDeclaration(node.declarations.map(_unparse));
        
    case 'VariableDeclarator':
        return variableDeclarator(
            _unparse(node.id),
            (node.init ?
                _unparse(node.init) :
                null));

// Value
    case 'Identifier':
        return identifier(node.name);
    
    case 'Literal':
        switch (node.kind) {
        case 'string':
            return string(node.value);
        case 'number':
            return number(node.value);
        case 'null':
            return nil(node.value);
        case 'boolean':
            return boolean(node.value)
        case 'regexp':
            return regexp(node.value);
        default:
            return stream.end;
        }
        
    default:
        return stream.end;
    }
};

/* Exported
 ******************************************************************************/


/**
 * Transform an AST to a stream of tokens.
 * 
 * Returned stream inserts line terminators for pretty printing.
 * 
 * @param node Root of AST to unparse.
 * 
 * @return Stream of parse-ecma lex tokens.
 */
var unparse = (function(){
    var indent = function(ind, s) {
        if (stream.isEmpty(s)) {
            return s;
        }
        
        var first = stream.first(s);
        var rest = stream.rest(s);
        
        if (first.type === 'LineTerminator') {
            if (!stream.isEmpty(rest)) {
                var next = stream.first(rest);
                if (next.type === 'Punctuator' && next.value === '}') {
                    var padding = gen.repeat(ind - 4, whitespace());
                    return stream.cons(first, stream.append(padding, indent(ind, rest)));
                }
            }
            var padding = gen.repeat(ind, whitespace());
            return stream.cons(first, stream.append(padding, indent(ind, rest)));
        }
        
        if (first.type === 'Punctuator') {
            switch  (first.value) {
            case '{': ind += 4; break;
            case '}': ind -= 4; break;
            }
        }
        
        return stream.stream(first, indent.bind(undefined, ind, stream.rest(s)));
    };
    
    return function(node) {
        return indent(0, _unparse(node));
    };
}());

/* Export
 ******************************************************************************/
return {
    'unparse': unparse
};

});
/*jshint curly:true, eqeqeq:true, laxbreak:true, noempty:false */
/*NOTE: the exports at the end of this file were modified to make it work with r.js */
/*

  The MIT License (MIT)

  Copyright (c) 2007-2013 Einar Lielmanis and contributors.

  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation files
  (the "Software"), to deal in the Software without restriction,
  including without limitation the rights to use, copy, modify, merge,
  publish, distribute, sublicense, and/or sell copies of the Software,
  and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
  BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
  ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

 JS Beautifier
---------------


  Written by Einar Lielmanis, <einar@jsbeautifier.org>
      http://jsbeautifier.org/

  Originally converted to javascript by Vital, <vital76@gmail.com>
  "End braces on own line" added by Chris J. Shull, <chrisjshull@gmail.com>
  Parsing improvements for brace-less statements by Liam Newman <bitwiseman@gmail.com>


  Usage:
    js_beautify(js_source_text);
    js_beautify(js_source_text, options);

  The options are:
    indent_size (default 4)          - indentation size,
    indent_char (default space)      - character to indent with,
    preserve_newlines (default true) - whether existing line breaks should be preserved,
    max_preserve_newlines (default unlimited) - maximum number of line breaks to be preserved in one chunk,

    jslint_happy (default false) - if true, then jslint-stricter mode is enforced.

            jslint_happy   !jslint_happy
            ---------------------------------
             function ()      function()

    brace_style (default "collapse") - "collapse" | "expand" | "end-expand"
            put braces on the same line as control statements (default), or put braces on own line (Allman / ANSI style), or just put end braces on own line.

    space_before_conditional (default true) - should the space before conditional statement be added, "if(true)" vs "if (true)",

    unescape_strings (default false) - should printable characters in strings encoded in \xNN notation be unescaped, "example" vs "\x65\x78\x61\x6d\x70\x6c\x65"

    wrap_line_length (default unlimited) - lines should wrap at next opportunity after this number of characters.
          NOTE: This is not a hard limit. Lines will continue until a point where a newline would
                be preserved if it were present.

    e.g

    js_beautify(js_source_text, {
      'indent_size': 1,
      'indent_char': '\t'
    });

*/


(function() {
    function js_beautify(js_source_text, options) {
        
        var beautifier = new Beautifier(js_source_text, options);
        return beautifier.beautify();
    }

    function Beautifier(js_source_text, options) {
        
        var input, output_lines;
        var token_text, token_type, last_type, last_last_text, indent_string;
        var flags, previous_flags, flag_store;
        var whitespace, wordchar, punct, parser_pos, line_starters, digits;
        var prefix;
        var input_wanted_newline;
        var output_wrapped, output_space_before_token;
        var input_length, n_newlines, whitespace_before_token;
        var handlers, MODE, opt;
        var preindent_string = '';

        whitespace = "\n\r\t ".split('');
        wordchar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$'.split('');
        digits = '0123456789'.split('');

        punct = '+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |= ::';
        punct += ' <%= <% %> <?= <? ?>'; // try to be a good boy and try not to break the markup language identifiers
        punct = punct.split(' ');

        // words which should always start on new line.
        line_starters = 'continue,try,throw,return,var,if,switch,case,default,for,while,break,function'.split(',');

        MODE = {
            BlockStatement: 'BlockStatement', // 'BLOCK'
            Statement: 'Statement', // 'STATEMENT'
            ObjectLiteral: 'ObjectLiteral', // 'OBJECT',
            ArrayLiteral: 'ArrayLiteral', //'[EXPRESSION]',
            ForInitializer: 'ForInitializer', //'(FOR-EXPRESSION)',
            Conditional: 'Conditional', //'(COND-EXPRESSION)',
            Expression: 'Expression' //'(EXPRESSION)'
        };

        handlers = {
            'TK_START_EXPR': handle_start_expr,
            'TK_END_EXPR': handle_end_expr,
            'TK_START_BLOCK': handle_start_block,
            'TK_END_BLOCK': handle_end_block,
            'TK_WORD': handle_word,
            'TK_SEMICOLON': handle_semicolon,
            'TK_STRING': handle_string,
            'TK_EQUALS': handle_equals,
            'TK_OPERATOR': handle_operator,
            'TK_COMMA': handle_comma,
            'TK_BLOCK_COMMENT': handle_block_comment,
            'TK_INLINE_COMMENT': handle_inline_comment,
            'TK_COMMENT': handle_comment,
            'TK_DOT': handle_dot,
            'TK_UNKNOWN': handle_unknown
        };

        function create_flags(flags_base, mode) {
            var next_indent_level = 0;
            if (flags_base) {
                next_indent_level = flags_base.indentation_level;
                next_indent_level += (flags_base.var_line && flags_base.var_line_reindented) ? 1 : 0;
                if (!just_added_newline() &&
                    flags_base.line_indent_level > next_indent_level) {
                    next_indent_level = flags_base.line_indent_level;
                }
            }

            var next_flags = {
                mode: mode,
                parent: flags_base,
                last_text: flags_base ? flags_base.last_text : '', // last token text
                last_word: flags_base ? flags_base.last_word : '', // last 'TK_WORD' passed
                var_line: false,
                var_line_tainted: false,
                var_line_reindented: false,
                in_html_comment: false,
                multiline_frame: false,
                if_block: false,
                do_block: false,
                do_while: false,
                in_case_statement: false, // switch(..){ INSIDE HERE }
                in_case: false, // we're on the exact line with "case 0:"
                case_body: false, // the indented case-action block
                indentation_level: next_indent_level,
                line_indent_level: flags_base ? flags_base.line_indent_level : next_indent_level,
                start_line_index: output_lines.length,
                ternary_depth: 0
            }
            return next_flags;
        }

        // Using object instead of string to allow for later expansion of info about each line

        function create_output_line() {
            return {
                text: []
            };
        }

        // Some interpreters have unexpected results with foo = baz || bar;
        options = options ? options : {};
        opt = {};

        // compatibility
        if (options.space_after_anon_function !== undefined && options.jslint_happy === undefined) {
            options.jslint_happy = options.space_after_anon_function;
        }
        if (options.braces_on_own_line !== undefined) { //graceful handling of deprecated option
            opt.brace_style = options.braces_on_own_line ? "expand" : "collapse";
        }
        opt.brace_style = options.brace_style ? options.brace_style : (opt.brace_style ? opt.brace_style : "collapse");

        // graceful handling of deprecated option
        if (opt.brace_style === "expand-strict") {
            opt.brace_style = "expand";
        }


        opt.indent_size = options.indent_size ? parseInt(options.indent_size, 10) : 4;
        opt.indent_char = options.indent_char ? options.indent_char : ' ';
        opt.preserve_newlines = (options.preserve_newlines === undefined) ? true : options.preserve_newlines;
        opt.break_chained_methods = (options.break_chained_methods === undefined) ? false : options.break_chained_methods;
        opt.max_preserve_newlines = (options.max_preserve_newlines === undefined) ? 0 : parseInt(options.max_preserve_newlines, 10);
        opt.space_in_paren = (options.space_in_paren === undefined) ? false : options.space_in_paren;
        opt.jslint_happy = (options.jslint_happy === undefined) ? false : options.jslint_happy;
        opt.keep_array_indentation = (options.keep_array_indentation === undefined) ? false : options.keep_array_indentation;
        opt.space_before_conditional = (options.space_before_conditional === undefined) ? true : options.space_before_conditional;
        opt.unescape_strings = (options.unescape_strings === undefined) ? false : options.unescape_strings;
        opt.wrap_line_length = (options.wrap_line_length === undefined) ? 0 : parseInt(options.wrap_line_length, 10);
        opt.e4x = (options.e4x === undefined) ? false : options.e4x;

        if(options.indent_with_tabs){
            opt.indent_char = '\t';
            opt.indent_size = 1;
        }

        //----------------------------------
        indent_string = '';
        while (opt.indent_size > 0) {
            indent_string += opt.indent_char;
            opt.indent_size -= 1;
        }

        while (js_source_text && (js_source_text.charAt(0) === ' ' || js_source_text.charAt(0) === '\t')) {
            preindent_string += js_source_text.charAt(0);
            js_source_text = js_source_text.substring(1);
        }
        input = js_source_text;
        // cache the source's length.
        input_length = js_source_text.length;

        last_type = 'TK_START_BLOCK'; // last token type
        last_last_text = ''; // pre-last token text
        output_lines = [create_output_line()];
        output_wrapped = false;
        output_space_before_token = false;
        whitespace_before_token = [];

        // Stack of parsing/formatting states, including MODE.
        // We tokenize, parse, and output in an almost purely a forward-only stream of token input
        // and formatted output.  This makes the beautifier less accurate than full parsers
        // but also far more tolerant of syntax errors.
        //
        // For example, the default mode is MODE.BlockStatement. If we see a '{' we push a new frame of type
        // MODE.BlockStatement on the the stack, even though it could be object literal.  If we later
        // encounter a ":", we'll switch to to MODE.ObjectLiteral.  If we then see a ";",
        // most full parsers would die, but the beautifier gracefully falls back to
        // MODE.BlockStatement and continues on.
        flag_store = [];
        set_mode(MODE.BlockStatement);

        parser_pos = 0;

        this.beautify = function() {
            /*jshint onevar:true */
            var t, i, keep_whitespace, sweet_code;

            while (true) {
                t = get_next_token();
                token_text = t[0];
                token_type = t[1];

                if (token_type === 'TK_EOF') {
                    break;
                }

                keep_whitespace = opt.keep_array_indentation && is_array(flags.mode);
                input_wanted_newline = n_newlines > 0;

                if (keep_whitespace) {
                    for (i = 0; i < n_newlines; i += 1) {
                        print_newline(i > 0);
                    }
                } else {
                    if (opt.max_preserve_newlines && n_newlines > opt.max_preserve_newlines) {
                        n_newlines = opt.max_preserve_newlines;
                    }

                    if (opt.preserve_newlines) {
                        if (n_newlines > 1) {
                            print_newline();
                            for (i = 1; i < n_newlines; i += 1) {
                                print_newline(true);
                            }
                        }
                    }
                }

                handlers[token_type]();

                // The cleanest handling of inline comments is to treat them as though they aren't there.
                // Just continue formatting and the behavior should be logical.
                // Also ignore unknown tokens.  Again, this should result in better behavior.
                if (token_type !== 'TK_INLINE_COMMENT' && token_type !== 'TK_COMMENT' &&
                    token_type !== 'TK_UNKNOWN') {
                    last_last_text = flags.last_text;
                    last_type = token_type;
                    flags.last_text = token_text;
                }
            }


            sweet_code = output_lines[0].text.join('');
            for (var line_index = 1; line_index < output_lines.length; line_index++) {
                sweet_code += '\n' + output_lines[line_index].text.join('');
            }
            sweet_code = sweet_code.replace(/[\r\n ]+$/, '');
            return sweet_code;
        };

        function trim_output(eat_newlines) {
            eat_newlines = (eat_newlines === undefined) ? false : eat_newlines;

            if (output_lines.length) {
                trim_output_line(output_lines[output_lines.length - 1], eat_newlines);

                while (eat_newlines && output_lines.length > 1 &&
                    output_lines[output_lines.length - 1].text.length === 0) {
                    output_lines.pop();
                    trim_output_line(output_lines[output_lines.length - 1], eat_newlines);
                }
            }
        }

        function trim_output_line(line) {
            while (line.text.length &&
                (line.text[line.text.length - 1] === ' ' ||
                    line.text[line.text.length - 1] === indent_string ||
                    line.text[line.text.length - 1] === preindent_string)) {
                line.text.pop();
            }
        }

        function trim(s) {
            return s.replace(/^\s+|\s+$/g, '');
        }

        // we could use just string.split, but
        // IE doesn't like returning empty strings

        function split_newlines(s) {
            //return s.split(/\x0d\x0a|\x0a/);

            s = s.replace(/\x0d/g, '');
            var out = [],
                idx = s.indexOf("\n");
            while (idx !== -1) {
                out.push(s.substring(0, idx));
                s = s.substring(idx + 1);
                idx = s.indexOf("\n");
            }
            if (s.length) {
                out.push(s);
            }
            return out;
        }

        function just_added_newline() {
            var line = output_lines[output_lines.length - 1];
            return line.text.length === 0;
        }

        function just_added_blankline() {
            if (just_added_newline()) {
                if (output_lines.length === 1) {
                    return true; // start of the file and newline = blank
                }

                var line = output_lines[output_lines.length - 2];
                return line.text.length === 0;
            }
            return false;
        }

        function allow_wrap_or_preserved_newline(force_linewrap) {
            force_linewrap = (force_linewrap === undefined) ? false : force_linewrap;
            if (opt.wrap_line_length && !force_linewrap) {
                var line = output_lines[output_lines.length - 1];
                var proposed_line_length = 0;
                // never wrap the first token of a line.
                if (line.text.length > 0) {
                    proposed_line_length = line.text.join('').length + token_text.length +
                        (output_space_before_token ? 1 : 0);
                    if (proposed_line_length >= opt.wrap_line_length) {
                        force_linewrap = true;
                    }
                }
            }
            if (((opt.preserve_newlines && input_wanted_newline) || force_linewrap) && !just_added_newline()) {
                print_newline(false, true);

                // Expressions and array literals already indent their contents.
                if (!(is_array(flags.mode) || is_expression(flags.mode))) {
                    output_wrapped = true;
                }
            }
        }

        function print_newline(force_newline, preserve_statement_flags) {
            output_wrapped = false;
            output_space_before_token = false;

            if (!preserve_statement_flags) {
                if (flags.last_text !== ';') {
                    while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                        restore_mode();
                    }
                }
            }

            if (output_lines.length === 1 && just_added_newline()) {
                return; // no newline on start of file
            }

            if (force_newline || !just_added_newline()) {
                flags.multiline_frame = true;
                output_lines.push(create_output_line());
            }
        }

        function print_token_line_indentation() {
            if (just_added_newline()) {
                var line = output_lines[output_lines.length - 1];
                if (opt.keep_array_indentation && is_array(flags.mode) && input_wanted_newline) {
                    // prevent removing of this whitespace as redundant
                    line.text.push('');
                    for (var i = 0; i < whitespace_before_token.length; i += 1) {
                        line.text.push(whitespace_before_token[i]);
                    }
                } else {
                    if (preindent_string) {
                        line.text.push(preindent_string);
                    }

                    print_indent_string(flags.indentation_level +
                        (flags.var_line && flags.var_line_reindented ? 1 : 0) +
                        (output_wrapped ? 1 : 0));
                }
            }
        }

        function print_indent_string(level) {
            // Never indent your first output indent at the start of the file
            if (output_lines.length > 1) {
                var line = output_lines[output_lines.length - 1];

                flags.line_indent_level = level;
                for (var i = 0; i < level; i += 1) {
                    line.text.push(indent_string);
                }
            }
        }

        function print_token_space_before() {
            var line = output_lines[output_lines.length - 1];
            if (output_space_before_token && line.text.length) {
                var last_output = line.text[line.text.length - 1];
                if (last_output !== ' ' && last_output !== indent_string) { // prevent occassional duplicate space
                    line.text.push(' ');
                }
            }
        }

        function print_token(printable_token) {
            printable_token = printable_token || token_text;
            print_token_line_indentation();
            output_wrapped = false;
            print_token_space_before();
            output_space_before_token = false;
            output_lines[output_lines.length - 1].text.push(printable_token);
        }

        function indent() {
            flags.indentation_level += 1;
        }

        function deindent() {
            if (flags.indentation_level > 0 &&
                ((!flags.parent) || flags.indentation_level > flags.parent.indentation_level))
                flags.indentation_level -= 1;
        }

        function remove_redundant_indentation(frame) {
            // This implementation is effective but has some issues:
            //     - less than great performance due to array splicing
            //     - can cause line wrap to happen too soon due to indent removal
            //           after wrap points are calculated
            // These issues are minor compared to ugly indentation.

            if (frame.multiline_frame) return;

            // remove one indent from each line inside this section
            var index = frame.start_line_index;
            var splice_index = 0;
            var line;

            while (index < output_lines.length) {
                line = output_lines[index];
                index++;

                // skip empty lines
                if (line.text.length === 0) {
                    continue;
                }

                // skip the preindent string if present
                if (preindent_string && line.text[0] === preindent_string) {
                    splice_index = 1;
                } else {
                    splice_index = 0;
                }

                // remove one indent, if present
                if (line.text[splice_index] === indent_string) {
                    line.text.splice(splice_index, 1);
                }
            }
        }

        function set_mode(mode) {
            if (flags) {
                flag_store.push(flags);
                previous_flags = flags;
            } else {
                previous_flags = create_flags(null, mode);
            }

            flags = create_flags(previous_flags, mode);
        }

        function is_array(mode) {
            return mode === MODE.ArrayLiteral;
        }

        function is_expression(mode) {
            return in_array(mode, [MODE.Expression, MODE.ForInitializer, MODE.Conditional]);
        }

        function restore_mode() {
            if (flag_store.length > 0) {
                previous_flags = flags;
                flags = flag_store.pop();
            }
        }

        function start_of_object_property() {
            return flags.mode === MODE.ObjectLiteral && flags.last_text === ':' &&
                flags.ternary_depth === 0;
        }

        function start_of_statement() {
            if (
                (flags.last_text === 'do' ||
                    (flags.last_text === 'else' && token_text !== 'if') ||
                    (last_type === 'TK_END_EXPR' && (previous_flags.mode === MODE.ForInitializer || previous_flags.mode === MODE.Conditional)))) {
                // Issue #276:
                // If starting a new statement with [if, for, while, do], push to a new line.
                // if (a) if (b) if(c) d(); else e(); else f();
                allow_wrap_or_preserved_newline(
                    in_array(token_text, ['do', 'for', 'if', 'while']));

                set_mode(MODE.Statement);
                // Issue #275:
                // If starting on a newline, all of a statement should be indented.
                // if not, use line wrapping logic for indent.
                if (just_added_newline()) {
                    indent();
                    output_wrapped = false;
                }
                return true;
            }
            return false;
        }

        function all_lines_start_with(lines, c) {
            for (var i = 0; i < lines.length; i++) {
                var line = trim(lines[i]);
                if (line.charAt(0) !== c) {
                    return false;
                }
            }
            return true;
        }

        function is_special_word(word) {
            return in_array(word, ['case', 'return', 'do', 'if', 'throw', 'else']);
        }

        function in_array(what, arr) {
            for (var i = 0; i < arr.length; i += 1) {
                if (arr[i] === what) {
                    return true;
                }
            }
            return false;
        }

        function unescape_string(s) {
            var esc = false,
                out = '',
                pos = 0,
                s_hex = '',
                escaped = 0,
                c;

            while (esc || pos < s.length) {

                c = s.charAt(pos);
                pos++;

                if (esc) {
                    esc = false;
                    if (c === 'x') {
                        // simple hex-escape \x24
                        s_hex = s.substr(pos, 2);
                        pos += 2;
                    } else if (c === 'u') {
                        // unicode-escape, \u2134
                        s_hex = s.substr(pos, 4);
                        pos += 4;
                    } else {
                        // some common escape, e.g \n
                        out += '\\' + c;
                        continue;
                    }
                    if (!s_hex.match(/^[0123456789abcdefABCDEF]+$/)) {
                        // some weird escaping, bail out,
                        // leaving whole string intact
                        return s;
                    }

                    escaped = parseInt(s_hex, 16);

                    if (escaped >= 0x00 && escaped < 0x20) {
                        // leave 0x00...0x1f escaped
                        if (c === 'x') {
                            out += '\\x' + s_hex;
                        } else {
                            out += '\\u' + s_hex;
                        }
                        continue;
                    } else if (escaped === 0x22 || escaped === 0x27 || escaped === 0x5c) {
                        // single-quote, apostrophe, backslash - escape these
                        out += '\\' + String.fromCharCode(escaped);
                    } else if (c === 'x' && escaped > 0x7e && escaped <= 0xff) {
                        // we bail out on \x7f..\xff,
                        // leaving whole string escaped,
                        // as it's probably completely binary
                        return s;
                    } else {
                        out += String.fromCharCode(escaped);
                    }
                } else if (c === '\\') {
                    esc = true;
                } else {
                    out += c;
                }
            }
            return out;
        }

        function is_next(find) {
            var local_pos = parser_pos;
            var c = input.charAt(local_pos);
            while (in_array(c, whitespace) && c !== find) {
                local_pos++;
                if (local_pos >= input_length) {
                    return false;
                }
                c = input.charAt(local_pos);
            }
            return c === find;
        }

        function get_next_token() {
            var i, resulting_string;

            n_newlines = 0;

            if (parser_pos >= input_length) {
                return ['', 'TK_EOF'];
            }

            input_wanted_newline = false;
            whitespace_before_token = [];

            var c = input.charAt(parser_pos);
            parser_pos += 1;

            while (in_array(c, whitespace)) {

                if (c === '\n') {
                    n_newlines += 1;
                    whitespace_before_token = [];
                } else if (n_newlines) {
                    if (c === indent_string) {
                        whitespace_before_token.push(indent_string);
                    } else if (c !== '\r') {
                        whitespace_before_token.push(' ');
                    }
                }

                if (parser_pos >= input_length) {
                    return ['', 'TK_EOF'];
                }

                c = input.charAt(parser_pos);
                parser_pos += 1;
            }

            if (in_array(c, wordchar)) {
                if (parser_pos < input_length) {
                    while (in_array(input.charAt(parser_pos), wordchar)) {
                        c += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos === input_length) {
                            break;
                        }
                    }
                }

                // small and surprisingly unugly hack for 1E-10 representation
                if (parser_pos !== input_length && c.match(/^[0-9]+[Ee]$/) && (input.charAt(parser_pos) === '-' || input.charAt(parser_pos) === '+')) {

                    var sign = input.charAt(parser_pos);
                    parser_pos += 1;

                    var t = get_next_token();
                    c += sign + t[0];
                    return [c, 'TK_WORD'];
                }

                if (c === 'in') { // hack for 'in' operator
                    return [c, 'TK_OPERATOR'];
                }
                return [c, 'TK_WORD'];
            }

            if (c === '(' || c === '[') {
                return [c, 'TK_START_EXPR'];
            }

            if (c === ')' || c === ']') {
                return [c, 'TK_END_EXPR'];
            }

            if (c === '{') {
                return [c, 'TK_START_BLOCK'];
            }

            if (c === '}') {
                return [c, 'TK_END_BLOCK'];
            }

            if (c === ';') {
                return [c, 'TK_SEMICOLON'];
            }

            if (c === '/') {
                var comment = '';
                // peek for comment /* ... */
                var inline_comment = true;
                if (input.charAt(parser_pos) === '*') {
                    parser_pos += 1;
                    if (parser_pos < input_length) {
                        while (parser_pos < input_length && !(input.charAt(parser_pos) === '*' && input.charAt(parser_pos + 1) && input.charAt(parser_pos + 1) === '/')) {
                            c = input.charAt(parser_pos);
                            comment += c;
                            if (c === "\n" || c === "\r") {
                                inline_comment = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                break;
                            }
                        }
                    }
                    parser_pos += 2;
                    if (inline_comment && n_newlines === 0) {
                        return ['/*' + comment + '*/', 'TK_INLINE_COMMENT'];
                    } else {
                        return ['/*' + comment + '*/', 'TK_BLOCK_COMMENT'];
                    }
                }
                // peek for comment // ...
                if (input.charAt(parser_pos) === '/') {
                    comment = c;
                    while (input.charAt(parser_pos) !== '\r' && input.charAt(parser_pos) !== '\n') {
                        comment += input.charAt(parser_pos);
                        parser_pos += 1;
                        if (parser_pos >= input_length) {
                            break;
                        }
                    }
                    return [comment, 'TK_COMMENT'];
                }

            }


            if (c === "'" || c === '"' || // string
                (
                    (c === '/') || // regexp
                    (opt.e4x && c === "<" && input.slice(parser_pos - 1).match(/^<([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*\/?\s*>/)) // xml
                ) && ( // regex and xml can only appear in specific locations during parsing
                    (last_type === 'TK_WORD' && is_special_word(flags.last_text)) ||
                    (last_type === 'TK_END_EXPR' && in_array(previous_flags.mode, [MODE.Conditional, MODE.ForInitializer])) ||
                    (in_array(last_type, ['TK_COMMENT', 'TK_START_EXPR', 'TK_START_BLOCK',
                        'TK_END_BLOCK', 'TK_OPERATOR', 'TK_EQUALS', 'TK_EOF', 'TK_SEMICOLON', 'TK_COMMA'
                    ]))
                )) {

                var sep = c,
                    esc = false,
                    has_char_escapes = false;

                resulting_string = c;

                if (parser_pos < input_length) {
                    if (sep === '/') {
                        //
                        // handle regexp
                        //
                        var in_char_class = false;
                        while (esc || in_char_class || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (!esc) {
                                esc = input.charAt(parser_pos) === '\\';
                                if (input.charAt(parser_pos) === '[') {
                                    in_char_class = true;
                                } else if (input.charAt(parser_pos) === ']') {
                                    in_char_class = false;
                                }
                            } else {
                                esc = false;
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }
                    } else if (opt.e4x && sep === '<') {
                        //
                        // handle e4x xml literals
                        //
                        var xmlRegExp = /<(\/?)([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*(\/?)\s*>/g;
                        var xmlStr = input.slice(parser_pos - 1);
                        var match = xmlRegExp.exec(xmlStr);
                        if (match && match.index === 0) {
                            var rootTag = match[2];
                            var depth = 0;
                            while (match) {
                                var isEndTag = !! match[1];
                                var tagName = match[2];
                                var isSingletonTag = ( !! match[match.length - 1]) || (tagName.slice(0, 8) === "![CDATA[");
                                if (tagName === rootTag && !isSingletonTag) {
                                    if (isEndTag) {
                                        --depth;
                                    } else {
                                        ++depth;
                                    }
                                }
                                if (depth <= 0) {
                                    break;
                                }
                                match = xmlRegExp.exec(xmlStr);
                            }
                            var xmlLength = match ? match.index + match[0].length : xmlStr.length;
                            parser_pos += xmlLength - 1;
                            return [xmlStr.slice(0, xmlLength), "TK_STRING"];
                        }
                    } else {
                        //
                        // handle string
                        //
                        while (esc || input.charAt(parser_pos) !== sep) {
                            resulting_string += input.charAt(parser_pos);
                            if (esc) {
                                if (input.charAt(parser_pos) === 'x' || input.charAt(parser_pos) === 'u') {
                                    has_char_escapes = true;
                                }
                                esc = false;
                            } else {
                                esc = input.charAt(parser_pos) === '\\';
                            }
                            parser_pos += 1;
                            if (parser_pos >= input_length) {
                                // incomplete string/rexp when end-of-file reached.
                                // bail out with what had been received so far.
                                return [resulting_string, 'TK_STRING'];
                            }
                        }

                    }
                }

                parser_pos += 1;
                resulting_string += sep;

                if (has_char_escapes && opt.unescape_strings) {
                    resulting_string = unescape_string(resulting_string);
                }

                if (sep === '/') {
                    // regexps may have modifiers /regexp/MOD , so fetch those, too
                    while (parser_pos < input_length && in_array(input.charAt(parser_pos), wordchar)) {
                        resulting_string += input.charAt(parser_pos);
                        parser_pos += 1;
                    }
                }
                return [resulting_string, 'TK_STRING'];
            }

            if (c === '#') {


                if (output_lines.length === 1 && output_lines[0].text.length === 0 &&
                    input.charAt(parser_pos) === '!') {
                    // shebang
                    resulting_string = c;
                    while (parser_pos < input_length && c !== '\n') {
                        c = input.charAt(parser_pos);
                        resulting_string += c;
                        parser_pos += 1;
                    }
                    return [trim(resulting_string) + '\n', 'TK_UNKNOWN'];
                }



                // Spidermonkey-specific sharp variables for circular references
                // https://developer.mozilla.org/En/Sharp_variables_in_JavaScript
                // http://mxr.mozilla.org/mozilla-central/source/js/src/jsscan.cpp around line 1935
                var sharp = '#';
                if (parser_pos < input_length && in_array(input.charAt(parser_pos), digits)) {
                    do {
                        c = input.charAt(parser_pos);
                        sharp += c;
                        parser_pos += 1;
                    } while (parser_pos < input_length && c !== '#' && c !== '=');
                    if (c === '#') {
                        //
                    } else if (input.charAt(parser_pos) === '[' && input.charAt(parser_pos + 1) === ']') {
                        sharp += '[]';
                        parser_pos += 2;
                    } else if (input.charAt(parser_pos) === '{' && input.charAt(parser_pos + 1) === '}') {
                        sharp += '{}';
                        parser_pos += 2;
                    }
                    return [sharp, 'TK_WORD'];
                }
            }

            if (c === '<' && input.substring(parser_pos - 1, parser_pos + 3) === '<!--') {
                parser_pos += 3;
                c = '<!--';
                while (input.charAt(parser_pos) !== '\n' && parser_pos < input_length) {
                    c += input.charAt(parser_pos);
                    parser_pos++;
                }
                flags.in_html_comment = true;
                return [c, 'TK_COMMENT'];
            }

            if (c === '-' && flags.in_html_comment && input.substring(parser_pos - 1, parser_pos + 2) === '-->') {
                flags.in_html_comment = false;
                parser_pos += 2;
                return ['-->', 'TK_COMMENT'];
            }

            if (c === '.') {
                return [c, 'TK_DOT'];
            }

            if (in_array(c, punct)) {
                while (parser_pos < input_length && in_array(c + input.charAt(parser_pos), punct)) {
                    c += input.charAt(parser_pos);
                    parser_pos += 1;
                    if (parser_pos >= input_length) {
                        break;
                    }
                }

                if (c === ',') {
                    return [c, 'TK_COMMA'];
                } else if (c === '=') {
                    return [c, 'TK_EQUALS'];
                } else {
                    return [c, 'TK_OPERATOR'];
                }
            }

            return [c, 'TK_UNKNOWN'];
        }

        function handle_start_expr() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            }

            var next_mode = MODE.Expression;
            if (token_text === '[') {

                if (last_type === 'TK_WORD' || flags.last_text === ')') {
                    // this is array index specifier, break immediately
                    // a[x], fn()[x]
                    if (in_array(flags.last_text, line_starters)) {
                        output_space_before_token = true;
                    }
                    set_mode(next_mode);
                    print_token();
                    indent();
                    if (opt.space_in_paren) {
                        output_space_before_token = true;
                    }
                    return;
                }

                next_mode = MODE.ArrayLiteral;
                if (is_array(flags.mode)) {
                    if (flags.last_text === '[' ||
                        (flags.last_text === ',' && (last_last_text === ']' || last_last_text === '}'))) {
                        // ], [ goes to new line
                        // }, [ goes to new line
                        if (!opt.keep_array_indentation) {
                            print_newline();
                        }
                    }
                }

            } else {
                if (flags.last_text === 'for') {
                    next_mode = MODE.ForInitializer;
                } else if (in_array(flags.last_text, ['if', 'while'])) {
                    next_mode = MODE.Conditional;
                } else {
                    // next_mode = MODE.Expression;
                }
            }

            if (flags.last_text === ';' || last_type === 'TK_START_BLOCK') {
                print_newline();
            } else if (last_type === 'TK_END_EXPR' || last_type === 'TK_START_EXPR' || last_type === 'TK_END_BLOCK' || flags.last_text === '.') {
                // TODO: Consider whether forcing this is required.  Review failing tests when removed.
                allow_wrap_or_preserved_newline(input_wanted_newline);
                output_wrapped = false;
                // do nothing on (( and )( and ][ and ]( and .(
            } else if (last_type !== 'TK_WORD' && last_type !== 'TK_OPERATOR') {
                output_space_before_token = true;
            } else if (flags.last_word === 'function' || flags.last_word === 'typeof') {
                // function() vs function ()
                if (opt.jslint_happy) {
                    output_space_before_token = true;
                }
            } else if (in_array(flags.last_text, line_starters) || flags.last_text === 'catch') {
                if (opt.space_before_conditional) {
                    output_space_before_token = true;
                }
            }

            // Support of this kind of newline preservation.
            // a = (b &&
            //     (c || d));
            if (token_text === '(') {
                if (last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                    if (!start_of_object_property()) {
                        allow_wrap_or_preserved_newline();
                    }
                }
            }

            set_mode(next_mode);
            print_token();
            if (opt.space_in_paren) {
                output_space_before_token = true;
            }

            // In all cases, if we newline while inside an expression it should be indented.
            indent();
        }

        function handle_end_expr() {
            // statements inside expressions are not valid syntax, but...
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }

            if (token_text === ']' && is_array(flags.mode) && flags.multiline_frame && !opt.keep_array_indentation) {
                print_newline();
            }

            if (flags.multiline_frame) {
                allow_wrap_or_preserved_newline();
            }
            if (opt.space_in_paren) {
                if (last_type === 'TK_START_EXPR') {
                    // () [] no inner space in empty parens like these, ever, ref #320
                    trim_output();
                    output_space_before_token = false;
                } else {
                    output_space_before_token = true;
                }
            }
            if (token_text === ']' && opt.keep_array_indentation) {
                print_token();
                restore_mode();
            } else {
                restore_mode();
                print_token();
            }
            remove_redundant_indentation(previous_flags);

            // do {} while () // no statement required after
            if (flags.do_while && previous_flags.mode === MODE.Conditional) {
                previous_flags.mode = MODE.Expression;
                flags.do_block = false;
                flags.do_while = false;

            }
        }

        function handle_start_block() {
            set_mode(MODE.BlockStatement);

            var empty_braces = is_next('}');
            var empty_anonymous_function = empty_braces && flags.last_word === 'function' &&
                last_type === 'TK_END_EXPR';

            if (opt.brace_style === "expand") {
                if (last_type !== 'TK_OPERATOR' &&
                    (empty_anonymous_function ||
                        last_type === 'TK_EQUALS' ||
                        (is_special_word(flags.last_text) && flags.last_text !== 'else'))) {
                    output_space_before_token = true;
                } else {
                    print_newline();
                }
            } else { // collapse
                if (last_type !== 'TK_OPERATOR' && last_type !== 'TK_START_EXPR') {
                    if (last_type === 'TK_START_BLOCK') {
                        print_newline();
                    } else {
                        output_space_before_token = true;
                    }
                } else {
                    // if TK_OPERATOR or TK_START_EXPR
                    if (is_array(previous_flags.mode) && flags.last_text === ',') {
                        if (last_last_text === '}') {
                            // }, { in array context
                            output_space_before_token = true;
                        } else {
                            print_newline(); // [a, b, c, {
                        }
                    }
                }
            }
            print_token();
            indent();
        }

        function handle_end_block() {
            // statements must all be closed when their container closes
            while (flags.mode === MODE.Statement) {
                restore_mode();
            }
            var empty_braces = last_type === 'TK_START_BLOCK';

            if (opt.brace_style === "expand") {
                if (!empty_braces) {
                    print_newline();
                }
            } else {
                // skip {}
                if (!empty_braces) {
                    if (is_array(flags.mode) && opt.keep_array_indentation) {
                        // we REALLY need a newline here, but newliner would skip that
                        opt.keep_array_indentation = false;
                        print_newline();
                        opt.keep_array_indentation = true;

                    } else {
                        print_newline();
                    }
                }
            }
            restore_mode();
            print_token();
        }

        function handle_word() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
            } else if (input_wanted_newline && !is_expression(flags.mode) &&
                (last_type !== 'TK_OPERATOR' || (flags.last_text === '--' || flags.last_text === '++')) &&
                last_type !== 'TK_EQUALS' &&
                (opt.preserve_newlines || flags.last_text !== 'var')) {

                print_newline();
            }

            if (flags.do_block && !flags.do_while) {
                if (token_text === 'while') {
                    // do {} ## while ()
                    output_space_before_token = true;
                    print_token();
                    output_space_before_token = true;
                    flags.do_while = true;
                    return;
                } else {
                    // do {} should always have while as the next word.
                    // if we don't see the expected while, recover
                    print_newline();
                    flags.do_block = false;
                }
            }

            // if may be followed by else, or not
            // Bare/inline ifs are tricky
            // Need to unwind the modes correctly: if (a) if (b) c(); else d(); else e();
            if (flags.if_block) {
                if (token_text !== 'else') {
                    while (flags.mode === MODE.Statement) {
                        restore_mode();
                    }
                    flags.if_block = false;
                }
            }

            if (token_text === 'case' || (token_text === 'default' && flags.in_case_statement)) {
                print_newline();
                if (flags.case_body || opt.jslint_happy) {
                    // switch cases following one another
                    deindent();
                    flags.case_body = false;
                }
                print_token();
                flags.in_case = true;
                flags.in_case_statement = true;
                return;
            }

            if (token_text === 'function') {
                if (flags.var_line && last_type !== 'TK_EQUALS') {
                    flags.var_line_reindented = true;
                }
                if ((just_added_newline() || flags.last_text === ';' || flags.last_text === '}') &&
                    flags.last_text !== '{' && !is_array(flags.mode)) {
                    // make sure there is a nice clean space of at least one blank line
                    // before a new function definition, except in arrays
                    if (!just_added_blankline()) {
                        print_newline();
                        print_newline(true);
                    }
                }
                if (last_type === 'TK_WORD') {
                    if (flags.last_text === 'get' || flags.last_text === 'set' || flags.last_text === 'new' || flags.last_text === 'return') {
                        output_space_before_token = true;
                    } else {
                        print_newline();
                    }
                } else if (last_type === 'TK_OPERATOR' || flags.last_text === '=') {
                    // foo = function
                    output_space_before_token = true;
                } else if (is_expression(flags.mode)) {
                    // (function
                } else {
                    print_newline();
                }
            }

            if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            }

            if (token_text === 'function') {
                print_token();
                flags.last_word = token_text;
                return;
            }

            prefix = 'NONE';

            if (last_type === 'TK_END_BLOCK') {
                if (!in_array(token_text, ['else', 'catch', 'finally'])) {
                    prefix = 'NEWLINE';
                } else {
                    if (opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                        prefix = 'NEWLINE';
                    } else {
                        prefix = 'SPACE';
                        output_space_before_token = true;
                    }
                }
            } else if (last_type === 'TK_SEMICOLON' && flags.mode === MODE.BlockStatement) {
                // TODO: Should this be for STATEMENT as well?
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_SEMICOLON' && is_expression(flags.mode)) {
                prefix = 'SPACE';
            } else if (last_type === 'TK_STRING') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_WORD') {
                prefix = 'SPACE';
            } else if (last_type === 'TK_START_BLOCK') {
                prefix = 'NEWLINE';
            } else if (last_type === 'TK_END_EXPR') {
                output_space_before_token = true;
                prefix = 'NEWLINE';
            }

            if (in_array(token_text, line_starters) && flags.last_text !== ')') {
                if (flags.last_text === 'else') {
                    prefix = 'SPACE';
                } else {
                    prefix = 'NEWLINE';
                }

            }

            if (in_array(token_text, ['else', 'catch', 'finally'])) {
                if (last_type !== 'TK_END_BLOCK' || opt.brace_style === "expand" || opt.brace_style === "end-expand") {
                    print_newline();
                } else {
                    trim_output(true);
                    var line = output_lines[output_lines.length - 1];
                    // If we trimmed and there's something other than a close block before us
                    // put a newline back in.  Handles '} // comment' scenario.
                    if (line.text[line.text.length - 1] !== '}') {
                        print_newline();
                    }
                    output_space_before_token = true;
                }
            } else if (prefix === 'NEWLINE') {
                if (is_special_word(flags.last_text)) {
                    // no newline between 'return nnn'
                    output_space_before_token = true;
                } else if (last_type !== 'TK_END_EXPR') {
                    if ((last_type !== 'TK_START_EXPR' || token_text !== 'var') && flags.last_text !== ':') {
                        // no need to force newline on 'var': for (var x = 0...)
                        if (token_text === 'if' && flags.last_word === 'else' && flags.last_text !== '{') {
                            // no newline for } else if {
                            output_space_before_token = true;
                        } else {
                            flags.var_line = false;
                            flags.var_line_reindented = false;
                            print_newline();
                        }
                    }
                } else if (in_array(token_text, line_starters) && flags.last_text !== ')') {
                    flags.var_line = false;
                    flags.var_line_reindented = false;
                    print_newline();
                }
            } else if (is_array(flags.mode) && flags.last_text === ',' && last_last_text === '}') {
                print_newline(); // }, in lists get a newline treatment
            } else if (prefix === 'SPACE') {
                output_space_before_token = true;
            }
            print_token();
            flags.last_word = token_text;

            if (token_text === 'var') {
                flags.var_line = true;
                flags.var_line_reindented = false;
                flags.var_line_tainted = false;
            }

            if (token_text === 'do') {
                flags.do_block = true;
            }

            if (token_text === 'if') {
                flags.if_block = true;
            }
        }

        function handle_semicolon() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // Semicolon can be the start (and end) of a statement
                output_space_before_token = false;
            }
            while (flags.mode === MODE.Statement && !flags.if_block && !flags.do_block) {
                restore_mode();
            }
            print_token();
            flags.var_line = false;
            flags.var_line_reindented = false;
            if (flags.mode === MODE.ObjectLiteral) {
                // if we're in OBJECT mode and see a semicolon, its invalid syntax
                // recover back to treating this as a BLOCK
                flags.mode = MODE.BlockStatement;
            }
        }

        function handle_string() {
            if (start_of_statement()) {
                // The conditional starts the statement if appropriate.
                // One difference - strings want at least a space before
                output_space_before_token = true;
            } else if (last_type === 'TK_WORD') {
                output_space_before_token = true;
            } else if (last_type === 'TK_COMMA' || last_type === 'TK_START_EXPR' || last_type === 'TK_EQUALS' || last_type === 'TK_OPERATOR') {
                if (!start_of_object_property()) {
                    allow_wrap_or_preserved_newline();
                }
            } else {
                print_newline();
            }
            print_token();
        }

        function handle_equals() {
            if (flags.var_line) {
                // just got an '=' in a var-line, different formatting/line-breaking, etc will now be done
                flags.var_line_tainted = true;
            }
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }

        function handle_comma() {
            if (flags.var_line) {
                if (is_expression(flags.mode) || last_type === 'TK_END_BLOCK') {
                    // do not break on comma, for(var a = 1, b = 2)
                    flags.var_line_tainted = false;
                }

                if (flags.var_line) {
                    flags.var_line_reindented = true;
                }

                print_token();

                if (flags.var_line_tainted) {
                    flags.var_line_tainted = false;
                    print_newline();
                } else {
                    output_space_before_token = true;
                }
                return;
            }

            if (last_type === 'TK_END_BLOCK' && flags.mode !== MODE.Expression) {
                print_token();
                if (flags.mode === MODE.ObjectLiteral && flags.last_text === '}') {
                    print_newline();
                } else {
                    output_space_before_token = true;
                }
            } else {
                if (flags.mode === MODE.ObjectLiteral) {
                    print_token();
                    print_newline();
                } else {
                    // EXPR or DO_BLOCK
                    print_token();
                    output_space_before_token = true;
                }
            }
        }

        function handle_operator() {
            var space_before = true;
            var space_after = true;
            if (is_special_word(flags.last_text)) {
                // "return" had a special handling in TK_WORD. Now we need to return the favor
                output_space_before_token = true;
                print_token();
                return;
            }

            // hack for actionscript's import .*;
            if (token_text === '*' && last_type === 'TK_DOT' && !last_last_text.match(/^\d+$/)) {
                print_token();
                return;
            }

            if (token_text === ':' && flags.in_case) {
                flags.case_body = true;
                indent();
                print_token();
                print_newline();
                flags.in_case = false;
                return;
            }

            if (token_text === '::') {
                // no spaces around exotic namespacing syntax operator
                print_token();
                return;
            }

            // http://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
            // if there is a newline between -- or ++ and anything else we should preserve it.
            if (input_wanted_newline && (token_text === '--' || token_text === '++')) {
                print_newline();
            }

            if (in_array(token_text, ['--', '++', '!']) || (in_array(token_text, ['-', '+']) && (in_array(last_type, ['TK_START_BLOCK', 'TK_START_EXPR', 'TK_EQUALS', 'TK_OPERATOR']) || in_array(flags.last_text, line_starters) || flags.last_text === ','))) {
                // unary operators (and binary +/- pretending to be unary) special cases

                space_before = false;
                space_after = false;

                if (flags.last_text === ';' && is_expression(flags.mode)) {
                    // for (;; ++i)
                    //        ^^^
                    space_before = true;
                }

                if (last_type === 'TK_WORD' && in_array(flags.last_text, line_starters)) {
                    space_before = true;
                }

                if ((flags.mode === MODE.BlockStatement || flags.mode === MODE.Statement) && (flags.last_text === '{' || flags.last_text === ';')) {
                    // { foo; --i }
                    // foo(); --bar;
                    print_newline();
                }
            } else if (token_text === ':') {
                if (flags.ternary_depth === 0) {
                    if (flags.mode === MODE.BlockStatement) {
                        flags.mode = MODE.ObjectLiteral;
                    }
                    space_before = false;
                } else {
                    flags.ternary_depth -= 1;
                }
            } else if (token_text === '?') {
                flags.ternary_depth += 1;
            }
            output_space_before_token = output_space_before_token || space_before;
            print_token();
            output_space_before_token = space_after;
        }

        function handle_block_comment() {
            var lines = split_newlines(token_text);
            var j; // iterator for this case
            var javadoc = false;

            // block comment starts with a new line
            print_newline(false, true);
            if (lines.length > 1) {
                if (all_lines_start_with(lines.slice(1), '*')) {
                    javadoc = true;
                }
            }

            // first line always indented
            print_token(lines[0]);
            for (j = 1; j < lines.length; j++) {
                print_newline(false, true);
                if (javadoc) {
                    // javadoc: reformat and re-indent
                    print_token(' ' + trim(lines[j]));
                } else {
                    // normal comments output raw
                    output_lines[output_lines.length - 1].text.push(lines[j]);
                }
            }

            // for comments of more than one line, make sure there's a new line after
            print_newline(false, true);
        }

        function handle_inline_comment() {
            output_space_before_token = true;
            print_token();
            output_space_before_token = true;
        }

        function handle_comment() {
            if (input_wanted_newline) {
                print_newline(false, true);
            } else {
                trim_output(true);
            }

            output_space_before_token = true;
            print_token();
            print_newline(false, true);
        }

        function handle_dot() {
            if (is_special_word(flags.last_text)) {
                output_space_before_token = true;
            } else {
                // allow preserved newlines before dots in general
                // force newlines on dots after close paren when break_chained - for bar().baz()
                allow_wrap_or_preserved_newline(flags.last_text === ')' && opt.break_chained_methods);
            }

            print_token();
        }

        function handle_unknown() {
            print_token();

            if (token_text[token_text.length - 1] === '\n') {
                print_newline();
            }
        }
    }


    if (typeof define === "function") {
        // Add support for require.js
        if (typeof define.amd === "undefined") {
            define('ecma-unparse/beautify', ['require','exports','module'],function(require, exports, module) {
                exports.js_beautify = js_beautify;
            });
        } else {
            // if is AMD ( https://github.com/amdjs/amdjs-api/wiki/AMD#defineamd-property- )
            define('ecma-unparse/beautify', [], function() {
                return js_beautify;
            });
        }

    } else if (typeof exports !== "undefined") {
        // Add support for CommonJS. Just put this file somewhere on your require.paths
        // and you will be able to `var js_beautify = require("beautify").js_beautify`.
        exports.js_beautify = js_beautify;
    } else if (typeof window !== "undefined") {
        // If we're running a web page and don't have either of the above, add our one global
        window.js_beautify = js_beautify;
    } else if (typeof global !== "undefined") {
        // If we don't even have window, try global.
        global.js_beautify = js_beautify;
    }

}());

define('ecma-unparse/print',['nu-stream/stream', './beautify'],
function(stream, beautify){

/**
 * Transforms a stream of tokens to strings.
 */
var print = (function(){
    var mapper = function(x) {
        if (!x)
            return '';
        
        switch (x.type) {
        case 'Null':
            return 'null';
        case 'Comment':
            return "/*" + x.value + "*/";
        case 'String':
            return JSON.stringify(x.value)
                .replace('\u2028', '\\u2028')
                .replace('\u2029', '\\u2029');
        default:
            return x.value;
        }
    };
    
    return function(s) {
        return beautify(
            stream.foldl(
                function(p, c) { return p + c; },
                '',
                stream.map(mapper, s)),
            {
                'preserve_newlines': false,
                "wrap_line_length": 120,
                "break_chained_methods": true
            });
    };
}());

return {
    'print': print
};

});
require(['nu-stream/stream',
         'khepri/lex/lexer',
         'khepri/parse/parser',
         'khepri/compile/transform',
         'khepri/compile/lexical',
         'khepri/compile/compile',
         'ecma-unparse/unparse',
         'ecma-unparse/print'],
function(stream,
        lexer,
        parser,
        transform,
        lexical,
        compile,
        unparse,
        unparse_print) {

var editor = CodeMirror.fromTextArea(document.getElementById('khepri-console-input'), {
    'mode': "javascript",
    'lineNumbers': true
});

var output = CodeMirror.fromTextArea(document.getElementById('javascript-console-output'), {
    'mode': "javascript",
    'lineNumbers': true,
    'readOnly': true
});


$(function () {
    $('button').click(function () {
        var input = editor.doc.getValue('\n');
        $('.ParseError').text('');
        $('#text_out').text('');
        
        var options = {
            'package_manager': $('#package_manager').val()
        };
        
        try {
            var lex = lexer.lex(input);
            var ast = parser.parseStream(lex);
            
            var ecam_ast = compile.compile(ast, options);
            var unparsed = unparse.unparse(ecam_ast);
            var s = unparse_print.print(unparsed);
            
            output.doc.setValue(s);
        } catch (e) {
            $('.ParseError').text(e);
        }
    });
});

});
define("javascripts/console.js", function(){});
