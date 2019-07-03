# Change log

## 1.2.0

* Fixed bug where `undefined` would be returned (instead of throwing exception) when trying to build an unknown type
* Created builder decorator to provide better error messages for self-referencing builders
* Improved type inference by adding conditional typing to data generated via templates

## 1.1.0

* Added support for merging of extensions, e.g. `const combinedExtension = domainExtension.merge(persistenceExtenion);`

## 1.0.0

* First stable release of Mixtape
