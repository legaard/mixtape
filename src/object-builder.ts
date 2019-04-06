import { FixtureContext } from './fixture';
import { ensure, isObject, isArray } from './utils';
import { ValueGenerator } from './generators';

export default class ObjectBuilder {
    private readonly _template: object;
    private readonly _context: FixtureContext;
    private readonly _generator: ValueGenerator<number>;

    constructor(template: object, context: FixtureContext, generator: ValueGenerator<number>) {
        this._template = template;
        this._context = context;
        this._generator = generator;

        ensure(
            () => isObject(this._template),
            "The template provided must be of type 'object'",
            TypeError);
    }

    create(): object {
        return this.build(this._template, this._context);
    }

    createMany(size?: number): object[] {
        const list: object[] = [];
        size = !!size ? size : this._generator.generate();

        for (let i = 0; i < size; i++) {
            list.push(this.create());
        }

        return list;
    }

    private build(template: object, context: FixtureContext): object {
        return Object
            .keys(template)
            .reduce((o, k) => {
                const value = template[k];

                if (isObject(value)) {
                    o[k] = this.build(value, context);
                    return o;
                }

                if (isArray(value)) {
                    ensure(
                        () => value.length === 1 && typeof value[0] === 'string',
                        'Array in template should only contain one type (string)');
                    o[k] = context.createMany(value[0] as string);
                    return o;
                }

                if (typeof value === 'string') {
                    o[k] = context.create<any>(value);
                    return o;
                }

                throw new Error(`Invalid template syntax '${k}: ${value}'`);
            }, {});
    }
}
