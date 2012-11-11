define(['parse'], function(parse){
    /*
     * An example of a two pass parser, a lexer that tokenizes an input stream
     * and a parser that evaluates the results during parsing.
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
        
        var tok = parse.Parser('tok', function() {
            return parse.choice(
                parse.next(whiteSpace, this.tok),
                number,
                op
            );
        });
        
        return parse.run.bind(undefined,
            parse.bind(parse.many(tok), function(tokens) {
                return parse.next(parse.eof(), parse.always(tokens));
            }));
    }());
    
    var eval = (function(){
        var op = parse.token(function(t){
            return t.type === 'op';
        });
        
        var num = parse.token(function(t) {
            return t.type === 'number';
        });
        
        var expr = parse.Parser('expr', function() {
            var expr = this.expr;
            return parse.choice(
                parse.bind(op, function(op) {
                    return parse.bind(expr, function(e1) {
                        return parse.bind(expr, function(e2) {
                            return parse.always({'value': op.value(e1.value, e2.value)});
                        });
                    });
                }),
                num
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