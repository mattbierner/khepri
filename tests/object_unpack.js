var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};
  

exports.single_value = function(test) {
    test.equal(
        testParser("var f = \\{'x': val} -> val; f {'x': 1, 'y': 2};"),
        1);
    
    test.done();
};

exports.multiple_values = function(test) {
    test.equal(
        testParser("var f = \\{'x': x, 'y': y} -> x + y; f {'x': 1, 'y': 2};"),
        3);
    
    test.done();
};

exports.undefined_value = function(test) {
    test.equal(
        testParser("var f = \\{'undefined': x} -> x; f {'x': 1, 'y': 2};"),
        undefined);
    
    test.done();
};

exports.identifier_name = function(test) {
    test.equal(
        testParser("var f = \\{x y} -> x + y; f {'x': 1, 'y': 2};"),
        3);
    
    test.done();
};

exports.nested_object_unpacks = function(test) {
    test.equal(
        testParser("var f = \\{'x': {'y': y} } -> y; f {'x': {'y': 2}};"),
        2);
    
    test.done();
};

exports.array_target = function(test) {
    test.equal(
        testParser("var f = \\{'1': x} -> x; f [0, 1, 2, 3];"),
        1);
    
    test.done();
};

exports.as_name = function(test) {
    test.equal(
        testParser("var f = \\{x#{y}} -> y; f {'x': {'y': 2}};"),
        2);
    
    test.done();
};
