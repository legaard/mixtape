import { FixtureContext } from './fixture';

export interface TypeBuilder<T> {
    readonly type: string;
    readonly aliases?: TypeAlias[];
    build(context: FixtureContext): T;
}

export default interface TypeAlias {
    name: string;
    type: string;
}