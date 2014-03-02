# Khepri
ECMAScript derived programming language

### About
Khepri is an ECMAScript derived programming language that tweaks
ECMAScript and introduces new features to make the language more concise 
and consistent. Khepri compiles to plain old Javascript and does not require
any runtime libraries and Khepri and Javascript can also be freely mixed in a
project.

Unlike most other *script languages, Khepri's goal is not to replace Javascript
by introducing new heavy weight language features, but to make writing Javascript
more fun, with a focus on functional style programming. 

### Links
* [Documentation][documentation]


## Overview
See documentation for details:

```
/* Functions
  ----------------------*/
// lambda single argument
\x -> x + 3;

// lambda multiple arguments, commas are optional
\x y -> x + y;
\x, y -> x + y;

// lambda with function body
\x y -> {
    var z = x + 10;
    return z + y;
};

// Named function
function f \x -> ?x < 10 :f x + 1 :x;

// Named Args access
var f = \args(...) -> args.length;

// Fat Arrow This Unpacks
\x =self-> self.z + x;


// Function Application
f 10; f(10);     // single arg
f(10, 20);       // multiple args
f 1 2 3;         // f(1)(2)(3) 

// Binding
f@10; f@(10);   // single argument bind
f@(10, 20);     // multiple argument bind

/* Unpacks
  ----------------------*/
// Unpack values from array
var sum = \[x y] -> x + y;
sum [1, 2];  // 3, note application

// Unpack values from object
var swapAB =  \{a b} -> ({'a': b, 'b': a});
swapAB {'a': 3, 'b': 5};   // {'a': 5, 'b': 3};

// Nesting unpacks
var dot2 = \[[a b] [x y]] -> a * x + b * y;
dot2 [[1, 2], [3, 4]];   // 11

// As unpacks
var dup = \arr#[x ...] -> [x, arr];
dup [1, [2]];    // [1, [1, [2]]]; 

/* Lexical Scope
  ----------------------*/
var x = 10;
{
    var x;
    x = 20;
}
x; // 10

/* Let Expression
  ----------------------*/
// Simple
4 * let a = 2 in a + 3; // 20
 
// With unpacks
let
    o#{x, y} = {'a': 3, 'x': 6, 'z': 5, 'y': 8},
    [first] = [1, 2, 3]
in
    first + y + x + o.a; // 18
 
/* Packages
  ----------------------*/
// Exports
package (min max) {
    min = \x y -> ?x < y :x :y;
    max = \x y -> ?x < y :y :x;
}

// imports using unpacks
package ()
with
    import 'math' math#{min max}
in {
    min(max(3, 7), 4);
}

/* New Operators
  ----------------------*/
// Pipe
10 |> f;   //   f(10);

// Reverse Pipe
f <| 10;   //   f(10);

// Compose
f \> g;     //    \x -> g(f(x))

// Reverse Compose
f <\ g;     //    \x -> f(g(x))

/* Other Important Changes
  ----------------------*/
// Operator to function
(+);

// Conditional
min = \x y -> ?x < y :x :y;

// Computed Member Access
a.(1 + x * 4);

// Unary plus and minus
++x; --x;

// Removed compound assign and inc/dec ops
x = x + 1;
```

## Using Khepri

### Install

    $ npm install -g khepri

### Compiling

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

# Compile stdin to stdout
$ echo "\x->x;" | khepri

# Watch files for changes and compile to outdir.
# If in_file is a directory, watch all *.kep files in the directory.
$ khepri -w lib/ -o dist/
```


### Clone From Git and use AMD
    git clone https://github.com/mattbierner/khepri khepri
    cd khepri
    git submodule update --init


## Code
Khepri is written in Javascript / Khepri.
Node files are generated into `dist_node`. Amd files in `dist`

[documentation]: https://github.com/mattbierner/khepri/wiki
[parsejs]: https://github.com/mattbierner/parse.js
[ecma51]: http://www.ecma-international.org/publications/standards/Ecma-262.htm
[nu]: http://mattbierner.github.io/nu/
[ecmaunparse]: https://github.com/mattbierner/ecma-unparse
[ecmaast]: https://github.com/mattbierner/ecma-ast
[khepriast]: https://github.com/mattbierner/khepri-ast
