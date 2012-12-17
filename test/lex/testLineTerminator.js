define(['parse', 'lineTerminatorLexer'], function(parse, lineTerminatorLexer){
    
    return {
        'module': "Line Terminator Tests",
        'tests': [
            ["Line Feed",
            function(){
                assert.equal(parse.run(lineTerminatorLexer.lf, '\u000A'), '\u000A');
            }],
            ["Carriage Return",
            function(){
                assert.equal(parse.run(lineTerminatorLexer.cr, '\u000D'), '\u000D');
            }],
            ["Line Separator",
            function(){
                assert.equal(parse.run(lineTerminatorLexer.ls, '\u2028'), '\u2028');
            }],
            ["Paragraph Separator",
            function(){
                assert.equal(parse.run(lineTerminatorLexer.ps, '\u2029'), '\u2029');
            }],
            ["Line Terminator",
            function(){
                assert.equal(parse.run(lineTerminatorLexer.lineTerminator, '\u000A'), '\u000A');
                assert.equal(parse.run(lineTerminatorLexer.lineTerminator, '\u000D'), '\u000D');
                assert.equal(parse.run(lineTerminatorLexer.lineTerminator, '\u2028'), '\u2028');
                assert.equal(parse.run(lineTerminatorLexer.lineTerminator, '\u2029'), '\u2029');
            }],
            ["Line Terminator Sequence",
            function(){
                assert.equal(parse.run(lineTerminatorLexer.lineTerminatorSequence, '\u000A'), '\u000A');
                assert.equal(parse.run(lineTerminatorLexer.lineTerminatorSequence, '\u2028'), '\u2028');
                assert.equal(parse.run(lineTerminatorLexer.lineTerminatorSequence, '\u2029'), '\u2029');
                
                // CR
                assert.equal(parse.run(lineTerminatorLexer.lineTerminatorSequence, '\u000D'), '\u000D');
                assert.equal(parse.run(lineTerminatorLexer.lineTerminatorSequence, '\u000Dabc'), '\u000D');
                assert.equal(parse.run(lineTerminatorLexer.lineTerminatorSequence, '\u000D\u000A'), '\u000D\u000A');

            }],
        ],
    };
});
