define(['bennu/parse', 'test/lex/testNumber', 'test/lex/testWhiteSpace', 'test/lex/testLineTerminator',
'test/lex/testComment', 'test/lex/testString', 'test/lex/testIdentifier', 'test/lex/testRegex'],
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
