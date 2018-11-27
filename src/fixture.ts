import { TypeBuilder, TypeBuilderDictionary } from './type-builder';
import Customization from './customization';
import CustomizableType from './customizable-type';
import ValueGenerator from './generators/value-generator';

export class Fixture implements FixtureContext {
    private _builders: TypeBuilderDictionary = {};
    private _frozenTypes: {[type: string]: any } = {};
    private _generator: ValueGenerator<number>;

    constructor(generator: ValueGenerator<number>) {
        this._generator = generator;
    }

    addCustomization(customization: Customization): Fixture {
        customization.builders.forEach(b => this._builders[b.typeName] = b);
        return this;
    }

    addBuilder(builder: TypeBuilder<any>): Fixture {
        this._builders[builder.typeName] = builder;
        return this;
    }

    removeBuilder(builderName: string): Fixture {
        delete this._builders[builderName];
        return this;
    }

    freeze<T>(type: string, value?: T): Fixture {
        this._frozenTypes[type] = !value ? this._builders[type].create(this) : value;
        return this;
    }

    create<T>(type: string): T {
        const builder = this._builders[type];
        
        if (!builder)
            throw new Error(`No builder defined for type '${type}'`);

        if(this._frozenTypes[type])
            return this._frozenTypes[type];
        
        return builder.create(this);
    }

    createMany<T>(type: string, size?: number): T[] {
        const list = [];
        
        if (!size)
            size = this._generator.generate();

        for(let i = 0; i < size; i++) {
            list.push(this.create<T>(type));
        }

        return list;
    }

    build<T>(type: string): CustomizableType<T> {
        return new CustomizableType<T>(type, this);
    }

    clear() {
        this._frozenTypes = {};
    }

    reset() {
        this._frozenTypes = {};
        this._builders = {};
    }
}

export interface FixtureContext {
    create<T>(type: string): T;
    createMany<T>(type: string, size?: number): T[];
    build<T>(type: string): CustomizableType<T>;
}