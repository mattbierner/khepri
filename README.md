# Khepri - ECMAScript Language #

## About ##
Khepri is a programming language that is a subset of ECMAScript. It restricts
ECMAScript and also uses an different syntax.

Unlike most other *script languages, Khepri's goal is not to replace Javascript
by introducing new language features, but to make writing Javascript more fun.
Its specific focus is functional programming in Javascript.


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
    }
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
    
    // Left associativity
    x -> y -> x + y;
    function(x) { return function(y) { return x + y; }};

All scoping remains the same as in the translated version.


## Modified ##

### Switch Default Clause ###
Optional, but must come last.

### Object Literal Keys ###
Must always be a string, not a number or identifier.
Bracket accessors still support expressions.


## Removed ##

### Function Declarations ###
Use function expressions instead.

### Comma Separated Expressions ###
Expressions must be a single expression, not a sequence of expressions.

### With Statement ###


### Labeled Statements ###
Make language more ambiguous.

### Semicolon Insertion and Significant Whitespace ###
Always use real semicolons. Also, whitespace no longer matters.

    // Khepri will ignore whitespace and not insert semicolons
    (x, y) -> {
        return
        
                 x + y;
    };
    function(x, y) { return x + y; };

### Empty Array Literal Elements ###
Use explicit undefined instead.

### In Operator ###
Still reserved keyword.

### For In Statement ###
Because in operator removed.

