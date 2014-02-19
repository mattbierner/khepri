var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var unparse = require('ecma-unparse').unparse;
var unparse_print = require('ecma-unparse').print;

var compile = require('../index').compile;


var testParser = function(input) {
    return eval(unparse_print.print(unparse.unparse(compile.compile(parser.parseStream(lexer.lex(input))))));
};
  

exports.bind_identifier = function(test) {
    test.equal(
        testParser("var f = \\() =self-> self.x; f.call({'x': 3});"),
        3);
    
    test.done();
};

exports.keeps_binding_in_new_scope = function(test) {
    test.equal(
        testParser("var f = \\() =self-> \\y -> y + self.x; f.call({'x': 3})(10);"),
        13);
    
    test.done();
};

exports.uses_lexical_scope = function(test) {
    test.equal(
        testParser("var f = \\=self-> { var x = self.x; return \\=self-> x + self.x; }; f.call({'x': 3}).call({'x': 10});"),
        13);
    
    test.done();
};


exports.array_unpack = function(test) {
    test.equal(
        testParser("var f = \\=[x _ y]-> x + y; f.call([1,2, 3]);"),
        4);
    
    test.done();
};

exports.object_unpack = function(test) {
    test.equal(
        testParser("var f = \\={x y}-> x + y; f.call({'x': 4, 'z': 3, 'y': 10});"),
        14);
    
    test.done();
};

exports.as_unpack = function(test) {
    test.equal(
        testParser("var f = \\=self#{x y}-> x + y + self.z; f.call({'x': 4, 'z': 3, 'y': 10});"),
        17);
    
    test.done();
};

