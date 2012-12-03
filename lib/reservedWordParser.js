/**
 * @fileOverview Parsers for ECMAScript 5.1 reserved words.
 */
define(['parse', 'parse_string', 'booleanParser', 'nullParser'],
    function(parse, parse_string, booleanParser, nullParser){
"use strict";


var keywordList = [
    'break', 'case', 'catch', 'continue', 'debugger', 'default', 'delete', 
    'do', 'else', 'finally', 'for', 'function', 'if', 'in', 'instanceof', 
    'typeof', 'new', 'var', 'return', 'void', 'switch', 'while', 'this', 
    'with', 'throw', 'try', 'class', 'enum', 'extends', 'super', 'const',
    'export', 'import', 'implements', 'let', 'private', 'public', 'interface',
    'package', 'protected', 'static', 'yield']; 

/* Parsers
 ******************************************************************************/
// Keywords
////////////////////////////////////////
var breakKeyword = parse.string('break');
var caseKeyword = parse.string('case');
var catchKeyword = parse.string('catch');
var continueKeyword = parse.string('continue');
var debuggerKeyword = parse.string('debugger');
var defaultKeyword = parse.string('default');
var deleteKeyword = parse.string('delete');
var doKeyword = parse.string('do');
var elseKeyword = parse.string('else');
var finallyKeyword = parse.string('finally');
var forKeyword = parse.string('for');
var functionKeyword = parse.string('function');
var ifKeyword = parse.string('if');
var inKeyword = parse.string('in');
var instanceofKeyword = parse.string('instanceof');
var typeofKeyword = parse.string('typeof');
var newKeyword = parse.string('new');
var varKeyword = parse.string('var');
var returnKeyword = parse.string('return');
var voidKeyword = parse.string('void');
var switchKeyword = parse.string('switch');
var whileKeyword = parse.string('while');
var thisKeyword = parse.string('this');
var withKeyword = parse.string('with');
var throwKeyword = parse.string('throw');
var tryKeyword = parse.string('try');

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
    tryKeyword);

// Future Reserved Words
////////////////////////////////////////
var classKeyword = parse.string('class');
var enumKeyword = parse.string('enum');
var extendsKeyword = parse.string('extends');
var superKeyword = parse.string('super');
var constKeyword = parse.string('const');
var exportKeyword = parse.string('export');
var importKeyword = parse.string('import');
var implementsKeyword = parse.string('implements');
var letKeyword = parse.string('let');
var privateKeyword = parse.string('private');
var publicKeyword = parse.string('public');
var interfaceKeyword = parse.string('interface');
var packageKeyword = parse.string('package');
var protectedKeyword = parse.string('protected');
var staticKeyword = parse.string('static');
var yieldKeyword = parse.string('yield');

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
var reservedWord = parse.Parser('Reserved Word Parser', parse.choice(
    parse_string.trie(keywordList),
    nullParser.nullLiteral, 
    booleanParser.booleanLiteral));

/* Export
 ******************************************************************************/

return {
    'keywordList': keywordList,
    
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