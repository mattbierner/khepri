define(['parse', 'commentParser'], function(parse, commentParser){
    return {
        'module': "Comment Tests",
        'tests': [
            ["Basic Single Line Comment",
            function(){
                assert.deepEqual(parse.run(commentParser.singleLineComment, '//abc efd'), 'abc efd');
                assert.deepEqual(parse.run(commentParser.singleLineComment, '//abc \nefd'), 'abc ');
            }],
            ["Empty Single Line",
            function(){
                assert.deepEqual(parse.run(commentParser.singleLineComment, '//'), '');
                assert.deepEqual(parse.run(commentParser.singleLineComment, '//\ndasfdsa'), '');
            }],
            ["Nested /",
            function(){
                assert.deepEqual(parse.run(commentParser.singleLineComment, '///'), '/');
                assert.deepEqual(parse.run(commentParser.singleLineComment, '////'), '//');
                assert.deepEqual(parse.run(commentParser.singleLineComment, '//a//ad/\n/a'), 'a//ad/');
            }],
            
            ["Basic Multi line Comment",
            function(){
                assert.deepEqual(parse.run(commentParser.multiLineComment, '/*abc*/'), 'abc');
                assert.deepEqual(parse.run(commentParser.multiLineComment, '/*a b\nc*/'), 'a b\nc');
               assert.deepEqual(parse.run(commentParser.multiLineComment, '/*abc*/fdsafsda'), 'abc');

            }],
            ["Empty Multi line Comment",
            function(){
                assert.deepEqual(parse.run(commentParser.multiLineComment, '/**/'), '');
                assert.deepEqual(parse.run(commentParser.multiLineComment, '/**/\ndfasds'), '');
               assert.deepEqual(parse.run(commentParser.multiLineComment, '/*\n*/'), '\n');
            }],
            ["Nested",
            function(){
                assert.deepEqual(parse.run(commentParser.multiLineComment, '/***/'), '*');
                assert.deepEqual(parse.run(commentParser.multiLineComment, '/*/*/'), '/');
            }],
        ],
    };
});
