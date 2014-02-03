# ChangeLog #

## 0.13.2 - Feb 3, 2014
* Fixed new expression.

## 0.13.1 - Feb 1, 2014
* Fixed curry expression with argument list.

## 0.13.0 - January 31, 2014
* Removed `TupleExpression`.
* Split `ApplicationExpression` from regular `CallExpression.`
** Application has lower precedence than curry. `f x`
** Call has same precedence as member expressions. This  allows chaining of calls
  and member access. `f(1)`

## 0.12.0 - January 30, 2014
* Allow `TupleExpression` as valid subexpressions. If not used in a call or curry,
  these are mapped to Javascript sequence expressions.
** Changes AST output of primary expressions.
* Fixed forms `f(+)` for operator expressions which translates to `f((+))`.
* Improved nested currying of curried expression so `f@1@2@3` generates `f.bind(null, 1, 2, 3);`

## 0.11.4 - January 29, 2014
* Added read from stdin support to compile.
* Added `--help` and `--version` flags.

## 0.11.3 - January 28, 2014
* Moved compile to `bin/khepri`

## 0.11.1 - January 28, 2014
* Fixed several issues resulting from compilation with incomplete translation.

## 0.11.0 - January 28, 2014
* New expressions must supply an argument list.
* Changed curry syntax.
** Form is `TARGET@EXPR` where expr may either be a curry expression or a list
  or arguments.
** Left associative.
** `f@1`, `f@(1,2)`
* Restricted numbers to always require digits both before and after the decimal.
* Changed computed member syntax:
** `x.(1 + 3)`
* Added unparened function application syntax:
** `f x y // f(x)(y)`
** Left associative
** Js syntax is still supported for multi argument functions `f(1, 2, 3)`
** Lower precedence then curry.
* Renamed unary plus to `++` and unary minus to `--`.

## 0.10.0 - January 26, 2014
* Changed conditional expression syntax.
** Now prefixed by `?` followed by the test then the two choices prefixed with `:`.
** This simplifies the grammar and makes it possible to use conditional
  expressions in the test without parens. `??x>3:10:4:6:7;`
* Allow package managers to customize behave of with imports.

## 0.9.0 - January 19, 2014
* Fat arrow `this` unpacks.
** `\x y =self-> self.z + x + y;`
* Removed `this` expressions.
** Always use explicit fat arrow to unpack `this`.
* Removed standard ECMAScript function syntax: `function(x) {...}`
** Use `function\ x -> {...}` instead.
* Improvements to generated code.
* Added support for generic separator for packages `::`.

## 0.8.1 - January 19, 2014
* Improvements to `watch.py`.
** Fixed double compiling.
** Auto delete files.
** Clearer output.
** Argument forwarding.
* Added experimental support for node package manager.
** Use the `--package_manager=node` flag to generate node style packages.
* Fixed function expressions discarding `"use strict"` if used with patterns.

## 0.8.0 - December 18, 2013
* Updated pattern grammar to disallow some weird forms including:
** `{'a': ...}`, `{'a': _}` for object patterns
** `a#b#c#d` and `a#...` or `a#_`. As Patterns are now
  restricted to targeting only object and array patterns.
* Updated statement grammar to restrict assignment and delete expressions
  to top level expressions.
** They are disallowed in return and throw arguments, if tests, switch tests,
  while and do while conditions, and for test expressions.
** Only expression statements and the for init and update expressions can use 
  deletion or assignment.
* Added more specific parser error messages.
* Changed lambda to capture all expressions, including compose and pipe.
* Added the `@` expression for unparenthesized function calls.
** Takes arbitrary number of arguments separated by `:`.

## 0.7.2 - December 17, 2013
* Rewrote to eliminate most AST mutation.
* Added a few peephole optimizes/rewrites.
* Divided stages better.

## 0.7.1 - December 17, 2013
* Optimized the case `return let` to not use extra function.

## 0.7.0 - December 15, 2013
* Changed pattern and package syntax to allow all commas to be omitted.
** Existing patterns are not effected.
* Changed aliased object and pattern syntax to to require the `#` symbol between
  top level aliases and the pattern, `let list#[e0, e1] =[1,2] in ...`.
