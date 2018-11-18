import { Builder, BuilderDictionary } from './builder';
import Customization from './customization';

export default class Fixture {
    private _builders: BuilderDictionary;
    private _valueModifiers: Array<(type: any) => void>;
    private _typeToBuild;

    constructor() {
        this._builders = {};
        this._valueModifiers = [];
    }

    addCustomization(customization: Customization) {
        customization.builders.forEach(b => this._builders[b.typeName] = b);
    }

    addBuilder(builder: Builder<any>) {
        this._builders[builder.typeName] = builder;
    }

    removeBuilder(builderName: string) {
        delete this._builders[builderName];
    }

    create<T>(type: string): T {
        const builder = this._builders[type];
        
        if (!builder) return undefined;

        return builder.create(this);
    }

    build(type: string): Fixture {
        this._typeToBuild = type;
        return this;
    }

    with<T>(modification: (data: T) => void): Fixture {
        this._valueModifiers.push(modification);
        return this;
    }

    construct<T>(): T {
        if(!this._typeToBuild) 
            throw new Error('A type must be declared before \'construct()\' can be called');

        let type = this.create<T>(this._typeToBuild);
        this._valueModifiers.forEach(m => m(type));

        this._typeToBuild = undefined;
        this._valueModifiers = [];

        return type;
    }
}