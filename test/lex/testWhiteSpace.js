define(['bennu/parse', 'khepri/lex/whitespace_lexer'], function(parse, white_space){
    
    return {
        'module': "White Space Tests",
        'tests': [
            ["Tab",
            function(){
                assert.equal(parse.run(white_space.tab, '\u0009'), '\u0009');
            }],
            ["Vertical Tab",
            function(){
                assert.equal(parse.run(white_space.vt, '\u000B'), '\u000B');
            }],
            ["Form Feed",
            function(){
                assert.equal(parse.run(white_space.ff, '\u000C'), '\u000C');
            }],
            ["Space",
            function(){
                assert.equal(parse.run(white_space.sp, '\u0020'), '\u0020');
            }],
            ["No-Break Space",
            function(){
                assert.equal(parse.run(white_space.nbsp, '\u00A0'), '\u00A0');
            }],
            ["Byte order mark",
            function(){
                assert.equal(parse.run(white_space.bom, '\uFEFF'), '\uFEFF');
            }],
            ["White Space",
            function(){
                assert.equal(parse.run(white_space.whitespace, '\u0009'), '\u0009');
                assert.equal(parse.run(white_space.whitespace, '\u000B'), '\u000B');
                assert.equal(parse.run(white_space.whitespace, '\u000B'), '\u000B');
                assert.equal(parse.run(white_space.whitespace, '\u0020'), '\u0020');
                assert.equal(parse.run(white_space.whitespace, '\u00A0'), '\u00A0');
                assert.equal(parse.run(white_space.whitespace, '\uFEFF'), '\uFEFF');
            }],
        ],
    };
});
