define(['bennu/parse',
        'khepri/lex/lexer',
        'khepri/parse/parser',
        'khepri/parse/expression_parser'],
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
            }],
            ["Simple Multi Element Array Literal",
            function(){
                var result = testParser(lexer.lex("[3, 4];"));
                assert.equal(result.elements.length, 2);
                assert.equal(result.elements[0].value, 3);
                assert.equal(result.elements[1].value, 4);
            }],
        ],
    };
});
