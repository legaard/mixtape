import Fixture from './fixture';

export interface Builder<T> {
    typeName: string;
    create(context: Fixture): T;
}

export interface BuilderDictionary {
    [type: string]: Builder<any>
}