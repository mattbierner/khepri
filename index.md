---
layout: base
---

# About
Khepri is an ECMAScript derived programming language that compiles to plain old Javascript.
Focusing on functional-style programming, Khepri makes Javascript more concise, more consistent, and more fun.

Unlike many other *script languages, Khepri does not aim to replace Javascript with heavy weight language features.
Instead it adds, removes, and reworks Javascript's syntax to make the language more flexible and expressive.

# Overview

    // Khepri Supports all standard JS values and objects
    
    // Create a mutable binding.
    var NIL = null, 
    
    // Lambda function syntax
    var flip = \f -> \x y -> f(y, x);
    
    var stream = \val f -> ({
        'first': val,
        'rest': f
    });
    
    // Unpacks in lambda
    var first = \{first} -> first;
    var rest = \{rest} -> rest();
    
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

## Lexical Scoping
Khepri is lexically scoped and disallows declaring a variable more then once in
a block. Explicit and implicit statement blocks, as well as function bodies, introduce
new scopes. 

```
// Create a few mutable bindings
var a = 3, b;
b = 10;

// New scope
{
    b = a * 2; // b is 2 * 3 is 6
    var a = b; // hiding outer a in this scope
    a = a + 2; // a is 8
};

a * b; // is 3 * 6 is 18
```

All variables be must defined before use and global variables are disallowed.

```
var h = "hello";
var message = h + " " + w; // error, w used before declared.
var w = "world";
```

Implicit blocks also introduce a new scope, such as if or for statements without
brackets:

```
var h = "hello";
if (h)
    var w = "world";
var message = h + " " + w; // error, w used outside of implicit if block.
```

Duplicate variables in the same scope are disallowed:

```
var b = 3;
var c = b;
var b = c; // Error, b already declared.
```

Similarly, duplicate parameter names and let bindings in the same scope are disallowed:

```
\x, y, x -> x + y; // error, x defined twice.

let x = 3, y = x + 10, x = y - 3 in x; // error, x defined twice.
```

### Imutable Bindings
Only variable declarations create mutable bindings, meaning they can be reassigned.
Those from packages imports, static declarations, catch clauses, function parameters,
and let bindings are immutable cannot be reassigned.

```
var a = 4;
a = 10; // ok;

static g;
g = 323; // Error, g is immutable

var f = \x -> { var x = 3; return x + 1; }; // error, x is immutable in scope
var f = \x -> { { var x = 3; return x + 1; } }; // ok, new scope 
```

### Static for Globals
Globals can used by declaring them with the 'static' keyword. 'static' is
already a reserved work in ECMAScript 5.1. By default, builtin object globals
are already declared, but this does not include any DOM objects.
'static' only suppresses checks on the global variables, it does not effect the 
behavior of the program. 

```
static define; // tell the compiler to expect a global called 'define'
define([], function() {
    var props = {'x': {'value': 3}};
    return Object.keys({}, props); // 'Object' builtin ok even without explicit static.
});
```

Use of a global can also be restricted to a block. This may help make intent
clearer but does not change the meaning of the actual program

```
var a = \x -> {
    static $;
    return $('<div></div>');
};
```

Static variables only declare that some variable exists. They are not automatically
rewritten to point to globals.

```
var define = null;
{
    static define;
    define(); // error since this is null();
}
```



## Lambda Function Syntax

### Lambda Function Expression Syntax
Available syntaxes, along with the ECMAScript translation as last item, are shown here: 

```
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
```
    
All scoping remains the same as in the translated version.

#### Fat Arrows For this Unpacks
Khepri remove the `this` expression (`this` is still a keyword) in favor of using
explicit `this` bindings. The last element of an arguments pattern can optional be
a `this` unpack of the form `= ID_PATTERN`:

    \x =self-> self.z + x;
    function(x) { return this.z + x; };

The fat arrow ensures that you always explicitly state what `this` you are using:

    var Obj = function\ x =self-> { self.x = x; };
    Obj.prototype.getXGetter = \=self-> \() -> self.x;
    
    new Obj(3).getXGetter()(); // 3 in khepri
    
    // ECMAScript normally would be:
    var Obj = function(x) { this.x = x; };
    Obj.prototype.getXGetter = function() { return function() { return this.x; }; };
    new Obj(3).getXGetter()(); // undefined since uses `this` of inner function.
