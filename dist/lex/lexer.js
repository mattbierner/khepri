/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "nu-stream/stream", "khepri_ast/token", "khepri/position",
    "khepri/lex/boolean_lexer", "khepri/lex/comment_lexer", "khepri/lex/identifier_lexer",
    "khepri/lex/line_terminator_lexer", "khepri/lex/null_lexer", "khepri/lex/number_lexer",
    "khepri/lex/punctuator_lexer", "khepri/lex/reserved_word_lexer", "khepri/lex/string_lexer",
    "khepri/lex/whitespace_lexer", "khepri/lex/regular_expression_lexer"
], (function(require, exports, __o, __o0, __o1, lexToken, __o2, __o3, __o4, __o5, __o6, __o7, __o8, __o9, __o10,
    __o11, __o12, __o13) {
    "use strict";
    var literal, token, inputElement, lexer, lexManyState, lex;
    var __o = __o,
        always = __o["always"],
        attempt = __o["attempt"],
        binds = __o["binds"],
        bind = __o["bind"],
        choice = __o["choice"],
        either = __o["either"],
        eof = __o["eof"],
        getPosition = __o["getPosition"],
        enumeration = __o["enumeration"],
        extract = __o["extract"],
        expected = __o["expected"],
        next = __o["next"],
        many = __o["many"],
        runState = __o["runState"],
        Parser = __o["Parser"],
        ParserState = __o["ParserState"],
        __o0 = __o0,
        then = __o0["then"],
        __o1 = __o1,
        memoStream = __o1["memoStream"],
        NIL = __o1["NIL"],
        streamFrom = __o1["from"],
        lexToken = lexToken,
        __o2 = __o2,
        SourceLocation = __o2["SourceLocation"],
        SourcePosition = __o2["SourcePosition"],
        __o3 = __o3,
        booleanLiteral = __o3["booleanLiteral"],
        __o4 = __o4,
        comment = __o4["comment"],
        __o5 = __o5,
        identifier = __o5["identifier"],
        identifierName = __o5["identifierName"],
        __o6 = __o6,
        lineTerminator = __o6["lineTerminator"],
        __o7 = __o7,
        nullLiteral = __o7["nullLiteral"],
        __o8 = __o8,
        numericLiteral = __o8["numericLiteral"],
        __o9 = __o9,
        punctuator = __o9["punctuator"],
        __o10 = __o10,
        reservedWord = __o10["reservedWord"],
        __o11 = __o11,
        stringLiteral = __o11["stringLiteral"],
        __o12 = __o12,
        whitespace = __o12["whitespace"],
        __o13 = __o13,
        regularExpressionLiteral = __o13["regularExpressionLiteral"];
    var makeToken = (function(type, p) {
        return bind(p, (function(value) {
            return always([type, value]);
        }));
    });
    var buildToken = (function(p) {
        return binds(enumeration(getPosition, p, getPosition), (function(start, __o14, end) {
            var type = __o14[0],
                value = __o14[1];
            return always(new(type)(new(SourceLocation)(start, end), value));
        }));
    });
    var literalImpl = choice(expected("string literal", makeToken(lexToken.StringToken, stringLiteral)),
        expected("regular expression literal", makeToken(lexToken.RegularExpressionToken,
            regularExpressionLiteral)), expected("boolean literal", makeToken(lexToken.BooleanToken,
            booleanLiteral)), expected("null literal", makeToken(lexToken.NullToken, nullLiteral)), expected(
            "number literal", makeToken(lexToken.NumberToken, numericLiteral)));
    var tokenImpl = choice(expected("identifier", attempt(makeToken(lexToken.IdentifierToken, identifier))),
        attempt(literalImpl), expected("reserved word", attempt(makeToken(lexToken.KeywordToken, reservedWord))),
        expected("puctuator", makeToken(lexToken.PunctuatorToken, punctuator)));
    var inputElementImpl = choice(expected("comment", makeToken(lexToken.CommentToken, comment)), expected(
        "whitespace", makeToken(lexToken.WhitespaceToken, whitespace)), expected("line terminator",
        makeToken(lexToken.LineTerminatorToken, lineTerminator)), tokenImpl);
    (literal = buildToken(literalImpl));
    (token = buildToken(tokenImpl));
    (inputElement = buildToken(inputElementImpl));
    (lexer = then(many(inputElement), eof));
    (lexManyState = (function(p, state) {
        var manyP = either(bind(p, (function(x, state, m) {
            return always(memoStream(x, runState.bind(null, manyP, state, m)));
        })), next(eof, always(NIL)));
        return runState(manyP, state);
    }));
    (lex = (function(input) {
        return lexManyState(inputElement, new(ParserState)(streamFrom(input), SourcePosition.initial));
    }));
    (exports.literal = literal);
    (exports.token = token);
    (exports.inputElement = inputElement);
    (exports.lexer = lexer);
    (exports.lexManyState = lexManyState);
    (exports.lex = lex);
}))