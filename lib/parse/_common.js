/**
 * @fileOverview 
 */
define(['parse/parse',
        'khepri/position',
        'khepri/ast/value'],
function(parse,
        position,
        astValue){
"use strict";

// Bind Always
////////////////////////////////////////
/**
 * Combines the behavior of the 'bind' and 'always' parsers.
 */
var bindAlways = function(p, f) {
    return function BIND_PARSER(state, m, cok, cerr, eok, eerr) {
        var pcok = function(v, state, m) { return cok(f(v, state), state, m); },
            peok = function(v, state, m) { return eok(f(v, state), state, m); };
        return cont(p, [state, m, pcok, cerr, peok, eerr]);
    };
};

// State Interaction
////////////////////////////////////////
var positionParser = parse.extract(function(state) {
    return state.pos;
});

var locParser = parse.extract(function(state) {
    return state.loc;
});

// Line Terminator
////////////////////////////////////////



// Ast Node
////////////////////////////////////////
var astNode = function(p) {
    return parse.binda(
        parse.sequence(
            locParser,
            p,
            locParser),
        function(o, node, c) {
            //TODO: not functional here
            node.loc = position.SourceLocation.merge(o, c);
            return parse.always(node);
        });
};

/* Export
 ******************************************************************************/
return {
    'bindAlways': bindAlways,
    
    'astNode': astNode,
    
    'position': positionParser
};

});