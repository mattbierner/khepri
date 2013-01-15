/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['require',
        'ecma/parse/program',
        'parse/parse', 'parse/parse_eager',
        'ecma/ast/node', 'ecma/ast/expression',
        'ecma/parse/token'],
function(require, program, parse, parse_eager, ast, astExpression, token){
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
var binaryExpression = function(sep, p) {
    return parse.bind(p, function(x) {
        return parse.bind(parse_eager.many(parse_eager.sequence(sep, p)), function(rest) {
            return parse.always(([x]).concat(rest).reduce(function(p, c) {
                return new astExpression.BinaryExpression(c[0], p, c[1]);
            }));
        });
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
var ArrayLiteral = function() { };

var elision = parse.bind(parse.many1(token.punctuator(',')), function(list) {
    return parse.always(list.length);
});

var elementList = parse.NamedRecParser('elementList', function(self) {
    return parse.choice(
        parse.attempt(token.numericLiteral),
        parse.attempt(parse.next(elision, token.numericLiteral)),
        parse.next(elision, parse.next(token.numericLiteral, self)));
});

var arrayLiteral = parse.Parser('Array Literal', parse.between(token.punctuator('['), token.punctuator(']'),
    parse.choice(
        parse.attempt(parse.bind(elision, function(pad) {
            return parse.always();
        })),
        parse.attempt(parse.bind(elementList, function(elements) {
            return parse.bind(elision, function(pad) {
                return parse.always();
            });
        })),
        parse.attempt(parse.bind(elementList, function(elements){
            return parse.always();
        })),
        parse.always(null))));

// Object Literal
////////////////////////////////////////
var ObjectLiteralNode = function(properties) {
    ast.Node.call(this, {
        'properties': properties
    });
};
ObjectLiteralNode.prototype = new ast.Node;
ObjectLiteralNode.prototype.type = "ObjectLiteral";

var propertyName = parse.choice(
    token.identifier,
    token.stringLiteral,
    token.numberLiteral);

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
        function(_, name, _, _, body) {
            return parse.always({
                'key': name,
                'getter': body
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
                'parameter': parameter,
                'setter': body
            });
        }));

var propertyNameAndValueList = parse.sepBy(token.punctuator(','),
    propertyAssignment);

var objectLiteral = parse.between(token.punctuator('{'), token.punctuator('}'),
    parse.binda(
        parse.sequence(
            propertyNameAndValueList,
            parse.optional(token.punctuator(','))),
        function(properties) {
            return parse.always(new ObjectLiteralNode(properties));
        }));

// Primary Expression
////////////////////////////////////////
var primaryExpression = parse.choice(
    token.keyword('this'),
    token.identifier,
    literal,
    arrayLiteral,
    objectLiteral,
    parse.between(token.punctuator('('), token.punctuator(')'),
        expression));

// Member Expression
////////////////////////////////////////
var MemberExpressionNode = function() { };
MemberExpressionNode.prototype = new ast.Node;

var MemberAccessorExpressionNode = function(expression, property) {
    ast.Node.call(this, {
        'expression': expression,
        'property': property
    });
};
MemberAccessorExpressionNode.prototype = new MemberExpressionNode;
MemberAccessorExpressionNode.prototype.type = "MemberAccessorExpression";

var MemberConstructorExpressionNode = function(expression, args) {
    ast.Node.call(this, {
        'expression': expression,
        'args': args
    });
};
MemberConstructorExpressionNode.prototype = new MemberExpressionNode;
MemberConstructorExpressionNode.prototype.type = "MemberConstructorExpression";

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
                    return new MemberAccessorExpressionNode(p, c);
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
            if (c instanceof ast.Node||c.hasOwnProperty('type')) {
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
    function(argument, operator) {
        return parse.always(operator ?
            new astExpression.UpdateExpression(operator, argument, false) :
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
        return parse.always(ops.reduceRight(function(p, c) {
            return new astExpression.UnaryExpression(c, p);
        }, expression));
    });

// Multiplicative Expression
////////////////////////////////////////
var multiplicativeOperator = parse.choice(
    token.punctuator('*'),
    token.punctuator('/'),
    token.punctuator('%'));

var multiplicativeExpression = binaryExpression(multiplicativeOperator, unaryExpression);

// Additive Expression
////////////////////////////////////////
var additiveOperator = parse.either(
    token.punctuator('+'),
    token.punctuator('-'));

var additiveExpression = binaryExpression(additiveOperator, multiplicativeExpression);

// Shift Expression
////////////////////////////////////////
var shiftOperator = parse.choice(
    token.punctuator('<<'),
    token.punctuator('>>'),
    token.punctuator('>>>'));

var shiftExpression = binaryExpression(shiftOperator, additiveExpression);

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

var relationalExpression = binaryExpression(relationalOperator, shiftExpression);

var relationalExpressionNoIn = binaryExpression(relationalOperatorNoIn, shiftExpression);

// Equality Expression
////////////////////////////////////////
var equalityOperator = parse.choice(
    token.punctuator('=='),
    token.punctuator('!=='),
    token.punctuator('==='),
    token.punctuator('!=='));

var equalityExpression = binaryExpression(equalityOperator, relationalExpression);

var equalityExpressionNoIn = binaryExpression(equalityOperator, relationalExpressionNoIn);

// Bitwise AND Expression
////////////////////////////////////////
var bitwiseANDOperator = token.punctuator('&');

var bitwiseANDExpression = binaryExpression(bitwiseANDOperator, equalityExpression);

var bitwiseANDExpressionNoIn = binaryExpression(bitwiseANDOperator,
    equalityExpressionNoIn);

// Bitwise XOR Expression
////////////////////////////////////////
var bitwiseXOROperator = token.punctuator('^');

var bitwiseXORExpression = binaryExpression(bitwiseXOROperator, bitwiseANDExpression);

var bitwiseXORExpressionNoIn = binaryExpression(bitwiseXOROperator, bitwiseANDExpressionNoIn);

// Bitwise OR Expression
////////////////////////////////////////
var bitwiseOROperator = token.punctuator('|');

var bitwiseORExpression = binaryExpression(bitwiseOROperator,
    bitwiseXORExpression);

var bitwiseORExpressionNoIn = binaryExpression(bitwiseOROperator,
    bitwiseXORExpressionNoIn);

// Logical And Expression
////////////////////////////////////////
var logicalANDOperator = token.punctuator('&&');

var logicalANDExpression = binaryExpression(logicalANDOperator, bitwiseORExpression);

var logicalANDExpressionNoIn = binaryExpression(logicalANDOperator, bitwiseORExpressionNoIn);

// Logical Or Expression
////////////////////////////////////////
var logicalOROperator = token.punctuator('||');

var logicalORExpression = binaryExpression(logicalOROperator, logicalANDExpression);

var logicalORExpressionNoIn = binaryExpression(logicalOROperator, logicalANDExpressionNoIn);

// Conditional Expression
////////////////////////////////////////
var ConditionalExpressionNode = function(leftExpression, trueExpression, falseExpression) {
    ast.Node.call(this, {
        'leftExpression': leftExpression,
        'trueExpression': trueExpression,
        'falseExpression': falseExpression
    });
};
ConditionalExpressionNode.prototype = new ast.Node;
ConditionalExpressionNode.prototype.type = "ConditionalExpression";

var conditionalExpression = parse.either(
    parse.attempt(parse.binda(
        parse.sequence(
            logicalORExpression,
            token.punctuator('?'),
            assignmentExpression,
            token.punctuator(':'),
            assignmentExpression),
        function(leftExpression, _, trueExpression, _, falseExpression) {
            return parse.always(new ConditionalExpressionNode(leftExpression, trueExpression, falseExpression));
        })),
    logicalORExpression);

var conditionalExpressionNoIn = parse.either(
    parse.attempt(parse.binda(
        parse.sequence(
            logicalORExpressionNoIn,
            token.punctuator('?'),
            assignmentExpression,
            token.punctuator(':'),
            assignmentExpressionNoIn),
        function(leftExpression, _, trueExpression, _, falseExpression) {
            return parse.always(new ConditionalExpressionNode(leftExpression, trueExpression, falseExpression));
        })),
    logicalORExpressionNoIn);

// Assignment Expression
////////////////////////////////////////
var AssignmentExpressionNode = function(left, op, right) {
    ast.Node.call(this, {
        'list': list
    });
};
AssignmentExpressionNode.prototype = new ast.Node;
AssignmentExpressionNode.prototype.type = "AssignmentExpression";

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

assignmentExpression = parse.RecParser(function(self) {
    return parse.either(
        parse.attempt(conditionalExpression),
        parse.bind(
            parse.sequence(
                leftHandSideExpression,
                assignmentOperator,
                self)),
            function(seq) {
                return parse.always(new AssignmentExpressionNode(seq[0], seq[1], seq[2]));
            });
    });

var assignmentExpressionNoIn = parse.RecParser(function(self) {
    return parse.either(
        parse.attempt(conditionalExpressionNoIn),
        parse.bind(
            parse.sequence(
                leftHandSideExpression,
                assignmentOperator,
                self)),
            function(seq) {
                return parse.always(new AssignmentExpressionNode(seq[0], seq[1], seq[2]));
            });
    });

// Expression
////////////////////////////////////////
expression = parse.bind(
    parse_eager.sepBy1(token.punctuator(','),
        assignmentExpression),
    function(list) {
        return parse.always(new astExpression.SequenceExpression(list));
    });

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