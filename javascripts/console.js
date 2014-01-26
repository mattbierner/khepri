require(['nu-stream/stream',
         'khepri/lex/lexer',
         'khepri/parse/parser',
         'khepri/compile/transform',
         'khepri/compile/lexical',
         'khepri/compile/compile',
         'ecma_unparse/unparse',
         'ecma_unparse/print'],
function(stream,
        lexer,
        parser,
        transform,
        lexical,
        compile,
        unparse,
        unparse_print) {

var editor = CodeMirror.fromTextArea(document.getElementById('console-input'), {
    'mode': "javascript",
    'lineNumbers': true
});

$(function () {
    $('button').click(function () {
        var input = $('textarea').val();
        $('.ParseError').text('');
        $('#text_out').text('');
        
        var options = {
            'package_manager': $('#package_manager').val()
        };
        
        try {
            var lex = lexer.lex(input);
            var ast = parser.parseStream(lex);
            
            var ecam_ast = compile.compile(ast, options);
            var unparsed = unparse.unparse(ecam_ast);
            var s = unparse_print.print(unparsed);
            
            $('#text_out').text(s);
        } catch (e) {
            $('.ParseError').text(e);
        }
    });
});

});