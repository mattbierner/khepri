var requirejs = require('requirejs');
var fs = require('fs');
var argv = require('optimist').argv;

requirejs.config({
    nodeRequire: require,
    paths: {
        'parse': 'dependencies/parse/lib',
        'stream': 'dependencies/stream/lib',
        'ecma_unparse': 'dependencies/ecma-unparse/lib',
        'khepri': 'lib',
        'ecma': 'dependencies/parse-ecma/lib'
    }
});

requirejs(['parse/parse',
           'stream/stream',
           'khepri/lex/lexer', 'khepri/parse/parser',
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
    var inFile = argv._[0];
    var outFile = argv['o'];
    var header = (argv['header'] ? argv['header'] + '\n' : '');

    fs.realpath(inFile, function(err, resolvedPath) {
        if (err) {
            throw err;
        }
        fs.readFile(resolvedPath, 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            var out = header + stream.reduce(compile(data), function(p, c){ return p + '' + c; }, '');
            
            if (outFile) {
                fs.realpath(outFile, function(err, resolvedOutPath) {
                    if (err) {
                        throw err;
                    }
                    fs.writeFile(resolvedOutPath, out, 'utf8', function(err) {
                        if (err) {
                            throw err;
                        }
                        console.log("Compiled '" + inFile + "' to '" + outFile + "'");
                    });
                });
            } else {
                process.stdout.write(out);
                console.log("Compiled '" + inFile + "' to stdout");
            }
        });
    });
});