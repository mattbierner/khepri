var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};

exports.identifier_member = function(test) {
    test.equal(
        testParser("var o = {'x':3}; o.x;"),
        3);
    
    test.equal(
        testParser("var o = {'x':3}; o.u;"),
        undefined);
    
    test.done();
};

exports.identifier_member_not_renamed = function(test) {
    test.equal(
        testParser("var x = {'x':3}; x.x;"),
        3);
    test.equal(
        testParser("var x = {'x':3}; x.hasOwnProperty('x');"),
        true);
    test.done();
};

exports.nested_member = function(test) {
    test.equal(
        testParser("var o = {'x':{'y': 3}}; o.x.y;"),
        3);
    
    test.done();
};

exports.computed_member = function(test) {
    test.equal(
        testParser("var a = [1, 2, 3]; a.(1);"),
        2);
    test.equal(
        testParser("var a = [1, 2, 3]; var i = 0; a.(i + 1);"),
        2);
    test.done();
};

exports.computed_member_evaled_once = function(test) {
    test.equal(
        testParser("var g = 0; var f = \\x -> { g = g + 1; return x; }; var a = [1, [4], 3]; a.(f(1)).(0); g;"),
        1);

    test.done();
};
