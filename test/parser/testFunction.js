define(['bennu/parse',
        'khepri/lex/lexer',
        'khepri/parse/parser',
        'khepri/parse/program_parser'],
function(parse,
        lexer,
        parser,
        expression){
    
    var testParser = function(stream) {
        var result = parser.parseStream(stream);
        return result.body[0].expression;
    };
    
    return {
        'module': "Function Expression",
        'tests': [
            ["Empty Function Expression",
            function(){
                var result = testParser(lexer.lex("z = function \\() -> {};"));
                assert.equal(result.right.type, 'FunctionExpression');
                assert.equal(result.right.params.elements.length, 0);
                assert.equal(result.right.name, null);
                assert.equal(result.right.body.type, 'BlockStatement');
            }],
            ["Simple Function Expression",
            function(){
                var result = testParser(lexer.lex("z = function\\ x ->{ return x; };"));
                assert.equal(result.right.type, 'FunctionExpression');
                assert.equal(result.right.name, null);
                assert.equal(result.right.params.elements.length, 1);
                assert.equal(result.right.params.elements[0].id.name, 'x');
                assert.equal(result.right.body.body[0].type, 'ReturnStatement');
            }],
            ["Named Function Expression",
            function(){
                var result = testParser(lexer.lex("z = function z\\x -> { return x; };"));
                assert.equal(result.right.type, 'FunctionExpression');
                assert.equal(result.right.id.name, 'z');
                assert.equal(result.right.params.elements.length, 1);
                assert.equal(result.right.params.elements[0].id.name, 'x');
                assert.equal(result.right.body.body[0].type, 'ReturnStatement');
            }],
        ],
    };
});
