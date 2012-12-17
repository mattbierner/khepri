define(['parse', 'commentLexer'], function(parse, commentLexer){
    return {
        'module': "Comment Tests",
        'tests': [
            ["Basic Single Line Comment",
            function(){
                assert.deepEqual(parse.run(commentLexer.singleLineComment, '//abc efd'), 'abc efd');
                assert.deepEqual(parse.run(commentLexer.singleLineComment, '//abc \nefd'), 'abc ');
            }],
            ["Empty Single Line",
            function(){
                assert.deepEqual(parse.run(commentLexer.singleLineComment, '//'), '');
                assert.deepEqual(parse.run(commentLexer.singleLineComment, '//\ndasfdsa'), '');
            }],
            ["Nested /",
            function(){
                assert.deepEqual(parse.run(commentLexer.singleLineComment, '///'), '/');
                assert.deepEqual(parse.run(commentLexer.singleLineComment, '////'), '//');
                assert.deepEqual(parse.run(commentLexer.singleLineComment, '//a//ad/\n/a'), 'a//ad/');
            }],
            
            ["Basic Multi line Comment",
            function(){
                assert.deepEqual(parse.run(commentLexer.multiLineComment, '/*abc*/'), 'abc');
                assert.deepEqual(parse.run(commentLexer.multiLineComment, '/*a b\nc*/'), 'a b\nc');
                assert.deepEqual(parse.run(commentLexer.multiLineComment, '/*abc*/fdsafsda'), 'abc');
            }],
            ["Empty Multi line Comment",
            function(){
                assert.deepEqual(parse.run(commentLexer.multiLineComment, '/**/'), '');
                assert.deepEqual(parse.run(commentLexer.multiLineComment, '/**/\ndfasds'), '');
                assert.deepEqual(parse.run(commentLexer.multiLineComment, '/*\n*/'), '\n');
            }],
            ["Nested",
            function(){
                assert.deepEqual(parse.run(commentLexer.multiLineComment, '/***/'), '*');
                assert.deepEqual(parse.run(commentLexer.multiLineComment, '/*/*/'), '/');
            }],
        ],
    };
});
