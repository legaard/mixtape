import { FixtureContext } from './fixture';

export interface TypeBuilder<T> {
    readonly typeName: string;
    build(context: FixtureContext): T;
}

export interface TypeBuilderDictionary {
    [type: string]: TypeBuilder<any>
}