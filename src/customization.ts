import { TypeBuilder, TypeBuilderDictionary } from './type-builder';

export default class Customization {
    private _builders: TypeBuilderDictionary;

    constructor() {
        this._builders = {}
    }

    get builders(): TypeBuilder<any>[] {
        return Object.keys(this._builders).map(k => this._builders[k]);
    }

    add(builder: TypeBuilder<any>) {
        this._builders[builder.type] = builder;
    }

    remove(builderName: string) {
        delete this._builders[builderName];
    }
}