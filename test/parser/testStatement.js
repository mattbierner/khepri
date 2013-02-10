define(['parse/parse', 'stream/stream', 'ecma/lex/lexer', 'ecma/parse/parser', 'ecma/parse/statement_parser'], function(parse, stream, lexer, parser, statement){
    
    var testParser = function(stream) {
        var result = parser.parseStream(stream);
        return result.body[0];
    };
    
    return {
        'module': "Statement Tests",
        'tests': [
            ["Debugger",
            function(){
                var result = testParser(lexer.lex("debugger;"));
                assert.equal(result.type, "DebuggerStatement");
            }],
            
            ["Empty Block",
            function(){
                var result = testParser(lexer.lex("{}"));
                assert.equal(result.type, "BlockStatement");
                assert.ok(result.body.length === 0);
            }],
            ["Non Empty Block",
            function(){
                var result = testParser(lexer.lex("{debugger;{}debugger;}"));
                assert.equal(result.type, "BlockStatement");
                assert.ok(result.body.length === 3);
                assert.equal(result.body[0].type, "DebuggerStatement");
                assert.equal(result.body[1].type, "BlockStatement");
                assert.equal(result.body[2].type, "DebuggerStatement");
            }],
            
            ["Single Variable Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("var a;")));
                assert.equal(result.type, "VariableDeclaration");
                assert.deepEqual(result.declarations.length, 1);
                assert.deepEqual(result.declarations[0].id.name, 'a');
                assert.ok(!result.declarations[0].init);
            }],
            ["Single Initilizer Variable Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("var a = 1;")));
                assert.equal(result.type, "VariableDeclaration");
                assert.deepEqual(result.declarations.length, 1);
                assert.deepEqual(result.declarations[0].id.name, 'a');
                assert.deepEqual(result.declarations[0].init.value, 1);
            }],
            ["Multi Variable Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("var a = 1, b;")));
                assert.equal(result.type, "VariableDeclaration");
                assert.deepEqual(result.declarations.length, 2);
                assert.deepEqual(result.declarations[0].id.name, 'a');
                assert.deepEqual(result.declarations[0].init.value, 1);
                assert.deepEqual(result.declarations[1].id.name, 'b');
                assert.ok(!result.declarations[1].init);
            }],
            
            ["Simple if Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("if (a) debugger;")));
                assert.equal(result.type, "IfStatement");
                assert.equal(result.test.name, 'a');
                assert.equal(result.consequent.type, 'DebuggerStatement');
                assert.ok(!result.alternate);
            }],
            ["Simple if Block Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("if (a) { debugger; return 3; }")));
                assert.equal(result.type, "IfStatement");
                assert.equal(result.test.name, 'a');
                assert.equal(result.consequent.type, 'BlockStatement');
                assert.equal(result.consequent.body[0].type, 'DebuggerStatement');
                assert.equal(result.consequent.body[1].type, 'ReturnStatement');
                assert.ok(!result.alternate);
            }],
            ["Simple if else Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("if (a) debugger; else ;")));
                assert.equal(result.type, "IfStatement");
                assert.equal(result.test.name, 'a');
                assert.equal(result.consequent.type, 'DebuggerStatement');
                assert.equal(result.alternate.type, 'EmptyStatement');
            }],
            
            ["Simple Do While Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("do debugger; while (a);")));
                assert.equal(result.type, "DoWhileStatement");
                assert.equal(result.test.name, 'a');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["Do While While Body Test",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("do while (a) debugger; while (b);")));
                assert.equal(result.type, "DoWhileStatement");
                assert.equal(result.test.name, 'b');
                assert.equal(result.body.type, 'WhileStatement');
            }],
            
            ["Simple While Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("while (a) debugger;")));
                assert.equal(result.type, "WhileStatement");
                assert.equal(result.test.name, 'a');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["While Statement Do While Body Test",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("while (a) do debugger; while (b);")));
                assert.equal(result.type, "WhileStatement");
                assert.equal(result.test.name, 'a');
                assert.equal(result.body.type, 'DoWhileStatement');
            }],
            
            ["Simple For Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("for (a; b; c) debugger;")));
                assert.equal(result.type, "ForStatement");
                assert.equal(result.init.name, 'a');
                assert.equal(result.test.name, 'b');
                assert.equal(result.update.name, 'c');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["For Statement Empty Init",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("for (; b; c) debugger;")));
                assert.equal(result.type, "ForStatement");
                assert.ok(!result.init);
                assert.equal(result.test.name, 'b');
                assert.equal(result.update.name, 'c');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["For Statement Empty Test",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("for (; ; c) debugger;")));
                assert.equal(result.type, "ForStatement");
                assert.ok(!result.init);
                assert.ok(!result.test);
                assert.equal(result.update.name, 'c');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["For Statement Empty Update",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("for (;;) debugger;")));
                assert.equal(result.type, "ForStatement");
                assert.ok(!result.init);
                assert.ok(!result.test);
                assert.ok(!result.update);
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["For Statement Var Init",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("for (var a = 3; b; c) debugger;")));
                assert.equal(result.type, "ForStatement");
                assert.equal(result.init.type, 'VariableDeclaration');
                assert.equal(result.init.declarations[0].id.name, 'a');
                assert.equal(result.init.declarations[0].init.value, 3);
                assert.equal(result.test.name, 'b');
                assert.equal(result.update.name, 'c');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["For Statement in operator expression",
            function(){
                testParser(parser.parserStream(lexer.lex("for (var a = (x in y); (x in y); (x in y)) debugger;")));
                assert.ok(true);
            }],
            ["For Statement Bad In operator",
            function(){
                assert.throws(
                    testParser.bind(undefined, parser.parserStream(lexer.lex("for (var a = x in y; ; ) debugger;"))));
            }],
            
            ["Simple For In Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("for (a in b) debugger;")));
                assert.equal(result.type, "ForInStatement");
                assert.equal(result.left.name, 'a');
                assert.equal(result.right.name, 'b');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["Simple For In Statement Var",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("for (var a in b) debugger;")));
                assert.equal(result.type, "ForInStatement");
                assert.equal(result.left.type, 'VariableDeclaration');
                assert.equal(result.left.declarations[0].id.name, 'a');
                assert.ok(!result.left.declarations[0].id.init);
                assert.equal(result.right.name, 'b');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["Simple For In Statement Var Init",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("for (var a = 3 in b) debugger;")));
                assert.equal(result.type, "ForInStatement");
                assert.equal(result.left.type, 'VariableDeclaration');
                assert.equal(result.left.declarations[0].id.name, 'a');
                assert.equal(result.left.declarations[0].init.value, 3);
                assert.equal(result.right.name, 'b');
                assert.equal(result.body.type, 'DebuggerStatement');
            }],
            ["Simple For In Statement With In Operator",
            function(){
                testParser(parser.parserStream(lexer.lex("for (a in (b in z)) debugger;")));
                testParser(parser.parserStream(lexer.lex("for (var a = (z in y) in (b in z)) debugger;")));
                assert.ok(true);
            }],
            
            ["Simple Continue Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("continue;")));
                assert.equal(result.type, "ContinueStatement");
                assert.ok(!result.label);
            }],
            ["Simple Labeled Continue Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("continue a;")));
                assert.equal(result.type, "ContinueStatement");
                assert.equal(result.label.name, 'a');
            }],
            ["Semicolon Insertion Labeled Continue Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("continue a")));
                assert.equal(result.type, "ContinueStatement");
                assert.equal(result.label.name, 'a');
                
                var result2 = testParser(parser.parserStream(lexer.lex("continue a\n debugger;")));
                assert.equal(result2.type, "ContinueStatement");
                assert.equal(result2.label.name, 'a');
            }],
            ["Breakline continue Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("continue \n a;")));
                assert.equal(result.type, "ContinueStatement");
                assert.ok(!result.label);
            }],
            
            ["Simple Break Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("break;")));
                assert.equal(result.type, "BreakStatement");
                assert.ok(!result.label);
            }],
            ["Simple Labeled Break Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("break a;")));
                assert.equal(result.type, "BreakStatement");
                assert.equal(result.label.name, 'a');
            }],
            ["Semicolon Insertion Labeled Break Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("break a")));
                assert.equal(result.type, "BreakStatement");
                assert.equal(result.label.name, 'a');
                
                var result2 = testParser(parser.parserStream(lexer.lex("break a\n debugger;")));
                assert.equal(result2.type, "BreakStatement");
                assert.equal(result2.label.name, 'a');
            }],
            ["Breakline Break Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("break \n a;")));
                assert.equal(result.type, "BreakStatement");
                assert.ok(!result.label);
            }],
        ],
    };
});
