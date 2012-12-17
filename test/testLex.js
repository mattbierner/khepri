define(['parse', 'lex/testNumber', 'lex/testWhiteSpace', 'lex/testLineTerminator',
'lex/testComment', 'lex/testString', 'lex/testIdentifier', 'lex/testRegex'],
function(parse, testNumber, testWhiteSpace, testLineTerminator,
testComment, testString, testIdentifier, testRegex){
    
    return function(){
        [testNumber, testWhiteSpace, testLineTerminator, testComment,
          testString, testIdentifier, testRegex].forEach(function(m){
            m.module && module(m.module);
            m.tests && m.tests.forEach(function(e){ test.apply(this, e); });
            m.asyncTests && m.asyncTests.forEach(function(e){ asyncTest.apply(this, e); });
          });
    };
});
