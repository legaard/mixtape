import { FixtureContext } from './fixture';

export default class CustomizableType<T extends object> {
    private readonly _type: T;
    private readonly _context: FixtureContext;
    private readonly _typeName: string;

    constructor(type: string, context: FixtureContext) {
        this._context = context;
        this._typeName = type;
        this._type = this._context.create<T>(type);

        if(typeof this._type !== 'object')
            throw new Error('CustomizableType can only be used with type \'object\'');
    }

    do(action: (type: T) => void): CustomizableType<T> {
        action(this._type);
        return this;
    }

    with<K extends keyof T>(property: K, value: (selected: T[K]) => T[K]): CustomizableType<T> {
        const currentValue = this._type[property];
        
        if (!currentValue)
            throw new Error(`Property '${property}' does not exist on type '${this._typeName}'`);

        if (typeof currentValue === 'object') {
            this._type[property] = value(Object.assign({}, currentValue));
        } else {
            this._type[property] = value(currentValue)
        }
        
        return this;
    }

    without<K extends keyof T>(key: K): CustomizableType<T> {
        delete this._type[key];
        return this;
    }

    create(): T {
        return this._type;
    }
}