import { TypeBuilder } from './builder';
import { ensure } from './utils';

/**
 * Class for bundling builders
 * Bundle builders in an extension to make it easy to add to a given `Fixture`.
 */
export class Extension {
    private _builders: {[type: string]: TypeBuilder<any>};
    private _typeAliases: {[alias: string]: string};
    private _decorators: (new (decoratee: TypeBuilder<any>) => TypeBuilder<any>)[];

    /**
     * Create a new `Extension`
     */
    constructor() {
        this._builders = {};
        this._typeAliases = {};
        this._decorators = [];
    }

    /**
     * All builders added to the extension
     */
    get builders(): TypeBuilder<any>[] {
        return Object.keys(this._builders).map(k => this._builders[k]);
    }

    /**
     * Add builder
     * @param builder - builder to add
     * @returns `this`
     * @throws if builder with same type or alias already exists
     */
    add(builder: TypeBuilder<any>): this {
        ensure(() => this._builders[builder.type] === undefined, `Builder for type '${builder.type}' already exists`);

        builder = this._decorators.reduce((b, d) => new d(b), builder);
        this._builders[builder.type] = builder;

        if (builder.aliases) {
            builder.aliases.forEach(a => {
                ensure(
                    () => this._typeAliases[a] === undefined,
                    `Builder for type '${this._typeAliases[a]}' also contains alias '${a}'`);

                this._typeAliases[a] = builder.type;
            });
        }

        return this;
    }

    /**
     * Get builder
     * @param typeOrAlias - type or alias for builder
     * @returns `object`
     */
    get<T>(typeOrAlias: string): TypeBuilder<T> {
        const builder = this._builders[typeOrAlias];
        const typeAlias = this._typeAliases[typeOrAlias];

        if (!builder && !typeAlias) return undefined;

        return builder || this._builders[typeAlias];
    }

    /**
     * Remove builder
     * @param type - builder with type to remove
     * @returns `this`
     */
    remove(type: string): this {
        delete this._builders[type];
        Object.keys(this._typeAliases).forEach(k => {
            if (this._typeAliases[k] === type) {
                delete this._typeAliases[k];
            }
        });

        return this;
    }

    /**
     * Merge data from another extension
     * @param extension - extension to merge to this extension
     * @returns `this`
     */
    merge(extension: Extension): this {
        extension.builders.forEach(b => this.add(b));

        return this;
    }

    /**
     * Remove all builders (including aliases)
     */
    clear() {
        this._builders = {};
        this._typeAliases = {};
    }
}
