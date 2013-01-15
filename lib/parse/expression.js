/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['require',
        'parse/parse', 'parse/parse_eager',
        'stream', 
        'ecma/parse/program',
        'ecma/ast/expression',
        'ecma/parse/token'],
function(require, parse, parse_eager, stream, program, astExpression, token){
//"use strict";

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
var binaryExpression = function(node, sep, p) {
    var reducer = function(p, c) {
        return new node(c[0].value, p, c[1]);
    };
    return parse.bind(
        parse.consParser(
            p,
            parse.many(parse_eager.sequence(sep, p))),
        function(x) {
            return parse.always(stream.reduce(x, reducer));
        });
};

/* Parser
 ******************************************************************************/
// Literal
////////////////////////////////////////
var literal = parse.choice(
    token.nullLiteral,
    token.booleanLiteral,
    token.numericLiteral,
    token.stringLiteral,
    token.regularExpressionLiteral);

// Array Literal
////////////////////////////////////////
var elision = parse.bind(
    parse.always(),
    function() {
        return parse.always(null);
    });

var elementList = parse_eager.sepBy(token.punctuator(','),
    parse.either(
        parse.attempt(assignmentExpression),
        elision));

/**
 * 
 */
var arrayLiteral = parse.between(token.punctuator('['), token.punctuator(']'),
    parse.bind(
        elementList,
        function(elements) {
            return parse.always(new astExpression.ArrayExpression(elements));
        }));

// Object Literal
////////////////////////////////////////
var propertyName = parse.choice(
    parse.attempt(token.identifier),
    parse.attempt(token.stringLiteral),
    token.numericLiteral);

var propertySetParameterList = token.identifier;

var propertyAssignment = parse.choice(
    parse.binda(
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
        }),
    parse.binda(
        parse.sequence(
            token.keyword('get'),
            propertyName,
            token.punctuator('('),
            token.punctuator(')'),
            parse.between(token.punctuator('{'), token.punctuator('}'),
                functionBody)),
        function(_1, name, _2, _3, body) {
            return parse.always({
                'key': name,
                'kind': 'get',
                'value': new astExpression.FunctionExpression(null, [], body)
            });
        }),
    parse.binda(
        parse.sequence(
            token.keyword('set'),
            propertyName,
            parse.between(token.punctuator('('), token.punctuator(')'),
                token.identifier),
            parse.between(token.punctuator('{'), token.punctuator('}'),
                functionBody)),
        function(_, name, parameter, body) {
            return parse.always({
                'key': name,
                'kind': 'set',
                'value': new astExpression.FunctionExpression(null, [parameter], body)
            });
        }));

var propertyNameAndValueList = parse_eager.sepBy(token.punctuator(','),
    propertyAssignment);

/**
 * 
 */
var objectLiteral = parse.between(token.punctuator('{'), token.punctuator('}'),
    parse.binda(
        parse.sequence(
            propertyNameAndValueList,
            parse.optional(token.punctuator(','))),
        function(properties) {
            return parse.always(new astExpression.ObjectExpression(properties));
        }));

// Primary Expression
////////////////////////////////////////
var primaryExpression = parse.choice(
    parse.attempt(token.keyword('this')),
    parse.attempt(token.identifier),
    parse.attempt(literal),
    parse.attempt(arrayLiteral),
    parse.attempt(objectLiteral),
    parse.between(token.punctuator('('), token.punctuator(')'),
        expression));

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

var memberExpression = parse.RecParser(function(self) {
    return parse.either(
        parse.attempt(parse.next(token.keyword('new'),
            parse.binda(
                parse.sequence(
                    self,
                    args),
                function(expression, a) {
                    return parse.always(new astExpression.NewExpression(expression, a));
                }))),
        parse.binda(
            parse.sequence(
                parse.either(
                    primaryExpression,
                    functionExpression),
                parse_eager.many(parse.either(
                    dotAccessor,
                    bracketAccessor))),
            function(expression, props) {
                return parse.always(props.reduce(function(p, c){
                    return new astExpression.MemberExpression(p, c);
                }, expression));
            }));
});

