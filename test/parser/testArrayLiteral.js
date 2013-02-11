define(['parse/parse',
        'ecma/lex/lexer',
        'ecma/parse/parser',
        'ecma/parse/expression_parser'],
function(parse,
        lexer,
        parser,
        expression){
    
    var testParser = function(stream) {
        var result = parser.parseStream(stream);
        return result.body[0].expression;
    };
    
    return {
        'module': "Array Literal Tests",
        'tests': [
            ["Empty Array Literal",
            function(){
                var result = testParser(lexer.lex("[];"));
                assert.equal(result.elements.length, 0);
            }],
            ["Single Element Array Literal",
            function(){
                var result = testParser(lexer.lex("[3];"));
                assert.equal(result.elements.length, 1);
                assert.equal(result.elements[0].value, 3);

                var result2 = testParser(lexer.lex("[3,];"));
                assert.equal(result2.elements.length, 1);
                assert.equal(result2.elements[0].value, 3);
            }],
            ["Simple Multi Element Array Literal",
            function(){
                var result = testParser(lexer.lex("[3, 4];"));
                assert.equal(result.elements.length, 2);
                assert.equal(result.elements[0].value, 3);
                assert.equal(result.elements[1].value, 4);

                var result2 = testParser(lexer.lex("[3, 4 ,];"));
                assert.equal(result2.elements.length, 2);
                assert.equal(result2.elements[0].value, 3);
                assert.equal(result2.elements[1].value, 4);
            }],
            ["Empty Element Array Literal",
            function(){
                var result = testParser(lexer.lex("[,];"));
                assert.equal(result.elements.length, 1);
                assert.equal(result.elements[0], null);
                
                var result2 = testParser(lexer.lex("[,,,];"));
                assert.equal(result2.elements.length, 3);
                assert.equal(result2.elements[0], null);
                assert.equal(result2.elements[1], null);
                assert.equal(result2.elements[2], null);
            }],
            [" Multi Element Array With Empty elements",
            function(){
                var result = testParser(lexer.lex("[3,, 4];"));
                assert.equal(result.elements.length, 3);
                assert.equal(result.elements[0].value, 3);
                assert.equal(result.elements[1], null);
                assert.equal(result.elements[2].value, 4);

                var result2 = testParser(lexer.lex("[3,, 4,];"));
                assert.equal(result2.elements.length, 3);
                
                var result3 = testParser(lexer.lex("[,, 3,, 4,,];"));
                assert.equal(result3.elements.length, 6);
                assert.equal(result3.elements[0], null);
                assert.equal(result3.elements[1], null);
                assert.equal(result3.elements[2].value, 3);
                assert.equal(result3.elements[3], null);
                assert.equal(result3.elements[4].value, 4);
                assert.equal(result3.elements[5], null);
            }],
        ],
    };
});
