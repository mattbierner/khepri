---
layout: base
---

# About
Khepri is an ECMAScript derived programming language that compiles to plain old Javascript.
Focusing on functional-style programming, Khepri makes Javascript more concise, more consistent, and more fun.

Unlike many other *script languages, Khepri does not aim to replace Javascript with heavy weight language features.
Instead it adds, removes, and reworks Javascript's syntax

# Overview


```
// Create a mutable binding with initial value 3.
var c = 3;

// Lambda function syntax
var f = \x -> x * 10;

// Multiple argument function
\x y -> x + y;
\x, y -> x + y;

// Function with statement block

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
```

## Lexical Scoping
Khepri is lexically scoped and disallows declaring a variable more then once in
a block. Blocks are 

## Lambda Syntax

```

```