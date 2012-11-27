define(['parse', 'identifierParser'], function(parse, identifierParser){
    return {
        'module': "Indentifier Tests",
        'tests': [
            ["Basic Identifier ",
            function(){
                assert.deepEqual(parse.run(identifierParser.identifier, 'a0bc'), 'a0bc');
                assert.deepEqual(parse.run(identifierParser.identifier, 'a0bc efd'), 'a0bc');
            }],
            ["Fail Start digit",
            function(){
                assert.throws(parse.run.bind(undefined, identifierParser.identifier, '0abc'));
            }],
            ["Start Chars",
            function(){
                assert.deepEqual(parse.run(identifierParser.identifier, '$ab$c$'), '$ab$c$');
                assert.deepEqual(parse.run(identifierParser.identifier, '_ab_c_'), '_ab_c_');
            }],
            ["Does not capture punctuation",
            function(){
                assert.deepEqual(parse.run(identifierParser.identifier, 'a.c.d'), 'a');
                assert.deepEqual(parse.run(identifierParser.identifier, 'a(c)'), 'a');
                assert.deepEqual(parse.run(identifierParser.identifier, 'a+'), 'a');
            }],
            
        ],
    };
});
