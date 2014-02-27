var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};

exports.basic_binding= function(test) {
    var result = testParser("var a = 10; a;");
    test.equal(result, 10);
    
    test.done();
};

exports.binding_mutability = function(test) {
    var result = testParser("var a = 10; a = a * 10; a;");
    test.equal(result, 100);
    
    test.done();
};

exports.binding_no_initilizer_mutability = function(test) {
    var result = testParser("var a; a = 10; a;");
    test.equal(result, 10);
    
    test.done();
};

exports.declaration_order = function(test) {
    test.throws(function() {
        testParser("b; var b;");
    });
    test.done();
};


exports.immutable_binding = function(test) {
    test.throws(function() {
        testParser("var a := 10; a = 100;");
    });
    test.done();
};


exports.immutable_nonrec_binding = function(test) {
    test.throws(function() {
        testParser("var a =: 10; a = 100;");
    });
    test.done();
};


exports.norec_binding = function(test) {
    var result = testParser("var a := 10; { var a =: a * 3; a; }");
    test.equal(result, 30);
    test.done();
};

