import CustomizableType from './customizable-type';

export default interface FixtureContext {
    create<T>(type: string): T;
    createList<T>(type: string, size?: number): Array<T>;
    build<T>(type: string): CustomizableType<T>;
}