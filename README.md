# parse-ecma - Combinatory Parsers for EcmaScript 5.1 #

parse-ecma is a library of [parse.js][parsejs] combinatory parsers for lexing
and parsing [ECMAScript 5.1][ecma51]. It is designed for flexibility,
extensibility, and completeness.
 

## To clone ##
    git clone https://github.com/mattbierner/parse-ecma parse-ecma
    cd parse-ecma
    git submodule update --init --recursive


# Using parse-ecma #

## Dependencies ##
* [parse.js][parsejs]
* [stream.js][stream]


## Modules ##

### ecma/lex ###
Parsers for tokenizing ECMAScript 5.1 input streams.

### ecma/parse ###
Parsers for building abstract syntax trees from token streams.

### ecma/ast ###
[SpiderMonkey][parseapi] abstract syntax tree node definitions.
 
 
 
 
 
 [parsejs]: https://github.com/mattbierner/parse.js
 [ecma51]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
 [parseapi]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API
 [stream]: https://github.com/mattbierner/stream.js