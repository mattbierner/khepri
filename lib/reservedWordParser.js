define(['parse', 'booleanParser', 'nullParser'], function(parse, booleanParser, nullParser){
/**
 * @fileOverview Parsers for ECMAScript 5.1 reserved words.
 */

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
    breakKeyword,
    caseKeyword,
    catchKeyword,
    continueKeyword,
    debuggerKeyword,
    defaultKeyword,
    deleteKeyword,
    doKeyword,
    elseKeyword,
    finallyKeyword,
    forKeyword,
    functionKeyword,
    ifKeyword,
    inKeyword,
    instanceofKeyword,
    typeofKeyword,
    newKeyword,
    varKeyword,
    returnKeyword,
    voidKeyword,
    switchKeyword,
    whileKeyword,
    thisKeyword,
    withKeyword,
    throwKeyword,
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
    classKeyword,
    enumKeyword,
    extendsKeyword,
    superKeyword,
    constKeyword,
    exportKeyword,
    importKeyword,
    implementsKeyword,
    letKeyword,
    privateKeyword,
    publicKeyword,
    interfaceKeyword,
    packageKeyword,
    protectedKeyword,
    staticKeyword,
    yieldKeyword);

// Reserved Word
////////////////////////////////////////
/**
 * 
 */
var reservedWord = parse.choice(
    keyword,
    futureReservedWord,
    nullParser.nullLiteral, 
    booleanParser.booleanLiteral);

/* Export
 ******************************************************************************/

return {
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