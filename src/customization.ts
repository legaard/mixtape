import { Builder, BuilderDictionary } from './builder';

export default class Customization {
    private _builders: BuilderDictionary;

    constructor() {
        this._builders = {}
    }

    get builders(): Array<Builder<any>> {
        return Object.keys(this._builders).map(k => this._builders[k]);
    }

    addBuilder(builder: Builder<any>) {
        this._builders[builder.typeName] = builder;
    }

    removeBuilder(builderName: string) {
        delete this._builders[builderName];
    }
}