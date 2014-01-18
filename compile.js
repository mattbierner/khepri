var requirejs = require('requirejs');
var fs = require('fs');
var argv = require('optimist').argv;

requirejs.config({
    nodeRequire: require,
    paths: {
        'khepri': 'dist',

        'parse': 'dependencies/parse/dist',
        'seshat': 'dependencies/seshat/lib/seshat',
        'nu': 'dependencies/nu/dist',
        
        'ecma': 'dependencies/parse-ecma/lib',
        'ecma_unparse': 'dependencies/ecma-unparse/lib',
        'ecma_ast': 'dependencies/ecma-ast/lib',
        'khepri_ast': 'dependencies/khepri-ast/dist',
        
        'neith': 'dependencies/neith/dist',
        'ecma_ast_zipper': 'dependencies/ecma-ast-zipper/dist',
        'khepri_ast_zipper': 'dependencies/khepri-ast-zipper/dist'
    }
});

requirejs(['ecma_unparse/unparse',
           'ecma_unparse/print',
           'khepri/compile/compile',
           'khepri/lex/lexer',
           'khepri/parse/parser'],
function(unparse,
        unparse_print,
        khepri_compile,
        lexer,
        parser){
    
    var compile = function(input) {
        try {
            var lex = lexer.lex(input);
            var ast = parser.parseStream(lex);
            var unparsed = unparse.unparse(khepri_compile.compile(ast));
            return unparse_print.print(unparsed);
        } catch (e) {
            console.error(e + '');
            process.exit(1);
        }
    };
    
    // Arguments
    var inFile = argv._[0],
        outFile = argv['o'],
        header = (argv['header'] ? argv['header'] + '\n' : '');
	console.log(inFile)

    fs.realpath(inFile, function(err, resolvedPath) {
        if (err) throw err;

        fs.readFile(resolvedPath, 'utf8', function(err, data) {
            if (err) throw err;
            
            var out = header + compile(data);
            if (outFile) {
                fs.writeFile(outFile, out, 'utf8', function(err) {
                    if (err) throw err;
                    console.log("Compiled '" + inFile + "' to '" + outFile + "'");
                });
            } else {
                process.stdout.write(out);
                console.log("Compiled '" + inFile + "' to stdout");
            }
        });
    });
});