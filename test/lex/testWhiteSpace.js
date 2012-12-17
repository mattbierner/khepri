define(['parse', 'whiteSpaceLexer'], function(parse, whiteSpaceLexer){
    
    return {
        'module': "White Space Tests",
        'tests': [
            ["Tab",
            function(){
                assert.equal(parse.run(whiteSpaceLexer.tab, '\u0009'), '\u0009');
            }],
            ["Vertical Tab",
            function(){
                assert.equal(parse.run(whiteSpaceLexer.vt, '\u000B'), '\u000B');
            }],
            ["Form Feed",
            function(){
                assert.equal(parse.run(whiteSpaceLexer.ff, '\u000C'), '\u000C');
            }],
            ["Space",
            function(){
                assert.equal(parse.run(whiteSpaceLexer.sp, '\u0020'), '\u0020');
            }],
            ["No-Break Space",
            function(){
                assert.equal(parse.run(whiteSpaceLexer.nbsp, '\u00A0'), '\u00A0');
            }],
            ["Byte order mark",
            function(){
                assert.equal(parse.run(whiteSpaceLexer.bom, '\uFEFF'), '\uFEFF');
            }],
            ["White Space",
            function(){
                assert.equal(parse.run(whiteSpaceLexer.whiteSpace, '\u0009'), '\u0009');
                assert.equal(parse.run(whiteSpaceLexer.whiteSpace, '\u000B'), '\u000B');
                assert.equal(parse.run(whiteSpaceLexer.whiteSpace, '\u000B'), '\u000B');
                assert.equal(parse.run(whiteSpaceLexer.whiteSpace, '\u0020'), '\u0020');
                assert.equal(parse.run(whiteSpaceLexer.whiteSpace, '\u00A0'), '\u00A0');
                assert.equal(parse.run(whiteSpaceLexer.whiteSpace, '\uFEFF'), '\uFEFF');
            }],
        ],
    };
});
