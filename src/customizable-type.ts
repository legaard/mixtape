import { FixtureContext } from './fixture';

export default class CustomizableType<T extends Object> {
    private _type: T;
    private _context: FixtureContext;

    constructor(type: string, context: FixtureContext) {
        this._context = context;
        this._type = this._context.create<T>(type);
    }

    with(action: (data: T) => void): CustomizableType<T> {
        action(this._type);
        return this;
    }

    create(): T {
        return this._type;
    }
}