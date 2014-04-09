---
layout: base
---

# About
Khepri is a programming language that reworks ECMAScript to be better for untyped
functional-style programming. Khepri's syntax eliminates some of ECMAScript's
clutter, and makes operations like function composition, currying, and using
operators as functions easy and fast.

```javascript
// Khepri function that sums elements of an input array and divides result by 2
var sum := foldl@((+), 0) \> (_/, 2);
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
package (stream cons first rest forEach foldl reverse toArray from)
{
// Declare some immutable bindings.
// These are only visible in the package.
var NIL := null;

// Using Khepri's lambda syntax
var flip := \f -> \x y -> f(y, x);

var constant := \x -> \ -> x;

// Export a symbol.
// Uses Khepri lambda syntax for a
// lambda returning object literal.
stream = \val f -> ({'first': val, 'rest': f});

// Function application without parens
cons = \val s -> stream(val, constant s);

// Convert an operator to a function and curry it
var isEmpty := (===, NIL);

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

// Currying a function
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
    // Import the stream library and unpack some symbols
    import 'stream' stream#{cons foldl reverse}
in {
    // Declare global.
    // Khepri is lexically scoped and vars must be defined before use
    static console;
    
    var s = stream.from [2, 3, 4];
    
    // pipelining
    cons(1, s)
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

