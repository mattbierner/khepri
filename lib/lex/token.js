/**
 * @fileOverview Lexer tokens.
 */
define(['ecma/ast/node'], function(node){
"use strict";

/**
 * 
 */
var Token = function(loc, value) {
    node.Node.call(this, loc);
    this.value = value;
};
Token.prototype = new node.Node;


/**
 * 
 */
var StringToken = function(loc, value) {
    Token.call(this, loc, value);
};
StringToken.prototype = new Token;
StringToken.prototype.type = "String";

/**
 * 
 */
var NumberToken = function(loc, value) {
    Token.call(this, loc, value);
};
NumberToken.prototype = new Token;
NumberToken.prototype.type = "Number";

/**
 * 
 */
var RegularExpressionToken = function(loc, value) {
    Token.call(this, loc, value);
};
RegularExpressionToken.prototype = new Token;
RegularExpressionToken.prototype.type = "RegularExpression";

/**
 * 
 */
var BooleanToken = function(loc, value) {
    Token.call(this, loc, value);
};
BooleanToken.prototype = new Token;
BooleanToken.prototype.type = "Boolean";

/**
 * 
 */
var NullToken = function(loc, value) {
    Token.call(this, loc, value);
};
NullToken.prototype = new Token;
NullToken.prototype.type = "Null";

/**
 * 
 */
var IdentifierToken = function(loc, value) {
    Token.call(this, loc, value);
};
IdentifierToken.prototype = new Token;
IdentifierToken.prototype.type = "Identifier";

/**
 * 
 */
var KeywordToken = function(loc, value) {
    Token.call(this, loc, value);
};
KeywordToken.prototype = new Token;
KeywordToken.prototype.type = "Keyword";

/**
 * 
 */
var PunctuatorToken = function(loc, value) {
    Token.call(this, loc, value);
};
PunctuatorToken.prototype = new Token;
PunctuatorToken.prototype.type = "Punctuator";

/**
 * 
 */
var CommentToken = function(loc, value) {
    Token.call(this, loc, value);
};
CommentToken.prototype = new Token;
CommentToken.prototype.type = "Comment";

/**
 * 
 */
var WhitespaceToken = function(loc, value) {
    Token.call(this, loc, value);
};
WhitespaceToken.prototype = new Token;
WhitespaceToken.prototype.type = "Whitespace";

/**
 * 
 */
var LineTerminatorToken = function(loc, value) {
    Token.call(this, loc, value);
};
LineTerminatorToken.prototype = new Token;
LineTerminatorToken.prototype.type = "LineTerminator";

/* Export
 ******************************************************************************/
return {
    'Token': Token,
    
    'StringToken': StringToken,
    'NumberToken': NumberToken,
    'RegularExpressionToken': RegularExpressionToken,
    'BooleanToken': BooleanToken,
    'NullToken': NullToken,
    
    'IdentifierToken': IdentifierToken,
    'KeywordToken': KeywordToken,
    'PunctuatorToken': PunctuatorToken,
    
    'CommentToken': CommentToken,
    'WhitespaceToken': WhitespaceToken,
    'LineTerminatorToken': LineTerminatorToken
};

});