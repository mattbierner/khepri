define(['parse', 'numberParser'], function(parse, numberParser){
    return {
        'module': "Number Tests",
        'tests': [
            ["decimal",
            function(){
                assert.equal(parse.run(numberParser.decimal, '.'), '.');
            }],
            ["negative sign",
            function(){
                assert.equal(parse.run(numberParser.negativeSign, '-'), '-');
            }],
            ["positive sign",
            function(){
                assert.equal(parse.run(numberParser.positiveSign, '+'), '+');
            }],
            ["exponent indicator",
            function(){
                assert.equal(parse.run(numberParser.exponentIndicator, 'e'), 'e');
                assert.equal(parse.run(numberParser.exponentIndicator, 'E'), 'E');
            }],
            ["hex indicator",
            function(){
                assert.equal(parse.run(numberParser.hexIndicator, '0x'), '0x');
                assert.equal(parse.run(numberParser.hexIndicator, '0X'), '0X');
            }],
            
            ["Decimal Digit",
            function(){
                assert.equal(parse.run(numberParser.decimalDigit, '0'), '0');
                assert.equal(parse.run(numberParser.decimalDigit, '1'), '1');
                assert.equal(parse.run(numberParser.decimalDigit, '2'), '2');
                assert.equal(parse.run(numberParser.decimalDigit, '3'), '3');
                assert.equal(parse.run(numberParser.decimalDigit, '4'), '4');
                assert.equal(parse.run(numberParser.decimalDigit, '5'), '5');
                assert.equal(parse.run(numberParser.decimalDigit, '6'), '6');
                assert.equal(parse.run(numberParser.decimalDigit, '7'), '7');
                assert.equal(parse.run(numberParser.decimalDigit, '8'), '8');
                assert.equal(parse.run(numberParser.decimalDigit, '9'), '9');
            }],
            ["Non zero Decimal Digit",
            function(){
                assert.equal(parse.run(numberParser.nonZeroDigit, '1'), '1');
                assert.equal(parse.run(numberParser.nonZeroDigit, '2'), '2');
                assert.equal(parse.run(numberParser.nonZeroDigit, '3'), '3');
                assert.equal(parse.run(numberParser.nonZeroDigit, '4'), '4');
                assert.equal(parse.run(numberParser.nonZeroDigit, '5'), '5');
                assert.equal(parse.run(numberParser.nonZeroDigit, '6'), '6');
                assert.equal(parse.run(numberParser.nonZeroDigit, '7'), '7');
                assert.equal(parse.run(numberParser.nonZeroDigit, '8'), '8');
                assert.equal(parse.run(numberParser.nonZeroDigit, '9'), '9');
                
                assert.throws(parse.run.bind(undefined, numberParser.nonZeroDigit, '0'));
            }],
            ["Hex Digit",
            function(){
                assert.equal(parse.run(numberParser.hexDigit, '0'), '0');
                assert.equal(parse.run(numberParser.hexDigit, '1'), '1');
                assert.equal(parse.run(numberParser.hexDigit, '2'), '2');
                assert.equal(parse.run(numberParser.hexDigit, '3'), '3');
                assert.equal(parse.run(numberParser.hexDigit, '4'), '4');
                assert.equal(parse.run(numberParser.hexDigit, '5'), '5');
                assert.equal(parse.run(numberParser.hexDigit, '6'), '6');
                assert.equal(parse.run(numberParser.hexDigit, '7'), '7');
                assert.equal(parse.run(numberParser.hexDigit, '8'), '8');
                assert.equal(parse.run(numberParser.hexDigit, '9'), '9');
                assert.equal(parse.run(numberParser.hexDigit, 'a'), 'a');
                assert.equal(parse.run(numberParser.hexDigit, 'b'), 'b');
                assert.equal(parse.run(numberParser.hexDigit, 'c'), 'c');
                assert.equal(parse.run(numberParser.hexDigit, 'd'), 'd');
                assert.equal(parse.run(numberParser.hexDigit, 'e'), 'e');
                assert.equal(parse.run(numberParser.hexDigit, 'f'), 'f');
                assert.equal(parse.run(numberParser.hexDigit, 'A'), 'A');
                assert.equal(parse.run(numberParser.hexDigit, 'B'), 'B');
                assert.equal(parse.run(numberParser.hexDigit, 'C'), 'C');
                assert.equal(parse.run(numberParser.hexDigit, 'D'), 'D');
                assert.equal(parse.run(numberParser.hexDigit, 'E'), 'E');
                assert.equal(parse.run(numberParser.hexDigit, 'F'), 'F');
            }],
            ["Decimal Digits",
            function(){
                assert.equal(parse.run(numberParser.decimalDigits, '012'), '012');
                assert.equal(parse.run(numberParser.decimalDigits, '123a3'), '123');
            }],
            ["Hex Digits",
            function(){
                assert.equal(parse.run(numberParser.hexDigits, '0a21f'), '0a21f');
                assert.equal(parse.run(numberParser.hexDigits, 'ba1'), 'ba1');
            }],
            
            ["Unsigned Integer",
            function(){
                assert.equal(parse.run(numberParser.unsignedInteger, '012'), 12);
                assert.equal(parse.run(numberParser.unsignedInteger, '123a3'), 123);
                
                assert.throws(parse.run.bind(undefined, numberParser.unsignedInteger, '-3'));
                assert.throws(parse.run.bind(undefined, numberParser.unsignedInteger, '+3'));
            }],
            ["Signed Integer",
            function(){
                assert.equal(parse.run(numberParser.signedInteger, '012'), 12);
                assert.equal(parse.run(numberParser.signedInteger, '123a3'), 123);
                
                assert.equal(parse.run(numberParser.signedInteger, '-391'), -391);
                assert.equal(parse.run(numberParser.signedInteger, '+391'), 391);
            }],
            
            ["Exponent Part",
            function(){
                assert.equal(parse.run(numberParser.exponentPart, 'e012'), 12);
                assert.equal(parse.run(numberParser.exponentPart, 'E123a3'), 123);
                
                assert.equal(parse.run(numberParser.exponentPart, 'e-391'), -391);
                assert.equal(parse.run(numberParser.exponentPart, 'E+391'), 391);
            }],
            
            ["Hex Integer Literal",
            function(){
                assert.equal(parse.run(numberParser.hexIntegerLiteral, '0x00123'), 291);
                assert.equal(parse.run(numberParser.hexIntegerLiteral, '0XAf01'), 44801);
            }],
            ["Decimal Integer Literal",
            function(){
                assert.equal(parse.run(numberParser.decimalIntegerLiteral, '00123'), 123);
                assert.equal(parse.run(numberParser.decimalIntegerLiteral, '99'), 99);
            }],
            ["Decimal Literal",
            function(){
                assert.equal(parse.run(numberParser.decimalLiteral, '00123'), 123);
                assert.equal(parse.run(numberParser.decimalLiteral, '123.'), 123);
                assert.equal(parse.run(numberParser.decimalLiteral, '99.9'), 99.9);
                assert.equal(parse.run(numberParser.decimalLiteral, '.123'), .123);
                
                assert.equal(parse.run(numberParser.decimalLiteral, '00123e3'), 123000);
                assert.equal(parse.run(numberParser.decimalLiteral, '123.e3'), 123000);
                assert.equal(parse.run(numberParser.decimalLiteral, '99.9e3'), 99900);
                assert.equal(parse.run(numberParser.decimalLiteral, '.123e3'), 123);
                
                assert.equal(parse.run(numberParser.decimalLiteral, '00123e+3'), 123000);
                assert.equal(parse.run(numberParser.decimalLiteral, '123.e+3'), 123000);
                assert.equal(parse.run(numberParser.decimalLiteral, '99.9e+3'), 99900);
                assert.equal(parse.run(numberParser.decimalLiteral, '.123e+3'), 123);
                
                assert.equal(parse.run(numberParser.decimalLiteral, '00123e-3'), 0.123);
                assert.equal(parse.run(numberParser.decimalLiteral, '123.e-3'), 0.123);
                assert.equal(parse.run(numberParser.decimalLiteral, '99.9e-3'), 0.0999);
                assert.equal(parse.run(numberParser.decimalLiteral, '.123e-3'), 0.000123);
            }],
        ],
    };
});
