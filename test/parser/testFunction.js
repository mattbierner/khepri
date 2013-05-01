define(['parse/parse',
        'ecma/lex/lexer',
        'ecma/parse/parser',
        'ecma/parse/program_parser'],
function(parse,
        lexer,
        parser,
        expression){
    
    var testParser = function(stream) {
        var result = parser.parseStream(stream);
        return result.body[0].expression;
    };
    
    return {
        'module': "Function Expression Tests",
        'tests': [
            ["Empty Function Expression",
            function(){
                var result = testParser(lexer.lex("z = function(){};"));
                assert.equal(result.right.type, 'FunctionExpression');
                assert.equal(result.right.params.length, 0);
                assert.equal(result.right.name, null);
                assert.equal(result.right.body.type, 'BlockStatement');
            }],
            ["Simple Function Expression",
            function(){
                var result = testParser(lexer.lex("z = function(x){ return x; };"));
                assert.equal(result.right.type, 'FunctionExpression');
                assert.equal(result.right.name, null);
                assert.equal(result.right.params.length, 1);
                assert.equal(result.right.params[0].name, 'x');
                assert.equal(result.right.body.body[0].type, 'ReturnStatement');
            }],
            ["Named Function Expression",
            function(){
                var result = testParser(lexer.lex("z = function z(x){ return x; };"));
                assert.equal(result.right.type, 'FunctionExpression');
                assert.equal(result.right.id.name, 'z');
                assert.equal(result.right.params.length, 1);
                assert.equal(result.right.params[0].name, 'x');
                assert.equal(result.right.body.body[0].type, 'ReturnStatement');
            }],
        ],
    };
});
