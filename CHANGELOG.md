# ChangeLog #

## 1.2.1 - Sep 25, 2014
* Fixed bug where compiler would inline indirect recursive calls forever.

## 1.2.1 - Sep 23, 2014
* Fixed immutable assignments in chained assignment statements not propagating
  immutablity correctly, and therefore not taking full advantage of constant propagating.
* Relaxed some restrictions on working binding prop.

## 1.2.0 - Sep 22, 2014
* Support for identifier alias exports.
** `package (x # alias) { ... }`
* Support for with and try body lambdas.
** `\x -> try { ... } catch (e) { ... } finally { ... }`
** `\x -> with import 'x' x in { ... }`
* Restricted bindings so that they may only be marked immutable if they have
  not previously been mutated in any enclosed scope.
* Better performance of slice unpacks.
** For inlined functions with know args targets, results in no call overhead.
* Added `<<|` and `|>>` to apply a function to an array of args.
** `var (<<|) = \f args -> f.apply(null, args);`
** `var (|>>) = \args f -> f.apply(null, args);`
* Fixed bug where lambdas in loops did not properly capture closure values.
* Removed Python watcher.
** Always use `-w` on main Khepri executable.

## 1.1.3 - Sep 9, 2014
* Fixed potential call stack issue for large programs.

## 1.1.2 - Sep 9, 2014
* Fixed `??` lexed as puctuator instead of operator.
* Fixed `(??, 1)` needing comma.

## 1.1.0 - Sep 8, 2014
* Added the checked operator `??`:
** Pseudo code is: `var (??) := \o f -> o && f o;`
** Allows writing safe member accessors: `o??.x`
** RHS lazily evaluated.
* Added support for generalized dot expressions
** These are unary functions that operate on a object: `.x` is `\o -> o.x`
** Dot expressions may contain any call or accessor: `.x.f(1 + 2).(computed)`
** Can be used almost anywhere: `.type \> (=== 'x')`
* Added support for checked object and array patterns `\?{x b}`.
** Ensures that base is a valid object before evaluating all child elements.
** All sub patterns of a checked pattern are implicitly checked.

## 1.0.7 - July 31, 2014
* Fixed new operator not included as standard language builtin.

## 1.0.6 - July 30, 2014
* Fixed compiler generating bad ASTs due to failure to update to use latest
  Khepri-ast API.

## 1.0.5 - June 15, 2014
* Fixed operators with `?` not generating correct names.
* Fixed not erroring on reassignment of built-in immutable ops.
** Local hiding of built-in ops  ok

## 1.0.3 - May 13, 2014
* Fixed infix ops like `->-` that include punctuators.

## 1.0.2 - May 13, 2014
* Fixed negated equality ops.

## 1.0.1 - May 12, 2014
* Fixed identifier operators like `instanceof` being undefined.

## 1.0.0 - May 10, 2014
* Fixed op to function of `void`.
* Added support for custom prefix unary and infix binary operators
** Can be used in variable declarations, package exports, and unpacks.
** Operators inherit precedence from their prefix op `1 +? 2 *> 3` is `(1 +? (2 *> 3));`
* Changed argument unpack syntax to require a prefixed `-`. `\-args(x ...)-> ...`
** Allows the parser to produce better error messages and support operators in the
  parameter list `\(+) -> 1 + 2;`
* Removed the not very useful unary operator curry syntax.
* Allow a curried binary operator to omit the comma for the argument in most cases.
** The two exceptions being `(new, x)` and `(., x)`;

## 0.24.8 - April 19, 2014
* When compiling a file, compiler error messages display the file
  name where the error occurred. Useful when compiling multiple files in a dir.
* Better error message for undefined var.

## 0.24.7 - April 19, 2014
* Fixed many issues with renaming of unpacked values, causing errors when inlined.
** Fixed arguments and self unpacks not renamed.
** Fixed slice unpack of arguments unpack not renamed.
* Better code generation when using import patterns.
** Will prune unused values unpacked from an import.
* Fixed inling issue where locals were not updated correctly after multiple passes
  inling, so they were renamed incorrectly.

## 0.24.6 - April 19, 2014
* Restored limited pruning of bindings in inline stage so curry expressions are
  better inlined.
* Prune arguments binding if unused.

## 0.24.5 - April 17, 2014
* Fixed bug with inline that could cause non local ids to get renamed when
  function is inlined into a non local context.
