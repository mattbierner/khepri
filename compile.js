var requirejs = require('requirejs');
var fs = require('fs');
var argv = require('optimist').argv;

requirejs.config({
    nodeRequire: require,
    paths: {
        'parse': 'dependencies/parse/lib',
        'seshat': 'dependencies/seshat/lib/seshat',
        'nu': 'dependencies/nu/lib',
        'ecma': 'dependencies/parse-ecma/lib',
        'ecma_unparse': 'dependencies/ecma-unparse/lib',
        'ecma_ast': 'dependencies/ecma-ast/lib',
        'khepri_ast': 'dependencies/khepri-ast/lib',
        'khepri': 'lib'
    }
});

requirejs(['nu/stream',
           'parse/parse',
           'ecma_unparse/unparse',
           'ecma_unparse/print',
           'khepri/compile/lexical',
           'khepri/compile/transform',
           'khepri/lex/lexer',
           'khepri/parse/parser'],
function(stream,
        parse,
        unparse,
        unparse_print,
        lexical,
        transform,
        lexer,
        parser){
    
    var compile = function(input) {
        try {
            var lex = lexer.lex(input);
            var ast = parser.parseStream(lex);
            lexical.check(ast);
            var unparsed = unparse.unparse(transform.transform(ast));
            return unparse_print.print(unparsed);
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    };
    
    var inFile = argv._[0];
    var outFile = argv['o'];
    var header = (argv['header'] ? argv['header'] + '\n' : '');
	console.log(inFile)

    fs.realpath(inFile, function(err, resolvedPath) {
        if (err) {
            throw err;
        }

        fs.readFile(resolvedPath, 'utf8', function(err, data) {
            if (err) {
                throw err;
            }
            var out = header + stream.foldl(function(p, c) { return p + '' + c; }, '', compile(data));
            
            if (outFile) {
                fs.writeFile(outFile, out, 'utf8', function(err) {
                    if (err) {
                        throw err;
                    }
                    console.log("Compiled '" + inFile + "' to '" + outFile + "'");
                });
            } else {
                process.stdout.write(out);
                console.log("Compiled '" + inFile + "' to stdout");
            }
        });
    });
});