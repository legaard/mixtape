import { FixtureContext } from './fixture';
import { isObject } from './utils';

export default class TypeComposer<T extends object> {
    private readonly _context: FixtureContext;
    private readonly _typeObject: T;
    private readonly _type: string;

    constructor(type: string, context: FixtureContext) {
        this._context = context;
        this._type = type;
        this._typeObject = this._context.create<T>(type);

        if (!isObject(this._typeObject)) {
            throw new Error("TypeComposer can only be used with type 'object'");
        }
    }

    do(action: (type: T) => void): TypeComposer<T> {
        action(this._typeObject);
        return this;
    }

    with<K extends keyof T>(property: K, value: (selected: T[K]) => T[K]): TypeComposer<T> {
        const currentValue = this._typeObject[property];

        if (!currentValue) {
            throw new Error(`Property '${property}' does not exist on type '${this._type}'`);
        }

        if (Array.isArray(currentValue)) {
            this._typeObject[property] = value([...currentValue] as unknown as T[K]);
        } else if (isObject(currentValue)) {
            this._typeObject[property] = value({...currentValue} as T[K]);
        } else {
            this._typeObject[property] = value(currentValue);
        }

        return this;
    }

    without<K extends keyof T>(key: K): TypeComposer<T> {
        delete this._typeObject[key];
        return this;
    }

    create(): T {
        return this._typeObject;
    }
}
