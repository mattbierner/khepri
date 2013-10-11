/**
 * @fileOverview Lexers for ECMAScript 5.1 reserved words.
 */
define(['parse/parse', 'parse/text',
        'khepri/lex/boolean_lexer', 'khepri/lex/null_lexer'],
    function(parse, parse_string,
            boolean_lexer, null_lexer){
"use strict";

var keywordList = [
    'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 
    'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 
    'typeof', 'new', 'var', 'return', 'void', 'switch', 'while', 'this', 
    'with', 'throw', 'try', 'class', 'enum', 'extends', 'super', 'const',
    'export', 'import', 'implements', 'let', 'private', 'public', 'interface',
    'package', 'protected', 'static', 'yield', 'get', 'set']; 

/* Lexers
 ******************************************************************************/
// Keywords
////////////////////////////////////////
var breakKeyword = parse_string.string('break');
var caseKeyword = parse_string.string('case');
var catchKeyword = parse_string.string('catch');
var continueKeyword = parse_string.string('continue');
var debuggerKeyword = parse_string.string('debugger');
var defaultKeyword = parse_string.string('default');
var deleteKeyword = parse_string.string('delete');
var doKeyword = parse_string.string('do');
var elseKeyword = parse_string.string('else');
var finallyKeyword = parse_string.string('finally');
var forKeyword = parse_string.string('for');
var functionKeyword = parse_string.string('function');
var ifKeyword = parse_string.string('if');
var inKeyword = parse_string.string('in');
var instanceofKeyword = parse_string.string('instanceof');
var typeofKeyword = parse_string.string('typeof');
var newKeyword = parse_string.string('new');
var varKeyword = parse_string.string('var');
var returnKeyword = parse_string.string('return');
var voidKeyword = parse_string.string('void');
var switchKeyword = parse_string.string('switch');
var whileKeyword = parse_string.string('while');
var thisKeyword = parse_string.string('this');
var withKeyword = parse_string.string('with');
var throwKeyword = parse_string.string('throw');
var tryKeyword = parse_string.string('try');
var getKeyword = parse_string.string('get');
var setKeyword = parse_string.string('set');

var keyword = parse.choice(
    parse.attempt(breakKeyword),
    parse.attempt(caseKeyword),
    parse.attempt(catchKeyword),
    parse.attempt(continueKeyword),
    parse.attempt(debuggerKeyword),
    parse.attempt(defaultKeyword),
    parse.attempt(deleteKeyword),
    parse.attempt(doKeyword),
    parse.attempt(elseKeyword),
    parse.attempt(finallyKeyword),
    parse.attempt(forKeyword),
    parse.attempt(functionKeyword),
    parse.attempt(ifKeyword),
    parse.attempt(inKeyword),
    parse.attempt(instanceofKeyword),
    parse.attempt(typeofKeyword),
    parse.attempt(newKeyword),
    parse.attempt(varKeyword),
    parse.attempt(returnKeyword),
    parse.attempt(voidKeyword),
    parse.attempt(switchKeyword),
    parse.attempt(whileKeyword),
    parse.attempt(thisKeyword),
    parse.attempt(withKeyword),
    parse.attempt(throwKeyword),
    parse.attempt(tryKeyword),
    parse.attempt(getKeyword),
    setKeyword);

// Future Reserved Words
////////////////////////////////////////
var classKeyword = parse_string.string('class');
var enumKeyword = parse_string.string('enum');
var extendsKeyword = parse_string.string('extends');
var superKeyword = parse_string.string('super');
var constKeyword = parse_string.string('const');
var exportKeyword = parse_string.string('export');
var importKeyword = parse_string.string('import');
var implementsKeyword = parse_string.string('implements');
var letKeyword = parse_string.string('let');
var privateKeyword = parse_string.string('private');
var publicKeyword = parse_string.string('public');
var interfaceKeyword = parse_string.string('interface');
var packageKeyword = parse_string.string('package');
var protectedKeyword = parse_string.string('protected');
var staticKeyword = parse_string.string('static');
var yieldKeyword = parse_string.string('yield');

var futureReservedWord = parse.choice(
    parse.attempt(classKeyword),
    parse.attempt(enumKeyword),
    parse.attempt(extendsKeyword),
    parse.attempt(superKeyword),
    parse.attempt(constKeyword),
    parse.attempt(exportKeyword),
    parse.attempt(importKeyword),
    parse.attempt(implementsKeyword),
    parse.attempt(letKeyword),
    parse.attempt(privateKeyword),
    parse.attempt(publicKeyword),
    parse.attempt(interfaceKeyword),
    parse.attempt(packageKeyword),
    parse.attempt(protectedKeyword),
    parse.attempt(staticKeyword),
    yieldKeyword);

// Reserved Word
////////////////////////////////////////
/**
 * 
 */
var reservedWord = parse.Parser('Reserved Word Lexer',
    parse.choice(
        parse_string.trie(keywordList),
        null_lexer.nullLiteral, 
        boolean_lexer.booleanLiteral));

/* Export
 ******************************************************************************/

return {
    'reservedWord': reservedWord,
    
// keywords
    'breakKeyword': breakKeyword,
    'caseKeyword': caseKeyword,
    'catchKeyword': catchKeyword,
    'continueKeyword': continueKeyword,
    'debuggerKeyword': debuggerKeyword,
    'defaultKeyword': defaultKeyword,
    'deleteKeyword': deleteKeyword,
    'doKeyword': doKeyword,
    'elseKeyword': elseKeyword,
    'finallyKeyword': finallyKeyword,
    'forKeyword': forKeyword,
    'functionKeyword': functionKeyword,
    'ifKeyword': ifKeyword,
    'inKeyword': inKeyword,
    'instanceofKeyword': instanceofKeyword,
    'typeofKeyword': typeofKeyword,
    'newKeyword': newKeyword,
    'varKeyword': varKeyword,
    'returnKeyword': returnKeyword,
    'voidKeyword': voidKeyword,
    'switchKeyword': switchKeyword,
    'whileKeyword': whileKeyword,
    'thisKeyword': thisKeyword,
    'withKeyword': withKeyword,
    'throwKeyword': throwKeyword,
    'tryKeyword': tryKeyword,
    'keyword': keyword,

// Future Reserved Word
    'classKeyword': classKeyword,
    'enumKeyword': enumKeyword,
    'extendsKeyword': extendsKeyword,
    'superKeyword': superKeyword,
    'constKeyword': constKeyword,
    'exportKeyword': exportKeyword,
    'importKeyword': importKeyword,
    'implementsKeyword': implementsKeyword,
    'letKeyword': letKeyword,
    'privateKeyword': privateKeyword,
    'publicKeyword': publicKeyword,
    'interfaceKeyword': interfaceKeyword,
    'packageKeyword': packageKeyword,
    'protectedKeyword': protectedKeyword,
    'staticKeyword': staticKeyword,
    'yieldKeyword': yieldKeyword
};

});