/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "nu-stream/stream", "khepri-ast/token", "../position",
    "./boolean_lexer", "./comment_lexer", "./identifier_lexer", "./line_terminator_lexer", "./null_lexer",
    "./number_lexer", "./punctuator_lexer", "./reserved_word_lexer", "./string_lexer", "./whitespace_lexer",
    "./regular_expression_lexer"
], (function(require, exports, parse, __o, __o0, lexToken, __o1, __o2, __o3, __o4, __o5, __o6, __o7, __o8, __o9,
    __o10, __o11, __o12) {
    "use strict";
    var always = parse["always"],
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
        then = __o["then"],
        memoStream = __o0["memoStream"],
        NIL = __o0["NIL"],
        streamFrom = __o0["from"],
        SourceLocation = __o1["SourceLocation"],
        SourcePosition = __o1["SourcePosition"],
        booleanLiteral = __o2["booleanLiteral"],
        comment = __o3["comment"],
        identifier = __o4["identifier"],
        identifierName = __o4["identifierName"],
        lineTerminator = __o5["lineTerminator"],
        nullLiteral = __o6["nullLiteral"],
        numericLiteral = __o7["numericLiteral"],
        punctuator = __o8["punctuator"],
        reservedWord = __o9["reservedWord"],
        stringLiteral = __o10["stringLiteral"],
        whitespace = __o11["whitespace"],
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
        literalImpl = choice(expected("string literal", makeToken(lexToken.StringToken, stringLiteral)),
            expected("regular expression literal", makeToken(lexToken.RegularExpressionToken,
                regularExpressionLiteral)), expected("boolean literal", makeToken(lexToken.BooleanToken,
                booleanLiteral)), expected("null literal", makeToken(lexToken.NullToken, nullLiteral)),
            expected("number literal", makeToken(lexToken.NumberToken, numericLiteral))),
        tokenImpl = choice(expected("identifier", attempt(makeToken(lexToken.IdentifierToken, identifier))),
            attempt(literalImpl), expected("reserved word", attempt(makeToken(lexToken.KeywordToken,
                reservedWord))), expected("puctuator", makeToken(lexToken.PunctuatorToken, punctuator))),
        inputElementImpl = choice(expected("comment", makeToken(lexToken.CommentToken, comment)), expected(
            "whitespace", makeToken(lexToken.WhitespaceToken, whitespace)), expected("line terminator",
            makeToken(lexToken.LineTerminatorToken, lineTerminator)), tokenImpl);
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
}));