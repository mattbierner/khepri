/**
 * @fileOverview Parser for ECMAScript 5.1 expression.
 */
define(['require', 'ecma/parse/program', 'parse/parse', 'ecma/parse/ast', 'ecma/parse/token'],
function(require, program, parse, ast, token){
//"use strict";

/* Forward Declarations
 ******************************************************************************/
var assignmentExpression = function() { return assignmentExpression.apply(undefined, arguments); };
var expression = function() { return expression.apply(undefined, arguments); };

var functionExpression = function() {
    return require('ecma/parse/program').functionExpression.apply(undefined, arguments);
};

/* Helpers 
 ******************************************************************************/
var ExpressionListNode = function(leftExpression, operator, rightExpression) {
    ast.Node.call(this, {
        'leftExpression': leftExpression,
        'operator': operator,
        'rightExpression': rightExpression
    });
};
ExpressionListNode.prototype = new ast.Node;

var expressionList = function(node, sep, p) {
    return parse.bind(p, function(x) {
        return parse.bind(parse.many(parse.sequence(sep, p)), function(rest) {
            return parse.always(([x]).concat(rest).reduce(function(p, c) {
                return new node(p, c[0], c[1]);
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
var propertyName = parse.choice(
    token.identifier,
    token.stringLiteral,
    token.numberLiteral);

var propertySetParameterList = token.identifier;

var propertyAssignment = parse.choice(
    parse.sequence(
        propertyName,
        token.punctuator(':'),
        assignmentExpression),
    parse.sequence(
        token.keyword('get'),
        propertyName,
        token.punctuator('('),
        token.punctuator(')'),
        assignmentExpression));

var propertyNameAndValueList = parse.sepBy1(token.punctuator(','),
    propertyAssignment);

var objectLiteral = parse.between(token.punctuator('['), token.punctuator(']'),
    parse.choice(
        parse.always(),
        propertyNameAndValueList,
        parse.next(propertyNameAndValueList, ',')));

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

var argumentList = parse.sepBy(token.punctuator(','),
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
            parse.bind(
                parse.sequence(
                    self,
                    args),
                function(seq) {
                    return parse.always(new MemberConstructorExpressionNode(seq[0], seq[1]));
                }))),
        parse.bind(
            parse.sequence(
                parse.either(
                    primaryExpression,
                    functionExpression),
                parse.many(parse.either(
                    dotAccessor,
                    bracketAccessor))),
            function(seq) {
                return parse.always(seq[1].reduce(function(p, c){
                    return new MemberAccessorExpressionNode(p, c);
                }, seq[0]));
            }));
});

// Call Expression
////////////////////////////////////////
var CallExpressionNode = function(expression, args) {
    ast.Node.call(this, {
        'expression': expression,
        'args': args
    });
};
CallExpressionNode.prototype = new ast.Node;
CallExpressionNode.prototype.type = "CallExpression";

var CallAccessorExpressionNode = function(expression, property) {
    ast.Node.call(this, {
        'expression': expression,
        'property': property
    });
};
CallAccessorExpressionNode.prototype = new CallExpressionNode;
CallAccessorExpressionNode.prototype.type = "CallAccessorExpression";

var callExpression = parse.bind(
    parse.sequence(
        memberExpression,
        args,
        parse.many(parse.choice(
            args,
            dotAccessor,
            bracketAccessor))),
    function(seq) {
        return parse.always(seq[2].reduce(function(p, c) {
            if (c instanceof ast.Node||c.hasOwnProperty('type')) {
                return new CallAccessorExpressionNode(p, c);
            } else {
                return new CallExpressionNode(p, c);
            }
        }, new CallExpressionNode(seq[0], seq[1])));
    });


// New Expression
////////////////////////////////////////
var NewExpressionNode = function(expression) {
    ast.Node.call(this, {
        'expression': expression
    });
};
NewExpressionNode.prototype = new ast.Node;
NewExpressionNode.prototype.type = "NewExpression";

var newExpression = parse.RecParser(function(self) {
    return parse.either(
        parse.attempt(memberExpression, parse.lookahead(parse.token(function(tok) {
            return !parse.test(tok, punctuator('('));
        }))),
        parse.next(token.keyword('new'),
            parse.bind(self, function(v) {
                return parse.always(new NewExpressionNode(v));
            })));
});

// Left Hand Side Expression
////////////////////////////////////////
var leftHandSideExpression = parse.either(
    parse.attempt(callExpression),
    memberExpression);

// Postfix Expression
////////////////////////////////////////
var PostfixExpressionNode = function(operator, expression) {
    ast.Node.call(this, {
        'operator': operator,
        'expression': expression
    });
};
PostfixExpressionNode.prototype = new ast.Node;
PostfixExpressionNode.prototype.type = "PostfixExpression";

var postfixOperator = parse.either(
    token.punctuator('++'),
    token.punctuator('--'));

var postfixExpression = parse.binda(
    parse.sequence(
        leftHandSideExpression,
        parse.optional(postfixOperator)),
    function(expression, operator) {
        return (operator.length > 0 ?
            parse.always(new PostfixExpressionNode(operator[0], expression)) :
            parse.always(expression));
    });

// Unary Expression
////////////////////////////////////////
var UnaryExpressionNode = function(operator, expression) {
    ast.Node.call(this, {
        'operator': operator,
        'expression': expression
    });
};
UnaryExpressionNode.prototype = new ast.Node;
UnaryExpressionNode.prototype.type = "UnaryExpression";

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
        parse.many(unaryOperator),
        postfixExpression),
    function(ops, expression) {
        return parse.always(ops.reduceRight(function(p, c) {
            return new UnaryExpressionNode(c, p);
        }, expression));
    });

// Multiplicative Expression
////////////////////////////////////////
var MultiplicativeExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
MultiplicativeExpressionNode.prototype = new ExpressionListNode;
MultiplicativeExpressionNode.prototype.type = "MultiplicativeExpression";

var multiplicativeOperator = parse.choice(
    token.punctuator('*'),
    token.punctuator('/'),
    token.punctuator('%'));

var multiplicativeExpression = expressionList(MultiplicativeExpressionNode, multiplicativeOperator,
    unaryExpression);

// Additive Expression
////////////////////////////////////////
var AdditiveExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
AdditiveExpressionNode.prototype = new ExpressionListNode;
AdditiveExpressionNode.prototype.type = "AdditiveExpression";

var additiveOperator = parse.either(
    token.punctuator('+'),
    token.punctuator('-'));

var additiveExpression = expressionList(AdditiveExpressionNode, additiveOperator,
    multiplicativeExpression);

// Shift Expression
////////////////////////////////////////
var ShiftExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
ShiftExpressionNode.prototype = new ExpressionListNode;
ShiftExpressionNode.prototype.type = "ShiftExpression";

var shiftOperator = parse.choice(
    token.punctuator('<<'),
    token.punctuator('>>'),
    token.punctuator('>>>'));

var shiftExpression = expressionList(ShiftExpressionNode, shiftOperator,
    additiveExpression);

// Relational Expression
////////////////////////////////////////
var RelationalExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
RelationalExpressionNode.prototype = new ExpressionListNode;
RelationalExpressionNode.prototype.type = "RelationalExpression";

var relationalOperator = parse.choice(
    token.punctuator('<'),
    token.punctuator('>'),
    token.punctuator('<='),
    token.punctuator('>='),
    token.keyword('instanceof'),
    token.keyword('in'));

var relationalExpression = expressionList(RelationalExpressionNode, relationalOperator,
    shiftExpression);

// Equality Expression
////////////////////////////////////////
var EqualityExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
EqualityExpressionNode.prototype = new ExpressionListNode;
EqualityExpressionNode.prototype.type = "EqualityExpression";

var equalityOperator = parse.choice(
    token.punctuator('=='),
    token.punctuator('!=='),
    token.punctuator('==='),
    token.punctuator('!=='));

var equalityExpression = expressionList(EqualityExpressionNode, equalityOperator,
    relationalExpression);

// Bitwise AND Expression
////////////////////////////////////////
var BitwiseANDExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
BitwiseANDExpressionNode.prototype = new ExpressionListNode;
BitwiseANDExpressionNode.prototype.type = "BitwiseANDExpressionNode";

var bitwiseANDExpression = expressionList(BitwiseANDExpressionNode, token.punctuator('&'),
    equalityExpression);

// Bitwise XOR Expression
////////////////////////////////////////
var BitwiseXORExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
BitwiseXORExpressionNode.prototype = new ExpressionListNode;
BitwiseXORExpressionNode.prototype.type = "BitwiseXORExpressionNode";

var bitwiseXORExpression = expressionList(BitwiseXORExpressionNode, token.punctuator('^'),
    bitwiseANDExpression);

// Bitwise OR Expression
////////////////////////////////////////
var BitwiseORExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
BitwiseORExpressionNode.prototype = new ExpressionListNode;
BitwiseORExpressionNode.prototype.type = "BitwiseORExpressionNode";

var bitwiseORExpression = expressionList(BitwiseORExpressionNode, token.punctuator('|'),
    bitwiseXORExpression);

// Logical And Expression
////////////////////////////////////////
var LogicalANDExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
LogicalANDExpressionNode.prototype = new ExpressionListNode;
LogicalANDExpressionNode.prototype.type = "LogicalANDExpression";

var logicalANDExpression = expressionList(LogicalANDExpressionNode, token.punctuator('&&'),
    bitwiseORExpression);

// Logical Or Expression
////////////////////////////////////////
var LogicalORExpressionNode = function() {
    ExpressionListNode.apply(this, arguments);
};
LogicalORExpressionNode.prototype = new ExpressionListNode;
LogicalORExpressionNode.prototype.type = "LogicalORExpression";

var logicalORExpression = expressionList(LogicalORExpressionNode, token.punctuator('||'),
    logicalANDExpression);

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
    parse.attempt(parse.bind(
        parse.sequence(
            logicalORExpression,
            token.punctuator('?'),
            assignmentExpression,
            token.punctuator(':'),
            assignmentExpression),
        function(seq) {
            return parse.always(new ConditionalExpressionNode(seq[0], seq[2], seq[4]));
        })),
    logicalORExpression);


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

// Expression
////////////////////////////////////////
var ExpressionNode = function(list) {
    ast.Node.call(this, {
        'list': list
    });
};
ExpressionNode.prototype = new ast.Node;
ExpressionNode.prototype.type = "Expression";

expression = parse.bind(
    parse.sepBy1(token.punctuator(','),
        assignmentExpression),
    function(list) {
        return parse.always(new ExpressionNode(list));
    });

/* Export
 ******************************************************************************/
return {
    'arrayLiteral': arrayLiteral,
    'assignmentExpression': assignmentExpression,
    'expression': expression
};

});