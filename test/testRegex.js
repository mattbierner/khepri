define(['parse', 'regularExpressionLexer'], function(parse, regularExpressionLexer){
    
    var reEq = function(x, y) {
        return assert.equal(x.toString(), y.toString());
    };
    
    return {
        'module': "Regular Expression Tests",
        'tests': [
            ["Basic Regex",
            function(){
                reEq(parse.run(regularExpressionLexer.regularExpressionLiteral, "/abc/"), /abc/);
                
                reEq(parse.run(regularExpressionLexer.regularExpressionLiteral, "/abc/i"), /abc/i);
                
                reEq(parse.run(regularExpressionLexer.regularExpressionLiteral, "/abc/igm"), /abc/igm);
            }],
            ["Simple Class",
            function(){
                reEq(parse.run(regularExpressionLexer.regularExpressionLiteral, "/[abc]/"), /[abc]/);
                
                reEq(parse.run(regularExpressionLexer.regularExpressionLiteral, "/[^*. 3][]/"), /[^*. 3][]/);
            }],
            ["Escape Class",
            function(){
                reEq(parse.run(regularExpressionLexer.regularExpressionLiteral, "/[\\]]/"), /[\]]/);
                
            }],
            ["Escape Slash",
            function(){
                reEq(parse.run(regularExpressionLexer.regularExpressionLiteral, "/\\/ab/"), /\/ab/);
                
            }],
           
        ],
    };
});
