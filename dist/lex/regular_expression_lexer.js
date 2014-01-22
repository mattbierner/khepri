/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/regular_expression_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/lang", "bennu/text", "nu-stream/stream",
    "khepri/lex/identifier_lexer", "khepri/lex/line_terminator_lexer"
], (function(require, exports, __o, __o0, __o1, __o2, __o3, __o4) {
    "use strict";
    var regularExpressionNonTerminator, regularExpressionBackslashSequence, regularExpressionClassChar,
            regularExpressionClassChars, regularExpressionClass, regularExpressionChar, regularExpressionChars,
            regularExpressionFirstChar, regularExpressionFlags, regularExpressionBody, regularExpressionLiteral;
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
        __o0 = __o0,
        between = __o0["between"],
        __o1 = __o1,
        character = __o1["character"],
        __o2 = __o2,
        foldl = __o2["foldl"],
        __o3 = __o3,
        identifierPart = __o3["identifierPart"],
        __o4 = __o4,
        lineTerminator = __o4["lineTerminator"];
    var join = foldl.bind(null, (function(x, y) {
        return (x + y);
    }), "");
    (regularExpressionNonTerminator = token((function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })((function(x) {
        return !x;
    }), test.bind(null, lineTerminator))));
    (regularExpressionBackslashSequence = next(character("\\"), bind(regularExpressionNonTerminator, (function(
        f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(always, (function(x, y) {
            return (x + y);
        })
        .bind(null, "\\")))));
    (regularExpressionClassChar = either(attempt(token((function(tok) {
        return ((!test(lineTerminator, tok) && (tok !== "]")) && (tok !== "\\"));
    }))), regularExpressionBackslashSequence));
    (regularExpressionClassChars = many(regularExpressionClassChar));
    (regularExpressionClass = between(character("["), character("]"), bind(regularExpressionClassChars, (
        function(body) {
            return always((("[" + join(body)) + "]"));
        }))));
    (regularExpressionFirstChar = choice(token((function(tok) {
        return ((((!test(lineTerminator, tok) && (tok !== "*")) && (tok !== "\\")) && (tok !==
            "`")) && (tok !== "["));
    })), regularExpressionBackslashSequence, regularExpressionClass));
    (regularExpressionChar = choice(token((function(tok) {
        return (((!test(lineTerminator, tok) && (tok !== "\\")) && (tok !== "`")) && (tok !==
            "["));
    })), regularExpressionBackslashSequence, regularExpressionClass));
    (regularExpressionChars = many(regularExpressionChar));
    (regularExpressionFlags = many(identifierPart));
    (regularExpressionBody = bind(cons(regularExpressionFirstChar, regularExpressionChars), (function(f, g) {
        return (function(x) {
            return f(g(x));
        });
    })(always, join)));
    (regularExpressionLiteral = Parser("Regular Expression Lexer", binds(enumeration(between(character("`"),
        character("`"), regularExpressionBody), regularExpressionFlags), (function(body, flags) {
        return always(new(RegExp)(body, join(flags)));
    }))));
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