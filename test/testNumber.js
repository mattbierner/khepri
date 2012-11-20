define(['parse', 'number'], function(parse, number){
  
    
    return {
        'module': "Number Tests",
        'tests': [
            ["decimal",
            function(){
                assert.equal(parse.run(number.decimal, '.'), '.');
            }],
            ["negative sign",
            function(){
                assert.equal(parse.run(number.negativeSign, '-'), '-');
            }],
            ["positive sign",
            function(){
                assert.equal(parse.run(number.positiveSign, '+'), '+');
            }],
            ["exponent indicator",
            function(){
                assert.equal(parse.run(number.exponentIndicator, 'e'), 'e');
                assert.equal(parse.run(number.exponentIndicator, 'E'), 'E');
            }],
            ["hex indicator",
            function(){
                assert.equal(parse.run(number.hexIndicator, '0x'), '0x');
                assert.equal(parse.run(number.hexIndicator, '0X'), '0X');
            }],
            
            ["Decimal Digit",
            function(){
                assert.equal(parse.run(number.decimalDigit, '0'), '0');
                assert.equal(parse.run(number.decimalDigit, '1'), '1');
                assert.equal(parse.run(number.decimalDigit, '2'), '2');
                assert.equal(parse.run(number.decimalDigit, '3'), '3');
                assert.equal(parse.run(number.decimalDigit, '4'), '4');
                assert.equal(parse.run(number.decimalDigit, '5'), '5');
                assert.equal(parse.run(number.decimalDigit, '6'), '6');
                assert.equal(parse.run(number.decimalDigit, '7'), '7');
                assert.equal(parse.run(number.decimalDigit, '8'), '8');
                assert.equal(parse.run(number.decimalDigit, '9'), '9');
            }],
            ["Non zero Decimal Digit",
            function(){
                assert.equal(parse.run(number.nonZeroDigit, '1'), '1');
                assert.equal(parse.run(number.nonZeroDigit, '2'), '2');
                assert.equal(parse.run(number.nonZeroDigit, '3'), '3');
                assert.equal(parse.run(number.nonZeroDigit, '4'), '4');
                assert.equal(parse.run(number.nonZeroDigit, '5'), '5');
                assert.equal(parse.run(number.nonZeroDigit, '6'), '6');
                assert.equal(parse.run(number.nonZeroDigit, '7'), '7');
                assert.equal(parse.run(number.nonZeroDigit, '8'), '8');
                assert.equal(parse.run(number.nonZeroDigit, '9'), '9');
                
                assert.throws(parse.run.bind(undefined, number.nonZeroDigit, '0'));
            }],
            ["Hex Digit",
            function(){
                assert.equal(parse.run(number.hexDigit, '0'), '0');
                assert.equal(parse.run(number.hexDigit, '1'), '1');
                assert.equal(parse.run(number.hexDigit, '2'), '2');
                assert.equal(parse.run(number.hexDigit, '3'), '3');
                assert.equal(parse.run(number.hexDigit, '4'), '4');
                assert.equal(parse.run(number.hexDigit, '5'), '5');
                assert.equal(parse.run(number.hexDigit, '6'), '6');
                assert.equal(parse.run(number.hexDigit, '7'), '7');
                assert.equal(parse.run(number.hexDigit, '8'), '8');
                assert.equal(parse.run(number.hexDigit, '9'), '9');
                assert.equal(parse.run(number.hexDigit, 'a'), 'a');
                assert.equal(parse.run(number.hexDigit, 'b'), 'b');
                assert.equal(parse.run(number.hexDigit, 'c'), 'c');
                assert.equal(parse.run(number.hexDigit, 'd'), 'd');
                assert.equal(parse.run(number.hexDigit, 'e'), 'e');
                assert.equal(parse.run(number.hexDigit, 'f'), 'f');
                assert.equal(parse.run(number.hexDigit, 'A'), 'A');
                assert.equal(parse.run(number.hexDigit, 'B'), 'B');
                assert.equal(parse.run(number.hexDigit, 'C'), 'C');
                assert.equal(parse.run(number.hexDigit, 'D'), 'D');
                assert.equal(parse.run(number.hexDigit, 'E'), 'E');
                assert.equal(parse.run(number.hexDigit, 'F'), 'F');
            }],
            ["Decimal Digits",
            function(){
                assert.equal(parse.run(number.decimalDigits, '012'), '012');
                assert.equal(parse.run(number.decimalDigits, '123a3'), '123');
            }],
            ["Hex Digits",
            function(){
                assert.equal(parse.run(number.hexDigits, '0a21f'), '0a21f');
                assert.equal(parse.run(number.hexDigits, 'ba1'), 'ba1');
            }],
            
            ["Unsigned Integer",
            function(){
                assert.equal(parse.run(number.unsignedInteger, '012'), 12);
                assert.equal(parse.run(number.unsignedInteger, '123a3'), 123);
                
                assert.throws(parse.run.bind(undefined, number.unsignedInteger, '-3'));
                assert.throws(parse.run.bind(undefined, number.unsignedInteger, '+3'));
            }],
            ["Signed Integer",
            function(){
                assert.equal(parse.run(number.signedInteger, '012'), 12);
                assert.equal(parse.run(number.signedInteger, '123a3'), 123);
                
                assert.equal(parse.run(number.signedInteger, '-391'), -391);
                assert.equal(parse.run(number.signedInteger, '+391'), 391);
            }],
            
            ["Exponent Part",
            function(){
                assert.equal(parse.run(number.exponentPart, 'e012'), 12);
                assert.equal(parse.run(number.exponentPart, 'E123a3'), 123);
                
                assert.equal(parse.run(number.exponentPart, 'e-391'), -391);
                assert.equal(parse.run(number.exponentPart, 'E+391'), 391);
            }],
            
            ["Hex Integer Literal",
            function(){
                assert.equal(parse.run(number.hexIntegerLiteral, '0x00123'), 291);
                assert.equal(parse.run(number.hexIntegerLiteral, '0XAf01'), 44801);
            }],
            ["Decimal Integer Literal",
            function(){
                assert.equal(parse.run(number.decimalIntegerLiteral, '00123'), 123);
                assert.equal(parse.run(number.decimalIntegerLiteral, '99'), 99);
            }],
            ["Decimal Literal",
            function(){
                assert.equal(parse.run(number.decimalLiteral, '00123'), 123);
                assert.equal(parse.run(number.decimalLiteral, '123.'), 123);
                assert.equal(parse.run(number.decimalLiteral, '99.9'), 99.9);
                assert.equal(parse.run(number.decimalLiteral, '.123'), .123);
                
                assert.equal(parse.run(number.decimalLiteral, '00123e3'), 123000);
                assert.equal(parse.run(number.decimalLiteral, '123.e3'), 123000);
                assert.equal(parse.run(number.decimalLiteral, '99.9e3'), 99900);
                assert.equal(parse.run(number.decimalLiteral, '.123e3'), 123);
                
                assert.equal(parse.run(number.decimalLiteral, '00123e+3'), 123000);
                assert.equal(parse.run(number.decimalLiteral, '123.e+3'), 123000);
                assert.equal(parse.run(number.decimalLiteral, '99.9e+3'), 99900);
                assert.equal(parse.run(number.decimalLiteral, '.123e+3'), 123);
                
                assert.equal(parse.run(number.decimalLiteral, '00123e-3'), 0.123);
                assert.equal(parse.run(number.decimalLiteral, '123.e-3'), 0.123);
                assert.equal(parse.run(number.decimalLiteral, '99.9e-3'), 0.0999);
                assert.equal(parse.run(number.decimalLiteral, '.123e-3'), 0.000123);
            }],
        ],
    };
});
