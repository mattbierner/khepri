/**
 * 
 */
define(['parse/parse',
        'ecma/position',
        'ecma/ast/value'],
function(parse,
        position,
        astValue){
"use strict";

var positionParser = parse.extract(function(state) {
    return state.pos;
});

/**
 * Combines the behavior of the 'bind' and 'always' parsers
 */
var bindAlways = function(p, f) {
    return function BIND_PARSER(state, m, cok, cerr, eok, eerr) {
        var pcok = function(v, state, m) { return cok(f(v, state), state, m); },
            peok = function(v, state, m) { return eok(f(v, state), state, m); };
        return cont(p, [state, m, pcok, cerr, peok, eerr]);
    };
};

var astNode = function(name, p) {
    return parse.binda(
        parse.sequence(
            parse.anyToken,
            p,
            positionParser),
        function(start, value, end) {
            //value.loc = new position.SourceLocation(start, end);
            return parse.always(value);
        });
};

var identifier = parse.Parser('Identifier',
    parse.bind(
        parse.token(function(tok) {
            return (tok.type === 'Identifier');
        }),
    function(x) {
        return parse.always(new astValue.Identifier(x.value, x.loc));
    }));

/* Export
 ******************************************************************************/
return {
    'bindAlways': bindAlways,
    
    'astNode': astNode,
    'position': positionParser,
    
    'identifier': identifier,
    
    
};

});