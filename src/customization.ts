import { TypeBuilder } from './type-builder';

export class Customization {
    private _builders: {[type: string]: TypeBuilder<any>};
    private _typeAliases: {[alias: string]: string};

    constructor() {
        this._builders = {};
        this._typeAliases = {};
    }

    get builders(): Array<TypeBuilder<any>> {
        return Object.keys(this._builders).map(k => this._builders[k]);
    }

    add(builder: TypeBuilder<any>) {
        this._builders[builder.type] = builder;

        if (builder.aliases) {
            builder.aliases.forEach(a => this._typeAliases[a.name] = a.type);
        }
    }

    get(type: string) {
        const aliasType = this._typeAliases[type];
        const builder = this._builders[type];

        if (!builder && !aliasType) return undefined;

        if (aliasType) {
            return this._builders[aliasType];
        }

        return builder;
    }

    remove(type: string) {
        delete this._builders[type];
        delete this._typeAliases[type];
    }

    clear() {
        this._builders = {};
        this._typeAliases = {};
    }
}
