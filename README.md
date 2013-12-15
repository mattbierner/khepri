# Khepri

## About
Khepri is an ECMAScript derived programming language that both restricts
ECMAScript and introduces new features to make the language more concise 
and consistent. Khepri compiles to plain old Javascript and does not require
any runtime libraries and Khepri and Javascript can also be freely mixed in a
project.

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
* [ecma-unparse][ecmaunparse]
* [khepri-ast][khepriast]
* [ecma-ast][ecmaast]

# Differences with ECMAScript

### Lambda Function Expression Syntax
Available syntaxes, along with the also valid ECMAScript translation as last item, are shown here: 

    // single argument
    \x -> x + 3;
    \(x) -> x + 3;
    function \x -> x + 3;
    function(x) { return x + 3; };
    
    // multiple arguments, commas are optional
    \x y -> x + y;
    \x, y -> x + y;
    \(x, y) -> x + y; 
    function(x, y) { return x + y; };
    
    // function body
    \x y -> {
        var z = x + 10;
        return z + y;
    };
    function \x, y -> {
        var z = x + 10;
        return z + y;
    };
    function(x, y) {
        var z = x + 10
        return z + y;
    };
    
    // No Arguments
    \ -> 3;
    \() -> 3;
    function \ -> 3;
    function() { return 3; };
    
    // Return empty object literal
    \() -> ({});
    
    // Right associativity
    \x -> \y -> x + y;
    function(x) { return function(y) { return x + y; }; };
    
    // Named function expression
    function f \x -> (x < 10 ? f(x + 1) : x);
    function f \x -> { return (x < 10 ? f(x + 1) : x); };
    function f (x) { return (x < 10 ? f(x + 1) : x); };


All scoping remains the same as in the translated version.

### Unpack Patterns
Khepri allows writing more concise expressions with a pattern syntax to unpack
values into into multiple identifiers. Patterns may be used in function parameter
lists, let expressions, and with expressions.

Unpack patterns effect the behavior of the generated code and have nothing
to do with pattern matching. All effects happen at runtime.

Comma separators are optional in all patterns.

#### Identifier Pattern
Same as ECMAScript. Binds argument at position to name for function body.

    (\a b c -> [a, b, c])(1, 2); // [1,2,undefined]
    
    (\a, b, c -> [a, b, c])(1, 2); // [1,2,undefined]

#### Ellipsis Pattern
Currently used only for annotation to represent a variable number of arguments.
It should only be used as the last pattern in a parameter list as
future use of Ellipsis may change but will not effect this use.

    var l = \a, ... -> [a, arguments];

#### Array Pattern
Performs a runtime unpacking of a parameter. Identifiers are bound to the unpacked
value of the paramter a the given index. 

    var first = \[x] -> x;
    var first = \arr -> arr[0];
    
    var add = \[x y] -> x + y;
    var add = \[x, y] -> x + y;
   
    var add = \arr -> arr[0] + arr[1];
    
No type checks are performed so it is possible to pass in array like objects or
invalid objects:

    var first = \[x] -> x;
    first("abc"); // a
    first({'0': 10, '1': 2}); // 10
    first(null); // error, accessing null[0]

Patterns can be arbitrarily nested:

    var dot2 = \[[a, b], [x, y]] -> a * x + b * y;
    dot2([[1, 2], [3, 4]]); // 11
    
    //translation
    var dot2 = \arr -> arr[0][0] + arr[1][0] + arr[0][1] + arr[1][1];
    
#### Object Pattern
Object patterns generalize array pattern for use with any string keys. Identifiers
are bound to the unpacked value of the paramter's member given name at runtime.

    var swapAB =  \{'a': a, 'b': b} -> ({'a': b, 'b': a});
    var swapAB =  \obj -> ({'a': obj['b'], 'b': obj['a']});
    swapAB({'a': 3, 'b': 5}); // {'a': 5, 'b': 3};

Object patterns can be nested:

    var nested = \{'c': [x, {'value': y}]} -> x + y;

As shorthand, properties that have names that are valid identifiers can be
unpacked directly by using the identifier as the key to unpack:

    \{x, y}-> x + y;
    
    var swapAB =  \{a, b} -> ({'a': b, 'b': a});

