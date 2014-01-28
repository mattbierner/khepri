/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/punctuator_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text"], (function(require, exports, __o, __o0) {
    "use strict";
    var Parser = __o["Parser"],
        character = __o0["character"],
        string = __o0["string"],
        trie = __o0["trie"],
        openBrace, closeBrace, openParenthesis, closeParenthesis, openBracket, closeBracket, period, semicolon,
            comma, colon, questionMark, logicalAnd, logicalOr, leftShift, signedRightShift, unsignedRightShift,
            lessThanOrEqualTo, lessThan, greaterThanOrEqualTo, greaterThan, strictEquals, strictDoesNotEqual,
            equals, doesNotEqual, and, or, xor, assign, logicalNot, bitwiseNot, addition, subtration,
            multiplication, mod, division, compose, composeNary, reverseCompose, reverseComposeNary, pipe,
            reversePipe, ellipsis, as, argumentList, lambda, punctuator, punctuators = ["{", "}", "(", ")", "[",
                "]", ",", ".", ";", ":", "?", "&&", "||", "<<", ">>", ">>>", "<=", "<", ">=", ">", "===", "!==",
                "==", "!=", "=", "!", "~", "++", "--", "&", "|", "^", "+", "-", "*", "/", "%", "@", "\\>",
                "\\>>", "<\\", "<<\\", "|>", "<|", "...", "#", "\\", "->"
        ];
    (openBrace = character("{"));
    (closeBrace = character("}"));
    (openParenthesis = character("("));
    (closeParenthesis = character(""));
    (openBracket = character("["));
    (closeBracket = character("]"));
    (period = character("."));
    (semicolon = character(";"));
    (comma = character(","));
    (colon = character(":"));
    (questionMark = character("?"));
    (logicalAnd = string("&&"));
    (logicalOr = string("||"));
    (leftShift = string("<<"));
    (signedRightShift = string(">>"));
    (unsignedRightShift = string(">>>"));
    (lessThanOrEqualTo = string("<="));
    (lessThan = character("<"));
    (greaterThanOrEqualTo = string(">="));
    (greaterThan = character(">"));
    (strictEquals = string("==="));
    (strictDoesNotEqual = string("!=="));
    (equals = string("=="));
    (doesNotEqual = string("!="));
    (assign = character("="));
    (logicalNot = character("!"));
    (bitwiseNot = character("~"));
    (and = character("&"));
    (or = character("|"));
    (xor = character("^"));
    (addition = character("+"));
    (subtration = character("-"));
    (multiplication = character("*"));
    (division = character("/"));
    (mod = character("%"));
    (as = character("#"));
    (ellipsis = string("..."));
    (argumentList = character("\\"));
    (lambda = string("->"));
    (punctuator = Parser("Punctuator Lexer", trie(punctuators)));
    (exports.openBrace = openBrace);
    (exports.closeBrace = closeBrace);
    (exports.openParenthesis = openParenthesis);
    (exports.closeParenthesis = closeParenthesis);
    (exports.openBracket = openBracket);
    (exports.closeBracket = closeBracket);
    (exports.period = period);
    (exports.semicolon = semicolon);
    (exports.comma = comma);
    (exports.colon = colon);
    (exports.questionMark = questionMark);
    (exports.logicalAnd = logicalAnd);
    (exports.logicalOr = logicalOr);
    (exports.leftShift = leftShift);
    (exports.signedRightShift = signedRightShift);
    (exports.unsignedRightShift = unsignedRightShift);
    (exports.lessThanOrEqualTo = lessThanOrEqualTo);
    (exports.lessThan = lessThan);
    (exports.greaterThanOrEqualTo = greaterThanOrEqualTo);
    (exports.greaterThan = greaterThan);
    (exports.strictEquals = strictEquals);
    (exports.strictDoesNotEqual = strictDoesNotEqual);
    (exports.equals = equals);
    (exports.doesNotEqual = doesNotEqual);
    (exports.and = and);
    (exports.or = or);
    (exports.xor = xor);
    (exports.assign = assign);
    (exports.logicalNot = logicalNot);
    (exports.bitwiseNot = bitwiseNot);
    (exports.addition = addition);
    (exports.subtration = subtration);
    (exports.multiplication = multiplication);
    (exports.mod = mod);
    (exports.division = division);
    (exports.compose = compose);
    (exports.composeNary = composeNary);
    (exports.reverseCompose = reverseCompose);
    (exports.reverseComposeNary = reverseComposeNary);
    (exports.pipe = pipe);
    (exports.reversePipe = reversePipe);
    (exports.ellipsis = ellipsis);
    (exports.as = as);
    (exports.argumentList = argumentList);
    (exports.lambda = lambda);
    (exports.punctuator = punctuator);
}));