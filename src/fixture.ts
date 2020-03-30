import { clone } from 'ramda';

import { Extension } from './extension';
import TypeComposer from './type-composer';
import { ValueGenerator } from './generators/value-generator';
import { ensure } from './utils';
import ObjectBuilder from './object-builder';

/**
 * Base fixture class.
 * @implements {FixtureContext}
 */
export class Fixture implements FixtureContext {
    private _frozenTypes: {[type: string]: any};
    private readonly _generator: ValueGenerator<number>;
    private readonly _extensions: Extension;

    /**
     * Create a new `Fixture`
     * @param generator - generator to use when generating numbers
     */
    constructor(generator: ValueGenerator<number>) {
        this._generator = generator;
        this._frozenTypes = {};
        this._extensions = new Extension();
    }

    /**
     * Get `Extension` containing all builders used for fixture
     * @returns `Extension`
     */
    get extensions(): Extension {
        return this._extensions;
    }

    /**
     * Add `Extension` to fixture
     * @param extension - extension to add
     * @returns `this`
     */
    extend(extension: Extension): this {
        this._extensions.merge(extension);

        return this;
    }

    /**
     * Add a function to use when building a certain type
     * @param type - type to register
     * @param builderFunc - function use to build type
     * @returns `this`
     */
    register<T>(type: string, builderFunc: (context: FixtureContext) => T): this {
        this._extensions.add({ type, build: builderFunc });

        return this;
    }

    /**
     * Freeze to type to ensure the same (randomly generated) value is used everytime
     * @param type - type to freeze
     * @returns `this`
     */
    freeze(type: string): this {
        if (this._frozenTypes[type]) return this;

        this._frozenTypes[type] = this.create<any>(type);

        return this;
    }

    /**
     * Set specific value to use when generating type
     * @param type - the targeted type
     * @param value - value to use for the targeted type
     * @returns `this`
     */
    use<T>(type: string, value: T): this {
        this._frozenTypes[type] = value;
        return this;
    }

    /**
     * Create single type
     * @param type - type to create
     * @returns type
     */
    create<T>(type: string): T {
        const builder = this._extensions.get<T>(type);
        ensure(() => builder !== undefined, `No builder defined for type or alias '${type}'`, ReferenceError);

        if (this._frozenTypes[type]) {
            return clone(this._frozenTypes[type]) as T;
        }

        return builder.build(this);
    }

    /**
     * Create array of a given type
     * @param type - type to create
     * @param size - size of array to create (optional)
     * @returns `Array` of types
     */
    createMany<T>(type: string, size?: number): T[] {
        const list: T[] = [];
        size = size ? size : this._generator.generate();

        for (let i = 0; i < size; i++) {
            list.push(this.create<T>(type));
        }

        return list;
    }

    /**
     * Build type with custom values
     * @param type - type to build
     * @returns `TypeComposer`
     */
    build<T extends object>(type: string): TypeComposer<T> {
        return new TypeComposer<T>(type, this, this._generator);
    }

    /**
     * Create object from a template
     * @param template - template to use when building object
     * @returns `ObjectBuilder`
     */
    from<T extends object>(template: T): ObjectBuilder<T> {
        return new ObjectBuilder<T>(template, this, this._generator);
    }

    /**
     * Reset fixture, i.e. clear frozen values
     */
    reset() {
        this._frozenTypes = {};
    }
}

/**
 * Interface for a fixture context.
 * A fixture context is usually injected into different classes/function to give easy access
 * to data creation and to ensure functionality like 'freeze' and 'use' is working.
 * @interface
 */
export interface FixtureContext {
    /**
     * Create single type
     * @param type - type to create
     * @returns type
     */
    create<T>(type: string): T;

    /**
     * Create array of a given type
     * @param type - type to create
     * @param size - size of array to create (optional)
     * @returns `Array` of types
     */
    createMany<T>(type: string, size?: number): T[];

    /**
     * Build type with custom values
     * @param type - type to build
     * @returns `TypeComposer`
     */
    build<T extends object>(type: string): TypeComposer<T>;

    /**
     * Create object from a template
     * @param template - template to use for building object
     * @returns `ObjectBuilder`
     */
    from<T extends object>(template: T): ObjectBuilder<T>;
}
