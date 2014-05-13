---
layout: base
---

# About
Khepri is a programming language that reworks ECMAScript to be better for untyped
functional-style programming. Khepri makes ECMAScript's syntax more concise and expressive,
with support for [lambdas](https://github.com/mattbierner/khepri/wiki/functions),
[unpacks](https://github.com/mattbierner/khepri/wiki/unpack-patterns),
and [user defined infix and prefix operators](https://github.com/mattbierner/khepri/wiki/User-Defined-Operators).

Khepri also makes it easy to perform operations like
[function composition](https://github.com/mattbierner/khepri/wiki/Symbols-and-Operators#-and----forward-composition-operator),
[partial application](https://github.com/mattbierner/khepri/wiki/Symbols-and-Operators#---partial-application-operator),
[binding variables in expressions](https://github.com/mattbierner/khepri/wiki/let-expression),
and using [operators as functions](https://github.com/mattbierner/khepri/wiki/operator-to-function),
all with minimal performance overhead.

```javascript
// Khepri function that sums elements of an input array and divides result by 2
var sum := foldl@((+), 0) \> (_ / 2);
sum [1, 2, 3, 4];

// VS ECMAScript to do the same
var sum = function(x) {
    return foldl(function(a, b) { return a + b; }, 0, x) / 2;
};
sum([1, 2, 3, 4]);
```

Unlike many other *script languages, Khepri's goal is not to replace Javascript
by introducing new heavy weight language features, but rather to rework ECMAScript's
syntax to be more flexible and expressive, while also helping programmers write
safer code that can be better optimized.

Khepri compiles to plain old Javascript and does not require any runtime
libraries. Khepri and Javascript can also be freely mixed in a project.

# Overview
Tiny lazy annotated stream library in Khepri.

```javascript
 // Declare a package and some exports
package (stream cons first rest forEach foldl reverse toArray from (+<))
{
// Declare some immutable bindings.
// These are only visible in the package.
var NIL := null;

// Using Khepri's lambda syntax.
// Lambda functions can be inlined by the compiler.
var flip := \f -> \x y -> f(y, x);

var constant := \x -> \ -> x;

// Export a symbol.
// This assignment marks `stream` as the export and declares that this is
// the final value of `stream`.
// Uses Khepri lambda syntax for a lambda returning object literal.
stream := \val f -> ({'first': val, 'rest': f});

// Function application without parens in `constant`
cons := \val s -> stream(val, constant s);

// Khepri's prefix and infix user defined operators can be used
// almost anywhere an identifier symbol can. They are lexically
// scoped as well, and you can even redefine builtin operators locally.
(+<) := cons;

// Convert an operator to a function and bind an argument
var isEmpty := (=== NIL);

// Unpacks parameters in lambda
first = \{first} -> first;
rest = \{rest} -> rest();

// Lambda with function block body
forEach = \f s -> {
    for (var head = s; !isEmpty head; head = rest head)
       f <| first head; // reverse pipe
};

foldl = \f z s -> {
    var r = s;
    forEach(\x -> { r = f(r, x); }, s);
    return r;
};

// Partial application
reverse = foldl@(flip cons, NIL);

toArray = foldl@([].concat.bind([]), []);

// Let Expression to bind a value in an expression
from = let
    // Recursive binding using `:=`
    fromImpl := \arr i len ->
        // Conditional expression
        ? i >= len
            :NIL
            :stream(
                arr.(i), // Get computed member i
                fromImpl@(arr, i + 1, len))
in
    // Unpacking with as pattern.
    \arr#{length} ->
        fromImpl(arr, 0, length);
}
```

Using the stream library in another file

```javascript
package ()
with
    // Import the stream library and unpack some symbols.
    // We can now use our custom cons infix operator.
    import 'stream' stream#{(+<) foldl reverse}
in {
    // Declare global.
    // Khepri is lexically scoped and vars must be defined before use
    static console;
    
    var s = stream.from [2, 3, 4];
    
    // pipelining
    1 +< s // using our custom cons operator
        |> reverse
        |> foldl@((/), 120) // create function from operator
        |> console.log; // prints 5
}
```

## Using Khepri

### Install

```
$ npm install -g khepri
```

### Compile
See [the wiki](https://github.com/mattbierner/khepri/wiki/compiler) for more complete
compiler documentation.

```
# Compile file to stdout
$ khepri file.kep

# Get help
$ khepri --help

# Compile file to output file
$ khepri file.kep -o build/file.js

# Generate node package code in output
$ khepri file.kep -o build/file.js --package_manager=node

# Compile all *.kep files in a directory to an output directory
$ khepri lib -o dist
```

