# Change log

## 2.0.0

* Frozen values are now deep cloned instead of returned by reference

## 1.3.0

* Additional arguments are now passed to the test function when using the `createInjector` function, e.g. `withFixture((fixture, ...arguments) => {})`

## 1.2.1

* Lowered the random max number of objects used for arrays from 75 to 25
* Updated decorator property on the `Extension` class to use a Symbol key instead

## 1.2.0

* Fixed bug where `undefined` would be returned (instead of throwing exception) when trying to build an unknown type
* Created builder decorator to provide better error messages for self-referencing builders
* Improved type inference by adding conditional typing to data generated via templates

## 1.1.0

* Added support for merging of extensions, e.g. `const combinedExtension = domainExtension.merge(persistenceExtension);`

## 1.0.0

* First stable release of Mixtape
