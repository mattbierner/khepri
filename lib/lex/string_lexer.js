/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/string_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "parse/parse", "parse/text", "parse/lang", "nu/stream", "khepri/lex/line_terminator_lexer", "khepri/lex/number_lexer"], (function(require, exports, __o, __o0, __o1, __o2, __o3, __o4) {
    "use strict";
    var doubleQuote, escape, singleQuote, lineContinuation, unicodeEscapeSequence, hexEscapeSequence, characterEscapeSequence, escapeSequence, singleStringCharacter, singleStringCharacters, singleStringLiteral, doubleStringCharacter, doubleStringCharacters, doubleStringLiteral, stringLiteral;
    var __o = __o,
        always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        choice = __o["choice"],
        either = __o["either"],
        eof = __o["eof"],
        many = __o["many"],
        next = __o["next"],
        sequence = __o["sequence"],
        Parser = __o["Parser"],
        test = __o["test"],
        token = __o["token"],
        __o0 = __o0,
        character = __o0["character"],
        __o1 = __o1,
        between = __o1["between"],
        times = __o1["times"],
        __o2 = __o2,
        foldl = __o2["foldl"],
        __o3 = __o3,
        lineTerminatorSequence = __o3["lineTerminatorSequence"],
        lineTerminator = __o3["lineTerminator"],
        __o4 = __o4,
        decimalDigit = __o4["decimalDigit"],
        hexDigit = __o4["hexDigit"]; {
            var join = (function(p, c) {
                return (p + c);
            });
            var fromCharCodeParser = (function(digits) {
                return always(String.fromCharCode(parseInt(foldl(join, "", digits), 16)));
            });
            (doubleQuote = character("\""));
            (escape = character("\\"));
            (singleQuote = character("'"));
            (lineContinuation = next(next(escape, lineTerminatorSequence), always("")));
            var singleEscapeCharacter = choice(character("'"), character("\""), character("\\"), next(character("b"), always("\b")), next(character("f"), always("\f")), next(character("n"), always("\n")), next(character("r"), always("\r")), next(character("t"), always("\t")), next(character("v"), always("\u000b")));
            var escapeCharacter = choice(singleEscapeCharacter, decimalDigit, character("u"), character("x"));
            var nonEscapeCharacter = token((function(tok) {
                return !(test(escapeCharacter, tok) || test(lineTerminator, tok));
            }));
            (hexEscapeSequence = next(character("x"), bind(times(2, hexDigit), fromCharCodeParser)));
            (unicodeEscapeSequence = next(character("u"), bind(times(4, hexDigit), fromCharCodeParser)));
            (characterEscapeSequence = either(singleEscapeCharacter, nonEscapeCharacter));
            (escapeSequence = choice(characterEscapeSequence, sequence(character("0"), either(eof, token((function(tok) {
                return !test(decimalDigit, tok);
            }))), always("\u0000")), hexEscapeSequence, unicodeEscapeSequence));
            (singleStringCharacter = choice(attempt(lineContinuation), next(escape, escapeSequence), token((function(tok) {
                return !((test(singleQuote, tok) || test(escape, tok)) || test(lineTerminator, tok));
            }))));
            (singleStringCharacters = many(singleStringCharacter));
            (singleStringLiteral = Parser("Single String Literal", between(singleQuote, singleQuote, bind(singleStringCharacters, (function(str) {
                return always(foldl(join, "", str));
            })))));
            (doubleStringCharacter = choice(attempt(lineContinuation), next(escape, escapeSequence), token((function(tok) {
                return !((test(doubleQuote, tok) || test(escape, tok)) || test(lineTerminator, tok));
            }))));
            (doubleStringCharacters = many(doubleStringCharacter));
            (doubleStringLiteral = Parser("Double String Literal", between(doubleQuote, doubleQuote, bind(doubleStringCharacters, (function(str) {
                return always(foldl(join, "", str));
            })))));
            (stringLiteral = Parser("Sting Literal Lexer", either(singleStringLiteral, doubleStringLiteral)));
    }
    (exports.doubleQuote = doubleQuote);
    (exports.escape = escape);
    (exports.singleQuote = singleQuote);
    (exports.lineContinuation = lineContinuation);
    (exports.unicodeEscapeSequence = unicodeEscapeSequence);
    (exports.hexEscapeSequence = hexEscapeSequence);
    (exports.characterEscapeSequence = characterEscapeSequence);
    (exports.escapeSequence = escapeSequence);
    (exports.singleStringCharacter = singleStringCharacter);
    (exports.singleStringCharacters = singleStringCharacters);
    (exports.singleStringLiteral = singleStringLiteral);
    (exports.doubleStringCharacter = doubleStringCharacter);
    (exports.doubleStringCharacters = doubleStringCharacters);
    (exports.doubleStringLiteral = doubleStringLiteral);
    (exports.stringLiteral = stringLiteral);
}))