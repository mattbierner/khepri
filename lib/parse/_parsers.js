/**
 * 
 */
define(['parse/parse',
        'ecma/position',
        'ecma/ast/value'],
function(parse,
        position,
        astValue){
//"use strict";

var positionParser = parse.extract(function(state) {
    return state.pos;
});

var locParser = parse.extract(function(state) {
    return state.loc;
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

var identifier = parse.Parser('Identifier',
    parse.bind(
        parse.token(function(tok) {
            return (tok.type === 'Identifier');
        }),
    function(x) {
        return parse.always(new astValue.Identifier(x.loc, x.value));
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