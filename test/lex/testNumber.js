define(['parse', 'numberLexer'], function(parse, numberLexer){
    return {
        'module': "Number Tests",
        'tests': [
            ["decimal",
            function(){
                assert.equal(parse.run(numberLexer.decimal, '.'), '.');
            }],
            ["negative sign",
            function(){
                assert.equal(parse.run(numberLexer.negativeSign, '-'), '-');
            }],
            ["positive sign",
            function(){
                assert.equal(parse.run(numberLexer.positiveSign, '+'), '+');
            }],
            ["exponent indicator",
            function(){
                assert.equal(parse.run(numberLexer.exponentIndicator, 'e'), 'e');
                assert.equal(parse.run(numberLexer.exponentIndicator, 'E'), 'E');
            }],
            ["hex indicator",
            function(){
                assert.equal(parse.run(numberLexer.hexIndicator, '0x'), '0x');
                assert.equal(parse.run(numberLexer.hexIndicator, '0X'), '0X');
            }],
            
            ["Decimal Digit",
            function(){
                assert.equal(parse.run(numberLexer.decimalDigit, '0'), '0');
                assert.equal(parse.run(numberLexer.decimalDigit, '1'), '1');
                assert.equal(parse.run(numberLexer.decimalDigit, '2'), '2');
                assert.equal(parse.run(numberLexer.decimalDigit, '3'), '3');
                assert.equal(parse.run(numberLexer.decimalDigit, '4'), '4');
                assert.equal(parse.run(numberLexer.decimalDigit, '5'), '5');
                assert.equal(parse.run(numberLexer.decimalDigit, '6'), '6');
                assert.equal(parse.run(numberLexer.decimalDigit, '7'), '7');
                assert.equal(parse.run(numberLexer.decimalDigit, '8'), '8');
                assert.equal(parse.run(numberLexer.decimalDigit, '9'), '9');
            }],
            ["Non zero Decimal Digit",
            function(){
                assert.equal(parse.run(numberLexer.nonZeroDigit, '1'), '1');
                assert.equal(parse.run(numberLexer.nonZeroDigit, '2'), '2');
                assert.equal(parse.run(numberLexer.nonZeroDigit, '3'), '3');
                assert.equal(parse.run(numberLexer.nonZeroDigit, '4'), '4');
                assert.equal(parse.run(numberLexer.nonZeroDigit, '5'), '5');
                assert.equal(parse.run(numberLexer.nonZeroDigit, '6'), '6');
                assert.equal(parse.run(numberLexer.nonZeroDigit, '7'), '7');
                assert.equal(parse.run(numberLexer.nonZeroDigit, '8'), '8');
                assert.equal(parse.run(numberLexer.nonZeroDigit, '9'), '9');
                
                assert.throws(parse.run.bind(undefined, numberLexer.nonZeroDigit, '0'));
            }],
            ["Hex Digit",
            function(){
                assert.equal(parse.run(numberLexer.hexDigit, '0'), '0');
                assert.equal(parse.run(numberLexer.hexDigit, '1'), '1');
                assert.equal(parse.run(numberLexer.hexDigit, '2'), '2');
                assert.equal(parse.run(numberLexer.hexDigit, '3'), '3');
                assert.equal(parse.run(numberLexer.hexDigit, '4'), '4');
                assert.equal(parse.run(numberLexer.hexDigit, '5'), '5');
                assert.equal(parse.run(numberLexer.hexDigit, '6'), '6');
                assert.equal(parse.run(numberLexer.hexDigit, '7'), '7');
                assert.equal(parse.run(numberLexer.hexDigit, '8'), '8');
                assert.equal(parse.run(numberLexer.hexDigit, '9'), '9');
                assert.equal(parse.run(numberLexer.hexDigit, 'a'), 'a');
                assert.equal(parse.run(numberLexer.hexDigit, 'b'), 'b');
                assert.equal(parse.run(numberLexer.hexDigit, 'c'), 'c');
                assert.equal(parse.run(numberLexer.hexDigit, 'd'), 'd');
                assert.equal(parse.run(numberLexer.hexDigit, 'e'), 'e');
                assert.equal(parse.run(numberLexer.hexDigit, 'f'), 'f');
                assert.equal(parse.run(numberLexer.hexDigit, 'A'), 'A');
                assert.equal(parse.run(numberLexer.hexDigit, 'B'), 'B');
                assert.equal(parse.run(numberLexer.hexDigit, 'C'), 'C');
                assert.equal(parse.run(numberLexer.hexDigit, 'D'), 'D');
                assert.equal(parse.run(numberLexer.hexDigit, 'E'), 'E');
                assert.equal(parse.run(numberLexer.hexDigit, 'F'), 'F');
            }],
            ["Decimal Digits",
            function(){
                assert.equal(parse.run(numberLexer.decimalDigits, '012'), '012');
                assert.equal(parse.run(numberLexer.decimalDigits, '123a3'), '123');
            }],
            ["Hex Digits",
            function(){
                assert.equal(parse.run(numberLexer.hexDigits, '0a21f'), '0a21f');
                assert.equal(parse.run(numberLexer.hexDigits, 'ba1'), 'ba1');
            }],
            
            ["Unsigned Integer",
            function(){
                assert.equal(parse.run(numberLexer.unsignedInteger, '012'), 12);
                assert.equal(parse.run(numberLexer.unsignedInteger, '123a3'), 123);
                
                assert.throws(parse.run.bind(undefined, numberLexer.unsignedInteger, '-3'));
                assert.throws(parse.run.bind(undefined, numberLexer.unsignedInteger, '+3'));
            }],
            ["Signed Integer",
            function(){
                assert.equal(parse.run(numberLexer.signedInteger, '012'), 12);
                assert.equal(parse.run(numberLexer.signedInteger, '123a3'), 123);
                
                assert.equal(parse.run(numberLexer.signedInteger, '-391'), -391);
                assert.equal(parse.run(numberLexer.signedInteger, '+391'), 391);
            }],
            
            ["Exponent Part",
            function(){
                assert.equal(parse.run(numberLexer.exponentPart, 'e012'), 12);
                assert.equal(parse.run(numberLexer.exponentPart, 'E123a3'), 123);
                
                assert.equal(parse.run(numberLexer.exponentPart, 'e-391'), -391);
                assert.equal(parse.run(numberLexer.exponentPart, 'E+391'), 391);
            }],
            
            ["Hex Integer Literal",
            function(){
                assert.equal(parse.run(numberLexer.hexIntegerLiteral, '0x00123'), 291);
                assert.equal(parse.run(numberLexer.hexIntegerLiteral, '0XAf01'), 44801);
            }],
            ["Decimal Integer Literal",
            function(){
                assert.equal(parse.run(numberLexer.decimalIntegerLiteral, '00123'), 123);
                assert.equal(parse.run(numberLexer.decimalIntegerLiteral, '99'), 99);
            }],
            ["Decimal Literal",
            function(){
                assert.equal(parse.run(numberLexer.decimalLiteral, '00123'), 123);
                assert.equal(parse.run(numberLexer.decimalLiteral, '123.'), 123);
                assert.equal(parse.run(numberLexer.decimalLiteral, '99.9'), 99.9);
                assert.equal(parse.run(numberLexer.decimalLiteral, '.123'), .123);
                
                assert.equal(parse.run(numberLexer.decimalLiteral, '00123e3'), 123000);
                assert.equal(parse.run(numberLexer.decimalLiteral, '123.e3'), 123000);
                assert.equal(parse.run(numberLexer.decimalLiteral, '99.9e3'), 99900);
                assert.equal(parse.run(numberLexer.decimalLiteral, '.123e3'), 123);
                
                assert.equal(parse.run(numberLexer.decimalLiteral, '00123e+3'), 123000);
                assert.equal(parse.run(numberLexer.decimalLiteral, '123.e+3'), 123000);
                assert.equal(parse.run(numberLexer.decimalLiteral, '99.9e+3'), 99900);
                assert.equal(parse.run(numberLexer.decimalLiteral, '.123e+3'), 123);
                
                assert.equal(parse.run(numberLexer.decimalLiteral, '00123e-3'), 0.123);
                assert.equal(parse.run(numberLexer.decimalLiteral, '123.e-3'), 0.123);
                assert.equal(parse.run(numberLexer.decimalLiteral, '99.9e-3'), 0.0999);
                assert.equal(parse.run(numberLexer.decimalLiteral, '.123e-3'), 0.000123);
            }],
        ],
    };
});
