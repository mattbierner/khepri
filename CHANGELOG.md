# ChangeLog #

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