define(['parse', 'stringParser'], function(parse, stringParser){
    return {
        'module': "String Tests",
        'tests': [
            ["Basic Single Strings",
            function(){
                assert.deepEqual(parse.run(stringParser.stringLiteral, "'abc'"), 'abc');
                assert.deepEqual(parse.run(stringParser.stringLiteral, "'abc efg''bla'"), 'abc efg');
            }],
            ["Basic Double Strings",
            function(){
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"abc"'), 'abc');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"abc efg""bla"'), 'abc efg');
            }],
            ["Empty Strings",
            function(){
                assert.deepEqual(parse.run(stringParser.stringLiteral, '""'), '');
                assert.deepEqual(parse.run(stringParser.stringLiteral, "''"), '');
            }],
            ["Line continuation",
            function(){
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"a\\\nbc"'), 'abc');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"a\\\n\\\nbc\\\n"'), 'abc');
                assert.deepEqual(parse.run(stringParser.stringLiteral, "'a\\\nbc'"), 'abc');
            }],
            ["Character Escapes",
            function(){
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\\\"'), '\\');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\\'"'), "'");
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\""'), '"');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\b"'), '\u0008');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\t"'), '\u0009');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\n"'), '\u000A');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\v"'), '\u000B');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\f"'), '\u000C');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\\r"'), '\u000D');
            }],
            ["Hex Escape",
            function(){
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\x41"'), 'A');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\x4F"'), 'O');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\x20"'), ' ');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"x\x2020"'), 'x 20');
            }],
            ["Unicode Escape",
            function(){
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\u0041"'), 'A');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\u004f"'), 'O');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\u0020"'), ' ');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"\u102f"'), '\u102f');
                assert.deepEqual(parse.run(stringParser.stringLiteral, '"u\u0020ff"'), 'u ff');
            }],
           
        ],
    };
});
