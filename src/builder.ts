import { FixtureContext } from './fixture';

/**
 * Interface for a type builder
 * @interface
 */
export interface TypeBuilder<T> {
    type: string;
    aliases?: TypeAlias[];
    build(context: FixtureContext): T;
}

/**
 * Type alias
 * @interface
 */
export interface TypeAlias {
    alias: string;
    type: string;
}

/**
 * Abstract class implementing the `TypeBuilder` interface.
 * This implementation gives easy access to adding type aliases.
 * @abstract
 */
export abstract class Builder<T> implements TypeBuilder<T> {
    /**
     * All aliases for type
     */
    readonly aliases: TypeAlias[];

    /**
     * Create a new `Builder`
     * @param type - name of the type that the builder can create
     */
    constructor(public type: string) {
        this.aliases = [];
    }

    /**
     * Build new type
     * @abstract
     * @param context - context to use for generating data
     * @returns new type
     */
    abstract build(context: FixtureContext): T;

    /**
     * Register new alias for type, e.g. 'surname' and 'lastName'
     * @protected
     * @param alias - alias for type
     * @param type - type (use the one from builder)
     */
    protected createAlias(alias: string, type: string) {
        this.aliases.push({ alias, type });
    }
}