* Restored accidentally commented out reachable pass.

## 0.24.4 - April 17, 2014
* Fixed inline of compose with mutable capture

## 0.24.3 - April 16, 2014
* Revert to count assignment in reachability.

## 0.24.2 - April 16, 2014
* Fixed `var f := \-> let y -> y;` with local bindings being inlined incorrectly.
* Improved inlining for fns like `var f := \x -> \y -> x + y;  f 1 2;` to
  output `3`;

## 0.24.1 - April 16, 2014
* Fixed bug that could cause the arguments unpack of an inlined function to be
  pruned.
* Improvements to constant folding of non-immutable bindings.

## 0.24.0 - April 15, 2014
* Assignment expressions not counted in reachability.
* `delete` may only be used on member expressions and not identifiers.
* Calls to lambdas that use the arguments object can be inlined.

## 0.23.1 - April 13, 2014
* Compiler ~2x faster.

## 0.23.0 - April 10, 2014
* Non Computed member Access operator to function `var f := (.abc); f {'abc': 1}; // 1`
* Added support for marking previously mutable binding immutable with `:=`.
** Can be used for declarations and package exports.
** Must take place in same scope as declaration.
* Better generated code when an argument to an inlined function is not provided,
  so it evaluates to undefined.
** `var f := \x -> x.x; f();` will output `undefined.x;`
* Object literal keys may be identifiers or numbers.

## 0.22.1 - April 8, 2014
* Restored support for ellipsis pattern without id.

## 0.22.0 - April 8, 2014
* Added slice unpack support
** Can be used in array unpacks and arguments unpacks.
** `var rest := \x ...xs -> xs`;
* Allow lambda to be ended by `�` to denote end of body.

## 0.21.15 - April 7, 2014
* Fixed reading from STDIN and writing to a file.

## 0.21.14 - April 7, 2014
* Fixed amd package generation for imports.

## 0.21.13 - April 7, 2014
* Globals pruned if inlining makes them unreachable.
** `(+, 1);` generates `\y -> y + 1` with no `_add`
** While `(+)` generates `var __add = \x y -> x + y; __add;`
* Fixed potentially incorrect normalization of let bindings with a let expression
  value.
* Unused declarators without inits can also be pruned.

## 0.21.12 - April 6, 2014
* Basic unreachable binding pruning.
** Compose now should have same overhead as a `compose` function in the worst case,
  but multi composes can be optimized to a single set of potentially inlined function calls.
* Unused variable elimination.

## 0.21.10 - April 1, 2014
* Fixed inlining of recursive curry with multiple args.

## 0.21.9 - March 31, 2014
* Better generated bindings when inlinig constants.
* Const string member access inlinining.
* Allow recursive bindings to be inlined.
** Recursive inline expansion fix (instead of just disallowing) to a fixed depth.

## 0.21.8 - March 28, 2014
* Inlining renaming fixes.

## 0.21.7 - March 28, 2014
* Fix for inling with too few args crashing compiler.
* Fixed logical ops not registering aliased names and generating invalid code.

## 0.21.6 - March 28, 2014
* Generated code creates only a single definition for each operator converted to
  a function instead of an new function where ever the op appears.
** Inlining may then expand these.
* Improvements to inlining.

## 0.21.4 - March 27, 2014
* Fixed potentially incorrect inlining of named functions.
* Better generated code for call of curried expression.
* Fixed incorrect AMD code generated when using Sink imports as targets of imports.
* Slightly better code generated for compose expressions.
* Fixed inlined curried expression potentially not capturing value of immutable
  binding, but instead using regular uncaptured identifier that can changed values.

## 0.21.3 - March 27, 2014
* Fixed AMD packages using global `require` instead of string `'require'` for imports.
* Improvements to constant folding.
* Fixed curry of function expression inlining potentially discarding arguments.

## 0.21.2 - March 25, 2014
* Fix for using `require` as an variable potentially breaking imports.

## 0.21.1 - March 24, 2014
* Fixed stack issue for large files.

## 0.21.0 - March 24, 2014
* Allow operator binary `new` and `@` operators to be converted to functions.
* Added flipped binary operator to function syntax. `(_/, 10)`.

## 0.20.2 - March 23, 2014
* Fixed static declarations potentially being renamed.
* Optimized call of curry `f @ 1 @ 2 3` to generate `f(1, 2, 3)`. This pattern is
  useful if you want to omit parentheses when calling a multi argument function.

