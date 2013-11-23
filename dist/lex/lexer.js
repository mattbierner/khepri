/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "nu/stream", "khepri_ast/token", "khepri/position", "khepri/lex/boolean_lexer", "khepri/lex/comment_lexer", "khepri/lex/identifier_lexer", "khepri/lex/line_terminator_lexer", "khepri/lex/null_lexer", "khepri/lex/number_lexer", "khepri/lex/punctuator_lexer", "khepri/lex/reserved_word_lexer", "khepri/lex/string_lexer", "khepri/lex/whitespace_lexer", "khepri/lex/regular_expression_lexer"], (function(require, exports, parse, __o, __o0, lexToken, __o1, __o2, __o3, __o4, __o5, __o6, __o7, __o8, __o9, __o10, __o11, __o12) {
    "use strict";
    var literal, token, inputElement, lexer, lexManyState, lex;
    var parse = parse,
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
        __o = __o,
        then = __o["then"],
        __o0 = __o0,
        memoStream = __o0["memoStream"],
        NIL = __o0["NIL"],
        streamFrom = __o0["from"],
        lexToken = lexToken,
        __o1 = __o1,
        SourceLocation = __o1["SourceLocation"],
        SourcePosition = __o1["SourcePosition"],
        __o2 = __o2,
        booleanLiteral = __o2["booleanLiteral"],
        __o3 = __o3,
        comment = __o3["comment"],
        __o4 = __o4,
        identifier = __o4["identifier"],
        identifierName = __o4["identifierName"],
        __o5 = __o5,
        lineTerminator = __o5["lineTerminator"],
        __o6 = __o6,
        nullLiteral = __o6["nullLiteral"],
        __o7 = __o7,
        numericLiteral = __o7["numericLiteral"],
        __o8 = __o8,
        punctuator = __o8["punctuator"],
        __o9 = __o9,
        reservedWord = __o9["reservedWord"],
        __o10 = __o10,
        stringLiteral = __o10["stringLiteral"],
        __o11 = __o11,
        whitespace = __o11["whitespace"],
        __o12 = __o12,
        regularExpressionLiteral = __o12["regularExpressionLiteral"];
    var makeToken = (function(type, p) {
        return bind(p, (function(value) {
            return always([type, value]);
        }));
    });
    var buildToken = (function(p) {
        return binds(enumeration(getPosition, p, getPosition), (function(start, __a, end) {
            var type = __a[0],
                value = __a[1];
            return always(new(type)(new(SourceLocation)(start, end), value));
        }));
    });
    var literalImpl = choice(expected.bind(null, "string literal")(makeToken(lexToken.StringToken, stringLiteral)), expected.bind(null, "regular expression literal")(makeToken(lexToken.RegularExpressionToken, regularExpressionLiteral)), expected.bind(null, "boolean literal")(makeToken(lexToken.BooleanToken, booleanLiteral)), expected.bind(null, "null literal")(makeToken(lexToken.NullToken, nullLiteral)), expected.bind(null, "number literal")(makeToken(lexToken.NumberToken, numericLiteral)));
    var tokenImpl = choice(expected.bind(null, "identifier")(attempt(makeToken(lexToken.IdentifierToken, identifier))), attempt(literalImpl), expected.bind(null, "reserved word")(attempt(makeToken(lexToken.KeywordToken, reservedWord))), expected.bind(null, "puctuator")(makeToken(lexToken.PunctuatorToken, punctuator)));
    var inputElementImpl = choice(expected.bind(null, "comment")(makeToken(lexToken.CommentToken, comment)), expected.bind(null, "whitespace")(makeToken(lexToken.WhitespaceToken, whitespace)), expected.bind(null, "line terminator")(makeToken(lexToken.LineTerminatorToken, lineTerminator)), tokenImpl);
    (literal = buildToken(literalImpl));
    (token = buildToken(tokenImpl));
    (inputElement = buildToken(inputElementImpl));
    (lexer = then(many(inputElement), eof));
    (lexManyState = (function(p, state) {
        return (function() {
            {
                var manyP = either(bind(p, (function(x, state, m) {
                    return always(memoStream(x, runState.bind(null, manyP, state, m)));
                })), next(eof, always(NIL)));
                return runState(manyP, state);
            }
        })();
    }));
    (lex = (function(input) {
        return lexManyState(inputElement, new(ParserState)(streamFrom(input), new(SourcePosition)(0, 0)));
    }));
    (exports.literal = literal);
    (exports.token = token);
    (exports.inputElement = inputElement);
    (exports.lexer = lexer);
    (exports.lexManyState = lexManyState);
    (exports.lex = lex);
}))