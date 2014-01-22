define(['bennu/parse', 'khepri/lex/comment_lexer'], function(parse, comment_lexer){
    return {
        'module': "Comment Tests",
        'tests': [
            ["Basic Single Line Comment",
            function(){
                assert.deepEqual(parse.run(comment_lexer.singleLineComment, '//abc efd'), 'abc efd');
                assert.deepEqual(parse.run(comment_lexer.singleLineComment, '//abc \nefd'), 'abc ');
            }],
            ["Empty Single Line",
            function(){
                assert.deepEqual(parse.run(comment_lexer.singleLineComment, '//'), '');
                assert.deepEqual(parse.run(comment_lexer.singleLineComment, '//\ndasfdsa'), '');
            }],
            ["Nested /",
            function(){
                assert.deepEqual(parse.run(comment_lexer.singleLineComment, '///'), '/');
                assert.deepEqual(parse.run(comment_lexer.singleLineComment, '////'), '//');
                assert.deepEqual(parse.run(comment_lexer.singleLineComment, '//a//ad/\n/a'), 'a//ad/');
            }],
            
            ["Basic Multi line Comment",
            function(){
                assert.deepEqual(parse.run(comment_lexer.multiLineComment, '/*abc*/'), 'abc');
                assert.deepEqual(parse.run(comment_lexer.multiLineComment, '/*a b\nc*/'), 'a b\nc');
                assert.deepEqual(parse.run(comment_lexer.multiLineComment, '/*abc*/fdsafsda'), 'abc');
            }],
            ["Empty Multi line Comment",
            function(){
                assert.deepEqual(parse.run(comment_lexer.multiLineComment, '/**/'), '');
                assert.deepEqual(parse.run(comment_lexer.multiLineComment, '/**/\ndfasds'), '');
                assert.deepEqual(parse.run(comment_lexer.multiLineComment, '/*\n*/'), '\n');
            }],
            ["Nested",
            function(){
                assert.deepEqual(parse.run(comment_lexer.multiLineComment, '/***/'), '*');
                assert.deepEqual(parse.run(comment_lexer.multiLineComment, '/*/*/'), '/');
            }],
        ],
    };
});
