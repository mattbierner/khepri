require(['nu-stream/stream',
         'khepri/lex/lexer',
         'khepri/parse/parser',
         'khepri/compile/transform',
         'khepri/compile/lexical',
         'khepri/compile/compile',
         'ecma-unparse/unparse',
         'ecma-unparse/print'],
function(stream,
        lexer,
        parser,
        transform,
        lexical,
        compile,
        unparse,
        unparse_print) {

var editor = CodeMirror.fromTextArea(document.getElementById('khepri-console-input'), {
    'mode': "javascript",
    'lineNumbers': true
});

var output = CodeMirror.fromTextArea(document.getElementById('javascript-console-output'), {
    'mode': "javascript",
    'lineNumbers': true,
    'readOnly': true
});

var translate = function(input) {
    $('#text-out').text('');
    
    var options = {
        'package_manager': $('#package_manager').val()
    };
    
    try {
        var lex = lexer.lex(input);
        var ast = parser.parseStream(lex);
        var ecam_ast = compile.compile(ast, options);
        var unparsed = unparse.unparse(ecam_ast);
        var s = unparse_print.print(unparsed);
        
         output.doc.setValue(s);
         $('#text-out').removeClass('error');

         return s;
    } catch(e) {
        $('#text-out').addClass('error').text(e);
        
    }
};

$(function () {
    $('#translate-button').click(function() {
        translate(editor.doc.getValue('\n'));
    });
});

});