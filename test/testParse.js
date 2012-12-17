define(['parse', './parser/testStatement'],
function(parse, testStatement){
    
    return function(){
        [testStatement].forEach(function(m){
            m.module && module(m.module);
            m.tests && m.tests.forEach(function(e){ test.apply(this, e); });
            m.asyncTests && m.asyncTests.forEach(function(e){ asyncTest.apply(this, e); });
          });
    };
});
