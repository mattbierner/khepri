define(['bennu/parse', 'khepri/lex/identifier_lexer'], function(parse, identifier_lexer){
    return {
        'module': "Indentifier Tests",
        'tests': [
            ["Basic Identifier ",
            function(){
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'a0bc'), 'a0bc');
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'a0bc efd'), 'a0bc');
            }],
            ["Fail Start digit",
            function(){
                assert.throws(parse.run.bind(undefined, identifier_lexer.identifier, '0abc'));
            }],
            ["Reserved Words",
            function(){
                assert.throws(parse.run.bind(undefined, identifier_lexer.identifier, 'while'));
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'While'), 'While');
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'awhile'), 'awhile');
            }],
            ["Start Chars",
            function(){
                assert.deepEqual(parse.run(identifier_lexer.identifier, '$ab$c$'), '$ab$c$');
                assert.deepEqual(parse.run(identifier_lexer.identifier, '_ab_c_'), '_ab_c_');
            }],
            ["Unicode",
            function(){
                assert.deepEqual(parse.run(identifier_lexer.identifier, '\\u0041BC'), 'ABC');
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'A\\u0042\\u0043'), 'ABC');
            }],
            ["Does not capture punctuation",
            function(){
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'a.c.d'), 'a');
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'a(c)'), 'a');
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'a+'), 'a');
                assert.deepEqual(parse.run(identifier_lexer.identifier, 'a\\'), 'a');
            }],
            
        ],
    };
});
