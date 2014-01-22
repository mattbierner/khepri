define(['bennu/parse', 'khepri/lex/string_lexer'], function(parse, string_lexer){
    return {
        'module': "String Tests",
        'tests': [
            ["Basic Single Strings",
            function(){
                assert.deepEqual(parse.run(string_lexer.stringLiteral, "'abc'"), 'abc');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, "'abc efg''bla'"), 'abc efg');
            }],
            ["Basic Double Strings",
            function(){
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"abc"'), 'abc');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"abc efg""bla"'), 'abc efg');
            }],
            ["Empty Strings",
            function(){
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '""'), '');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, "''"), '');
            }],
            ["Line continuation",
            function(){
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"a\\\nbc"'), 'abc');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"a\\\n\\\nbc\\\n"'), 'abc');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, "'a\\\nbc'"), 'abc');
            }],
            ["Character Escapes",
            function(){
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\\\"'), '\\');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\\'"'), "'");
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\""'), '"');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\b"'), '\u0008');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\t"'), '\u0009');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\n"'), '\u000A');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\v"'), '\u000B');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\f"'), '\u000C');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\\r"'), '\u000D');
            }],
            ["Hex Escape",
            function(){
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\x41"'), 'A');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\x4F"'), 'O');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\x20"'), ' ');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"x\x2020"'), 'x 20');
            }],
            ["Unicode Escape",
            function(){
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\u0041"'), 'A');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\u004f"'), 'O');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\u0020"'), ' ');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"\u102f"'), '\u102f');
                assert.deepEqual(parse.run(string_lexer.stringLiteral, '"u\u0020ff"'), 'u ff');
            }],
           
        ],
    };
});
