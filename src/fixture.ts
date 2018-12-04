import Customization from './customization';
import CustomizableType from './customizable-type';
import ValueGenerator from './generators/value-generator';

export class Fixture implements FixtureContext {
    private _frozenTypes: {[type: string]: any} = {};
    private readonly _generator: ValueGenerator<number>;
    private readonly _customizations: Customization;

    constructor(generator: ValueGenerator<number>) {
        this._generator = generator;
        this._customizations = new Customization();
    }

    get customizations(): Customization {
        return this._customizations;
    }

    customize(customization: Customization): Fixture {
        customization.builders.forEach(b => this._customizations.add(b));
        return this;
    }

    freeze(type: string): Fixture {
        this._frozenTypes[type] = this._customizations.get(type).build(this);
        return this;
    }

    use<T>(type: string, value: T): Fixture {
        this._frozenTypes[type] = value;
        return this;
    }

    create<T>(type: string): T {
        const builder = this._customizations.get(type);
        
        if (!builder)
            throw new Error(`No builder defined for type '${type}'`);

        if(this._frozenTypes[type])
            return this._frozenTypes[type];
        
        return builder.build(this);
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

    build<T extends object>(type: string): CustomizableType<T> {
        return new CustomizableType<T>(type, this);
    }

    clear() {
        this._frozenTypes = {};
    }

    reset() {
        this._customizations.clear();
        this._frozenTypes = {};
    }
}

export interface FixtureContext {
    create<T>(type: string): T;
    createMany<T>(type: string, size?: number): T[];
    build<T extends object>(type: string): CustomizableType<T>;
}