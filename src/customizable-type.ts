import { FixtureContext } from './fixture';

export default class CustomizableType<T> {
    private _modifiers: Array<(type: T) => void>;
    private _type: string;
    private _context: FixtureContext;

    constructor(type: string, context: FixtureContext) {
        this._type = type;
        this._context = context;
        this._modifiers = [];
    }

    with(modification: (data: T) => void): CustomizableType<T> {
        this._modifiers.push(modification);
        return this;
    }

    create(): T {
        let type = this._context.create<T>(this._type);
        this._modifiers.forEach(m => m(type));

        return type;
    }
}