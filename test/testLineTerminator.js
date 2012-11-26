define(['parse', 'lineTerminatorParser'], function(parse, lineTerminatorParser){
    
    return {
        'module': "Line Terminator Tests",
        'tests': [
            ["Line Feed",
            function(){
                assert.equal(parse.run(lineTerminatorParser.lf, '\u000A'), '\u000A');
            }],
            ["Carriage Return",
            function(){
                assert.equal(parse.run(lineTerminatorParser.cr, '\u000D'), '\u000D');
            }],
            ["Line Separator",
            function(){
                assert.equal(parse.run(lineTerminatorParser.ls, '\u2028'), '\u2028');
            }],
            ["Paragraph Separator",
            function(){
                assert.equal(parse.run(lineTerminatorParser.ps, '\u2029'), '\u2029');
            }],
            ["Line Terminator",
            function(){
                assert.equal(parse.run(lineTerminatorParser.lineTerminator, '\u000A'), '\u000A');
                assert.equal(parse.run(lineTerminatorParser.lineTerminator, '\u000D'), '\u000D');
                assert.equal(parse.run(lineTerminatorParser.lineTerminator, '\u2028'), '\u2028');
                assert.equal(parse.run(lineTerminatorParser.lineTerminator, '\u2029'), '\u2029');
            }],
            ["Line Terminator Sequence",
            function(){
                assert.equal(parse.run(lineTerminatorParser.lineTerminatorSequence, '\u000A'), '\u000A');
                assert.equal(parse.run(lineTerminatorParser.lineTerminatorSequence, '\u2028'), '\u2028');
                assert.equal(parse.run(lineTerminatorParser.lineTerminatorSequence, '\u2029'), '\u2029');
                
                // CR
                assert.equal(parse.run(lineTerminatorParser.lineTerminatorSequence, '\u000D'), '\u000D');
                assert.equal(parse.run(lineTerminatorParser.lineTerminatorSequence, '\u000Dabc'), '\u000D');
                assert.equal(parse.run(lineTerminatorParser.lineTerminatorSequence, '\u000D\u000A'), '\u000D\u000A');

            }],
        ],
    };
});
