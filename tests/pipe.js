var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};


exports.simple_pipe = function(test) {
    test.equal(
        testParser("10 |> \\x -> x + 1;"),
        11);
    
    test.done();
};

exports.multi_pipe = function(test) {
    test.equal(
        testParser("10 |> \\x -> x + 2 |> \\x -> x / 3;"),
        4);
    
    test.done();
};

exports.pipe_to_curried = function(test) {
    test.equal(
        testParser("10 |> (+)@1;"),
        11);
    
    test.done();
};

exports.reverse_pipe = function(test) {
    test.equal(
        testParser("(\\x -> x + 1) <| 10;"),
        11);
    
    test.done();
};
