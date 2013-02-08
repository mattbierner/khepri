var requirejs = require('requirejs');
var fs = require('fs');
var argv = require('optimist').argv;

requirejs.config({
    nodeRequire: require,
    paths: {
        'parse': 'dependencies/parse/lib',
        'stream': 'dependencies/stream/lib',
        'ecma': 'lib',
        'ecma_unparse': 'dependencies/ecma-unparse/lib'
    }
});

requirejs(['parse/parse',
           'stream/stream',
           'ecma/lex/lexer', 'ecma/parse/parser',
           'ecma_unparse/unparse', 'ecma_unparse/print'],
function(parse,
        stream,
        lexer, parser,
        unparse, unparse_print) {
    var compile = function(input) {
        try {
            var lex = lexer.lex(input);
            var ast = parser.parseStream(lex);
            var unparsed = unparse.unparse(ast);
            return unparse_print.print(unparsed);
        } catch (e) {
            throw e;
        }
    };
    
    var file = argv._[0];
    
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        var s = compile(data);
        var out = stream.reduce(s, function(p, c){ return p + '' + c; }, '');
        process.stdout.write(out);
    });
});