"use strict";
var parse = require("bennu")["parse"],
    always = parse["always"],
    attempt = parse["attempt"],
    binds = parse["binds"],
    bind = parse["bind"],
    choice = parse["choice"],
    either = parse["either"],
    eof = parse["eof"],
    getPosition = parse["getPosition"],
    enumeration = parse["enumeration"],
    extract = parse["extract"],
    expected = parse["expected"],
    next = parse["next"],
    many = parse["many"],
    runState = parse["runState"],
    Parser = parse["Parser"],
    ParserState = parse["ParserState"],
    __o = require("bennu")["lang"],
    then = __o["then"],
    __o0 = require("nu-stream")["stream"],
    memoStream = __o0["memoStream"],
    NIL = __o0["NIL"],
    streamFrom = __o0["from"],
    lexToken = require("khepri-ast")["token"],
    __o1 = require("../position"),
    SourceLocation = __o1["SourceLocation"],
    SourcePosition = __o1["SourcePosition"],
    __o2 = require("./boolean_lexer"),
    booleanLiteral = __o2["booleanLiteral"],
    __o3 = require("./comment_lexer"),
    comment = __o3["comment"],
    __o4 = require("./identifier_lexer"),
    identifier = __o4["identifier"],
    identifierName = __o4["identifierName"],
    __o5 = require("./line_terminator_lexer"),
    lineTerminator = __o5["lineTerminator"],
    __o6 = require("./null_lexer"),
    nullLiteral = __o6["nullLiteral"],
    __o7 = require("./number_lexer"),
    numericLiteral = __o7["numericLiteral"],
    __o8 = require("./punctuator_lexer"),
    punctuator = __o8["punctuator"],
    __o9 = require("./reserved_word_lexer"),
    reservedWord = __o9["reservedWord"],
    __o10 = require("./string_lexer"),
    stringLiteral = __o10["stringLiteral"],
    __o11 = require("./whitespace_lexer"),
    whitespace = __o11["whitespace"],
    __o12 = require("./regular_expression_lexer"),
    regularExpressionLiteral = __o12["regularExpressionLiteral"],
    literal, token, inputElement, lexer, lexManyState, lex, makeToken = (function(type, p) {
        return bind(p, (function(value) {
            return always([type, value]);
        }));
    }),
    buildToken = (function(p) {
        return binds(enumeration(getPosition, p, getPosition), (function(start, __o13, end) {
            var type = __o13[0],
                value = __o13[1];
            return always(new(type)(new(SourceLocation)(start, end), value));
        }));
    }),
    literalImpl = choice(expected("string literal", makeToken(lexToken.StringToken, stringLiteral)), expected(
            "regular expression literal", makeToken(lexToken.RegularExpressionToken, regularExpressionLiteral)),
        expected("boolean literal", makeToken(lexToken.BooleanToken, booleanLiteral)), expected("null literal",
            makeToken(lexToken.NullToken, nullLiteral)), expected("number literal", makeToken(lexToken.NumberToken,
            numericLiteral))),
    tokenImpl = choice(expected("identifier", attempt(makeToken(lexToken.IdentifierToken, identifier))), attempt(
        literalImpl), expected("reserved word", attempt(makeToken(lexToken.KeywordToken, reservedWord))), expected(
        "puctuator", makeToken(lexToken.PunctuatorToken, punctuator))),
    inputElementImpl = choice(expected("comment", makeToken(lexToken.CommentToken, comment)), expected("whitespace",
        makeToken(lexToken.WhitespaceToken, whitespace)), expected("line terminator", makeToken(lexToken.LineTerminatorToken,
        lineTerminator)), tokenImpl);
(literal = buildToken(literalImpl));
(token = buildToken(tokenImpl));
(inputElement = buildToken(inputElementImpl));
(lexer = then(many(inputElement), eof));
(lex = (function(input) {
    return runState(lexer, new(ParserState)(streamFrom(input), SourcePosition.initial));
}));
(exports.literal = literal);
(exports.token = token);
(exports.inputElement = inputElement);
(exports.lexer = lexer);
(exports.lexManyState = lexManyState);
(exports.lex = lex);