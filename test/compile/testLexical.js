define(['parse/parse',
        'khepri/compile/lexical',
        'khepri/lex/lexer',
        'khepri/parse/parser',
        'khepri/parse/expression_parser'],
function(parse,
        lexical,
        lexer,
        parser,
        expression){
    
    var testParser = function(stream) {
        return parser.parseStream(stream);
    };
    
    return {
        'module': "Lexical",
        'tests': [
            ["Simple Lexical",
            function(){
                var result = lexical.check(testParser(lexer.lex("var a; a; { a; };")));
                assert.ok(true);
            }],
            ["Simple undefined var Lexical",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("b; c;")));
                });
            }],
            ["Order",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("b; var b;")));
                });
            }],
            ["Outside of block",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("{ var b; }; b;")));
                });
            }],
            ["If body",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex(" if (true) var b; b;")));
                });
            }],
            ["Multiple in same scope",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("var a; var c; var a;")));
                });
                
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("{ var a; var c; var a; }")));
                });
                
                var result = lexical.check(testParser(lexer.lex("var a; { var a; }")));
                assert.ok(true);
            }],
            
            ["Renaming",
            function(){
                var result = lexical.check(testParser(lexer.lex("var a; { var a; }")));
                assert.ok(result.body[0].declarations[0].id.name !== result.body[1].body[0].declarations[0].id.name);
                
                var result = lexical.check(testParser(lexer.lex("{ var a; } var a; ")));
                assert.ok(result.body[0].body[0].declarations[0].id.name !== result.body[1].declarations[0].id.name);
            }],
            
            ["Switch body introduces new scope but not cases.",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("var a; switch(a) {case 0: var a; default: var a; }")));
                });
                assert.ok(
                    lexical.check(testParser(lexer.lex("var a; switch(a) { default: var a; }"))));
                
                var result = lexical.check(testParser(lexer.lex("var a; switch(a) { default: var a; }")));
                assert.ok(result.body[0].declarations[0].id.name != result.body[1].cases[0].consequent[0].declarations[0].id.name)
            }],
            
            ["Package duplicate export name",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("package (x, x) {}")));
                });
                
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("package (x, y, z, x) {}")));
                });
            }],
            ["Package with binding conflicts with export",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("package (x) with x = 3 {}")));
                });
                
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("package (y, z, x) with [[[x]]] = 3 {}")));
                });
                
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("package (y, z, x) with import 'x' x {}")));
                });
            }],
            ["Package block scope conflicts with exports",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("package (x) { var x; }")));
                });
                
                assert.ok(
                    lexical.check(testParser(lexer.lex("package (x) { {var x; } }"))));
            }],
            ["Package block scope conflicts with with",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("package () with x = 3 in { var x; }")));
                });
                
                assert.ok(
                    lexical.check(testParser(lexer.lex("package () with x = 3 in { {var x; } }"))));
            }],
            
            ["Multiple parameter same name",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("(\\x, x -> x*x)(2)")));
                });
                
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("(\\x, a, b, x -> x*x)(2)")));
                });
                
                 assert.ok(
                    lexical.check(testParser(lexer.lex("\\x -> \\x -> x;"))));
            }],
            ["Let bindings with same name",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("let x = 3, x = 5 in x;")));
                });
                
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("let x=1,y=3,x=4 in x;")));
                });
                
                var result = lexical.check(testParser(lexer.lex("let x=3 in let x=5 in x;")));
                assert.ok(true);
                var result = lexical.check(testParser(lexer.lex("\\x -> (let x=3 in x) + (let x=5 in x);")));
                assert.ok(true);
            }],
            ["Let patterns with same name",
            function(){
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("let {x} = 3, {x} = 5 in x;")));
                });
                
                assert.throws(function(){
                    lexical.check(testParser(lexer.lex("let x=1,y=3,{'x':[x]}=4 in x;")));
                });
            }],
        ],
    };
});
