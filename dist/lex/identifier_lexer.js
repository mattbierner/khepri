/*
 * THIS FILE IS AUTO GENERATED from 'lib/lex/identifier_lexer.kep'
 * DO NOT EDIT
*/
define(["require", "exports", "bennu/parse", "bennu/text", "nu-stream/stream", "./reserved_word_lexer",
    "./string_lexer"
], (function(require, exports, __o, __o0, __o1, __o2, __o3) {
    "use strict";
    var always = __o["always"],
        attempt = __o["attempt"],
        bind = __o["bind"],
        cons = __o["cons"],
        choice = __o["choice"],
        either = __o["either"],
        eof = __o["eof"],
        fail = __o["fail"],
        many = __o["many"],
        never = __o["never"],
        next = __o["next"],
        Parser = __o["Parser"],
        testStream = __o["testStream"],
        token = __o["token"],
        character = __o0["character"],
        characters = __o0["characters"],
        digit = __o0["digit"],
        letter = __o0["letter"],
        string = __o0["string"],
        foldl = __o1["foldl"],
        reservedWord = __o2["reservedWord"],
        escape = __o3["escape"],
        unicodeEscapeSequence = __o3["unicodeEscapeSequence"],
        zwnj, zwj, unicodeLetter, unicodeDigit, unicodeConnectorPunctuation, unicodeCombiningMark,
            identifierStart, identifierPart, identifierParts, identifierName, identifier, join = foldl.bind(
                null, (function(x, y) {
                    return (x + y);
                }), "");
    (zwnj = character("‌"));
    (zwj = character("‍"));
    (unicodeLetter = letter);
    (unicodeDigit = digit);
    (unicodeConnectorPunctuation = characters(["_", "‿", "⁀", "⁔", "︳", "︴", "﹍", "﹎", "﹏", "＿"]));
    (unicodeCombiningMark = never());
    (identifierStart = choice(unicodeLetter, characters("$_"), next(escape, unicodeEscapeSequence)));
    (identifierPart = choice(attempt(identifierStart), unicodeCombiningMark, unicodeDigit,
        unicodeConnectorPunctuation, zwnj, zwj));
    (identifierParts = many(identifierPart));
    (identifierName = cons(identifierStart, identifierParts));
    var reservedWordTest = next(reservedWord, eof);
    (identifier = Parser("Identifier Lexer", bind(identifierName, (function(name) {
        return (testStream(reservedWordTest, name) ? fail() : always(join(name)));
    }))));
    (exports.zwnj = zwnj);
    (exports.zwj = zwj);
    (exports.unicodeLetter = unicodeLetter);
    (exports.unicodeDigit = unicodeDigit);
    (exports.unicodeConnectorPunctuation = unicodeConnectorPunctuation);
    (exports.unicodeCombiningMark = unicodeCombiningMark);
    (exports.identifierStart = identifierStart);
    (exports.identifierPart = identifierPart);
    (exports.identifierParts = identifierParts);
    (exports.identifierName = identifierName);
    (exports.identifier = identifier);
}));