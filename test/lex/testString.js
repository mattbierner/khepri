define(['parse', 'stringLexer'], function(parse, stringLexer){
    return {
        'module': "String Tests",
        'tests': [
            ["Basic Single Strings",
            function(){
                assert.deepEqual(parse.run(stringLexer.stringLiteral, "'abc'"), 'abc');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, "'abc efg''bla'"), 'abc efg');
            }],
            ["Basic Double Strings",
            function(){
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"abc"'), 'abc');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"abc efg""bla"'), 'abc efg');
            }],
            ["Empty Strings",
            function(){
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '""'), '');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, "''"), '');
            }],
            ["Line continuation",
            function(){
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"a\\\nbc"'), 'abc');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"a\\\n\\\nbc\\\n"'), 'abc');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, "'a\\\nbc'"), 'abc');
            }],
            ["Character Escapes",
            function(){
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\\\"'), '\\');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\\'"'), "'");
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\""'), '"');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\b"'), '\u0008');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\t"'), '\u0009');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\n"'), '\u000A');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\v"'), '\u000B');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\f"'), '\u000C');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\\r"'), '\u000D');
            }],
            ["Hex Escape",
            function(){
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\x41"'), 'A');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\x4F"'), 'O');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\x20"'), ' ');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"x\x2020"'), 'x 20');
            }],
            ["Unicode Escape",
            function(){
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\u0041"'), 'A');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\u004f"'), 'O');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\u0020"'), ' ');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"\u102f"'), '\u102f');
                assert.deepEqual(parse.run(stringLexer.stringLiteral, '"u\u0020ff"'), 'u ff');
            }],
           
        ],
    };
});