* Fixed the syntax `function f(args(...)) {};` being allowed. Should always be
  `function f\args(...) -> { };` instead.
* Improved error messages for patterns.
* Allow unnamed as at the top level of object patterns: `let {x#{y}} = {} in y;`
* Fixed imports being allowed in elements like functions.

## 0.6.0 - December 9, 2013
* Added `void` back.
* Added syntax for named lambda functions with all unpacks:
    `function fun \args(x, ...) -> x`
** Hybrid of base ecmascript function expression and Khepri lambda expression.
** Syntaxes:
*** `var fun = function fun \args(x, ...) -> x`
*** `var fun = function \args(x, ...) -> x`
*** `var fun = function fun(x, ...) { return x; } // no args unpack`
*** `var fun = \args(x, ...) -> { return x; }`
*** `var fun = \args(x, ...) ->  x;`
*** `var fun = \x, ... -> x;`

## 0.5.5 - December 9, 2013
* Fixed let expressions hiding `this` values.

## 0.5.4 - November 22, 2013
* `watch.py` generate directories for files if they do not exist.
* Updated to `khepri_ast` V3
* Moved generated files to `dist`.

## 0.5.3 - November 15, 2013
* Fixed sink pattern creating empty declarations if used in unpacks.
* Update to Nu V3, Parse V16.

## 0.5.2 - November 10, 2013
* Fixed generation of package with no exports creating empty variable declaration.

## 0.5.1 - November 4, 2013
* Fixed allowing usage of mapped sink pattern internal identifiers.
* Fixed allowing usage of generated identifiers from object and array patterns.
* Fixed bug preventing use of nested object patterns.

## 0.5.0 - November 4, 2013
* Removed object literal get and setter syntax.
** Get and set are no longer keywords.
* Removed prefix decimal number support.
** All numbers must start with a digit.
* Added reversed versions of compose and pipeline operator.
* Added versions of compose and pipeline operator to support multiple args.
* Changed existing compose operator to pass a single argument.
* Removed support for all compound assignment operators.
** Also will lex to puctuator plus assignment op.
* Added `_` pattern for unused var.
** `_` is a reserved word but words can contain or begin with `_` (like other
  reserved words.)
* Removed the `void` operator.
* Delete can only be used as a top level expression.
* Removed support for multi value bracket accessor.

## 0.4.2 - October 29, 2013
* Fixed lexical transform for ids using building names.

## 0.4.1 - October 20, 2013
* Fixed bad reference on DoWhileStatement transform.

## 0.4.0 - October 17, 2013
* Added pipeline and compose operators.
* Added syntax for currying functions.
* Added ability to transform operators to functions.

## 0.3.1 - October 16, 2013
* Made the lexical requirements for packages and the with statement correct,
  stricter than they were previously.
** Package exports may not be duplicated.
** With body may not declare a variable that conflicts with any with binding.
** Package with bindings must not conflict with any package exports.
* Fixed object patterns not always working for explicit unpacks.

## 0.3.0 - October 14, 2013
* Repurposed the with statement to behave like a statement level let expression.
** With statements can also be used to import a package locally using the import
  pattern.
* Changed syntax for package imports slightly so that section after the import
  may be either a with statement or a block statement. This requires the
  addition of the `in` keyword for existing packages using the with statement.
* Fixed switch cases not being lexical checked.
* Packages may now also have circular dependencies. Packages  imported
  in a package level with statement will be loaded (or marked for loading if there
  is an circular dep), before the package body executed. At this point, top level
  packages should be assumed to be undefined until the package body completes.
  This means that they cannot be unpacked at the moment.
* Removed pase-ecma dep.

## 0.2.0 - October 11, 2013
* Let expressions can also use patterns to unpack their result.
* Generated tree uses only ECMA nodes.
* Added shorthand for unpacking values with same key as identifier in object patterns.
* Added packages syntax.
** Allows defining package exports and imports.
** Import uses object unpacking syntax.
** Currently require js is targeted but other module loaded could be used.

## 0.1.0 - July 27, 2013
* Added object and array patterns.