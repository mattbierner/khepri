/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'stream', 
        'ecma/parse/program',
        'ecma/ast/node',
        'ecma/parse/token'],
function(require,
        parse, parse_eager,
        stream,
        program,
        astNode,
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
        function(x, state) {
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
                            out.push(new state.ast.expression[o2.node](o2.value, lf, rt));
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
                out.push(new state.ast.expression[o.node](o.value, lf, rt));
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
    parse.choice(
        parse.bind(token.nullLiteral, function(x, state) {
            return parse.always(new state.ast.value.Literal(x.value, 'null'));
        }),
        parse.bind(token.booleanLiteral, function(x, state) {
            return parse.always(new state.ast.value.Literal(x.value, 'boolean'));
        }),
        parse.bind(token.numericLiteral, function(x, state) {
            return parse.always(new state.ast.value.Literal(x.value, 'number'));
        }),
        parse.bind(token.stringLiteral, function(x, state) {
            return parse.always(new state.ast.value.Literal(x.value, 'string'));
        }),
        parse.bind(token.regularExpressionLiteral, function(x, state) {
            return parse.always(new state.ast.value.Literal(x.value, 'RegExp'));
        })));

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
            function(elements, state) {
                return parse.always(new state.ast.expression.ArrayExpression(elements));
        })));

// Object Literal
////////////////////////////////////////
var propertyName = parse.choice(
    parse.attempt(token.anyIdentifier),
    parse.attempt(token.stringLiteral),
    token.numericLiteral);

var propertySetParameterList = token.anyIdentifier;

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
    parse.next(token.identifier('get'),
        parse.binda(
            parse.sequence(
                propertyName,
                token.punctuator('('),
                token.punctuator(')'),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(name, _0, _1, body, state) {
                return parse.always({
                    'key': name,
                    'kind': 'get',
                    'value': new state.ast.expression.FunctionExpression(null, [], body)
                });
            })),
    parse.next(token.identifier('set'),
        parse.binda(
            parse.sequence(
                propertyName,
                parse.between(token.punctuator('('), token.punctuator(')'),
                    propertySetParameterList),
                parse.between(token.punctuator('{'), token.punctuator('}'),
                    functionBody)),
            function(name, parameter, body, state) {
                return parse.always({
                    'key': name,
                    'kind': 'set',
                    'value': new state.ast.expression.FunctionExpression(null, [parameter], body)
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
            function(properties, _, state) {
                return parse.always(new state.ast.expression.ObjectExpression(properties));
            })));

// Primary Expression
////////////////////////////////////////
var primaryExpression = parse.Parser('Primary Expression',
    parse.choice(
        token.keyword('this'),
        token.anyIdentifier,
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
    token.anyIdentifier);

var bracketAccessor = parse.between(token.punctuator('['), token.punctuator(']'),
    expression);

var accessor = parse.either(
    parse.attempt(dotAccessor),
    bracketAccessor);

/**
 * 
 */
var memberExpression = parse.RecParser('Member Expression', function(self) {
    return parse.binda(
            parse.sequence(
                parse.choice(
                    parse.attempt(parse.next(token.keyword('new'),
                        parse.binda(
                            parse.sequence(
                                self,
                                args),
                            function(expression, a, state) {
                                return parse.always(new state.ast.expression.NewExpression(expression, a));
                            }))),
                    parse.attempt(primaryExpression),
                    functionExpression),
                parse.many(accessor)),
            function(expression, props, state) {
                return parse.always(stream.reduce(props, function(p, c){
                    return new state.ast.expression.MemberExpression(p, c);
                }, expression));
            });
});


// Call Expression
////////////////////////////////////////
var callExpression = parse.Parser('Call Expression',
    parse.binda(
        parse.sequence(
            parse.memo(memberExpression),
            args,
            parse.many(parse.either(
                parse.attempt(args),
                accessor))),
        function(member, a, accessors, state) {
            return parse.always(stream.reduce(accessors, function(p, c) {
                return (c instanceof astNode.Node ?
                     new state.ast.expression.MemberExpression(p, c) :
                     new state.ast.expression.CallExpression(p, c))
            }, new state.ast.expression.CallExpression(member, a)));
        }));


// New Expression
////////////////////////////////////////
var newExpression = parse.RecParser('New Expression', function(self) {
    return parse.either(
        parse.attempt(parse.memo(memberExpression)),
        parse.next(token.keyword('new'),
            parse.bind(self, function(v, state) {
                return parse.always(new state.ast.expression.NewExpression(v));
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
    function(argument, op, state) {
        return parse.always(op ?
            new state.ast.expression.UpdateExpression(op.value, argument, false) :
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
    return parse.binda(
        parse.sequence(
            parse.many(unaryOperator),
            postfixExpression),
        function(ops, expression, state) {
            return parse.always(stream.reduceRight(ops, function(argument, op) {
                return (op.value === '++' || op.value === '--' ?
                    new state.ast.expression.UpdateExpression(op.value, argument, true) :
                    new state.ast.expression.UnaryExpression(op, argument));
            }, expression));
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
        'node': 'BinaryExpression'
    },
    {
        'sep': additiveOperator,
        'precedence': 2,
        'node': 'BinaryExpression'
    },
    {
        'sep': shiftOperator,
        'precedence': 3,
        'node': 'BinaryExpression'
    },
    {
        'sep': equalityOperator,
        'precedence': 5,
        'node': 'BinaryExpression'
    },
    {
        'sep': bitwiseANDOperator,
        'precedence': 6,
        'node': 'BinaryExpression'
    },
    {
        'sep': bitwiseXOROperator,
        'precedence': 7,
        'node': 'BinaryExpression'
    },
    {
        'sep': bitwiseOROperator,
        'precedence': 8,
        'node': 'BinaryExpression'
    },
    {
        'sep': logicalOROperator,
        'precedence': 9,
        'node': 'LogicalExpression'
    },
    {
        'sep': logicalANDOperator,
        'precedence': 10,
        'node': 'LogicalExpression'
    }
];

var precedenceTable = basePrecedenceTable.concat([
    {
        'sep': relationalOperator,
        'precedence': 4,
        'node': 'BinaryExpression'
    }
]);

var precedenceTableNoIn = basePrecedenceTable.concat([
    {
        'sep': relationalOperatorNoIn,
        'precedence': 4,
        'node': 'BinaryExpression'
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
            function(test, _0, consequent, _1, alternate, state) {
                return parse.always(new state.ast.expression.ConditionalExpression(test, consequent, alternate));
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
        function(test, _0, consequent, _1, alternate, state) {
            return parse.always(new state.ast.expression.ConditionalExpression(test, consequent, alternate));
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
            function(left, operator, right, state) {
                return parse.always(new state.ast.expression.AssignmentExpression(operator, left, right));
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
            function(left, operator, right, state) {
                return parse.always(new state.ast.expression.AssignmentExpression(operator, left, right));
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
        function(list, state) {
            return parse.always(list.length > 1 ?
                new state.ast.expression.SequenceExpression(list) :
                list[0]);
        }));

/**
 * 
 */
var expressionNoIn = parse.Parser('Expression No In',
    parse.bind(
        parse_eager.sepBy1(token.punctuator(','),
            assignmentExpressionNoIn),
        function(list, state) {
            return parse.always(list.length > 1 ?
                new state.ast.expression.SequenceExpression(list) :
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