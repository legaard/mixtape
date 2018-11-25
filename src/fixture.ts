import { TypeBuilder, TypeBuilderDictionary } from './type-builder';
import Customization from './customization';
import CustomizableType from './customizable-type';
import FixtureContext from './fixture-context';
import Generator from './generators/generator';

export default class Fixture implements FixtureContext {
    private _builders: TypeBuilderDictionary;
    private _generator: Generator<number>;

    constructor(generator: Generator<number>) {
        this._builders = {};
        this._generator = generator;
    }

    addCustomization(customization: Customization) {
        customization.builders.forEach(b => this._builders[b.typeName] = b);
    }

    addBuilder(builder: TypeBuilder<any>) {
        this._builders[builder.typeName] = builder;
    }

    removeBuilder(builderName: string) {
        delete this._builders[builderName];
    }

    create<T>(type: string): T {
        const builder = this._builders[type];
        
        if (!builder)
            throw new Error(`No builder defined for type '${type}'`);
        
        return builder.create(this);
    }

    createList<T>(type: string, size?: number): Array<T> {
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
}