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

### Lambda Function Expression Syntax
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

### Multiple value bracket accessor
Bracket accessors support multiple expressions separated by commas for traversing
hierarchical paths. Single expressions are still supported.

Available syntaxes, along with translations, are shown here: 

    // Single argument
    a[b];
    a[b];
    
    // Multiple arguments
    a[b, c];
    a[b][c];
    
    a[5 + 10, (x -> x.y)({'y': 7})];
    a[b][function(x) { return x.y; }({'y': 7})];

### Let Expression
Let expression allow variables to bound in expressions.

    // Id Let Expression
    let a = 3 in a;
    (a -> a)(3);

Let expressions have higher precedence than conditional expressions and are 
right associative:

    // Multiple let expressions
    let a = 3 in let b = 4 in a + b;
    (a -> (b -> a + b)(4))(3);

Multiple values can be bound in a single let expression. Bound values are 
evaluated left to right and previously bound values can be used in the current
binding:

    // These are the same
    let a = 3, b = 5 in a + b;
    let a = 3 in let b = 5 in a + b;
    
    // Using a existing binding.
    let a = 3, b = a + 10 in a + b;
    let a = 3 in let b = a + 10 in a + b;

Let expressions capture as much as possible to their right. This can be limited
by wrapping the entire expression in parentheses:

    // Capturing everything to right 
    4 * let a = 2 in a + 3;
    4 * (let a = 2 in a + 3); // 20
    4 * (2 + 3); 
    
    // Limiting capture
    4 * (let a = 2 in a) + 3;
    4 * 2 + 3; // 11

Let expressions have lower precedence than assignment expressions. They always
result in a value, not a member reference even on the left hand side. Assignment
is usually a bad idea but it is supported in let expressions if you really need it.

    // Assign left let result
    // Grammatically valid but semantically not.
    let a = 3 in a = 10;
    (let a = 3 in a) = 10;
    3 = 10; // a is always a value.
    
    // Using assign in let body
    // Grammatically valid but semantically not.
    let a = 3 in (a = 10);
    3 = 10; // however a may be a reference here
    
    // Using assign in let binding
    // a is bound to result of b = 10 while the body is evaluated after the bindings.
    let a = (b = 10) in a + b;
    10 + b; // b = 10
    
    // Result by value
    // Grammatically valid but semantically not.
    let a = [1, 2, 3] in a[0] = 10;
    (let a = [1, 2, 3] in a[0]) = 10;
    ([1, 2, 3][0]) = 10; // left side evaluated to value.
    1 = 10;
    
    // Member reference inside let body is valid
    let a = [1, 2, 3] in (a[0] = 10);
    ([1, 2, 3][0]) = 10; // left side evaluated to reference.
    10; // with array = [10, 2, 3]

The bound value will only be evaluated once no matter how many times it is used.
Bindings hide existing bindings for the duration of the expression and let 
expressions bindings can hide one another. Use of let expression bindings outside
of the expression is not valid.

    // Hiding let expressions
    // Here the bound value for the inner a is resolved against the existing binding
    // for a, 3 in this case.
    let a = 3 in let a = a in a * a;
    (a -> (a -> a * a)(a))(3);


## Modified ##

### Switch Default Clause
The default clause in a switch statement remains optional, but must be the last
clause in the switch statement.

### Object Literal Keys
Like JSON, object literal keys must be strings. ECMAScript normally allows
number and identifier key values as well.

### 'get' and 'set' keywords
In ECMAScript 5.1, 'get' and 'set' are identifiers. This is confusing as they
have a special meaning in object literals.

### Regular Expression Literal Syntax
Backticks are used to mark the start and the end of regular expressions instead
of slashes. This eliminates the need for having two top level elements in the 
grammar.

## Removed ##

### Function Declarations
Function declarations are not necessary. Use function expressions instead.

### Comma Separated Expressions
Comma separated sequences of expressions are not allowed. An expressions must be 
single expression. Such sequence expressions are usually not clear and make the
language more complex than it should be. 

### With Statement
With statements are not valid in strict mode ECMAScript and have been removed.

### Labeled Statements
Make language more ambiguous.

### Semicolon Insertion and Significant Whitespace
Semicolon insertion is not supported and whitespace is no longer significant.
Real semicolons must always be used.

    // Khepri will ignore whitespace and not insert semicolons
    (x, y) -> {
        return
        
                 x + y;
    };
    function(x, y) { return x + y; };

### Empty Array Literal Elements
Array literals do not support empty elements or a trailing comma.
Use an explicit undefined value instead.

### Object Literal Trailing Comma
Object literals may not have trailing comma.

### In Operator
The in operator is not supported, but 'in' remains a reserved word and is used
in let expressions

### For In Statement
Since the 'in' operator is not supported, for in statements are also not supported.
Other solutions usually exist, such as 'forEach'.

### Increment and Decrement Operators
Where mutable state must be used, make it more explicit.
Additionally, '++' and '--' are no longer valid punctuators and will be lexed
to '+' '+' and '-' '-'.


# Code #
Khepri is written in Javascript / Khepri.

For now, both the .js and .kep versions of source code will be kept in 'lib/',
but only Khepri sources will be developed and Javascript files will be
generated from it.


 [parsejs]: https://github.com/mattbierner/parse.js
 [parseecma]: https://github.com/mattbierner/parse-ecma
 [ecma51]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
 [stream]: https://github.com/mattbierner/stream.js
 [ecmaunparse]: https://github.com/mattbierner/ecma-unparse