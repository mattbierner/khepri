/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "nu/stream", "khepri_ast/token", "khepri/position", "khepri/lex/boolean_lexer", "khepri/lex/comment_lexer", "khepri/lex/identifier_lexer", "khepri/lex/line_terminator_lexer", "khepri/lex/null_lexer", "khepri/lex/number_lexer", "khepri/lex/punctuator_lexer", "khepri/lex/reserved_word_lexer", "khepri/lex/string_lexer", "khepri/lex/whitespace_lexer", "khepri/lex/regular_expression_lexer"], (function(require, exports, parse, __o, lexToken, __o0, __o1, __o2, __o3, __o4, __o5, __o6, __o7, __o8, __o9, __o10, __o11) {
    "use strict";
    var literal, token, inputElementRegExp, lexer, lexManyState, lex;
    var parse = parse,
        always = parse["always"],
        attempt = parse["attempt"],
        binds = parse["binds"],
        bind = parse["bind"],
        choice = parse["choice"],
        either = parse["either"],
        eof = parse["eof"],
        enumeration = parse["enumeration"],
        extract = parse["extract"],
        expected = parse["expected"],
        next = parse["next"],
        many = parse["many"],
        runState = parse["runState"],
        Parser = parse["Parser"],
        ParserState = parse["ParserState"],
        __o = __o,
        memoStream = __o["memoStream"],
        NIL = __o["end"],
        streamFrom = __o["from"],
        lexToken = lexToken,
        __o0 = __o0,
        SourceLocation = __o0["SourceLocation"],
        SourcePosition = __o0["SourcePosition"],
        __o1 = __o1,
        booleanLiteral = __o1["booleanLiteral"],
        __o2 = __o2,
        comment = __o2["comment"],
        __o3 = __o3,
        identifier = __o3["identifier"],
        __o4 = __o4,
        lineTerminator = __o4["lineTerminator"],
        __o5 = __o5,
        nullLiteral = __o5["nullLiteral"],
        __o6 = __o6,
        numericLiteral = __o6["numericLiteral"],
        __o7 = __o7,
        punctuator = __o7["punctuator"],
        __o8 = __o8,
        reservedWord = __o8["reservedWord"],
        __o9 = __o9,
        stringLiteral = __o9["stringLiteral"],
        __o10 = __o10,
        whitespace = __o10["whitespace"],
        __o11 = __o11,
        regularExpressionLiteral = __o11["regularExpressionLiteral"]; {
            var positionParser = extract((function(state) {
                return state.position;
            }));
            var makeToken = (function(type, p) {
                return binds(enumeration(positionParser, p, positionParser), (function(start, value, end) {
                    return always(new(type)(new(SourceLocation)(start, end), value));
                }));
            });
            (literal = choice(expected("string literal", makeToken(lexToken.StringToken, stringLiteral)), expected("regular expression literal", makeToken(lexToken.RegularExpressionToken, regularExpressionLiteral)), expected("boolean literal", makeToken(lexToken.BooleanToken, booleanLiteral)), expected("null literal", makeToken(lexToken.NullToken, nullLiteral)), expected("number literal", makeToken(lexToken.NumberToken, numericLiteral))));
            (token = choice(attempt(expected("identifier", makeToken(lexToken.IdentifierToken, identifier))), attempt(literal), attempt(expected("reserved word", makeToken(lexToken.KeywordToken, reservedWord))), expected("puctuator", makeToken(lexToken.PunctuatorToken, punctuator))));
            (inputElementRegExp = choice(expected("comment", makeToken(lexToken.CommentToken, comment)), expected("whitespace", makeToken(lexToken.WhitespaceToken, whitespace)), expected("line terminator", makeToken(lexToken.LineTerminatorToken, lineTerminator)), token));
            (lexer = many(inputElementRegExp));
            (lexManyState = (function(p, state) {
                return (function() {
                    {
                        var manyP = either(bind(p, (function(x, state, m) {
                            return always(memoStream(x, runState.bind(undefined, manyP, state, m)));
                        })), next(eof, always(NIL))); {
                            return runState(manyP, state);
                        }
                    }
                })();
            }));
            (lex = (function(input) {
                return lexManyState(inputElementRegExp, new(ParserState)(streamFrom(input), new(SourcePosition)(0, 0)));
            }));
    }
    (exports.literal = literal);
    (exports.token = token);
    (exports.inputElementRegExp = inputElementRegExp);
    (exports.lexer = lexer);
    (exports.lexManyState = lexManyState);
    (exports.lex = lex);
}))