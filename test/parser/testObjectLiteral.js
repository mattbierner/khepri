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
        'module': "Object Literal Tests",
        'tests': [
            ["Empty Object Literal",
            function(){
                var result = testParser(lexer.lex("({});"));
                assert.equal(result.properties.length, 0);
                
                var result2 = testParser(lexer.lex("({,});"));
                assert.equal(result2.properties.length, 0);
            }],
            ["Init Values Object Literal",
            function(){
                var result = testParser(lexer.lex("({ a: 0 , 'b': 1, 9: 2,});"));
                assert.equal(result.properties.length, 3);
                assert.equal(result.properties[0].kind, 'init');
                assert.equal(result.properties[0].key.name, 'a');
                assert.equal(result.properties[0].value.value, 0);
                
                assert.equal(result.properties[1].kind, 'init');
                assert.equal(result.properties[1].key.value, 'b');
                assert.equal(result.properties[1].value.value, 1);
                
                assert.equal(result.properties[2].kind, 'init');
                assert.equal(result.properties[2].key.value, 9);
                assert.equal(result.properties[2].value.value, 2);
            }],
            ["Get Value Object Literal",
            function(){
                var result = testParser(lexer.lex("({ get a() { return 3; }, get b(){ return {}; } });"));
                assert.equal(result.properties.length, 2);
                assert.equal(result.properties[0].kind, 'get');
                assert.equal(result.properties[0].key.name, 'a');
                assert.equal(result.properties[0].value.type, 'FunctionExpression');
            }],
            ["Set Value Object Literal",
            function(){
                var result = testParser(lexer.lex("({ set a(b) { }, set b(a) { return {};} });"));
                assert.equal(result.properties.length, 2);
                assert.equal(result.properties[0].kind, 'set');
                assert.equal(result.properties[0].key.name, 'a');
                assert.equal(result.properties[0].value.type, 'FunctionExpression');
                assert.equal(result.properties[0].value.params.length, 1);
                assert.equal(result.properties[0].value.params[0].name, 'b');
            }],
        ],
    };
});
