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
        testParser("with x = 3 in { x * 2; }"),
        6);
    
    test.done();
};

exports.multiple_binds = function(test) {
    test.equal(
        testParser("with x = 3, y = 2 in { x * y; }"),
        6);
    
    test.done();
};


exports.introduces_new_scope = function(test) {
    test.equal(
        testParser("var x = 3; with x = 10 in { x * x; }"),
        100);
    
    test.done();
};

exports.unpack = function(test) {
    test.equal(
        testParser("with [x y] = [1, 2, 3] in { x + y; }"),
        3);
    
    test.done();
};

exports.return_in_with = function(test) {
    test.equal(
        testParser("var f = \\x -> { with y = 3 in { return x + y; } }; f 10;"),
        13);
    
    test.done();
};

exports.throw_in_with = function(test) {
    test.equal(
        testParser("try { with x = 3 in { throw x; }} catch (e) { e; }"),
        3);
    
    test.done();
};


exports.break_in_with = function(test) {
    test.equal(
        testParser("for (var i = 0; true; i = i + 1) with y = i * i in { y; if (y > 100) break; }"),
        121);
    
    test.done();
};


