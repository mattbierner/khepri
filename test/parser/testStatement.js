define(['parse', 'ecma/lex/lexer', 'statement'], function(parse, lexer, statement){
    
    return {
        'module': "Statement Tests",
        'tests': [
            ["Debugger",
            function(){
                var result = parse.run(statement.debuggerStatement, lexer.lexLang("debugger;"))
                assert.ok(result instanceof statement.DebuggerStatementNode);
            }],
            
            ["Empty Block",
            function(){
                var result = parse.run(statement.blockStatement, lexer.lexLang("{}"))
                assert.ok(result instanceof statement.BlockStatementNode);
                assert.ok(result.body.length === 0);
            }],
            ["Non Empty Block",
            function(){
                var result = parse.run(statement.blockStatement, lexer.lexLang("{debugger;{}debugger;}"))
                assert.ok(result instanceof statement.BlockStatementNode);
                assert.ok(result.body.length === 3);
                assert.ok(result.body[0] instanceof statement.DebuggerStatementNode);
                assert.ok(result.body[1] instanceof statement.BlockStatementNode);
                assert.ok(result.body[2] instanceof statement.DebuggerStatementNode);
            }],
            
            ["Single Variable Statement",
            function(){
                var result = parse.run(statement.variableStatement, lexer.lexLang("var a;"))
                assert.ok(result instanceof statement.VariableStatementNode);
                assert.deepEqual(result.list.length, 1);
                assert.deepEqual(result.list[0].identifier.value, 'a');
                assert.ok(!result.list[0].initialiser);
            }],
            ["Single Initilizer Variable Statement",
            function(){
                var result = parse.run(statement.variableStatement, lexer.lexLang("var a = 1;"))
                assert.ok(result instanceof statement.VariableStatementNode);
                assert.deepEqual(result.list.length, 1);
                assert.deepEqual(result.list[0].identifier.value, 'a');
                assert.deepEqual(result.list[0].initialiser.value, 1);
            }],
        ],
    };
});
