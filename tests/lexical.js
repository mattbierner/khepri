var parser = require('khepri-parse').parse.parser;
var lexer = require('khepri-parse').lex.lexer;

var lexical = require('../index').lexical;


var testParser = function(stream) {
    return parser.parseStream(stream);
};
  

exports.basicLexicalScope = function(test) {
    var result = lexical.check(testParser(lexer.lex("var a; a; { a; };")));
    test.ok(true);
    
    test.done();
};

exports.undefinedVar = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("b;")));
    });
    
    test.done();
};

exports.declarationOrder = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("b; var b;")));
    });
    test.done();
};

exports.usedOutsideofBlock = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("{ var b; }; b;")));
    });
    test.done();
};

exports.ifBodyIntroducesScope = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex(" if (true) var b; b;")));
    });
    test.done();
};

exports.duplicateDeclarationsInOneScope = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("var a; var c; var a;")));
    });
    
    test.throws(function() {
        lexical.check(testParser(lexer.lex("{ var a; var c; var a; }")));
    });
    
    var result = lexical.check(testParser(lexer.lex("var a; { var a; }")));
    test.ok(true);
    test.done();
};

//@TODO: renaming now takes place in translate not lexical
/*
exports.renaming = function(test) {
    var result = lexical.check(testParser(lexer.lex("var a; { var a; }")));
    test.ok(result.body[0].declarations[0].id.name !== result.body[1].body[0].declarations[0].id.name);
    
    var result = lexical.check(testParser(lexer.lex("{ var a; } var a; ")));
    test.ok(result.body[0].body[0].declarations[0].id.name !== result.body[1].declarations[0].id.name);
    test.done();
};
*/
exports.switchBodyIntroducesNewScopeButNotCases = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("var a; switch(a) {case 0: var a; default: var a; }")));
    });
    test.ok(
        lexical.check(testParser(lexer.lex("var a; switch(a) { default: var a; }"))));
    
    var result = lexical.check(testParser(lexer.lex("var a; switch(a) { default: var a; }")));
    //test.ok(result.body[0].declarations[0].id.name != result.body[1].cases[0].consequent[0].declarations[0].id.name);
    test.done();
};

exports.packageDuplicateExports = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("package (x, x) {}")));
    });
    
    test.throws(function() {
        lexical.check(testParser(lexer.lex("package (x, y, z, x) {}")));
    });
    test.done();
};

exports.packageBindingNameConflict = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("package (x) with x = 3 {}")));
    });
    
    test.throws(function() {
        lexical.check(testParser(lexer.lex("package (y, z, x) with [[[x]]] = 3 {}")));
    });
    
    test.throws(function() {
        lexical.check(testParser(lexer.lex("package (y, z, x) with import 'x' x {}")));
    });
    test.done();
};

exports.packageBodyNameConflict = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("package (x) { var x; }")));
    });
    
    test.ok(
        lexical.check(testParser(lexer.lex("package (x) { {var x; } }"))));
    test.done();
};

exports.packageBlockBodyConflict = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("package () with x = 3 in { var x; }")));
    });
    
    test.ok(
        lexical.check(testParser(lexer.lex("package () with x = 3 in { {var x; } }"))));
    test.done();
};

exports.multipleParameterSameName = function(test) {
    test.throws(function() {
        lexical.check(testParser(lexer.lex("(\\x, x -> x*x)(2)")));
    });
    
    test.throws(function() {
        lexical.check(testParser(lexer.lex("(\\x, a, b, x -> x*x)(2)")));
    });
    
     test.ok(
        lexical.check(testParser(lexer.lex("\\x -> \\x -> x;"))));
     test.done();
};


