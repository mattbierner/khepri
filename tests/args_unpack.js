var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};

exports.simple_unpack_args = function(test) {
    test.equal(
        testParser("(\\args() -> args.length)(1, 2, 3);"),
        3);
    
    test.done();
};

exports.unpack_args_and_inner_pattern = function(test) {
    test.equal(
        testParser("(\\args(x y z) -> args.length * (x + y * z))(1, 2, 3);"),
        21);
    
    test.done();
};

