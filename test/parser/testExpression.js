define(['bennu/parse',
        'nu-stream/stream',
        'khepri/lex/lexer',
        'khepri/parse/parser'],
function(parse,
        stream,
        lexer,
        parser) {
    
    var testParser = function(stream) {
        var expr = parser.parseStream(stream);
        return expr.body[0].expression;
    };
    
    return {
        'module': "Expression Tests",
        'tests': [

            ["Assignment Exression",
            function(){
                var expr = testParser(lexer.lex("a = b + 3;"));
                assert.equal(expr.type, 'AssignmentExpression');
                
                // Check Associativity
                assert.equal(expr.left.name, 'a');
                assert.equal(expr.right.type, 'BinaryExpression');
                assert.equal(expr.right.left.name, 'b');
                assert.equal(expr.right.right.value, '3');
            }],
            
            ["Simple Conditional Expression",
            function(){
                var expr = testParser(lexer.lex("?a :b :c;"));
                assert.equal(expr.type, 'ConditionalExpression');
                assert.equal(expr.test.name, 'a');
                assert.equal(expr.consequent.name, 'b');
                assert.equal(expr.alternate.name, 'c');
            }],
            ["Conditional Expression Associativity",
            function(){
                var expr = testParser(lexer.lex("?a :b :?c :d :e;"));
                assert.equal(expr.type, 'ConditionalExpression');
                assert.equal(expr.test.name, 'a');
                assert.equal(expr.consequent.name, 'b');
                assert.equal(expr.alternate.type, 'ConditionalExpression');
                assert.equal(expr.alternate.test.name, 'c');
                assert.equal(expr.alternate.consequent.name, 'd');
                assert.equal(expr.alternate.alternate.name, 'e');
            }],
            ["Conditional Expression ConditionalExpression in Consequent",
            function(){
                var expr = testParser(lexer.lex("?a :?b :c :d :e;"));
                assert.equal(expr.type, 'ConditionalExpression');
                assert.equal(expr.test.name, 'a');
                assert.equal(expr.consequent.type, 'ConditionalExpression');
                assert.equal(expr.consequent.test.name, 'b');
                assert.equal(expr.consequent.consequent.name, 'c');
                assert.equal(expr.consequent.alternate.name, 'd');
                assert.equal(expr.alternate.name, 'e');
            }],
            ["Conditional Expression ConditionalExpression in test",
            function(){
                var expr = testParser(lexer.lex("??a :b :c :d :e;"));
                assert.equal(expr.type, 'ConditionalExpression');
                assert.equal(expr.test.type, 'ConditionalExpression');
                assert.equal(expr.test.test.name, 'a');
                assert.equal(expr.test.consequent.name, 'b');
                assert.equal(expr.test.alternate.name, 'c');
                assert.equal(expr.consequent.name, 'd');
                assert.equal(expr.alternate.name, 'e');
            }],
            
            ["Simple Binary Expression",
            function(){
                var expr = testParser(lexer.lex("a + b;"));
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '+');
                assert.equal(expr.left.name, 'a');
                assert.equal(expr.right.name, 'b');
            }],
            ["Binary Expression Left Associativity",
            function(){
                var expr = testParser(lexer.lex("a + b + c;"));
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '+');
                assert.equal(expr.left.type, 'BinaryExpression');
                assert.equal(expr.left.left.name, 'a');
                assert.equal(expr.left.right.name, 'b');
                assert.equal(expr.right.name, 'c');
            }],
            ["Binary Expression Paren",
            function(){
                var expr = testParser(lexer.lex("a + (b + c);"));
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '+');
                assert.equal(expr.left.name, 'a');
                assert.equal(expr.right.type, 'BinaryExpression');
                assert.equal(expr.right.operator, '+');
                assert.equal(expr.right.left.name, 'b');
                assert.equal(expr.right.right.name, 'c');
            }],
            ["Binary Expression Precedence",
            function(){
                var expr = testParser(lexer.lex("a + b * c;"));
                assert.equal(expr.type, 'BinaryExpression');
                assert.equal(expr.operator, '+');
                assert.equal(expr.left.name, 'a');
                assert.equal(expr.right.type, 'BinaryExpression');
                assert.equal(expr.right.operator, '*');
                assert.equal(expr.right.left.name, 'b');
                assert.equal(expr.right.right.name, 'c');
            }],
            
            ["Simple Unary Expression",
            function(){
                var expr = testParser(lexer.lex("!a;"));
                assert.equal(expr.type, 'UnaryExpression');
                assert.equal(expr.operator, '!');
                assert.equal(expr.argument.name, 'a');
            }],
            ["Unary Expression Right Associativity",
            function(){
                var expr = testParser(lexer.lex("~!a;"));
                assert.equal(expr.type, 'UnaryExpression');
                assert.equal(expr.operator, '~');
                assert.equal(expr.argument.type, 'UnaryExpression');
                assert.equal(expr.argument.operator, '!');
                assert.equal(expr.argument.argument.name, 'a');
            }],
           
            ["Simple New Expression",
            function(){
                var expr = testParser(lexer.lex("new a();"));
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.name, 'a');
                assert.equal(expr.args.length, 0);
            }],
            ["Many New Expression",
            function(){
                var expr = testParser(lexer.lex("new new a()();"));
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.type, 'NewExpression');
                assert.equal(expr.callee.callee.name, 'a');
                assert.equal(expr.callee.args.length, 0);
                assert.equal(expr.args.length, 0);
            }],
            ["New Expression Args",
            function(){
                var expr = testParser(lexer.lex("new a(1);"));
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.name, 'a');
                assert.equal(expr.args.length, 1);
                assert.equal(expr.args[0].value, 1);
            }],
            ["Many New Expression Args",
            function(){
                var expr = testParser(lexer.lex("new new a(1)(2);"));
                assert.equal(expr.type, 'NewExpression');
                assert.equal(expr.callee.type, 'NewExpression');
                assert.equal(expr.callee.callee.name, 'a');
                assert.equal(expr.callee.args.length, 1);
                assert.equal(expr.callee.args[0].value, 1);
                assert.equal(expr.args.length, 1);
                assert.equal(expr.args[0].value, 2);
            }],
            
            ["Simple Call Expression ",
            function(){
                var expr = testParser(lexer.lex("a();"));
                assert.equal(expr.type, 'CallExpression');
                assert.equal(expr.callee.name, 'a');
                assert.equal(expr.args.length, 0);
            }],
            ["Call Expression with args",
            function(){
                var expr = testParser(lexer.lex("a(b);"));
                assert.equal(expr.type, 'CallExpression');
                assert.equal(expr.callee.name, 'a');
                assert.equal(expr.args.length, 1);
                assert.equal(expr.args[0].name, 'b');
            }],
            ["Multiple Call Expression",
            function(){
                var expr = testParser(lexer.lex("a(b)(c);"));
                assert.equal(expr.type, 'CallExpression');
                assert.equal(expr.callee.type, 'CallExpression');
                assert.equal(expr.callee.callee.name, 'a');
                assert.equal(expr.callee.args.length, 1);
                assert.equal(expr.callee.args[0].name, 'b');
                assert.equal(expr.args.length, 1);
                assert.equal(expr.args[0].name, 'c');
            }],
            
            ["Simple Dot Accessor",
            function(){
                var expr = testParser(lexer.lex("a.b;"));
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.name, 'a');
                assert.equal(expr.property.name, 'b');
                assert.equal(expr.computed, false);
            }],
            ["Many Dot Accessor Left Associativity",
            function(){
                var expr = testParser(lexer.lex("a.b.c;"));
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.type, 'MemberExpression');
                assert.equal(expr.object.object.name, 'a');
                assert.equal(expr.object.property.name, 'b');
                assert.equal(expr.object.computed, false);
                assert.equal(expr.property.name, 'c');
                assert.equal(expr.computed, false);
            }],
            
            ["Simple Bracket Accessor",
            function(){
                var expr = testParser(lexer.lex("a.(b);"));
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.name, 'a');
                assert.equal(expr.property.name, 'b');
                assert.equal(expr.computed, true);
            }],
            ["Many Bracket Accessor Left Associativity",
            function(){
                var expr = testParser(lexer.lex("a.(b).(c);"));
                assert.equal(expr.type, 'MemberExpression');
                assert.equal(expr.object.type, 'MemberExpression');
                assert.equal(expr.object.object.name, 'a');
                assert.equal(expr.object.property.name, 'b');
                assert.equal(expr.object.computed, true);
                assert.equal(expr.property.name, 'c');
                assert.equal(expr.computed, true);
            }],
        ],
    };
});
