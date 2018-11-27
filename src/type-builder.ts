import { FixtureContext } from './fixture';

export interface TypeBuilder<T> {
    typeName: string;
    create(context: FixtureContext): T;
}

export interface TypeBuilderDictionary {
    [type: string]: TypeBuilder<any>
}