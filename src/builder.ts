import { FixtureContext } from './fixture';

export interface TypeBuilder<T> {
    type: string;
    aliases?: TypeAlias[];
    build(context: FixtureContext): T;
}

export interface TypeAlias {
    alias: string;
    type: string;
}

export abstract class Builder<T> implements TypeBuilder<T> {
    readonly aliases: TypeAlias[] = [];

    constructor(public type: string) {
    }

    abstract build(context: FixtureContext): T;

    protected createAlias(alias: string, type: string) {
        this.aliases.push({ alias, type });
    }
}
