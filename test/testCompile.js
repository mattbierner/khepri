define(['test/compile/testLexical'],
function(/*...*/){
    var modules = arguments;
    
    return function(){
        [].forEach.call(modules, function(m){
            m.module && module(m.module);
            m.tests && m.tests.forEach(function(e){ test.apply(this, e); });
            m.asyncTests && m.asyncTests.forEach(function(e){ asyncTest.apply(this, e); });
          });
    };
});
