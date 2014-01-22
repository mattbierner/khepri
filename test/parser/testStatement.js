define(['bennu/parse', 'nu-stream/stream', 'khepri/lex/lexer', 'khepri/parse/parser', 'khepri/parse/statement_parser'], function(parse, stream, lexer, parser, statement){
    
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
            
            ["Simple Continue Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("continue;")));
                assert.equal(result.type, "ContinueStatement");
                assert.ok(!result.label);
            }],

            ["Simple Break Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("break;")));
                assert.equal(result.type, "BreakStatement");
                assert.ok(!result.label);
            }],
            
            ["Simple Return Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("return;")));
                assert.equal(result.type, "ReturnStatement");
                assert.ok(!result.argument);
            }],
            ["Simple Return Statement With Value",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("return 3;")));
                assert.equal(result.type, "ReturnStatement");
                assert.equal(result.argument.value, 3);
            }],
            
            ["Simple Switch Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("switch (a) {}")));
                assert.equal(result.type, "SwitchStatement");
                assert.equal(result.discriminant.name, 'a');
                assert.deepEqual(result.cases, []);
            }],
            ["Switch Statement With Cases",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("switch (a) { case x: break; case y: debugger; break; }")));
                assert.equal(result.type, "SwitchStatement");
                assert.equal(result.discriminant.name, 'a');
                assert.equal(result.cases.length, 2);
                assert.equal(result.cases[0].test.name, 'x');
                assert.equal(result.cases[0].consequent[0].type, 'BreakStatement');
                assert.equal(result.cases[1].test.name, 'y');
                assert.equal(result.cases[1].consequent[0].type, 'DebuggerStatement');
                assert.equal(result.cases[1].consequent[1].type, 'BreakStatement');
            }],
            ["Switch Statement With Default",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("switch (a) { case x: break; case y: debugger; break;  default: break;  }")));
                assert.equal(result.type, "SwitchStatement");
                assert.equal(result.discriminant.name, 'a');
                assert.equal(result.cases.length, 3);
                assert.equal(result.cases[0].test.name, 'x');
                assert.equal(result.cases[0].consequent[0].type, 'BreakStatement');
                assert.equal(result.cases[1].test.name, 'y');
                assert.equal(result.cases[1].consequent[0].type, 'DebuggerStatement');
                assert.equal(result.cases[1].consequent[1].type, 'BreakStatement');
                assert.ok(!result.cases[2].test);
            }],
            ["Switch Statement With Fallthrough Cases",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("switch (a) { case x: case y: debugger; break; }")));
                assert.equal(result.type, "SwitchStatement");
                assert.equal(result.discriminant.name, 'a');
                assert.equal(result.cases.length, 2);
                assert.equal(result.cases[0].test.name, 'x');
                assert.ok(!result.cases[0].consequent[0]);
                assert.equal(result.cases[1].test.name, 'y');
                assert.equal(result.cases[1].consequent[0].type, 'DebuggerStatement');
                assert.equal(result.cases[1].consequent[1].type, 'BreakStatement');
            }],
            
            ["Simple Throw Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("throw a;")));
                assert.equal(result.type, "ThrowStatement");
                assert.equal(result.argument.name, 'a');
            }],
            
            ["Simple Try Statement ",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("try {debugger;}")));
                assert.equal(result.type, "TryStatement");
                assert.equal(result.block.body.length, 1);
                assert.equal(result.block.body[0].type, "DebuggerStatement");
            }],
            ["Simple Try Statement With Finally",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("try {} finally { debugger; }")));
                assert.equal(result.type, "TryStatement");
                assert.equal(result.block.body.length, 0);
                assert.equal(result.finalizer.body[0].type, "DebuggerStatement");
            }],
             ["Simple Try Statement With Catch",
            function(){
                var stmt = testParser(parser.parserStream(lexer.lex("try {} catch (a) { debugger; }")));
                assert.equal(stmt.type, "TryStatement");
                assert.equal(stmt.block.body.length, 0);
                assert.equal(stmt.handler.param.name, "a");
                assert.equal(stmt.handler.body.body[0].type, "DebuggerStatement");
            }],
            ["Simple Try Statement With Catch and Finally",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("try {} finally { debugger; }")));
                assert.equal(result.type, "TryStatement");
                assert.equal(result.block.body.length, 0);
                assert.equal(result.finalizer.body[0].type, "DebuggerStatement");
            }],
        ],
    };
});
