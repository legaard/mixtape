import { FixtureContext } from './fixture';

export default class CustomizableType<T extends object> {
    private readonly _context: FixtureContext;    
    private readonly _typeObject: T;
    private readonly _type: string;

    constructor(type: string, context: FixtureContext) {
        this._context = context;
        this._type = type;
        this._typeObject = this._context.create<T>(type);

        if(typeof this._typeObject !== 'object')
            throw new Error('CustomizableType can only be used with type \'object\'');
    }

    do(action: (type: T) => void): CustomizableType<T> {
        action(this._typeObject);
        return this;
    }

    with<K extends keyof T>(property: K, value: (selected: T[K]) => T[K]): CustomizableType<T> {
        const currentValue = this._typeObject[property];
        
        if (!currentValue)
            throw new Error(`Property '${property}' does not exist on type '${this._type}'`);

        if (typeof currentValue === 'object') {
            this._typeObject[property] = value(Object.assign({}, currentValue));
        } else {
            this._typeObject[property] = value(currentValue)
        }
        
        return this;
    }

    without<K extends keyof T>(key: K): CustomizableType<T> {
        delete this._typeObject[key];
        return this;
    }

    create(): T {
        return this._typeObject;
    }
}