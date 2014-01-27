"use strict";
var parse = require("bennu")["parse"],
    punctuator, keyword, identifier, anyIdentifier, nullLiteral, booleanLiteral, numericLiteral, stringLiteral,
        regularExpressionLiteral, indexOf = Function.prototype.call.bind(Array.prototype.indexOf),
    join = Function.prototype.call.bind(Array.prototype.join),
    expectError = (function(msg) {
        return (function(pos, tok) {
            return new(parse.ExpectError)(pos, msg, ((tok === null) ? "end of input" : tok.value));
        });
    }),
    typeParser = (function(type, msg) {
        return parse.token((function(tok) {
            return (tok.type === type);
        }), expectError(msg));
    }),
    selectAny = (function(type) {
        return (function() {
            var options = arguments;
            return parse.token((function(tok) {
                return ((tok.type === type) && (indexOf(options, tok.value) >= 0));
            }), expectError(join(options, ", ")));
        });
    });
(punctuator = selectAny("Punctuator"));
(keyword = selectAny("Keyword"));
(anyIdentifier = typeParser("Identifier", "any identifier"));
(identifier = selectAny("Identifier"));
(nullLiteral = typeParser("Null", "Null literal"));
(booleanLiteral = typeParser("Boolean", "boolean literal"));
(numericLiteral = typeParser("Number", "numeric literal"));
(stringLiteral = typeParser("String", "string literal"));
(regularExpressionLiteral = typeParser("RegularExpression", "regular expression literal"));
(exports.punctuator = punctuator);
(exports.keyword = keyword);
(exports.identifier = identifier);
(exports.anyIdentifier = anyIdentifier);
(exports.nullLiteral = nullLiteral);
(exports.booleanLiteral = booleanLiteral);
(exports.numericLiteral = numericLiteral);
(exports.stringLiteral = stringLiteral);
(exports.regularExpressionLiteral = regularExpressionLiteral);