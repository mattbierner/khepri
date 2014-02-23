var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};
  

exports.single_bind = function(test) {
    test.equal(
        testParser("let x = 3 in x * 2;"),
        6);
    
    test.done();
};

exports.multiple_binds = function(test) {
    test.equal(
        testParser("let x = 3, y = 2 in x * y;"),
        6);
    
    test.done();
};

exports.as_sub_expression = function(test) {
    test.equal(
        testParser("5 + let x = 3, y = 2 in x * y;"),
        11);
    
    test.done();
};

exports.introduces_new_scope = function(test) {
    test.equal(
        testParser("var x = 3; let x = 10 in x * x;"),
        100);
    
    test.done();
};

exports.top_level_no_conflict = function(test) {
    test.equal(
        testParser("var x = let y = 3 in \\ -> y;" +
                   "var g = let y = 10 in \\ -> y;"+
                   "g();"),
        10);
    
    test.done();
};

exports.unpack = function(test) {
    test.equal(
        testParser("let [x y] = [1, 2, 3] in x + y;"),
        3);
    
    test.done();
};


exports.binding_do_not_see_themselves = function(test) {
    test.equal(
        testParser("var x = 6; let x = x * 4, x = x / 2 in x;"),
        12);
    
    test.done();
};

exports.recursive_binding = function(test) {
    test.equal(
        testParser("let f := \\x -> ?x < 3 :f(x + 1) :x in f(0);"),
        3);
    
    test.done();
};

