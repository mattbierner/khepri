/*
 * THIS FILE IS AUTO GENERATED from 'lib/parse/expression_parser.kep'
 * DO NOT EDIT
*/
define(["require", "parse/parse", "parse/parse_eager", "nu/stream", "khepri/parse/_common", "khepri/parse/program_parser", "khepri/parse/value_parser", "ecma/parse/token_parser", "ecma/ast/node", "ecma/ast/expression", "ecma/ast/value"], function(require, parse, parse_eager, stream, ecma_parse, program, value, token, astNode, astExpression, astValue) {
    "use strict";
    var assignmentExpression = function() {
        return assignmentExpression.apply(undefined, arguments);
    };
    var expression = function() {
        return expression.apply(undefined, arguments);
    };
    var functionExpression = function() {
        return require("khepri/parse/program_parser").functionExpression.apply(undefined, arguments);
    };
    var functionBody = function() {
        return require("khepri/parse/program_parser").functionBody.apply(undefined, arguments);
    };
    var precedence = function(p, table) {
        var sep = parse.choice.apply(undefined, table.map(function(entry) {
            return parse.bind(entry.sep, function(v) {
                return parse.always({
                    "value": v.value,
                    "node": entry.node,
                    "precedence": entry.precedence
                }, v.value);
            });
        }));
        return parse.bind(parse.rec(function(self) {
            return parse.consParser(p, parse.optional(parse.consParser(sep, self), stream.end));
        }), function(x) {
            var list = stream.toArray(x);
            var stack = [],out = [];
            while((list.length > 0)){
                var tok = list.shift();
                if (tok.type){
                    out.push(tok);
                }else {
                    while((stack.length > 0)){
                        var o2 = stack[(stack.length - 1)];
                        if ((o2.precedence <= tok.precedence)){
                            stack.pop();
                            var rt = out.pop(),lf = out.pop();
                            out.push(new astExpression[o2.node](o2.value, lf, rt));
                        }else {
                            break ;}}stack.push(tok);
                }}while((stack.length > 0)){
                var o = stack.pop();
                var rt = out.pop(),lf = out.pop();
                out.push(new astExpression[o.node](o.value, lf, rt));
            }return parse.always(out.pop());
        });
    };
    var elementList = parse_eager.sepBy(token.punctuator(","), assignmentExpression);
    var arrayLiteral = parse.Parser("Array Literal", ecma_parse.astNode(parse.between(token.punctuator("["), token.punctuator("]"), parse.bind(elementList, function(elements) {
        return parse.always(new astExpression.ArrayExpression(elements));
    }))));
    var propertyName = value.stringLiteral;
    var propertySetParameterList = value.identifier;
    var propertyAssignment = parse.choice(parse.attempt(parse.binda(parse.sequence(propertyName, token.punctuator(":"), assignmentExpression), function(name, _, value) {
        return parse.always({
            "key": name,
            "kind": "init",
            "value": value
        });
    })), parse.next(token.keyword("get"), parse.binda(parse.sequence(propertyName, token.punctuator("("), token.punctuator(")"), parse.between(token.punctuator("{"), token.punctuator("}"), functionBody)), function(name, _0, _1, body) {
        return parse.always({
            "key": name,
            "kind": "get",
            "value": new astExpression.FunctionExpression(null, [], body)
        });
    })), parse.next(token.keyword("set"), parse.binda(parse.sequence(propertyName, parse.between(token.punctuator("("), token.punctuator(")"), propertySetParameterList), parse.between(token.punctuator("{"), token.punctuator("}"), functionBody)), function(name, parameter, body) {
        return parse.always({
            "key": name,
            "kind": "set",
            "value": new astExpression.FunctionExpression(null, [parameter], body)
        });
    })));
    var propertyNameAndValueList = parse_eager.sepBy(token.punctuator(","), propertyAssignment);
    var objectLiteral = parse.Parser("Object Literal", ecma_parse.astNode(parse.between(token.punctuator("{"), token.punctuator("}"), parse.binda(parse.sequence(propertyNameAndValueList, parse.optional(token.punctuator(","))), function(properties) {
        return parse.always(new astExpression.ObjectExpression(properties));
    }))));
    var thisExpression = ecma_parse.astNode(parse.bind(token.keyword("this"), function() {
        return parse.always(new astExpression.ThisExpression());
    }));
    var primaryExpression = parse.Parser("Primary Expression", parse.choice(thisExpression, parse.attempt(value.identifier), value.literal, arrayLiteral, parse.attempt(objectLiteral), parse.between(token.punctuator("("), token.punctuator(")"), expression)));
    var argumentList = parse_eager.sepBy(token.punctuator(","), assignmentExpression);
    var args = parse.between(token.punctuator("("), token.punctuator(")"), argumentList);
    var dotAccessor = parse.bind(parse.next(token.punctuator("."), value.identifier), function(x) {
        return parse.always([{
            "property": x,
            "computed": false
        }]);
    });
    var bracketAccessor = parse.bind(parse.between(token.punctuator("["), token.punctuator("]"), parse_eager.sepBy1(token.punctuator(","), expression)), function(accessor) {
        return parse.always(accessor.map(function(x) {
            return {
                "property": x,
                "computed": true
            };
        }));
    });
    var accessor = parse.either(dotAccessor, bracketAccessor);
    var accessorReducer = function(p, c) {
        return new astExpression.MemberExpression(p, c.property, c.computed);
    };
    var memberExpression = function() {
        var reducer = function(p, c) {
            return c.reduce(accessorReducer, p);
        };
        return parse.RecParser("Member Expression", function(self) {
            return parse.binda(parse.sequence(parse.choice(parse.attempt(parse.next(token.keyword("new"), parse.binda(parse.sequence(self, args), function(expression, a) {
                return parse.always(new astExpression.NewExpression(expression, a));
            }))), parse.attempt(functionExpression), primaryExpression), parse.many(accessor)), function(expression, props) {
                return parse.always(stream.foldl(reducer, expression, props));
            });
        });
    }();
    var callExpression = function() {
        var reducer = function(p, c) {
            return (((Array.isArray(c) && (c.length > 0)) && c[0].hasOwnProperty("property")) ? c.reduce(accessorReducer, p) : new astExpression.CallExpression(p, c));
        };
        return parse.Parser("Call Expression", parse.binda(parse.sequence(parse.memo(memberExpression), args, parse.many(parse.either(parse.attempt(args), accessor))), function(member, a, accessors) {
            return parse.always(stream.foldl(reducer, new astExpression.CallExpression(member, a), accessors));
        }));
    }();
    var newExpression = parse.RecParser("New Expression", function(self) {
        return parse.either(parse.attempt(parse.memo(memberExpression)), parse.next(token.keyword("new"), parse.bind(self, function(x) {
            return parse.always(new astExpression.NewExpression(x, []));
        })));
    });
    var leftHandSideExpression = parse.Parser("Left Hand Side Expression", parse.either(parse.attempt(callExpression), newExpression));
    var unaryOperator = parse.choice(token.keyword("delete"), token.keyword("void"), token.keyword("typeof"), token.punctuator("+"), token.punctuator("-"), token.punctuator("~"), token.punctuator("!"));
    var unaryExpression = function() {
        var reducer = function(argument, op) {
            return new astExpression.UnaryExpression(op.value, argument);
        };
        return parse.binda(parse.sequence(parse.many(unaryOperator), leftHandSideExpression), function(ops, expression) {
            return parse.always(stream.foldr(reducer, expression, ops));
        });
    }();
    var multiplicativeOperator = parse.choice(token.punctuator("*"), token.punctuator("/"), token.punctuator("%"));
    var additiveOperator = parse.either(token.punctuator("+"), token.punctuator("-"));
    var shiftOperator = parse.choice(token.punctuator("<<"), token.punctuator(">>"), token.punctuator(">>>"));
    var relationalOperator = parse.choice(token.punctuator("<"), token.punctuator(">"), token.punctuator("<="), token.punctuator(">="), token.keyword("instanceof"));
    var equalityOperator = parse.choice(token.punctuator("=="), token.punctuator("!="), token.punctuator("==="), token.punctuator("!=="));
    var bitwiseANDOperator = token.punctuator("&");
    var bitwiseXOROperator = token.punctuator("^");
    var bitwiseOROperator = token.punctuator("|");
    var logicalANDOperator = token.punctuator("&&");
    var logicalOROperator = token.punctuator("||");
    var precedenceTable = [{
        "sep": multiplicativeOperator,
        "precedence": 1,
        "node": "BinaryExpression"
    }, {
        "sep": additiveOperator,
        "precedence": 2,
        "node": "BinaryExpression"
    }, {
        "sep": shiftOperator,
        "precedence": 3,
        "node": "BinaryExpression"
    }, {
        "sep": equalityOperator,
        "precedence": 5,
        "node": "BinaryExpression"
    }, {
        "sep": bitwiseANDOperator,
        "precedence": 6,
        "node": "BinaryExpression"
    }, {
        "sep": bitwiseXOROperator,
        "precedence": 7,
        "node": "BinaryExpression"
    }, {
        "sep": bitwiseOROperator,
        "precedence": 8,
        "node": "BinaryExpression"
    }, {
        "sep": logicalOROperator,
        "precedence": 9,
        "node": "LogicalExpression"
    }, {
        "sep": logicalANDOperator,
        "precedence": 10,
        "node": "LogicalExpression"
    }, {
        "sep": relationalOperator,
        "precedence": 4,
        "node": "BinaryExpression"
    }];
    var binExpression = parse.Parser("Binary Expression", precedence(unaryExpression, precedenceTable));
    var conditionalExpression = parse.Parser("Conditional Expression", function() {
        var conditionalBody = parse.sequence(token.punctuator("?"), assignmentExpression, token.punctuator(":"), assignmentExpression);
        return parse.bind(binExpression, function(bin) {
            return parse.either(parse.binda(conditionalBody, function(_0, consequent, _1, alternate) {
                return parse.always(new astExpression.ConditionalExpression(bin, consequent, alternate));
            }), parse.always(bin));
        });
    }());
    var assignmentOperator = parse.choice(token.punctuator("="), token.punctuator("*="), token.punctuator("*="), token.punctuator("/="), token.punctuator("%="), token.punctuator("+="), token.punctuator("-="), token.punctuator("<<="), token.punctuator(">>="), token.punctuator(">>>="), token.punctuator("&="), token.punctuator("^="), token.punctuator("|="));
    var assignmentExpression = parse.rec(function(self) {
        return parse.backtrack(parse.either(parse.attempt(parse.binda(parse.sequence(parse.memo(leftHandSideExpression), assignmentOperator, self), function(left, operator, right) {
            return parse.always(new astExpression.AssignmentExpression(operator.value, left, right));
        })), conditionalExpression));
    });
    (expression = assignmentExpression);
    return {
        "arrayLiteral": arrayLiteral,
        "objectLiteral": objectLiteral,
        "leftHandSideExpression": leftHandSideExpression,
        "assignmentExpression": assignmentExpression,
        "expression": expression
    };
});