## 0.20.1 - March 21, 2014
* Fixed programs and packages not introducing a new scope, leading to potential
  name conflicts with globals.
* Fixed node packages silently discarding non import bindings.

## 0.20.0 - March 20, 2014
* Changed composed associativity to match the order the functions are evaluated in.
* Fixed forms `f (+)` and `f @ (+)`.

## 0.19.2 - March 20, 2014
* Compiling input files will prefix an auto gen header by default.

## 0.19.1 - March 19, 2014
* Fixed call stack for large programs
* Locked khepri_parse and khepri_compile to specific versions.

## 0.19.0 - March 19, 2014
* All pipes and compose operators can be converted to functions `(<|), (\>>), ...`.
* Dot operator `(.)` can be converted to function for computed member access.
* new expressions can be used without parens: `new Parser\...->...`.
* Left hand side of assignment expression to be chained: `x = y = 3` as
  long as the lhs or each expressions is a reference expression.
* Improved error messaging and performance.

## 0.18.1 - March 5, 2014
* Fixed new lines not being printed in log info.

## 0.18.0 - March 4, 2014
* Added package export aliases. `package ('alias': id ...)`.
* Added package module export: `package api { api = ... }`.

## 0.17.4 - March 2, 2014
* Split command line tool logic out of `bin/khepri` to own library.

## 0.17.2 - March 2, 2014
* Split compiler code into own library `khepri-compile`.

## 0.17.1 - March 2, 2014
* Added node file watcher to compiler
** Use `-w` or `--watch` flag.
** All standard options/flags will work with the watcher.

## 0.17.0 - Feb 26, 2014
* Added support for immutable, non-recursive variable declarations.
* Added back syntax `(+, 1)` to curry args on operator.

## 0.16.6 - Feb 24, 2014
* Non package programs generate 'use strict' code.
* Fixed AMD modules potentially not setting 'use strict'.

## 0.16.4 - Feb 23, 2014
* Fixed multi arg curry order.

## 0.16.3 - Feb 23, 2014
* Fixed potential conflicting argument use with curried operator expression 
  transformation.

## 0.16.1 - Feb 23, 2014
* Fixed let normalization with many args.

## 0.16.0 - Feb 23, 2014
* Added support for recursive binding using `:=` in lets and withs.

## 0.15.0 - Feb 23, 2014
* Let binding do not see their own bindings.
* A multiple binding let expression may rebind earlier bindings.
* Better generated code for forms: `(UNARY_OP)@ARG` and `(BIN_OP)@arg`.
** Expression like `(+)@1` generate `var x = 1; function(y) { return x + y; }`
* Better generated code for forms: (\ARGS -> BODY) @ CURRY_ARGS
** Note that unused args are silently discarded. `(\_ -> 1) @ f();` never evaluates
   `f()`.

## 0.14.1 - Feb 19, 2014
* Fixed constant folding of unary `++` and `--`.
* Moved scope datastructures to use hashtrie.

## 0.14.0 - Feb 19, 2014
* Allow self unpacks to contain subpatterns.

## 0.13.9 - Feb 18, 2014
* Fixed an issue with top level let to function bindings using wrong names
  in function body.
  
## 0.13.8 - Feb 18, 2014
* Improved performance of generated code for lets.

## 0.13.6 - Feb 4, 2014
* Fixed potential leaking of internal identifier names.
* Improved lex and transform code.
** Identifiers are assigned uids during lexical check instead of changing names.
** Transform maps uids to unique real identifiers.

## 0.13.5 - Feb 4, 2014
* Fixed let expression in lambda body not converting to with statement.

## 0.13.3 - Feb 3, 2014
* Split `lex` and `parse` into own package.

## 0.13.2 - Feb 3, 2014
* Fixed new expression.

## 0.13.1 - Feb 1, 2014
* Fixed curry expression with argument list.

## 0.13.0 - January 31, 2014
* Removed `TupleExpression`.
* Split `ApplicationExpression` from regular `CallExpression.`
** Application has lower precedence than curry. `f x`
** Call has same precedence as member expressions. This allows chaining of calls
  and member access. `f(1).z.w(34).g`

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
** Form is `TARGET@EXPR` where EXPR may either be a curry expression or a list
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
* Allow package managers to customize behavior of `with` imports.

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