#### As Pattern
The as pattern unpacks a value to an identifier and then unpacks the value again
with another pattern. This is similar to Haskell's `@`. It can be used in any
other pattern.

    var dup = \arr#[x ...] -> [x, arr];
    dup([1, [2]]); //[1, [1, [2]]]; 

Used as a top level in an object pattern, the as pattern specifies the key to unpack:

    var dup = \{x#{y}} -> y;
    
    // is short for;
    var dup = \{'x': {y}} -> y;
    
#### Arguments Pattern
The arguments pattern is used to unpack the arguments object in functions.
Two forms exist, explicit which allows access to the underlying arguments object
and implicit which only allows the individual arguments to be accessed.
The `arguments` magic identifier is no longer valid and this is the only way to
access the arguments.

Implicit form is a list (optionally comma separated) of zero or more patterns. Each pattern
unpacks the argument value at its index.

    var f = \x y {z} -> x + y + z;
    f(1, 3, {'z': 5}); // 9

Explicit form adds an optional unpack for the arguments object itself. It is
an optional identifier pattern followed by a parenthesized comma separated list
of patterns for the individual argument unpacks.

    var f = \args(...) -> args.length;
    f(1, 2); // 2;
    f(1, 2, 3, 4); // 4

## Let Expression
Let expressions bind variables in a expression:

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

Anonymous functions bound in let expressions can access themselves by bound
name in the function body:

    let fib = \x -> (x < 2 ? x : fib(n - 1) + fib(n - 2)) in
        fib(10);

Named functions can also access themselves by function name. The
scope of the function name is limited to the evaluation of the bound value.

    let fib = function impl \x -> (x < 2 ? x : impl(x - 1) + impl(x - 2)) in
        fib(10);

let expressions may also use any pattern on their left hand side:

    let
        o#{x, y} = {'a': 3, 'x': 6, 'z': 5, 'y': 8},
        [first] = [1,2, 3]
    in
       first + y + x + o.a; // 18

### With statement
The `with` statement has been modified to behave like a statement level let
expression. The syntax is:

    with BINDINGS in { STATEMENTS }

where `BINDINGS` is a list of let style bindings and `STATEMENTS` is zero or more
other statements.

    with x = 10, y = 5 in { 
        if (x > y)
            reutrn x;
        return y;
    }

Unlike the `let` statement, `with` statements can contain flow control statements
like `return`, `throw`, `break`, and `continue`.

Like `let`, all bindings are immutable and only valid inside of the body.


### Package Syntax
Khepri introduces a syntax for packages. Code for different package management
systems may be generated from the base package syntax.

A program may either be a regular program or a package. New packages are simple
declared:

    package (EXPORTS) { BODY }

EXPORTS is a list of symbols the package exports from BODY. For a math package,
exporting two symbols `min` and `max`:

    package (min max)
    {
        min = \x, y -> (x < y ? x : y);
        max = \x, y -> (x < y ? y : x);
    }

The export name is the name other packages use to access the symbol. Order of
exports does not matter, but the exports must be unique. Exports create local
variables for that export in the package body. The value for the exported
symbol is taken from the symbols value at the end of the package body.

Packages may also import other packages.

    package () with
        import PATH OBJECT_PATTERN
    {
    }

The path is a string path to the module to import. OBJECT_PATTERN is an object
pattern used to unpack the import locally. This can unpack just specific symbols or
bind the entire import to a name.

For example, importing two packages:

    package () with
        import 'lib/math' math#{min, max},
        import 'lib/str' {match, search}
    {
    }

Inside the package body, `math` is bound the entire math package. `min` and `max`
are bound to the min and max exports of the math package. Because we named the entire
math package as `math`, we could also write `math.min` or `math.abs` to access
members. `str` on the other hand does not name its package but imports two
symbols, `match` and `search`. The package cannot be directly accessed but
these two values can be.

Imported names are immutable bindings in the package body. All packages
reserve the names `require`, `exports`, `module` as immutable bindings before
any of the package is evaluated. All packages also use strict mode.


## Function Curry Operator
In place of sequence expressions, parenthesized comma separated expressions are used to
curry functions. Their current use to group a subexpression remains unchanged as
a parenthesized expression with only a single expression just returns the value
of that expression.

    var add = \x y -> x + y;
    
    var add10 = (add, 10);
    add10(3); // 13
    add10("abc"); "10abc";

Select unary, binary, and ternary operators can also be converted to regular functions
using the curry syntax:

    var binary = \op x y -> op(x, y);
    
    var add = (binary, (+));
    add(2, 5); // 7

Logical and conditional expressions may be converted but the converted form
will eagerly evaluate all arguments.

    var args = \args(...) -> args;
    var foldl = \f z x -> Array.prototype.reduce.call(x, f, z);
    
    // Function that sums its arguments
    var add = args \> (foldl, (+), 0);
    add(); // 0;
    add(3); // 3
    add(3, 10, 5); // 18

The `this` binding of a function cannot be changed using the curry operator.
Use `Function.prototype.bind` for this.

## Composition Operator 
The `\>` and `\>>` operators composes two functions into a new function. Using
the `\>` operator, the resulting function takes a single argument while the result
of the `\>>` takes an arbitrary number of arguments.

    var (\>) = \f, g -> \x -> g(f(x));

    var (\>>) = \g, g -> \args(...) -> g(f.apply(null, args));

Both compose functions like F#'s `>>` operator but the opposite of Haskell's `.`.

The composition operators are left associative and have lower precedence than
the conditional expression. They two compose operators have the same precedence,
and also have the same precedence as the reverse composition operators.
It has higher precedence than the pipe operator.

    var f = \x -> x + 10,
        g = \x -> x / 2;
    
    (g \> f)(4); // 12
    (f \> g)(4); // 7
    (g \> g \> f)(4); // (g \> (g \> f))(4) // 11
    (g \> f \> f)(4); // 22
    
    // Will evaluate all unary, new, member, and call expressions before composing
    var o = {'f': f, 'g': g};
    
    (o.g \> o.f)(5); // 11

## Reverse Composition Operator
The `<\` and `<<\` operators behave the same as the corresponding regular
composition operators with their arguments flipped:

    var (<\) = \f, g -> \x -> f(g(x));

    var (<\) = \g, g -> \args(...) -> f(g.apply(null, args));

They are right associative. All composition operators have the same precedence:

    var f = \x -> x + 10,
        g = \x -> x / 2;
    
    (f <\ g)(10); // 15

    (f <\ f <\ g)(10); // (f <\ (f <\ g))(10); // 25
    
    (f <\ g \> f)(10); // ((f <\ g) \> f)(10); // 25

    (f \> g <\ f)(10); // ((f \> g) <\ f)(10); // g(f(f(10))) // 15

## Pipe Operator
The `|>` operator applies a function on the right to input on the left.

    var (|>) = \x, f -> f(x);

The `|>` is left associative and has lower precedence than the conditional and
compose expressions.

The pipe operator is useful for chaining multiple functions together in a more
readable way.

    var f = \x -> x + 10,
        g = \x -> x / 2;
    
    // Basic
    10 |> g; // 5
    
    // Lower precedence than other binary ops
    6 + 10 |> g; // (6 + 10) |> g; // 8
    
    // Left associative
    10 |> f |> g; // (10 |> f) |> g; // 10
    
    // Lower precedence than compose
    10 |> g \> f; // 10 |> (g \> f) // 15
    
    // Higher precedence than logical ops
    (0 |> g) ? 10 |> f : 5 |> f // (0 |> g) ? (10 |> f) : (5 |> f); // 15

## Reverse Pipe Operator
The `<|` operator behaves the same as the pipe operator with its arguments flipped:

    var (<|) = \f, x -> f(x);

This is the same as a normal function call, but the reverse pipe operator allows
the parenthesis to be removed, which may be clearer in certain situations.

The reverse pipe is right associative and has equal precedence as the regular pipe operator:

    var f = \x -> x + 10,
        g = \x -> x / 2;

    g |> 10; // 5

    f |> g |> 10; // g |> (g |> 10); // f(g(10)); // 15

    f <| 10 |> g; // g(f(10)); // 10  


## Modified ##

# Restrict Assignment and Delete Expressions
Assignment is generally dangerous and allowing arbitrary assignments in expressions
can make code difficult to reason about. However, without fundamental changes to
the entire language, we need assignment. Therefore, Khepri restricts assignment
and deletion to top level statements. The left hand side of assignment and delete
expressions must be either an identifier or a member expression.

In a statement, any expression may either be a normal expression or either an
assignment or delete expression:

    var a = {'x': 4};
    a.x = 34; // valid since used as statement
    a = {}; // also valid
    if (a = {}) {} // also valid
    b = a = 4; // error, assignment used in expression
    3 = 4; // error, as lhs not identifier or member expression

### Switch Default Clause
The default clause in a switch statement remains optional, but must be the last
clause in the switch statement.

### Object Literal Keys
Like JSON, object literal keys must be strings. ECMAScript normally allows
number and identifier key values as well.

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
before use and that global variables are explicitly listed before use. Khepri
also disallows symbol redefinition. The concept of an immutable binding is
added for values that cannot be directly assigned. All bindings except those
from variable declarations are immutable.

Three elements introduce new a new scope: the program, the function body, and
the block statement. Variables are only valid inside the scope in which they are declared
as well as any enclosed scopes. A variable with the same name as one in an
outer scope hides the outer bindings.

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

Similarly, duplicate parameter names and let bindings in the same scope are disallowed:

    \x, y, x -> x + y; // error, x defined twice.
    
    let x = 3, y = x + 10, x = y - 3 in x; // error, x defined twice.

Only variables from variable declarations has mutable bindings, meaning they can
be reassigned. Those from static declarations, catch clauses, function parameters,
and let bindings are immutable cannot be reassigned.

    var a = 4;
    a = 10; // ok;
    
    static g;
    g = 323; // Error, g is immutable
    
    var f = \x -> { var x = 3; return x + 1; }; // error, x is immutable in scope
    var f = \x -> { { var x = 3; return x + 1; } }; // ok, new scope 

Globals can used by declaring them with the 'static' keyword. 'static' is
already a reserved work in ECMAScript 5.1. By default, builtin object globals
are already declared, but this does not include any DOM objects.
'static' only suppresses checks on the global variables, it does not effect the 
behavior of the program. 

    static define; // tell the interpreter to expect a global called 'define'
    define([], function() {
        var props = {'x': {'value': 3}};
        return Object.keys({}, props); // 'Object' builtin ok even without explicit static.
    });

Use of a global can also be restricted to a block. This may help make intent
clearer but does not change the meaning of the actual program

    var a = \x -> {
        static $;
        return $('<div></div>');
    };

### Numeric Literals with Leading Decimals
All numeric literals must begin with a digit. Literals like `.5` that are valid numbers in 
ECMAScript are not supported.


## Removed ##

### Function Declarations
Function declarations are not necessary. Use function expressions instead.

### Object Literal getters and setter syntax
The `get` and `set` syntax in object literals is not supported.
`Object.defineProperty` should be used instead.

### Sequence Expressions
Comma separated sequences of expressions are not allowed. An expressions must be 
a single expression. The syntax is reused for curry expressions.

### ECMAScript style With Statement
ECMAScript style `with (OBJECT) BODY` expressions are not supported. The `with`
statement has been repurposed to behave like a statement level let binding.

### Labeled Statements
Make language more ambiguous.

### Semicolon Insertion and Significant Whitespace
Semicolon insertion is not supported and whitespace is no longer significant.
Real semicolons must always be used.

    // Khepri will ignore whitespace and not insert semicolons
    var z = \x, y -> {
        return
        
                 x + y;
    };
    var z = function(x, y) { return x + y; };

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


# Code
Khepri is written in Javascript / Khepri.

For now, both the .js and .kep versions of source code will be kept in 'lib/',
but only Khepri sources will be developed and Javascript files will be
generated from it.


[parsejs]: https://github.com/mattbierner/parse.js
[ecma51]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
[nu]: http://mattbierner.github.io/nu/
[ecmaunparse]: https://github.com/mattbierner/ecma-unparse
[ecmaast]: https://github.com/mattbierner/ecma-ast
[khepriast]: https://github.com/mattbierner/khepri-ast