// Call Expression
////////////////////////////////////////
var callExpression = parse.binda(
    parse.sequence(
        memberExpression,
        args,
        parse_eager.many(parse.choice(
            args,
            dotAccessor,
            bracketAccessor))),
    function(member, a, accessors) {
        return parse.always(accessors.reduce(function(p, c) {
            if (c.hasOwnProperty('type')) {
                return new astExpression.MemberExpression(p, c);
            } else {
                return new astExpression.CallExpression(p, c);
            }
        }, new astExpression.CallExpression(member, a)));
    });


// New Expression
////////////////////////////////////////
var newExpression = parse.RecParser(function(self) {
    return parse.either(
        parse.attempt(memberExpression, parse.lookahead(parse.token(function(tok) {
            return !parse.test(tok, punctuator('('));
        }))),
        parse.next(token.keyword('new'),
            parse.bind(self, function(v) {
                return parse.always(new astExpression.NewExpression(v));
            })));
});

// Left Hand Side Expression
////////////////////////////////////////
var leftHandSideExpression = parse.either(
    parse.attempt(callExpression),
    memberExpression);

// Postfix Expression
////////////////////////////////////////
var postfixOperator = parse.either(
    token.punctuator('++'),
    token.punctuator('--'));

var postfixExpression = parse.binda(
    parse.sequence(
        leftHandSideExpression,
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

var unaryExpression = parse.binda(
    parse.sequence(
        parse_eager.many(unaryOperator),
        postfixExpression),
    function(ops, expression) {
        return parse.always(ops.reduceRight(function(argument, op) {
            if (op.value === '++' || op.value === '--') {
                return new astExpression.UpdateExpression(op.value, argument, true);
            } else {
                return new astExpression.UnaryExpression(op, argument);
            }
        }, expression));
    });

// Multiplicative Expression
////////////////////////////////////////
var multiplicativeOperator = parse.choice(
    token.punctuator('*'),
    token.punctuator('/'),
    token.punctuator('%'));

var multiplicativeExpression = binaryExpression(astExpression.BinaryExpression, multiplicativeOperator, unaryExpression);

// Additive Expression
////////////////////////////////////////
var additiveOperator = parse.either(
    token.punctuator('+'),
    token.punctuator('-'));

var additiveExpression = binaryExpression(astExpression.BinaryExpression, additiveOperator, multiplicativeExpression);

// Shift Expression
////////////////////////////////////////
var shiftOperator = parse.choice(
    token.punctuator('<<'),
    token.punctuator('>>'),
    token.punctuator('>>>'));

var shiftExpression = binaryExpression(astExpression.BinaryExpression, shiftOperator,
    additiveExpression);

// Relational Expression
////////////////////////////////////////
var relationalOperatorNoIn = parse.choice(
    token.punctuator('<'),
    token.punctuator('>'),
    token.punctuator('<='),
    token.punctuator('>='),
    token.keyword('instanceof'));

var relationalOperator = parse.either(
    relationalOperatorNoIn,
    token.keyword('in'));

var relationalExpression = binaryExpression(astExpression.BinaryExpression, relationalOperator,
    shiftExpression);

var relationalExpressionNoIn = binaryExpression(astExpression.BinaryExpression, relationalOperatorNoIn,
    shiftExpression);

// Equality Expression
////////////////////////////////////////
var equalityOperator = parse.choice(
    token.punctuator('=='),
    token.punctuator('!=='),
    token.punctuator('==='),
    token.punctuator('!=='));

var equalityExpression = binaryExpression(astExpression.BinaryExpression, equalityOperator,
    relationalExpression);

var equalityExpressionNoIn = binaryExpression(astExpression.BinaryExpression, equalityOperator,
    relationalExpressionNoIn);

// Bitwise AND Expression
////////////////////////////////////////
var bitwiseANDOperator = token.punctuator('&');

var bitwiseANDExpression = binaryExpression(astExpression.BinaryExpression, bitwiseANDOperator,
    equalityExpression);

var bitwiseANDExpressionNoIn = binaryExpression(astExpression.BinaryExpression, bitwiseANDOperator,
    equalityExpressionNoIn);

// Bitwise XOR Expression
////////////////////////////////////////
var bitwiseXOROperator = token.punctuator('^');

/**
 * 
 */
var bitwiseXORExpression = binaryExpression(astExpression.BinaryExpression, bitwiseXOROperator,
    bitwiseANDExpression);

/**
 * 
 */
var bitwiseXORExpressionNoIn = binaryExpression(astExpression.BinaryExpression, bitwiseXOROperator,
    bitwiseANDExpressionNoIn);

// Bitwise OR Expression
////////////////////////////////////////
var bitwiseOROperator = token.punctuator('|');

/**
 * 
 */
var bitwiseORExpression = binaryExpression(astExpression.BinaryExpression, bitwiseOROperator,
    bitwiseXORExpression);

/**
 * 
 */
var bitwiseORExpressionNoIn = binaryExpression(astExpression.BinaryExpression, bitwiseOROperator,
    bitwiseXORExpressionNoIn);

// Logical And Expression
////////////////////////////////////////
var logicalANDOperator = token.punctuator('&&');

/**
 * 
 */
var logicalANDExpression = binaryExpression(astExpression.LogicalExpression, logicalANDOperator,
    bitwiseORExpression);

/**
 * 
 */
var logicalANDExpressionNoIn = binaryExpression(astExpression.LogicalExpression, logicalANDOperator,
    bitwiseORExpressionNoIn);

// Logical Or Expression
////////////////////////////////////////
var logicalOROperator = token.punctuator('||');

/**
 * 
 */
var logicalORExpression = binaryExpression(astExpression.LogicalExpression, logicalOROperator,
    logicalANDExpression);

/**
 * 
 */
var logicalORExpressionNoIn = binaryExpression(astExpression.LogicalExpression, logicalOROperator,
    logicalANDExpressionNoIn);

// Conditional Expression
////////////////////////////////////////
var conditionalExpression = parse.either(
    parse.attempt(parse.binda(
        parse.sequence(
            logicalORExpression,
            token.punctuator('?'),
            assignmentExpression,
            token.punctuator(':'),
            assignmentExpression),
        function(test, _1, consequent, _2, alternate) {
            return parse.always(new astExpression.ConditionalExpression(test, consequent, alternate));
        })),
    logicalORExpression);

var conditionalExpressionNoIn = parse.either(
    parse.attempt(parse.binda(
        parse.sequence(
            logicalORExpressionNoIn,
            token.punctuator('?'),
            assignmentExpressionNoIn,
            token.punctuator(':'),
            assignmentExpressionNoIn),
        function(test, _1, consequent, _2, alternate) {
            return parse.always(new astExpression.ConditionalExpression(test, consequent, alternate));
        })),
    logicalORExpressionNoIn);

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
assignmentExpression = parse.RecParser(function(self) {
    return parse.either(
        parse.attempt(conditionalExpression),
        parse.binda(
            parse.sequence(
                leftHandSideExpression,
                assignmentOperator,
                self)),
            function(left, operator, right) {
                return parse.always(new astExpression.AssignmentExpression(operator, left, right));
            });
    });

/**
 * 
 */
var assignmentExpressionNoIn = parse.RecParser(function(self) {
    return parse.either(
        parse.attempt(conditionalExpressionNoIn),
        parse.binda(
            parse.sequence(
                leftHandSideExpression,
                assignmentOperator,
                self)),
            function(left, operator, right) {
                return parse.always(new astExpression.AssignmentExpression(operator, left, right));
            });
    });

// Expression
////////////////////////////////////////
/**
 * 
 */
expression = parse.bind(
    parse_eager.sepBy1(token.punctuator(','),
        assignmentExpression),
    function(list) {
        return parse.always(list.length > 1 ?
            new astExpression.SequenceExpression(list) :
            list);
    });

/**
 * 
 */
var expressionNoIn = parse.bind(
    parse_eager.sepBy1(token.punctuator(','),
        assignmentExpressionNoIn),
    function(list) {
        return parse.always(new astExpression.SequenceExpression(list));
    });


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