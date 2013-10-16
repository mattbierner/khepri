define(['./parser/testStatement',
        './parser/testArrayLiteral',
        './parser/testObjectLiteral',
        './parser/testExpression',
        './parser/testFunction',
        './parser/testPackage'],
function(/*...*/){
    var tests = arguments;
    return function(){
        [].forEach.call(tests, function(m){
            m.module && module(m.module);
            m.tests && m.tests.forEach(function(e){ test.apply(this, e); });
            m.asyncTests && m.asyncTests.forEach(function(e){ asyncTest.apply(this, e); });
          });
    };
});
