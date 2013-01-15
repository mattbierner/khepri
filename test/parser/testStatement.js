define(['parse/parse', 'stream', 'ecma/lex/lexer', 'ecma/parse/statement'], function(parse, stream, lexer, statement){
    
    return {
        'module': "Statement Tests",
        'tests': [
            ["Debugger",
            function(){
                var result = parse.runStream(statement.debuggerStatement, lexer.lexLang("debugger;"))
                assert.equal(result.type, "DebuggerStatement");
            }],
            
            ["Empty Block",
            function(){
                var result = parse.runStream(statement.blockStatement, lexer.lexLang("{}"))
                assert.equal(result.type, "BlockStatement");
                assert.ok(result.body.length === 0);
            }],
            ["Non Empty Block",
            function(){
                var result = parse.runStream(statement.blockStatement, lexer.lexLang("{debugger;{}debugger;}"))
                assert.equal(result.type, "BlockStatement");
                assert.ok(result.body.length === 3);
                assert.equal(result.body[0].type, "DebuggerStatement");
                assert.equal(result.body[1].type, "BlockStatement");
                assert.equal(result.body[2].type, "DebuggerStatement");
            }],
            
            ["Single Variable Statement",
            function(){
                var result = parse.runStream(statement.variableStatement, lexer.lexLang("var a;"))
                assert.equal(result.type, "VariableDeclaration");
                assert.deepEqual(result.declarations.length, 1);
                assert.deepEqual(result.declarations[0].id.value, 'a');
                assert.ok(!result.declarations[0].init);
            }],
            ["Single Initilizer Variable Statement",
            function(){
                var result = parse.runStream(statement.variableStatement, lexer.lexLang("var a = 1;"))
                assert.equal(result.type, "VariableDeclaration");
                assert.deepEqual(result.declarations.length, 1);
                assert.deepEqual(result.declarations[0].id.value, 'a');
                assert.deepEqual(result.declarations[0].init.value, 1);
            }],
            ["Multi Variable Statement",
            function(){
                var result = parse.runStream(statement.variableStatement, lexer.lexLang("var a = 1, b;"))
                assert.equal(result.type, "VariableDeclaration");
                assert.deepEqual(result.declarations.length, 2);
                assert.deepEqual(result.declarations[0].id.value, 'a');
                assert.deepEqual(result.declarations[0].init.value, 1);
                assert.deepEqual(result.declarations[1].id.value, 'b');
                assert.ok(!result.declarations[1].init);
            }],
        ],
    };
});
