# Mixtape

[![Build Status](https://travis-ci.org/legaard/mixtape.svg?branch=master)](https://travis-ci.org/legaard/mixtape)
[![Coverage Status](https://coveralls.io/repos/github/legaard/mixtape/badge.svg?branch=master)](https://coveralls.io/github/legaard/mixtape?branch=master)
[![npm](https://img.shields.io/npm/v/@mixtape/core.svg)](https://www.npmjs.com/package/@mixtape/core)
[![npm](https://img.shields.io/npm/dm/@mixtape/core)](https://www.npmjs.com/package/@mixtape/core)
[![David](https://img.shields.io/david/legaard/mixtape.svg)](https://david-dm.org/legaard/mixtape)
[![David](https://img.shields.io/david/dev/legaard/mixtape.svg)](https://david-dm.org/legaard/mixtape?type=dev)
[![license](https://img.shields.io/npm/l/@mixtape/core.svg)](https://github.com/legaard/mixtape/blob/master/LICENSE.md)

A _fixture library_, written in [TypeScript](http://typescriptlang.org), for organizing and generating random test data for JavaScript/Node.js applications. Using this library should make it easy to arrange and maintain tests.

This library is heavily inspired by the C# library [AutoFixture](https://github.com/AutoFixture/AutoFixture).

## Table of Contents

* [Installation](#installation)
* [Getting Started](#getting-started)
  * [Templates and Injectors](#templates-and-injectors)
  * [Creating Builders](#creating-builders)
  * [Bundle Builders Using Extensions](#bundle-builders-using-extensions)
  * [Freeze Properties](#freeze-properties)
  * [Custom Objects](#custom-objects)
* [Documentation](https://github.com/legaard/mixtape/wiki/Documentation)
* [Change log](https://github.com/legaard/mixtape/blob/master/CHANGELOG.md)

## Installation 💾

Install the library with `npm`

```bash
npm install --save-dev @mixtape/core
```

or with `yarn`

```bash
yarn add --dev @mixtape/core
```

## Getting Started 🚀

### Templates and Injectors

The fastest way to get started with Mixtape is to create an _injector_ (with a [`Fixture`](https://github.com/legaard/mixtape/wiki/The-Fixture-Class) constructor function), use the injector to provide the fixture in the tests and make a _template_ as a blueprint for generating test data. Here is an example:

```js
const { Fixture, createInjector } = require('@mixtape/core');

const withFixture = createInjector(() => new Fixture());

test('test template with Mixtape', withFixture(fixture => {
    const heroTemplate = {
        name: 'string',
        powers: ['string'],
        age: 'number',
        hasSecretIdentity: 'boolean',
        origin: {
            planet: 'string',
            parents: 'undefined'
        }
    }

    const randomHero = fixture.from(heroTemplate).create();

    expect(typeof randomHero.name).toBe('string');
    expect(randomHero.powers instanceof Array).toBeTruthy();
    expect(typeof randomHero.age).toBe('number');
    expect(typeof randomHero.hasSecretIdentity).toBe('boolean');
    expect(typeof randomHero.origin).toBe('object');
    expect(typeof randomHero.origin.planet).toBe('string');
    expect(randomHero.origin.parents).toBeUndefined();
}));
```

> ℹ️ For injector functions: Additional arguments from the testing framework is passed after the fixture object, e.g. `withFixture((fixture, ...args) => {})`.

### Creating Builders

To make things easier to maintain and to keep the tests [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), builders can be used instead of templates. A builder can be created and added to the `extensions` property of the `Fixture` object like this:

```js
const { Fixture, Builder } = require('@mixtape/core');

class SuperHeroBuilder extends Builder {
    constructor() {
        // Name of the type that the builder can create
        super('SuperHero');
    }

    /**
     * The `context` (a subset of Fixture methods) can be use to create other types inside the builder
     * Using the `context` to generate data is needed for methods like ´freeze()´ to work
     */
    build(context) {
        return {
            name: context.create('string'),
            powers: context.createMany('string', 3),
            age: context.create('number'),
            hasSecretIdentity: context.create('boolean')
        }
    }
}

const fixture = new Fixture();
fixture.extensions.add(new SuperHeroBuilder());

const randomHero = fixture.create('SuperHero');

/**
 * Value of randomHero
 * {
        name: 'a716b96b-3ede-4cca-8f5a-07629a3d9e2b',
        powers: [
            'f12183b5-08d9-4948-8259-46b6342a630d',
            'b271e647-2eae-4629-826f-22987df5d349',
            'e59af318-56a3-4b26-a8ff-6f0dbd1704d1'
        ],
        age: 117,
        hasSecretIdentity: true
    }
 */
```

> ℹ️ Instead of using strings to denote primitive types an object (`PrimitiveType`) is also available with these types. Then creating primitive types looks likes this `fixture.create(PrimitiveType.string)`.

> In ES5 a similar builder looks like this:
>
>```js
>var SuperHeroBuilder = {
>    type: 'SuperHero',
>    build: function(context) {
>        return {
>            name: context.create('string'),
>            powers: context.createMany('string', 3),
>            age: context.create('number'),
>            hasSecretIdentity: context.create('boolean')
>        }
>    }
>}
>```

When a builder has been added to a `Fixture` then it can be used by other builders (or in templates). Maybe - building on the hero example - the _age_ of a superhero should meet a certain criteria, i.e. value must be between 18 and 99.

```js
const { Fixture, Builder, NumberGenerator } = require('@mixtape/core');

class SuperHeroBuilder extends Builder {
    constructor() {
        super('SuperHero');
    }

    build(context) {
        return {
            name: context.create('string'),
            powers: context.createMany('string', 3),
            age: context.create('HeroAge'),
            hasSecretIdentity: context.create('boolean')
        }
    }
}

class SuperHeroAgeBuilder extends Builder {
    constructor() {
        super('HeroAge');
        // Use a random number generator to control the age
        this.generator = new NumberGenerator(18, 99);
    }

    build() {
        return this.generator.generate();
    }
}

fixture.extensions.add(new SuperHeroBuilder());
fixture.extensions.add(new SuperHeroAgeBuilder());

const randomHero = fixture.create('SuperHero');

/**
 * Value of randomHero
 * {
        name: '66cbacff-2e85-4403-a986-2337a28520ca',
        powers: [
            '4e1bab7b-2548-4fbc-9f80-e9c4f747317d',
            '687fa7f2-250e-40fa-a561-c2ad52d91c82',
            '3fb8e2e9-d715-4b9e-a6f2-3f6986ac0229'
        ],
        age: 88,
        hasSecretIdentity: true
    }
  */
```

This ensures that all generated heroes will have an age between 18 and 99.

### Bundle Builders Using Extensions

Now that we have two builders it would be a good idea to bundle them in an `Extension` like this

```js
const superHeroExtension = new Extension();
superHeroExtension.add(new SuperHeroBuilder());
superHeroExtension.add(new SuperHeroAgeBuilder());

// Now add it to a fixture like this
const fixture = new Fixture();
fixture.extend(superHeroExtension);

// or use it in the creation of an injector like this
const withHeroFixture = createInjector(() => new Fixture().extend(superHeroExtension));
```

This makes it easy to group related builders and easily add them to Fixtures as needed.

### Freeze Properties

In some test cases a number of objects need to have the same value for a specific property; this can be achieved by calling [`freeze()`](https://github.com/legaard/mixtape/wiki/The-Fixture-Class#freeze) on the `Fixture`. In this case a random sized array of heroes with same age can be created like this:

```js
fixture.freeze('HeroAge');
const heroesWithSameAge = fixture.createMany('SuperHero');

/**
 * Value of heroesWithSameAge
 * [
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
 */
```

> ℹ️ If the property - in our case `age` - needs to have a specific value then the method [`use()`](https://github.com/legaard/mixtape/wiki/The-Fixture-Class#use) can be utilized instead. Also, the method [`reset()`](https://github.com/legaard/mixtape/wiki/The-Fixture-Class#reset) can be used to clear all frozen values and values defined via `use()`.

### Custom Objects

In other test cases a custom build object is needed and for this [`build()`](https://github.com/legaard/mixtape/wiki/The-Fixture-Class#build) can be called on the `Fixture`.

```js
const customHero = fixture
    .build('SuperHero')
    .with('name', () => 'Wolverine')
    .with('powers', p => ['healing', 'endurance', ...p])
    .without('hasSecretIdentity')
    .create();

/**
 * Value of customHero
 * {
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
 */
```

> ℹ️ Accessing a nested property is not possible using `with()`/`without()`. A way around this is to use [`do()`](https://github.com/legaard/mixtape/wiki/The-Fixture-Class#do) instead. For instance `fixture.build('type').do(t => t.nestedObject.value = 'newValue')`.

## Documentation 📄

More details about this library can be found in the documentation [here](https://github.com/legaard/mixtape/wiki/Documentation).
