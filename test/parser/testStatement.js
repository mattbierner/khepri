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
            ["Simple if else Statement",
            function(){
                var result = testParser(parser.parserStream(lexer.lex("if (a) debugger; else ;")));
                assert.equal(result.type, "IfStatement");
                assert.equal(result.test.name, 'a');
                assert.equal(result.consequent.type, 'DebuggerStatement');
                assert.equal(result.alternate.type, 'EmptyStatement');
            }],
        ],
    };
});
