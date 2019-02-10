import { FixtureContext } from './fixture';
import { ensure, isObject } from './utils';

export default class ObjectBuilder {
    private readonly _template: object;
    private readonly _context: FixtureContext;

    constructor(template: object, context: FixtureContext) {
        this._template = template;
        this._context = context;

        ensure(
            () => isObject(this._template),
            "The template provided must be of type 'object'",
            TypeError);
    }

    create(): object {
        return this.build(this._template, this._context);
    }

    private build(template: object, context: FixtureContext): object {
        return Object
            .keys(template)
            .reduce((o, k) => {
                const value = template[k];

                if (isObject(value)) {
                    o[k] = this.build(value as object, context);
                    return o;
                }

                if (Array.isArray(value)) {
                    const array = value as any[];
                    ensure(() => array.length === 1, 'Array in template should contain (only) one type');
                    o[k] = context.createMany(array[0]);
                    return o;
                }

                if (typeof value === 'string') {
                    o[k] = context.create<any>(template[k] as string);
                    return o;
                }

                throw new Error(`Invalid template syntax '${k}: ${value}'`);
            }, {});
    }
}
