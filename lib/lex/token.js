/**
 * @fileOverview Lexer tokens.
 */
define(['ecma/ast/node'], function(node){
"use strict";

/**
 * 
 */
var Token = function(value, loc) {
    node.Node.call(this, this.type, loc);
    this.value = value;
};
Token.prototype = new node.Node;


/**
 * 
 */
var StringToken = function(value, loc) {
    Token.call(this, value, loc);
};
StringToken.prototype = new Token;
StringToken.prototype.type = "String";

/**
 * 
 */
var NumberToken = function(value, loc) {
    Token.call(this, value, loc);
};
NumberToken.prototype = new Token;
NumberToken.prototype.type = "Number";

/**
 * 
 */
var RegularExpressionToken = function(value, loc) {
    Token.call(this, value, loc);
};
RegularExpressionToken.prototype = new Token;
RegularExpressionToken.prototype.type = "RegularExpression";

/**
 * 
 */
var BooleanToken = function(value, loc) {
    Token.call(this, value, loc);
};
BooleanToken.prototype = new Token;
BooleanToken.prototype.type = "Boolean";

/**
 * 
 */
var NullToken = function(value, loc) {
    Token.call(this, value, loc);
};
NullToken.prototype = new Token;
NullToken.prototype.type = "Null";

/**
 * 
 */
var IdentifierToken = function(value, loc) {
    Token.call(this, value, loc);
};
IdentifierToken.prototype = new Token;
IdentifierToken.prototype.type = "Identifier";

/**
 * 
 */
var KeywordToken = function(value, loc) {
    Token.call(this, value, loc);
};
KeywordToken.prototype = new Token;
KeywordToken.prototype.type = "Keyword";

/**
 * 
 */
var PunctuatorToken = function(value, loc) {
    Token.call(this, value, loc);
};
PunctuatorToken.prototype = new Token;
PunctuatorToken.prototype.type = "Punctuator";

/**
 * 
 */
var CommentToken = function(value, loc) {
    Token.call(this, value, loc);
};
CommentToken.prototype = new Token;
CommentToken.prototype.type = "Comment";

/**
 * 
 */
var WhitespaceToken = function(value, loc) {
    Token.call(this, value, loc);
};
WhitespaceToken.prototype = new Token;
WhitespaceToken.prototype.type = "Whitespace";

/**
 * 
 */
var LineTerminatorToken = function(value, loc) {
    Token.call(this, value, loc);
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