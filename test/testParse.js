define(['parse/parse',
        './parser/testStatement',
        './parser/testArrayLiteral',
        './parser/testObjectLiteral'],
function(parse,
        testStatement,
        testArrayLiteral,
        testObjectLiteral){
    
    return function(){
        [testStatement, testArrayLiteral, testObjectLiteral].forEach(function(m){
            m.module && module(m.module);
            m.tests && m.tests.forEach(function(e){ test.apply(this, e); });
            m.asyncTests && m.asyncTests.forEach(function(e){ asyncTest.apply(this, e); });
          });
    };
});
