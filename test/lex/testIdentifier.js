define(['parse', 'identifierLexer'], function(parse, identifierLexer){
    return {
        'module': "Indentifier Tests",
        'tests': [
            ["Basic Identifier ",
            function(){
                assert.deepEqual(parse.run(identifierLexer.identifier, 'a0bc'), 'a0bc');
                assert.deepEqual(parse.run(identifierLexer.identifier, 'a0bc efd'), 'a0bc');
            }],
            ["Fail Start digit",
            function(){
                assert.throws(parse.run.bind(undefined, identifierLexer.identifier, '0abc'));
            }],
            ["Reserved Words",
            function(){
                assert.throws(parse.run.bind(undefined, identifierLexer.identifier, 'while'));
                assert.deepEqual(parse.run(identifierLexer.identifier, 'While'), 'While');
                assert.deepEqual(parse.run(identifierLexer.identifier, 'awhile'), 'awhile');
            }],
            ["Start Chars",
            function(){
                assert.deepEqual(parse.run(identifierLexer.identifier, '$ab$c$'), '$ab$c$');
                assert.deepEqual(parse.run(identifierLexer.identifier, '_ab_c_'), '_ab_c_');
            }],
            ["Unicode",
            function(){
                assert.deepEqual(parse.run(identifierLexer.identifier, '\\u0041BC'), 'ABC');
                assert.deepEqual(parse.run(identifierLexer.identifier, 'A\\u0042\\u0043'), 'ABC');
            }],
            ["Does not capture punctuation",
            function(){
                assert.deepEqual(parse.run(identifierLexer.identifier, 'a.c.d'), 'a');
                assert.deepEqual(parse.run(identifierLexer.identifier, 'a(c)'), 'a');
                assert.deepEqual(parse.run(identifierLexer.identifier, 'a+'), 'a');
                assert.deepEqual(parse.run(identifierLexer.identifier, 'a\\'), 'a');
            }],
            
        ],
    };
});
