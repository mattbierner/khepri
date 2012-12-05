define(['parse', 'regularExpressionParser'], function(parse, regularExpressionParser){
    
    var reEq = function(x, y) {
        return assert.equal(x.toString(), y.toString());
    };
    
    return {
        'module': "Regular Expression Tests",
        'tests': [
            ["Basic Regex",
            function(){
                reEq(parse.run(regularExpressionParser.regularExpressionLiteral, "/abc/"), /abc/);
                
                reEq(parse.run(regularExpressionParser.regularExpressionLiteral, "/abc/i"), /abc/i);
                
                reEq(parse.run(regularExpressionParser.regularExpressionLiteral, "/abc/igm"), /abc/igm);
            }],
            ["Simple Class",
            function(){
                reEq(parse.run(regularExpressionParser.regularExpressionLiteral, "/[abc]/"), /[abc]/);
                
                reEq(parse.run(regularExpressionParser.regularExpressionLiteral, "/[^*. 3][]/"), /[^*. 3][]/);
            }],
            ["Escape Class",
            function(){
                reEq(parse.run(regularExpressionParser.regularExpressionLiteral, "/[\\]]/"), /[\]]/);
                
            }],
            ["Escape Slash",
            function(){
                reEq(parse.run(regularExpressionParser.regularExpressionLiteral, "/\\/ab/"), /\/ab/);
                
            }],
           
        ],
    };
});
