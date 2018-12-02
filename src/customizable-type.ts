import { FixtureContext } from './fixture';

export default class CustomizableType<T extends object> {
    private _type: T;
    private _context: FixtureContext;

    constructor(type: string, context: FixtureContext) {
        this._context = context;
        this._type = this._context.create<T>(type);

        if(typeof this._type !== 'object')
            throw new Error('CustomizableType can only be used for type \'object\'');
    }

    do(action: (type: T) => void): CustomizableType<T> {
        action(this._type);
        return this;
    }

    with<K extends keyof T>(key: K, value: (selected: T[K]) => T[K]): CustomizableType<T> {
        const currentValue = this._type[key];
        
        if (typeof currentValue === 'object') {
            this._type[key] = value(Object.assign({}, currentValue));
        } else {
            this._type[key] = value(currentValue)
        }
        
        return this;
    }

    create(): T {
        return this._type;
    }
}