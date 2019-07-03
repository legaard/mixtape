import { FixtureContext } from '../../fixture';
import TypeComposer from '../../type-composer';
import ObjectBuilder from '../../object-builder';
import { ensure, isObject, isArray } from '../../utils';
import { TypeBuilder } from '../../builder';

export class NonSelfReferencingTypeBuilderDecorator<T> implements TypeBuilder<T> {
    type: string;
    aliases?: string[];

    private readonly _decoratee: TypeBuilder<T>;

    constructor(decoratee: TypeBuilder<T>) {
        this._decoratee = decoratee;
        this.type = this._decoratee.type;
        this.aliases = this._decoratee.aliases;
    }

    build(context: FixtureContext): T {
        const callChecker = new ContextCallChecker(
            context,
            this._decoratee.type,
            ...(this._decoratee.aliases ? this._decoratee.aliases : []));

        this._decoratee.build(callChecker);

        return this._decoratee.build(context);
    }
}

class ContextCallChecker implements FixtureContext {
    private readonly _typesNotAllowed: string[];
    private readonly _fixtureContext: FixtureContext;

    constructor(fixtureContext: FixtureContext, ...typesNotAllowed: string[]) {
        this._fixtureContext = fixtureContext;
        this._typesNotAllowed = typesNotAllowed;
    }

    create<T>(type: string): T {
        this.checkType(type);
        return this._fixtureContext.create(type);
    }

    createMany<T>(type: string, size?: number): T[] {
        this.checkType(type);
        return this._fixtureContext.createMany(type, size);
    }

    build<T extends object>(type: string): TypeComposer<T> {
        this.checkType(type);
        return this._fixtureContext.build(type);
    }

    from<T extends object>(template: T): ObjectBuilder<T> {
        this.getTypes(template).forEach(t => this.checkType(t));
        return this._fixtureContext.from(template);
    }

    private checkType(type: string) {
        ensure(
            () => !this._typesNotAllowed.some(t => t === type),
            `Ups! It looks like builder for type '${type}' is referencing itself`,
            ReferenceError);
    }

    private getTypes<T extends object>(template: T): string[] {
        return Object
            .keys(template)
            .reduce((a, k) => {
                const value = template[k];

                if (isObject(value)) {
                    a.push(...this.getTypes(value));
                }

                if (isArray(value) && typeof value[0] === 'string') {
                     a.push(value[0] as string);
                }

                if (typeof value === 'string') {
                    a.push(value);
                }

                return a;
            }, [] as any);
    }
}
