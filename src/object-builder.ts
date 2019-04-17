import { FixtureContext } from './fixture';
import { ensure, isObject, isArray } from './utils';
import { ValueGenerator } from './generators';

/**
 * Data object created from a template
 * @type {object}
 */
type TemplateObject<T> = {
    [P in keyof T]: any;
};

/**
 * Class for generating object(s) from a template.
 * From a template the class can be used to generate one or more objects
 * with random data based on the declared types in the template.
 */
export default class ObjectBuilder<T extends object> {
    private readonly _template: T;
    private readonly _context: FixtureContext;
    private readonly _generator: ValueGenerator<number>;

    /**
     * Create a new `ObjectBuilder`
     * @param template - object template to generate object from
     * @param context - fixture context to use when generating data
     * @param generator - generator to use when generating numbers
     * @throws if template is not an object
     */
    constructor(template: T, context: FixtureContext, generator: ValueGenerator<number>) {
        this._template = template;
        this._context = context;
        this._generator = generator;

        ensure(
            () => isObject(this._template),
            "The template provided must be of type 'object'",
            TypeError);
    }

    /**
     * Create single object
     * @returns single object based on template
     * @throws on invalid template syntax
     */
    create(): TemplateObject<T> {
        return this.build(this._template, this._context);
    }

    /**
     * Create array of objects
     * @param size - size of array to create
     * @returns array of objects based on template
     * @throws on invalid template syntax
     */
    createMany(size?: number): Array<TemplateObject<T>> {
        const list: Array<{[key in keyof T]: any}> = [];
        size = !!size ? size : this._generator.generate();

        for (let i = 0; i < size; i++) {
            list.push(this.create());
        }

        return list;
    }

    private build(template: object, context: FixtureContext): TemplateObject<T> {
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
            }, {} as TemplateObject<T>);
    }
}
