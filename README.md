# Fizzy

[![Build Status](https://travis-ci.org/legaard/fizzy.svg?branch=master)](https://travis-ci.org/legaard/fizzy)

A _fixture library_, written in TypeScript, for organizing and generating random test data for JavaScript/Node.js applications. Using this library should make it easy to arrange and maintain tests.

This library is heavily inspired by the C# library [AutoFixture](https://github.com/AutoFixture/AutoFixture).

## Table of Contents

* [Installation](#installation)
* [Quick Start](#quick-start)
* [Documentation](#documentation)
  * [The `Fixture` Class](#the-fixture-class)
    * [`fixture.customization`](#fixturecustomization)
    * [`customize()`](#customize)
    * [`create()`](#create-1)
    * [`createMany()`](#createmany)
    * [`freeze()`](#freeze)
    * [`use()`](#use)
    * [`build()`](#build-1)
    * [`reset()`](#reset)
  * [The `Builder` Class](#the-builder-class)
    * [`build()`](#build-2)
    * [`this.createAlias()`](#createalias)
  * [The `Customization` Class](#the-customization-class)
    * [`customization.builders`](#customizationbuilders)
    * [`add()`](#add)
    * [`remove()`](#remove)
    * [`get()`](#get)
    * [`clear()`](#clear)
  * [The `TypeComposer` Class](###the-typecomposer-class)
    * [`do()`](#do)
    * [`with()`](#with)
    * [`without()`](#without)
    * [`create()`](#create-2)
  * [The `PrimitiveType` Object](#the-primitivetype-object)
  * [The `ValueGenerator` Classes](#the-valuegenerator-classes)
    * [`StringGenerator`](#stringgenerator)
    * [`NumberGenerator`](#numbergenerator)

## Installation

Install the library with `npm`

```bash
npm install --save-dev fizzy
```

or with `yarn`

```bash
yarn add --dev fizzy
```

## Quick Start

The backbone of Fizzy is the user-defined builders - i.e. object constructor blueprints - for creating different types of objects. A builder can be created and added to the customizations property (see [`customize()`](####customize) to learn how to bundle builders) of the `Fixture` object like this:

```js
const { Fixture, PrimitiveType, Builder } = require('fizzy');

class SuperHeroBuilder extends Builder {
    constructor() {
        super('SuperHero');
    }

    build(context) {
        return {
            name: context.create(PrimitiveType.string),
            powers: context.createMany(PrimitiveType.string, 3),
            age: context.create(PrimitiveType.number),
            hasSecretIdentity: context.create(PrimitiveType.boolean)
        }
    }
}

const fixture = new Fixture();
fixture.customizations.add(new SuperHeroBuilder());

const randomHero = fixture.create('SuperHero');
```

In ES5 a similar builder looks like this:

```js
var SuperHeroBuilder = {
    type: 'SuperHero',
    build: function(context) {
        return {
            name: context.create(PrimitiveType.string),
            powers: context.createMany(PrimitiveType.string, 3),
            age: context.create(PrimitiveType.number),
            hasSecretIdentity: context.create(PrimitiveType.boolean)
        }
    }
}
```

The value of `randomHero` could then be:

```js
{
    name: 'a716b96b-3ede-4cca-8f5a-07629a3d9e2b',
    powers: [
        'f12183b5-08d9-4948-8259-46b6342a630d',
        'b271e647-2eae-4629-826f-22987df5d349',
        'e59af318-56a3-4b26-a8ff-6f0dbd1704d1'
    ],
    age: 117,
    hasSecretIdentity: true
}
```

When a builder has been added to a `Fixture` then it can be used by other builders. Maybe - building on the hero example - the _age_ of a superhero should meet at certain criteria, e.g. value must be between 18 and 99.

```js
class SuperHeroBuilder extends Builder {
    constructor() {
        super('SuperHero');
    }

    build(context) {
        return {
            name: context.create(PrimitiveType.string),
            powers: context.createMany(PrimitiveType.string, 3),
            age: context.create('HeroAge'),
            hasSecretIdentity: context.create(PrimitiveType.boolean)
        }
    }
}

class SuperHeroAgeBuilder extends Builder {
    constructor() {
        super('HeroAge');
        this.generator = new NumberGenerator(18, 99);
    }

    build() {
        return this.generator.generate();
    }
}

fixture.customizations.add(new SuperHeroBuilder());
fixture.customizations.add(new SuperHeroAgeBuilder());

const randomHero = fixture.create('SuperHero');
```

This ensures that all generated heroes will have an age between 18 and 99.

In some tests cases a number of objects need to have the same value for a specific property; this can be achieved by calling `freeze()` on the `Fixture`.

```js
fixture.freeze('HeroAge');

const heroesWithSameAge = fixture.createMany('SuperHero');
```

This will create a random sized array of heroes where all heroes have the same age:

```js
[
    {
        name: '7869ced3-ff7d-4e0b-9bfb-b29d5b36d980',
        powers: [
            'be8f0ec5-1281-436a-9a25-3fc78086dc91',
            '678e5e93-4bae-4b19-b75a-0b71bf43656a',
            '8f1d9dbe-e91a-4c2e-b5f5-7d4ed270546e'
        ],
        age: 37,
        hasSecretIdentity: false
    },
    {
        name: '3ed5d9e5-25c3-413c-8032-60958a731414',
        powers: [
            '77860d28-d1b2-428e-8b1a-ded618d8314d',
            '68429cda-f63e-48a3-88c5-f7b7fda6fdd7',
            '102e20df-07ef-4699-87c4-c558e5a14dc4'
        ],
        age: 37,
        hasSecretIdentity: true
    },
    {
        name: 'f8767886-e72e-42ac-9b7d-1a4a3ccbe87a',
        powers: [
            '232e377e-c6d5-461f-8f52-6b3248719839',
            'b1e45387-50de-4424-a00c-808fddb259f0',
            'e56ca196-7515-4efd-83cd-0b5812a4e859'
        ],
        age: 37,
        hasSecretIdentity: false
    }
    .
    .
    .
]
```

> If the property - in our case _age_ - needs to have a specific value then the method [`use()`](####use) can be utilized instead. Also, the method [`reset()`](####reset) can be used to clear all frozen or defined values.

In other test cases a custom build object is needed and for this `build()` can be called on the `Fixture`.

```js
const customHero = fixture
    .build('SuperHero')
    .with('name', () => 'Wolverine')
    .with('powers', p => ['healing', 'endurance', ...p])
    .without('hasSecretIdentity')
    .create();
```

Then `customHero` would look like this:

```js
{
    name: 'Wolverine',
    powers: [
        'healing',
        'endurance',
        'af537167-863c-42ca-8181-31f1fcb25115',
        '250f05b4-b0ea-45c4-b0d4-2b6efbe26172',
        '40a746c0-b361-4428-a894-86edefa61e17'
    ],
    age: 59
}
```

## Documentation

Lorem ipsum