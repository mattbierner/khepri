define(['bennu/parse',
        'khepri/lex/lexer',
        'khepri/parse/parser',
        'khepri/parse/package_parser'],
function(parse,
        lexer,
        parser,
        package){
    
    var testParser = function(stream) {
        var result = parser.parseStream(stream);
        return result.body;
    };
    
    return {
        'module': "Package Parsers",
        'tests': [
            ["Simple Block Package",
            function(){
                var result = testParser(lexer.lex("package () { }"));
                assert.equal(result.type, "Package");
                assert.equal(result.exports.type, "PackageExports");
                assert.equal(result.exports.exports.length, 0);
                assert.equal(result.body.type, 'BlockStatement');
                assert.equal(result.body.body.length, 0);
                
            }],
            ["Simple With Package",
            function(){
                var result = testParser(lexer.lex("package () with x = 3 in { }"));
                assert.equal(result.type, "Package");
                assert.equal(result.exports.type, "PackageExports");
                assert.equal(result.exports.exports.length, 0);
                assert.equal(result.body.type, 'WithStatement');
                assert.equal(result.body.bindings.length, 1);
                assert.equal(result.body.bindings[0].pattern.type, 'IdentifierPattern');
                assert.equal(result.body.bindings[0].pattern.id.name, 'x');
                assert.equal(result.body.bindings[0].value.type, 'Literal');
                assert.equal(result.body.bindings[0].value.kind, 'number');
                assert.equal(result.body.bindings[0].value.value, 3);

                assert.equal(result.body.body.type, 'BlockStatement');
                assert.equal(result.body.body.body.length, '0');
            }],
            ["Simple Exports",
            function(){
                var result = testParser(lexer.lex("package (min, max) { }"));
                assert.equal(result.type, "Package");
                assert.equal(result.exports.type, "PackageExports");
                assert.equal(result.exports.exports.length, 2);
                assert.equal(result.exports.exports[0].type, 'PackageExport');
                assert.equal(result.exports.exports[0].id.type, 'Identifier');
                assert.equal(result.exports.exports[0].id.name, 'min');
                assert.equal(result.exports.exports[1].type, 'PackageExport');
                assert.equal(result.exports.exports[1].id.type, 'Identifier');
                assert.equal(result.exports.exports[1].id.name, 'max');
                assert.equal(result.body.type, 'BlockStatement');
                assert.equal(result.body.body.length, 0);
            }]
        ],
    };
});
