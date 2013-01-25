/**
 * @fileOverview
 */
define([
        'parse/parse',
        'ecma/parse/program'],
function(parse,
        program){
"use strict";

/* Running
 ******************************************************************************/
var parseStream = parse.runStream.bind(undefined, program.program);

var parse = parse.run.bind(undefined, program.program);

/* Export
 ******************************************************************************/
return {
    'parse': parse,
    'parseStream': parseStream
};

});