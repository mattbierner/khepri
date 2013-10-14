# ChangeLog #

## 0.3.0 - October 11, 2013
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