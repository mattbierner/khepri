define(['parse/parse',
        './parser/testStatement',
        './parser/testArrayLiteral'],
function(parse,
        testStatement,
        testArrayLiteral){
    
    return function(){
        [testStatement,
         testArrayLiteral].forEach(function(m){
            m.module && module(m.module);
            m.tests && m.tests.forEach(function(e){ test.apply(this, e); });
            m.asyncTests && m.asyncTests.forEach(function(e){ asyncTest.apply(this, e); });
          });
    };
});
