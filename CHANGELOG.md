# ChangeLog #

## 0.7.0 - December 15, 2013
* Changed pattern and package syntax to allow all commas to be omitted.
** Existing patterns are not effected.
* Changed aliased object and pattern syntax to to require the `#` symbol between
  top level aliases and the pattern, `let list#[e0, e1] in ...`.
* Fixed the syntax `function f(args(...)) {};` being allowed. Should always be
  `function f\args(...) -> { };` instead.
* Improved error messages for patterns.
* Allow unnamed as at the top level of object patterns: `let {x#{y}} = {} in y;`
* Fixed imports being allowed in things like functions.

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