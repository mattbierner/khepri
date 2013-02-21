# Khepri - ECMAScript Language #

## About ##
Khepri is a programming language that is a subset of ECMAScript. It restricts
ECMAScript and also introduces some syntax changes.

Unlike most other *script languages, Khepri's goal is not to replace Javascript
by introducing new language features, but to make writing Javascript more fun.
Its specific focus is functional style programming in Javascript.
 

## To clone ##
    git clone https://github.com/mattbierner/khepri khepri
    cd khepri
    git submodule update --init


# Using Khepri #

## Dependencies ##
* [parse.js][parsejs]
* [stream.js][stream]
* [parse-ecma][parseecma]
* [ecma-unparse][ecmaunparse]


# Changes #

## Added ##

### Lambda Function Expression Syntax ###
Available syntaxes, along with translations, are shown here: 

    // single argument
    x -> x + 3;
    function(x) { return x + 3; };
    
    // multiple arguments
    (x y) -> x + y; 
    function(x, y) { return x + y; };
    
    // function body
    (x y) -> {
        ++x;
        --y;
        return x + y;
    };
    function(x, y) {
        ++x; 
        --y;
        return x + y;
    };
    
    // No Arguments
    () -> 3;
    function() { return 3; };
    
    // Return empty object literal
    () -> ({});
    
    // Right associativity
    x -> y -> x + y;
    function(x) { return function(y) { return x + y; }};

All scoping remains the same as in the translated version. 


## Modified ##

### Switch Default Clause ###
The default clause in a switch statement remains optional, but must be the last
clause in the switch statement.

### Object Literal Keys ###
Like JSON, object literal keys must be strings. ECMAScript normally allows
number and identifier key values as well.

### 'get' and 'set' keywords ###
In ECMAScript 5.1, 'get' and 'set' are identifiers. This is confusing as they
have a special meaning in object literals.

## Removed ##

### Function Declarations ###
Function declarations are not necessary. Use function expressions instead.

### Comma Separated Expressions ###
Comma separated sequences of expressions are not allowed. An expressions must be 
single expression. Such sequence expressions are usually not clear and make the
language more complex than it should be. 

### With Statement ###
With statements are not valid in strict mode ECMAScript and have been removed.

### Labeled Statements ###
Make language more ambiguous.

### Semicolon Insertion and Significant Whitespace ###
Semicolon insertion is not supported and whitespace is no longer significant.
Real semicolons must always be used.

    // Khepri will ignore whitespace and not insert semicolons
    (x, y) -> {
        return
        
                 x + y;
    };
    function(x, y) { return x + y; };

### Empty Array Literal Elements ###
Array literals do not support empty elements or a trailing comma.
Use an explicit undefined value instead.

### Object Literal Trailing Comma ###
Object literals may not have trailing comma.

### In Operator ###
The in operator is not supported, but 'in' remains a reserved word. 

### For In Statement ###
Since the 'in' operator is not supported, for in statements are also not supported.
Other solutions usually exist, such as 'forEach'.

### Increment and Decrement Operators ###
Where mutable state must be used, make it more explicit.



 [parsejs]: https://github.com/mattbierner/parse.js
 [parseecma]: https://github.com/mattbierner/parse-ecma
 [ecma51]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
 [stream]: https://github.com/mattbierner/stream.js
 [ecmaunparse]: https://github.com/mattbierner/ecma-unparse