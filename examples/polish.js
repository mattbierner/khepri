define(['parse'], function(parse){
    /*
     * An example of a two pass parser for Polish Notation.
     * 
     *  Demonstrates tokenizing input and building a tree.
     */
    
    var lex = (function(){
        var Token = function(type, value) {
            return parse.always({
                'type': type,
                'value': value,
                'toString': function() {
                    return "{type:" + type + " value:" + value + "}";
                }
            });
        };
        
        // Operations
        var add = parse.next(parse.char('+'), parse.always(function(a, b){ return a + b; })),
            sub = parse.next(parse.char('-'), parse.always(function(a, b){ return a - b; })),
            mul = parse.next(parse.char('*'), parse.always(function(a, b){ return a * b; })),
            div = parse.next(parse.char('/'), parse.always(function(a, b){ return a / b; }));
        
        var op = parse.bind(parse.choice(add, sub, mul, div),
            Token.bind(undefined, 'op'));
        
        // Numbers
        var digit = parse.digit(),
            decimal = parse.char('.'),
            neg = parse.char('-');
        
        var naturalNumber = parse.bind(parse.many1(digit), function(digits) {
            return parse.always(digits.join(''));
        });
        
        var decimalNumber = parse.either(
            parse.attempt(parse.bind(naturalNumber, function(p) {
                return parse.bind(decimal, function() {
                    return parse.bind(parse.many(digit), function(t) {
                        return parse.always(p + '.' + t.join(''));
                    });
                });
            })),
            parse.bind(parse.many(digit), function(p) {
                return parse.bind(decimal, function() {
                    return parse.bind(naturalNumber, function(t) {
                        return parse.always(p.join('') + '.' + t);
                    });
                });
            }));
        
        var positiveNumber = parse.either(
            parse.attempt(decimalNumber),
            naturalNumber);
        
        var sign = parse.either(
            parse.attempt(neg),
            parse.always(''));
        
        var number = parse.bind(sign, function(neg) {
            return parse.bind(positiveNumber, function(num) {
                return Token('number', parseFloat(neg + num));
            });
        });
        
        // Tokens
        var whiteSpace = parse.many1(parse.space());
        
        var tok = parse.Parser(function(self) {
            return parse.choice(
                parse.next(whiteSpace, self),
                parse.attempt(number),
                op
            );
        });
        
        return parse.run.bind(undefined,
            parse.bind(parse.many(tok), function(tokens) {
                return parse.next(parse.eof(), parse.always(tokens));
            }));
    }());
    
    var eval = (function(){
        var NumberNode = function(v) {
            return { 'value': v };
        };
        var ExprNode = function(f, e1, e2) {
            return Object.create(Object.prototype, {
                'value': {
                    'get': function() {
                        return f(e1.value, e2.value);
                    }
                }
            });
        };

        var op = parse.token(function(t){
            return t.type === 'op';
        });
        
        var num =parse.token(function(t) {
            return t.type === 'number';
        });
        
        var expr = parse.Parser(function(self) {
            return parse.choice(
                parse.bind(op, function(op) {
                    return parse.bind(self, function(e1) {
                        return parse.bind(self, function(e2) {
                            return parse.always(ExprNode(op.value, e1, e2));
                        });
                    });
                }),
                parse.bind(num, function(tok) {
                    return parse.always(NumberNode(tok.value));
                })
            );
        });
        
        return parse.run.bind(undefined,
                parse.bind(expr, function(result) {
                    return parse.next(parse.eof(), parse.always(result.value));
        }));
    }());

    return {
        'lex': lex,
        'eval': eval
    };
});