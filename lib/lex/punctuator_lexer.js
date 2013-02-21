/**
 * @fileOverview Lexers for ECMAScript 5.1 punctuators.
 */
define(['parse/parse', 'parse/parse_string'], function(parse, parse_string){
"use strict";

/* Objects
 ******************************************************************************/
var punctuators = [
    '{', '}', '(', ')', ',', '[', ']', '.', ';', ',', ':', '?', '&&', '||', '<<', '>>',
    '>>>', '<=', '<', '>=', '>', '===', '!==', '==', '!=', '=', '<<=', '>>=',
    '>>>=', '+=', '-=', '*=', '/=', '%=', '!', '~', '&', '|', '+',
    '-', '*', '/', '%', '->'];

/* Lexers
 ******************************************************************************/
// Brackets and Braces
////////////////////////////////////////
var openBrace = parse.character('{');
var closeBrace = parse.character('}');

var openParenthesis = parse.character('(');
var closeParenthesis = parse.character(')');

var openBracket= parse.character('[');
var closeBracket= parse.character(']');

// Punctuation
////////////////////////////////////////
var period = parse.character('.');

var semicolon = parse.character(';');

var comma = parse.character(',');

// Conditional
////////////////////////////////////////
var colon = parse.character(':');

var questionMark = parse.character('?');

// Logical
////////////////////////////////////////
var logicalAnd = parse.string('&&');

var logicalOr = parse.string('||');

// Shifts
////////////////////////////////////////
var leftShift = parse.string('<<');

var signedRightShift = parse.string('>>');

var unsignedRightShift = parse.string('>>>');

// Relational
////////////////////////////////////////
var lessThanOrEqualTo = parse.string('<=');
var lessThan = parse.character('<');

var greaterThanOrEqualTo = parse.string('>=');
var greaterThan = parse.character('>');

// Equality
////////////////////////////////////////
var strictEquals = parse.string('===');
var strictDoesNotEqual = parse.string('!==');

var equals = parse.string('==');
var doesNotEqual = parse.string('!=');

// Assignment
////////////////////////////////////////
var assign = parse.character('=');

var leftShiftAssignment = parse.string('<<=');

var signedRightShiftAssignment = parse.string('>>=');

var unsignedRightShiftAssignment = parse.string('>>>=');

var additionAssignment = parse.string('+=');

var subtrationAssignment = parse.string('-=');

var multiplicationAssignment = parse.string('*=');

var divisionAssignment = parse.string('/=');

var modAssignment = parse.string('%=');

// Unary
////////////////////////////////////////
var logicalNot = parse.character('!');

var bitwiseNot = parse.character('~');

// Bitwise
////////////////////////////////////////
var and = parse.character('&');
var or = parse.character('|');

// Additive Operators
////////////////////////////////////////
var addition = parse.character('+');

var subtration = parse.character('-');

// Multiplicative Operators
////////////////////////////////////////
var multiplication = parse.character('*');

var division = parse.character('/');

var mod = parse.character('%');

// Lambda Expression
////////////////////////////////////////
var lambda = parse.string('->');

// Punctuators
////////////////////////////////////////
/**
 * Lexer for punctuators excluding division punctuators.
 */
var punctuator = parse.Parser('Punctuator Lexer',
    parse_string.trie(punctuators));

/**
 * Lexer for division punctuators.
 */
var divPunctuator = parse.either(
    parse.attempt(divisionAssignment),
    division);


/* Export
 ******************************************************************************/
return {
// Brackets and Braces
    'openBrace': openBrace,
    'closeBrace': closeBrace,
    'openParenthesis': openParenthesis,
    'closeParenthesis': closeParenthesis,
    'openBracket': openBracket,
    'closeBracket': closeBracket,
    'period': period,
    'semicolon': semicolon,
    'comma': comma,
    'colon': colon,
    'questionMark': questionMark,
    
// Logical
    'logicalAnd': logicalAnd,
    'logicalOr': logicalOr,

// Shifts
    'leftShift': leftShift,
    'signedRightShift': signedRightShift,
    'unsignedRightShift': unsignedRightShift,

// Relational
    'lessThanOrEqualTo': lessThanOrEqualTo,
    'lessThan': lessThan,
    'greaterThanOrEqualTo': greaterThanOrEqualTo,
    'greaterThan': greaterThan,

// Equality
    'strictEquals': strictEquals,
    'strictDoesNotEqual': strictDoesNotEqual,
    'equals': equals,
    'doesNotEqual': doesNotEqual,
// bitwise
    'and': and,
    'or': or,
    
// Assignment Operators
    'assign': assign,
    'leftShiftAssignment': leftShiftAssignment,
    'signedRightShiftAssignment': signedRightShiftAssignment,
    'unsignedRightShiftAssignment': unsignedRightShiftAssignment,
    'additionAssignment': additionAssignment,
    'subtrationAssignment': subtrationAssignment,
    'multiplicationAssignment': multiplicationAssignment,
    'modAssignment': modAssignment,

// Additive Operators
    'logicalNot': logicalNot,
    'bitwiseNot': bitwiseNot,

// Additive Operators
    'addition': addition,
    'subtration': subtration,
    
// Multiplicative Operators
    'multiplication': multiplication,
    'mod': mod,

// Punctuators
    'punctuator': punctuator,
    'divPunctuator': divPunctuator
};
});