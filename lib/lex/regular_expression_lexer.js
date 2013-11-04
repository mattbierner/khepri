/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/regular_expression_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/lang", "parse/text", "nu/stream", "khepri/lex/identifier_lexer", "khepri/lex/line_terminator_lexer"], (function(require, exports, __o, parse_lang, __o0, __o1, identifier_lexer, __o2) {
    "use strict";
    var regularExpressionNonTerminator, regularExpressionBackslashSequence, regularExpressionClassChar, regularExpressionClassChars, regularExpressionClass, regularExpressionChar, regularExpressionChars, regularExpressionFirstChar, regularExpressionFlags, regularExpressionBody, regularExpressionLiteral;
    var __o = __o,
        always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        binds = __o["binds"],
        choice = __o["choice"],
        cons = __o["cons"],
        either = __o["either"],
        enumeration = __o["enumeration"],
        many = __o["many"],
        next = __o["next"],
        Parser = __o["Parser"],
        token = __o["token"],
        test = __o["test"],
        parse_lang = parse_lang,
        between = parse_lang["between"],
        __o0 = __o0,
        character = __o0["character"],
        __o1 = __o1,
        foldl = __o1["foldl"],
        identifier_lexer = identifier_lexer,
        __o2 = __o2,
        lineTerminator = __o2["lineTerminator"]; {
            var join = (function(p, c) {
                return (p + c);
            });
            (regularExpressionNonTerminator = token((function(tok) {
                return !test(lineTerminator, tok);
            })));
            (regularExpressionBackslashSequence = next(character("\\"), bind(regularExpressionNonTerminator, (function(char) {
                return always(("\\" + char));
            }))));
            (regularExpressionClassChar = either(attempt(token((function(tok) {
                return ((!test(lineTerminator, tok) && (tok !== "]")) && (tok !== "\\"));
            }))), regularExpressionBackslashSequence));
            (regularExpressionClassChars = many(regularExpressionClassChar));
            (regularExpressionClass = between(character("["), character("]"), bind(regularExpressionClassChars, (function(body) {
                return always((("[" + foldl(join, "", body)) + "]"));
            }))));
            (regularExpressionFirstChar = choice(token((function(tok) {
                return ((((!test(lineTerminator, tok) && (tok !== "*")) && (tok !== "\\")) && (tok !== "`")) && (tok !== "["));
            })), regularExpressionBackslashSequence, regularExpressionClass));
            (regularExpressionChar = choice(token((function(tok) {
                return (((!test(lineTerminator, tok) && (tok !== "\\")) && (tok !== "`")) && (tok !== "["));
            })), regularExpressionBackslashSequence, regularExpressionClass));
            (regularExpressionChars = many(regularExpressionChar));
            (regularExpressionFlags = many(identifier_lexer.identifierPart));
            (regularExpressionBody = bind(cons(regularExpressionFirstChar, regularExpressionChars), (function(s) {
                return always(foldl(join, "", s));
            })));
            (regularExpressionLiteral = Parser("Regular Expression Lexer", binds(enumeration(between(character("`"), character("`"), regularExpressionBody), regularExpressionFlags), (function(body, flags) {
                return always(new(RegExp)(body, foldl(join, "", flags)));
            }))));
    }
    (exports.regularExpressionNonTerminator = regularExpressionNonTerminator);
    (exports.regularExpressionBackslashSequence = regularExpressionBackslashSequence);
    (exports.regularExpressionClassChar = regularExpressionClassChar);
    (exports.regularExpressionClassChars = regularExpressionClassChars);
    (exports.regularExpressionClass = regularExpressionClass);
    (exports.regularExpressionChar = regularExpressionChar);
    (exports.regularExpressionChars = regularExpressionChars);
    (exports.regularExpressionFirstChar = regularExpressionFirstChar);
    (exports.regularExpressionFlags = regularExpressionFlags);
    (exports.regularExpressionBody = regularExpressionBody);
    (exports.regularExpressionLiteral = regularExpressionLiteral);
}))