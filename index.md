---
layout: base
---

# About
Khepri is an ECMAScript derived programming language that compiles to plain old Javascript.
Focusing on functional-style programming, Khepri makes Javascript more concise, more consistent, and more fun.

Unlike many other *script languages, Khepri does not aim to replace Javascript with heavy weight language features.
Instead it adds, removes, and reworks Javascript's syntax to make the language more flexible and expressive.

# Overview
Tiny lazy annotated stream library in Khepri.

```javascript
 // Declare a package and some exports
package (stream cons first rest forEach foldl reverse toArray from)
{
// Mutable internal binding.
var NIL = null;

// Lambda function syntax
var isEmpty = \s -> s === NIL;

var constant = \x -> \() -> x;
var flip = \f -> \x y -> f(y, x);

// Export a symbol
// Lambda returning object literal
stream = \val f -> ({'first': val, 'rest': f});

// Function application without parens
cons = \val s -> stream(val, constant s);

// Unpacks in lambda
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

// Curry Operator
reverse = foldl@(flip cons, end);

// Let Expression
toArray = let builder = \p, c -> { p.push c; return p; } in
    \s -> foldl(builder, [], s);

from = let
    fromImpl = \arr i len ->
        // Conditional Expression
        ? i >= len
            :NIL
            :stream(
                arr.(i),  // Get computed member i
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
    // Import the stream library and unpack
    import 'stream' stream#{cons toArray reverse}
in {
    // Declare global.
    // Khepri is lexically scope and vars must be defined before use
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
$ npm install -g khepri`
```

### Compile

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

