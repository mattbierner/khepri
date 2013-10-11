/**
 * @fileOverview Lexers for ECMAScript 5.1 punctuators.
 */
define(['parse/parse', 'parse/text'], function(parse, parse_string){
"use strict";

/* Objects
 ******************************************************************************/
var punctuators = [
    '{', '}', '(', ')', ',', '[', ']', '.', ';', ',', ':', '?', '&&', '||', '<<', '>>',
    '>>>', '<=', '<', '>=', '>', '===', '!==', '==', '!=', '=', '<<=', '>>=',
    '>>>=', '+=', '-=', '*=', '/=', '%=', '!', '~', '&', '|', '+', '^',
    '-', '*', '/', '%', '->', '\\', '...'];

/* Lexers
 ******************************************************************************/
// Brackets and Braces
////////////////////////////////////////
var openBrace = parse_string.character('{');
var closeBrace = parse_string.character('}');

var openParenthesis = parse_string.character('(');
var closeParenthesis = parse_string.character(')');

var openBracket= parse_string.character('[');
var closeBracket= parse_string.character(']');

// Punctuation
////////////////////////////////////////
var period = parse_string.character('.');

var semicolon = parse_string.character(';');

var comma = parse_string.character(',');

// Conditional
////////////////////////////////////////
var colon = parse_string.character(':');

var questionMark = parse_string.character('?');

// Logical
////////////////////////////////////////
var logicalAnd = parse_string.string('&&');

var logicalOr = parse_string.string('||');

// Shifts
////////////////////////////////////////
var leftShift = parse_string.string('<<');

var signedRightShift = parse_string.string('>>');

var unsignedRightShift = parse_string.string('>>>');

// Relational
////////////////////////////////////////
var lessThanOrEqualTo = parse_string.string('<=');
var lessThan = parse_string.character('<');

var greaterThanOrEqualTo = parse_string.string('>=');
var greaterThan = parse_string.character('>');

// Equality
////////////////////////////////////////
var strictEquals = parse_string.string('===');
var strictDoesNotEqual = parse_string.string('!==');

var equals = parse_string.string('==');
var doesNotEqual = parse_string.string('!=');

// Assignment
////////////////////////////////////////
var assign = parse_string.character('=');

var leftShiftAssignment = parse_string.string('<<=');

var signedRightShiftAssignment = parse_string.string('>>=');

var unsignedRightShiftAssignment = parse_string.string('>>>=');

var additionAssignment = parse_string.string('+=');

var subtrationAssignment = parse_string.string('-=');

var multiplicationAssignment = parse_string.string('*=');

var divisionAssignment = parse_string.string('/=');

var modAssignment = parse_string.string('%=');

// Unary
////////////////////////////////////////
var logicalNot = parse_string.character('!');

var bitwiseNot = parse_string.character('~');

// Bitwise
////////////////////////////////////////
var and = parse_string.character('&');
var or = parse_string.character('|');
var xor = parse_string.character('^');

// Additive Operators
////////////////////////////////////////
var addition = parse_string.character('+');

var subtration = parse_string.character('-');

// Multiplicative Operators
////////////////////////////////////////
var multiplication = parse_string.character('*');

var division = parse_string.character('/');

var mod = parse_string.character('%');

// Lambda Expression
////////////////////////////////////////
var lambda = parse_string.string('->');

// Punctuators
////////////////////////////////////////
/**
 * Lexer for punctuators excluding division punctuators.
 */
var punctuator = parse.Parser('Punctuator Lexer',
    parse_string.trie(punctuators));

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
    'xor': xor,
    
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
    'punctuator': punctuator
};
});