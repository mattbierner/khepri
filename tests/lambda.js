var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};

exports.single_arg_lambda = function(test) {
    test.equal(
        testParser("(\\x -> x * 3)(10);"),
        30);
    
    test.done();
};

exports.multi_arg_lambda = function(test) {
    test.equal(
        testParser("(\\x y z -> x + y * z)(1, 4, 5);"),
        21);
    
    test.done();
};

exports.placeholders = function(test) {
    test.equal(
        testParser("(\\_ x _ y -> x + y)(1, 2, 3, 4);"),
        6);
    
    test.done();
};

exports.introduces_new_scope_for_args = function(test) {
    test.equal(
        testParser("var x = 100; (\\x -> x * 3)(10);"),
        30);
    
    test.done();
};

exports.introduces_new_scope_for_body = function(test) {
    test.equal(
        testParser("var x = 100; (\\() -> { var x = 3; return x * x; })();"),
        9);
    
    test.done();
};