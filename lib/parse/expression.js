/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'stream', 
        'ecma/parse/program',
        'ecma/ast/node', 'ecma/ast/expression', 'ecma/ast/value',
        'ecma/parse/token'],
function(require,
        parse, parse_eager,
        stream,
        program,
        astNode, astExpression, astValue,
        token){
"use strict";

/* Forward Declarations
 ******************************************************************************/
var assignmentExpression = function() { return assignmentExpression.apply(undefined, arguments); };

var assignmentExpressionNoIn = function() { return assignmentExpressionNoIn.apply(undefined, arguments); };

var expression = function() { return expression.apply(undefined, arguments); };

var functionExpression = function() {
    return require('ecma/parse/program').functionExpression.apply(undefined, arguments);
};

var functionBody = function() {
    return require('ecma/parse/program').functionBody.apply(undefined, arguments);
};


/* Helpers 
 ******************************************************************************/
var precedence = function(p, table) {
    var sep = parse.choice.apply(undefined, table.map(function(entry) {
        return parse.bind(entry.sep, function(v) {
            return parse.always({
                'value': v.value,
                'node': entry.node,
                'precedence': entry.precedence
            }, v.value);
        });
    }));
    
    return parse.bind(
        parse.rec(function(self) {
            return parse.consParser(p,
                parse.optional(parse.consParser(sep, self), stream.end));
            }),
        function(x) {
            var list = stream.toArray(x);
            var stack = [], out = [];
            
            while (list.length > 0) {
                var tok = list.shift();
                if (tok.type) {
                    out.push(tok);
                } else {
                    while (stack.length > 0) {
                        var o2 = stack[stack.length - 1];
                        if (o2.precedence <= tok.precedence) {
                            stack.pop();
                            var rt = out.pop(),
                                lf = out.pop();
                            out.push(new o2.node(o2.value, lf, rt));
                        } else {
                            break;
                        }
                    }
                    stack.push(tok);
                }
            }
            
            while (stack.length > 0){
                var o = stack.pop();
                var rt = out.pop(),
                    lf = out.pop();
                out.push(new o.node(o.value, lf, rt));
            }
            
            return parse.always(out.pop());
        });

};

/* Parsers
 ******************************************************************************/
// Literal
////////////////////////////////////////
/**
 * Parser for a simple ECMAScript literal, excluding array and object literals.
 */
var literal = parse.Parser('Literal',
    parse.bind(
        parse.choice(
            parse.attempt(token.nullLiteral),
            parse.attempt(token.booleanLiteral),
            parse.attempt(token.numericLiteral),
            parse.attempt(token.stringLiteral),
            token.regularExpressionLiteral),
        function(x) {
            return parse.always(new astValue.Literal(x.value));
        }));

// Array Literal
////////////////////////////////////////
var elementList = parse_eager.sepBy(token.punctuator(','),
    parse.optional(assignmentExpression, null));

/**
 * Parser for an ECMASccript array literal.
 */
var arrayLiteral = parse.Parser('Array Literal',
    parse.between(token.punctuator('['), token.punctuator(']'),
        parse.bind(
            elementList,
            function(elements) {
                return parse.always(new astExpression.ArrayExpression(elements));
        })));

// Object Literal
////////////////////////////////////////
var propertyName = parse.choice(
    parse.attempt(token.identifier),
    parse.attempt(token.stringLiteral),
    token.numericLiteral);

var propertySetParameterList = token.identifier;

var propertyAssignment = parse.choice(
    parse.attempt(parse.binda(
        parse.sequence(
            propertyName,
            token.punctuator(':'),
            assignmentExpression),
        function(name, _, value) {
            return parse.always({
                'key': name,
                'kind': 'init',
                'value': value
            });
        })),
    parse.next(token.specificIdentifier('get'),
        parse.binda(
            parse.sequence(
                propertyName,
                token.punctuator('('),
                token.punctuator(')'),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(name, _2, _3, body) {
                return parse.always({
                    'key': name,
                    'kind': 'get',
                    'value': new astExpression.FunctionExpression(null, [], body)
                });
            })),
    parse.next(token.specificIdentifier('set'),
        parse.binda(
            parse.sequence(
                propertyName,
                parse.between(token.punctuator('('), token.punctuator(')'),
                    token.identifier),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(name, parameter, body) {
                return parse.always({
                    'key': name,
                    'kind': 'set',
                    'value': new astExpression.FunctionExpression(null, [parameter], body)
                });
            })));

var propertyNameAndValueList = parse_eager.sepBy(token.punctuator(','),
    propertyAssignment);

/**
 * Parser for an ECMAScript object literal.
 */
var objectLiteral = parse.Parser('Object Literal',
    parse.between(token.punctuator('{'), token.punctuator('}'),
        parse.binda(
            parse.sequence(
                propertyNameAndValueList,
                parse.optional(token.punctuator(','))),
            function(properties) {
                return parse.always(new astExpression.ObjectExpression(properties));
            })));

// Primary Expression
////////////////////////////////////////
var primaryExpression = parse.Parser('Primary Expression',
    parse.choice(
        token.keyword('this'),
        token.identifier,
        literal,
        arrayLiteral,
        objectLiteral,
        parse.between(token.punctuator('('), token.punctuator(')'),
            expression)));

// Member Expression
////////////////////////////////////////
var argumentList = parse_eager.sepBy(token.punctuator(','),
    assignmentExpression);

var args = parse.between(token.punctuator('('), token.punctuator(')'),
    argumentList);

var dotAccessor = parse.next(token.punctuator('.'),
    token.identifier);

var bracketAccessor = parse.between(token.punctuator('['), token.punctuator(']'),
    expression);

var accessor = parse.either(
    parse.attempt(dotAccessor),
    bracketAccessor);

/**
 * 
 */
var memberExpression = (function(){
    var reducer = function(p, c){
        return new astExpression.MemberExpression(p, c);
    };
    
    return parse.RecParser('Member Expression', function(self) {
        return parse.binda(
                parse.sequence(
                    parse.choice(
                        parse.attempt(parse.next(token.keyword('new'),
                            parse.binda(
                                parse.sequence(
                                    self,
                                    args),
                                function(expression, a) {
                                    return parse.always(new astExpression.NewExpression(expression, a));
                                }))),
                        parse.attempt(primaryExpression),
                        functionExpression),
                    parse.many(accessor)),
                function(expression, props) {
                    return parse.always(stream.reduce(props, reducer, expression));
                });
    });
}());

// Call Expression
////////////////////////////////////////
var callExpression = (function(){
    var reducer = function(p, c) {
        return (c instanceof astNode.Node ?
             new astExpression.MemberExpression(p, c) :
             new astExpression.CallExpression(p, c))
    };
    
    return parse.Parser('Call Expression',
        parse.binda(
            parse.sequence(
                parse.memo(memberExpression),
                args,
                parse.many(parse.either(
                    parse.attempt(args),
                    accessor))),
            function(member, a, accessors) {
                return parse.always(stream.reduce(accessors, reducer, new astExpression.CallExpression(member, a)));
            }));
}());


// New Expression
////////////////////////////////////////
var newExpression = parse.RecParser('New Expression', function(self) {
    return parse.either(
        parse.attempt(parse.memo(memberExpression)),
        parse.next(token.keyword('new'),
            parse.bind(self, function(v) {
                return parse.always(new astExpression.NewExpression(v));
            })));
});

// Left Hand Side Expression
////////////////////////////////////////
var leftHandSideExpression = parse.Parser('Left Hand Side Expression',
    parse.either(
        parse.attempt(callExpression),
        newExpression));

// Postfix Expression
////////////////////////////////////////
var postfixOperator = parse.either(
    token.punctuator('++'),
    token.punctuator('--'));

var postfixExpression = parse.binda(
    parse.sequence(
        parse.memo(leftHandSideExpression),
        parse.optional(postfixOperator)),
    function(argument, op) {
        return parse.always(op ?
            new astExpression.UpdateExpression(op.value, argument, false) :
            argument);
    });

// Unary Expression
////////////////////////////////////////
var unaryOperator = parse.choice(
    token.keyword('delete'),
    token.keyword('void'),
    token.keyword('typeof'),
    token.punctuator('++'),
    token.punctuator('--'),
    token.punctuator('+'),
    token.punctuator('-'),
    token.punctuator('~'),
    token.punctuator('!'));

var unaryExpression = (function(){
    var reducer = function(argument, op) {
        if (op.value === '++' || op.value === '--') {
            return new astExpression.UpdateExpression(op.value, argument, true);
        } else {
            return new astExpression.UnaryExpression(op, argument);
        }
    };
    3
    return parse.binda(
        parse.sequence(
            parse.many(unaryOperator),
            postfixExpression),
        function(ops, expression) {
            return parse.always(stream.reduceRight(ops, reducer, expression));
        });
}());

// Binary Expressions
////////////////////////////////////////
var multiplicativeOperator = parse.choice(
    token.punctuator('*'),
    token.punctuator('/'),
    token.punctuator('%'));

var additiveOperator = parse.either(
    token.punctuator('+'),
    token.punctuator('-'));

var shiftOperator = parse.choice(
    token.punctuator('<<'),
    token.punctuator('>>'),
    token.punctuator('>>>'));

var relationalOperatorNoIn = parse.choice(
    token.punctuator('<'),
    token.punctuator('>'),
    token.punctuator('<='),
    token.punctuator('>='),
    token.keyword('instanceof'));

var relationalOperator = parse.either(
    relationalOperatorNoIn,
    token.keyword('in'));

var equalityOperator = parse.choice(
    token.punctuator('=='),
    token.punctuator('!='),
    token.punctuator('==='),
    token.punctuator('!=='));

var bitwiseANDOperator = token.punctuator('&');

var bitwiseXOROperator = token.punctuator('^');

var bitwiseOROperator = token.punctuator('|');

var logicalANDOperator = token.punctuator('&&');

var logicalOROperator = token.punctuator('||');

var basePrecedenceTable = [
    {
        'sep': multiplicativeOperator,
        'precedence': 1,
        'node': astExpression.BinaryExpression
    },
    {
        'sep': additiveOperator,
        'precedence': 2,
        'node': astExpression.BinaryExpression
    },
    {
        'sep': shiftOperator,
        'precedence': 3,
        'node': astExpression.BinaryExpression
    },
    {
        'sep': equalityOperator,
        'precedence': 5,
        'node': astExpression.BinaryExpression
    },
    {
        'sep': bitwiseANDOperator,
        'precedence': 6,
        'node': astExpression.BinaryExpression
    },
    {
        'sep': bitwiseXOROperator,
        'precedence': 7,
        'node': astExpression.BinaryExpression
    },
    {
        'sep': bitwiseOROperator,
        'precedence': 8,
        'node': astExpression.BinaryExpression
    },
    {
        'sep': logicalOROperator,
        'precedence': 9,
        'node': astExpression.LogicalExpression
    },
    {
        'sep': logicalANDOperator,
        'precedence': 10,
        'node': astExpression.LogicalExpression
    }
];

var precedenceTable = basePrecedenceTable.concat([
    {
        'sep': relationalOperator,
        'precedence': 4,
        'node': astExpression.BinaryExpression
    }
]);

var precedenceTableNoIn = basePrecedenceTable.concat([
    {
        'sep': relationalOperatorNoIn,
        'precedence': 4,
        'node': astExpression.BinaryExpression
    }
]);

var binExpression = parse.Parser('Binary Expression',
    precedence(unaryExpression, precedenceTable));

var binExpressionNoIn = parse.Parser('Binary Expression',
    precedence(unaryExpression, precedenceTableNoIn));

// Conditional Expression
////////////////////////////////////////
var conditionalExpression = parse.Parser('Conditional Expression',
    parse.backtrack(parse.either(
        parse.attempt(parse.binda(
            parse.sequence(
                parse.memo(binExpression),
                token.punctuator('?'),
                assignmentExpression,
                token.punctuator(':'),
                assignmentExpression),
            function(test, _1, consequent, _2, alternate) {
                return parse.always(new astExpression.ConditionalExpression(test, consequent, alternate));
            })),
        parse.memo(binExpression))));

var conditionalExpressionNoIn = parse.either(
    parse.attempt(parse.binda(
        parse.sequence(
            parse.memo(binExpressionNoIn),
            token.punctuator('?'),
            assignmentExpressionNoIn,
            token.punctuator(':'),
            assignmentExpressionNoIn),
        function(test, _1, consequent, _2, alternate) {
            return parse.always(new astExpression.ConditionalExpression(test, consequent, alternate));
        })),
    parse.memo(binExpressionNoIn));

// Assignment Expression
////////////////////////////////////////
var assignmentOperator = parse.choice(
    token.punctuator('='),
    token.punctuator('*='),
    token.punctuator('*='),
    token.punctuator('/='),
    token.punctuator('%='),
    token.punctuator('+='),
    token.punctuator('-='),
    token.punctuator('<<='),
    token.punctuator('>>='),
    token.punctuator('>>>='),
    token.punctuator('&='),
    token.punctuator('^='),
    token.punctuator('|='));

/**
 * 
 */
assignmentExpression = parse.RecParser('Assignment Expression', function(self) {
    return parse.backtrack(parse.either(
        parse.attempt(parse.binda(
            parse.sequence(
                parse.memo(leftHandSideExpression),
                assignmentOperator,
                self),
            function(left, operator, right) {
                return parse.always(new astExpression.AssignmentExpression(operator, left, right));
            })),
        conditionalExpression));
    });

/**
 * 
 */
var assignmentExpressionNoIn = parse.RecParser('Assignment Expression No In', function(self) {
    return parse.backtrack(parse.either(
        parse.attempt(parse.binda(
            parse.sequence(
                parse.memo(leftHandSideExpression),
                assignmentOperator,
                self),
            function(left, operator, right) {
                return parse.always(new astExpression.AssignmentExpression(operator, left, right));
            })),
        conditionalExpressionNoIn));
    });

// Expression
////////////////////////////////////////
/**
 * 
 */
expression = parse.Parser('Expression',
    parse.bind(
        parse_eager.sepBy1(token.punctuator(','),
            assignmentExpression),
        function(list) {
            return parse.always(list.length > 1 ?
                new astExpression.SequenceExpression(list) :
                list[0]);
        }));

/**
 * 
 */
var expressionNoIn = parse.Parser('Expression No In',
    parse.bind(
        parse_eager.sepBy1(token.punctuator(','),
            assignmentExpressionNoIn),
        function(list) {
            return parse.always(list.length > 1 ?
                new astExpression.SequenceExpression(list) :
                list[0]);
        }));

/* Export
 ******************************************************************************/
return {
    'arrayLiteral': arrayLiteral,
    'objectLiteral': objectLiteral,
    
    'leftHandSideExpression': leftHandSideExpression,
    
    'assignmentExpression': assignmentExpression,
    'assignmentExpressionNoIn': assignmentExpressionNoIn,
    
    'expression': expression,
    'expressionNoIn': expressionNoIn
};

});