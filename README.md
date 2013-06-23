# Khepri

## About
Khepri is a duck typed programming language derived from ECMAScript. It both
restricts ECMAScript and introduces new features to make the language more concise 
and consistent.

Unlike most other *script languages, Khepri's goal is not to replace Javascript
by introducing new heavy weight language features, but to make writing Javascript
more fun, with a focus on functional style programming. 


## To clone ##
    git clone https://github.com/mattbierner/khepri khepri
    cd khepri
    git submodule update --init


# Using Khepri #

## Dependencies ##
* [parse.js][parsejs]
* [nu][nu]
* [parse-ecma][parseecma]
* [ecma-unparse][ecmaunparse]


# Differences with ECMAScript 

## Additions

### Lambda Function Expression Syntax
Available syntaxes, along with translations as last item, are shown here: 

    // single argument
    \x -> x + 3;
    \(x) -> x + 3;
    function(x) { return x + 3; };
    
    // multiple arguments
    \x, y -> x + y;
    \(x, y) -> x + y; 
    function(x, y) { return x + y; };
    
    // function body
    \x, y -> {
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
    \ -> 3;
    \() -> 3;
    function() { return 3; };
    
    // Return empty object literal
    \() -> ({});
    
    // Right associativity
    \x -> \y -> x + y;
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
    
    a[5 + 10, (\x -> x.y)({'y': 7})];
    a[b][function(x) { return x.y; }({'y': 7})];

### Let Expression
Let expression allow variables to be bound in expressions:

    // Id Let Expression
    let a = 3 in a;
    (\a -> a)(3);

Let expressions have higher precedence than conditional expressions and are 
right associative:

    // Multiple let expressions
    let a = 3 in let b = 4 in a + b;
    (\a -> (\b -> a + b)(4))(3);

Multiple values can be bound in a single let expression. Bound values are 
evaluated left to right and previously bound values can be used in the current
binding:

    // These are the same
    let a = 3, b = 5 in a + b;
    let a = 3 in let b = 5 in a + b;
    
    // Using an existing binding.
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

The bound value will only be evaluated once no matter how many times it is used.
Bindings hide existing bindings for the duration of the expression and let 
expressions bindings can hide one another. Use of let expression bindings outside
of the expression is not valid.

    // Hiding let expressions
    // Here the bound value for the inner a is resolved against the existing binding
    // for a, 3 in this case.
    let a = 3 in let a = a in a * a;
    (\a -> (\a -> a * a)(a))(3);


## Modified ##

# Restrict Assignment Expressions
Assignment is generally dangerous and allowing arbitrary assignments in expressions
can make code difficult to reason about. However, without fundamental changes to
the entire language, we need assignment. Therefore, Khepri restricts assignment
to top level statements and it is disallowed in expressions. The left hand side
of an assignment statement must be either an identifier or a member expression.

    var a = {'x': 4};
    a.x = 34; // valid since used as statement
    a = {}; // also valid
    if (a = {}) // error, assignment used in expression
    b = a = 4; // error, assignment used in expression
    3 = 4; // error, as lhs not identifier or member expression

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

### Lexical Scoping, Redefinition, and Globals
Javascript's scoping rules are inconsistent with its C inspired syntax. Some
programmers advocate making this inconsistency clear by explicitly declaring
variables at the start of their scope. Another issue is Javascript's handling of
globals and undeclared variables.

Khepri introduces static checks that enforce lexical scoping based on blocks
and functions. Further checks also enforce that all variables are declared 
before use and that global variables are be explicitly listed before use. Khepri
also disallows duplicate symbol definition in the same scope. The concept of an
immutable binding is also added for values that cannot be directly assigned.
All bindings except those from variable declarations are immutable.

Three elements introduce new a new scope: the program, the function body, a block
statement. Variables are only valid inside the scope in which they are declared
as well as any enclosed scopes. A variable with the same name as one in an
outer scopes hides the outer one.

    // Annotated to show which variables are in scope
    // a, b
    var a = 10;
    var b;
    if (a > 0)
    { // a, b, g, f
        var g = 100;
        var f -> \a -> { var z = 13; return a - g; } // a, b, g, f, a, z
        b = f(3);
    }

Variables declarations are evaluated in order, and only previously declared 
variables can be used. This is a restriction of Javascript where declarations are
evaluated first and variables bound to undefined before statements
are evaluated:

    var h = "hello";
    var message = h + " " + w; // error, w used before declared.
    var w = "world";

Implicit blocks also introduce a new scope, such as if or for statements without
brackets:

    var h = "hello";
    if (h)
        var w = "world";
    var message = h + " " + w; // error, w used outside of implicit if block.

Duplicate variables in the same scope are disallowed:

    var b = 3;
    var c = b;
    var b = c; // Error, b already declared.

Only variables from variable declarations has mutable bindings, meaning they can
be reassigned. Those from static declarations, catch clauses, function parameters,
and let bindings are immutable cannot be reassigned.

    var a = 4;
    a = 10; // ok;
    
    static g;
    g = 323; // Error, g is immutable
    
    var f = \x -> { var x = 3; return x + 1; }; // error, x is immutable in scope
    var f = \x -> { { var x = 3; return x + 1; } }; // ok, new scope 

Globals are used by declaring them with the 'static' keyword. 'static' is
already a reserved work in ECMAScript 5.1. By default, builtin object globals
are already declared. This does not include any DOM objects.
This only suppresses checks on the global variables, it does not effect the 
behavior of the program. 

    static define; // expect a global called 'define'
    define([], function() {
        var props = {'x': {'value': 3}};
        return Object.keys({}, props); // 'Object' builtin ok even without explicit static.
    });

 Use of a global can also be restricted to a block. This may help make intent
 clearer but again, does not change the meaning of the actual program

    var a = \x -> {
        static $;
        return $('<div></div>');
    };


## Removed ##

### Function Declarations
Function declarations are not necessary. Use function expressions instead.

### Comma Separated Expressions
Comma separated sequences of expressions are not allowed. An expressions must be 
a single expression. Such sequence expressions are usually not clear and make the
language more complex than it should be. 

### With Statement
With statements are not valid in strict mode ECMAScript and have been removed.

### Labeled Statements
Make language more ambiguous.

### Semicolon Insertion and Significant Whitespace
Semicolon insertion is not supported and whitespace is no longer significant.
Real semicolons must always be used.

    // Khepri will ignore whitespace and not insert semicolons
    (\x, y) -> {
        return
        
                 x + y;
    };
    function(x, y) { return x + y; };

### Empty Array Literal Elements
Array literals do not support empty elements or a trailing comma.
Use an explicit undefined value instead.

### Object Literal Trailing Comma
Object literals may not have a trailing comma.

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
 [nu]: http://mattbierner.github.io/nu/
 [ecmaunparse]: https://github.com/mattbierner/ecma-unparse