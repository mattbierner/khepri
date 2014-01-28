define(['bennu/parse', 'khepri/lex/number_lexer'], function(parse, number_lexer){
    return {
        'module': "Number Tests",
        'tests': [
            ["decimal",
            function(){
                assert.equal(parse.run(number_lexer.decimal, '.'), '.');
            }],
            ["negative sign",
            function(){
                assert.equal(parse.run(number_lexer.negativeSign, '-'), '-');
            }],
            ["positive sign",
            function(){
                assert.equal(parse.run(number_lexer.positiveSign, '+'), '+');
            }],
            ["exponent indicator",
            function(){
                assert.equal(parse.run(number_lexer.exponentIndicator, 'e'), 'e');
                assert.equal(parse.run(number_lexer.exponentIndicator, 'E'), 'E');
            }],
            ["hex indicator",
            function(){
                assert.equal(parse.run(number_lexer.hexIndicator, '0x'), '0x');
                assert.equal(parse.run(number_lexer.hexIndicator, '0X'), '0X');
            }],
            
            ["Decimal Digit",
            function(){
                assert.equal(parse.run(number_lexer.decimalDigit, '0'), '0');
                assert.equal(parse.run(number_lexer.decimalDigit, '1'), '1');
                assert.equal(parse.run(number_lexer.decimalDigit, '2'), '2');
                assert.equal(parse.run(number_lexer.decimalDigit, '3'), '3');
                assert.equal(parse.run(number_lexer.decimalDigit, '4'), '4');
                assert.equal(parse.run(number_lexer.decimalDigit, '5'), '5');
                assert.equal(parse.run(number_lexer.decimalDigit, '6'), '6');
                assert.equal(parse.run(number_lexer.decimalDigit, '7'), '7');
                assert.equal(parse.run(number_lexer.decimalDigit, '8'), '8');
                assert.equal(parse.run(number_lexer.decimalDigit, '9'), '9');
            }],
            ["Non zero Decimal Digit",
            function(){
                assert.equal(parse.run(number_lexer.nonZeroDigit, '1'), '1');
                assert.equal(parse.run(number_lexer.nonZeroDigit, '2'), '2');
                assert.equal(parse.run(number_lexer.nonZeroDigit, '3'), '3');
                assert.equal(parse.run(number_lexer.nonZeroDigit, '4'), '4');
                assert.equal(parse.run(number_lexer.nonZeroDigit, '5'), '5');
                assert.equal(parse.run(number_lexer.nonZeroDigit, '6'), '6');
                assert.equal(parse.run(number_lexer.nonZeroDigit, '7'), '7');
                assert.equal(parse.run(number_lexer.nonZeroDigit, '8'), '8');
                assert.equal(parse.run(number_lexer.nonZeroDigit, '9'), '9');
                
                assert.throws(parse.run.bind(undefined, number_lexer.nonZeroDigit, '0'));
            }],
            ["Hex Digit",
            function(){
                assert.equal(parse.run(number_lexer.hexDigit, '0'), '0');
                assert.equal(parse.run(number_lexer.hexDigit, '1'), '1');
                assert.equal(parse.run(number_lexer.hexDigit, '2'), '2');
                assert.equal(parse.run(number_lexer.hexDigit, '3'), '3');
                assert.equal(parse.run(number_lexer.hexDigit, '4'), '4');
                assert.equal(parse.run(number_lexer.hexDigit, '5'), '5');
                assert.equal(parse.run(number_lexer.hexDigit, '6'), '6');
                assert.equal(parse.run(number_lexer.hexDigit, '7'), '7');
                assert.equal(parse.run(number_lexer.hexDigit, '8'), '8');
                assert.equal(parse.run(number_lexer.hexDigit, '9'), '9');
                assert.equal(parse.run(number_lexer.hexDigit, 'a'), 'a');
                assert.equal(parse.run(number_lexer.hexDigit, 'b'), 'b');
                assert.equal(parse.run(number_lexer.hexDigit, 'c'), 'c');
                assert.equal(parse.run(number_lexer.hexDigit, 'd'), 'd');
                assert.equal(parse.run(number_lexer.hexDigit, 'e'), 'e');
                assert.equal(parse.run(number_lexer.hexDigit, 'f'), 'f');
                assert.equal(parse.run(number_lexer.hexDigit, 'A'), 'A');
                assert.equal(parse.run(number_lexer.hexDigit, 'B'), 'B');
                assert.equal(parse.run(number_lexer.hexDigit, 'C'), 'C');
                assert.equal(parse.run(number_lexer.hexDigit, 'D'), 'D');
                assert.equal(parse.run(number_lexer.hexDigit, 'E'), 'E');
                assert.equal(parse.run(number_lexer.hexDigit, 'F'), 'F');
            }],
            ["Decimal Digits",
            function(){
                assert.equal(parse.run(number_lexer.decimalDigits, '012'), '012');
                assert.equal(parse.run(number_lexer.decimalDigits, '123a3'), '123');
            }],
            ["Hex Digits",
            function(){
                assert.equal(parse.run(number_lexer.hexDigits, '0a21f'), '0a21f');
                assert.equal(parse.run(number_lexer.hexDigits, 'ba1'), 'ba1');
            }],
            
            ["Unsigned Integer",
            function(){
                assert.equal(parse.run(number_lexer.unsignedInteger, '012'), 12);
                assert.equal(parse.run(number_lexer.unsignedInteger, '123a3'), 123);
                
                assert.throws(parse.run.bind(undefined, number_lexer.unsignedInteger, '-3'));
                assert.throws(parse.run.bind(undefined, number_lexer.unsignedInteger, '+3'));
            }],
            ["Signed Integer",
            function(){
                assert.equal(parse.run(number_lexer.signedInteger, '012'), 12);
                assert.equal(parse.run(number_lexer.signedInteger, '123a3'), 123);
                
                assert.equal(parse.run(number_lexer.signedInteger, '-391'), -391);
                assert.equal(parse.run(number_lexer.signedInteger, '+391'), 391);
            }],
            
            ["Exponent Part",
            function(){
                assert.equal(parse.run(number_lexer.exponentPart, 'e012'), 12);
                assert.equal(parse.run(number_lexer.exponentPart, 'E123a3'), 123);
                
                assert.equal(parse.run(number_lexer.exponentPart, 'e-391'), -391);
                assert.equal(parse.run(number_lexer.exponentPart, 'E+391'), 391);
            }],
            
            ["Hex Integer Literal",
            function(){
                assert.equal(parse.run(number_lexer.hexIntegerLiteral, '0x00123'), 291);
                assert.equal(parse.run(number_lexer.hexIntegerLiteral, '0XAf01'), 44801);
            }],
            ["Decimal Integer Literal",
            function(){
                assert.equal(parse.run(number_lexer.decimalIntegerLiteral, '00123'), 123);
                assert.equal(parse.run(number_lexer.decimalIntegerLiteral, '99'), 99);
            }],
            ["Decimal Literal",
            function(){
                assert.equal(parse.run(number_lexer.decimalLiteral, '00123'), 123);
                assert.equal(parse.run(number_lexer.decimalLiteral, '123.'), 123);
                assert.equal(parse.run(number_lexer.decimalLiteral, '99.9'), 99.9);
                assert.equal(parse.run(number_lexer.decimalLiteral, '0.123'), .123);
                
                assert.equal(parse.run(number_lexer.decimalLiteral, '00123e3'), 123000);
                assert.equal(parse.run(number_lexer.decimalLiteral, '123.0e3'), 123000);
                assert.equal(parse.run(number_lexer.decimalLiteral, '99.9e3'), 99900);
                assert.equal(parse.run(number_lexer.decimalLiteral, '0.123e3'), 123);
                
                assert.equal(parse.run(number_lexer.decimalLiteral, '00123e+3'), 123000);
                assert.equal(parse.run(number_lexer.decimalLiteral, '123.0e+3'), 123000);
                assert.equal(parse.run(number_lexer.decimalLiteral, '99.9e+3'), 99900);
                assert.equal(parse.run(number_lexer.decimalLiteral, '0.123e+3'), 123);
                
                assert.equal(parse.run(number_lexer.decimalLiteral, '00123e-3'), 0.123);
                assert.equal(parse.run(number_lexer.decimalLiteral, '123.0e-3'), 0.123);
                assert.equal(parse.run(number_lexer.decimalLiteral, '99.9e-3'), 0.0999);
                assert.equal(parse.run(number_lexer.decimalLiteral, '0.123e-3'), 0.000123);
            }],
        ],
    };
});
