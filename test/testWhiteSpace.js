define(['parse', 'whiteSpaceParser'], function(parse, whiteSpaceParser){
    
    return {
        'module': "White Space Tests",
        'tests': [
            ["Tab",
            function(){
                assert.equal(parse.run(whiteSpaceParser.tab, '\u0009'), '\u0009');
            }],
            ["Vertical Tab",
            function(){
                assert.equal(parse.run(whiteSpaceParser.vt, '\u000B'), '\u000B');
            }],
            ["Form Feed",
            function(){
                assert.equal(parse.run(whiteSpaceParser.ff, '\u000C'), '\u000C');
            }],
            ["Space",
            function(){
                assert.equal(parse.run(whiteSpaceParser.sp, '\u0020'), '\u0020');
            }],
            ["No-Break Space",
            function(){
                assert.equal(parse.run(whiteSpaceParser.nbsp, '\u00A0'), '\u00A0');
            }],
            ["Byte order mark",
            function(){
                assert.equal(parse.run(whiteSpaceParser.bom, '\uFEFF'), '\uFEFF');
            }],
            ["White Space",
            function(){
                assert.equal(parse.run(whiteSpaceParser.whiteSpace, '\u0009'), '\u0009');
                assert.equal(parse.run(whiteSpaceParser.whiteSpace, '\u000B'), '\u000B');
                assert.equal(parse.run(whiteSpaceParser.whiteSpace, '\u000B'), '\u000B');
                assert.equal(parse.run(whiteSpaceParser.whiteSpace, '\u0020'), '\u0020');
                assert.equal(parse.run(whiteSpaceParser.whiteSpace, '\u00A0'), '\u00A0');
                assert.equal(parse.run(whiteSpaceParser.whiteSpace, '\uFEFF'), '\uFEFF');
            }],
        ],
    };
});
