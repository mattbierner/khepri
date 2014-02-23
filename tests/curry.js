var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};


exports.single_curry = function(test) {
    test.equal(
        testParser("(\\x, y -> x + y)@2 3;"),
        5);
    
    test.done();
};

exports.curry_multi_arg = function(test) {
    test.equal(
        testParser("(\\x, y, z -> (x + y) / z)@(5, 10) 5;"),
        3);
    
    test.done();
};

exports.multi_curry = function(test) {
    test.equal(
        testParser("(\\x, y, z -> (x + y) / z)@5@10 5;"),
        3);
    
    test.done();
};

exports.multi_arg_lambda_order = function(test) {
    test.equal(
        testParser("(\\x, y, z -> (x / y) + z)@(10,5) 2;"),
        4);
    
    test.done();
};

exports.multi_arg_order = function(test) {
    test.equal(
        testParser("var f = \\x, y, z -> (x / y) + z;" +
                   "f@(10,5) 2;"),
        4);
    
    test.done();
};

exports.curried_args_evaled_once = function(test) {
    test.equal(
        testParser(
            "var g = 0, f = \\x -> { g = g + 1; return x;};"+
            "var c = (\\x, y -> x + y)@(f(10));" +
            "c(3); c(5); g;"),
        1);
    
    test.done();
};

