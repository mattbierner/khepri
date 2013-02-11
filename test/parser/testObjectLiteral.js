define(['parse/parse', 'ecma/lex/lexer', 'ecma/parse/expression_parser'], function(parse, lexer, expression){
    return {
        'module': "Array Literal Tests",
        'tests': [
            ["Empty Array Literal",
            function(){
                var result = parse.run(expression.arrayLiteral, lexer.lex("[]"))
                assert.deepEqual(result.value, []);
            }],
            ["Single Element Array Literal",
            function(){
                var result = parse.run(expression.arrayLiteral, lexer.lex("[3]"))
                assert.deepEqual(result.value, [3]);
                
                var result2 = parse.run(expression.arrayLiteral, lexer.lex("[3,]"))
                assert.deepEqual(result2.value, [3]);
                assert.deepEqual(result2.value.length, 1);
            }],
        ],
    };
});
