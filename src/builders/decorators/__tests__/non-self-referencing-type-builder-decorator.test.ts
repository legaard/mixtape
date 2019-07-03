import * as uuid from 'uuid/v4';

import { NonSelfReferencingTypeBuilderDecorator } from '../non-self-referencing-type-builder-decorator';
import { TypeBuilder } from '../../../builder';
import { FixtureContext } from '../../../fixture';

describe('NonSelfReferencingTypeBuilderDecorator', () => {
    test("should on 'create' throw ReferenceError if decorated builder is referencing itself", () => {
        // Arrange
        const type = uuid();
        const builder: TypeBuilder<string> = {
            type,
            build: context => context.create(type)
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);

        // Act and assert
        expect(() => sut.build(null))
            .toThrowError(new ReferenceError(`Ups! It looks like builder for type '${type}' is referencing itself`));
    });

    test("should on 'create' call context of decorated builder if there is no self-reference", () => {
        // Arrange
        const typeToCreate = uuid();
        const createdType = uuid();
        const builder: TypeBuilder<string> = {
            type: uuid(),
            build: context => context.create(typeToCreate)
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);
        const createStubFunction = (t: string) => t === typeToCreate ? createdType : undefined as any;
        const stubContext: FixtureContext = {
            build: () => undefined,
            create: createStubFunction,
            createMany: () => undefined,
            from: () => undefined
        };

        // Act
        const result = sut.build(stubContext);

        // Assert
        expect(result).toBe(createdType);
    });

    test("should on 'createMany' throw ReferenceError if decorated builder is referencing itself", () => {
        // Arrange
        const type = uuid();
        const builder: TypeBuilder<string[]> = {
            type,
            build: context => context.createMany(type)
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);

        // Act and assert
        expect(() => sut.build(null))
            .toThrowError(new ReferenceError(`Ups! It looks like builder for type '${type}' is referencing itself`));
    });

    test("should on 'createMany' call context of decorated builder if there is no self-reference", () => {
        // Arrange
        const typeToCreate = uuid();
        const createdType = uuid();
        const builder: TypeBuilder<string[]> = {
            type: uuid(),
            build: context => context.createMany(typeToCreate)
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);
        const createManyStubFunction = (t: string) => t === typeToCreate ? createdType : undefined as any;
        const stubContext: FixtureContext = {
            build: () => undefined,
            create: () => undefined,
            createMany: createManyStubFunction,
            from: () => undefined
        };

        // Act
        const result = sut.build(stubContext);

        // Assert
        expect(result).toBe(createdType);
    });

    test("should on 'build' throw ReferenceError if decorated builder is referencing itself", () => {
        // Arrange
        const type = uuid();
        const builder: TypeBuilder<object> = {
            type,
            build: context => context.build(type)
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);

        // Act and assert
        expect(() => sut.build(null))
            .toThrowError(new ReferenceError(`Ups! It looks like builder for type '${type}' is referencing itself`));
    });

    test("should on 'build' call context of decorated builder if there is no self-reference", () => {
        // Arrange
        const typeToCreate = uuid();
        const createdType = uuid();
        const builder: TypeBuilder<object> = {
            type: uuid(),
            build: context => context.build(typeToCreate)
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);
        const buildMockFunction = (t: string) => t === typeToCreate ? createdType : undefined as any;
        const stubContext: FixtureContext = {
            build: buildMockFunction,
            create: () => undefined,
            createMany: () => undefined,
            from: () => undefined
        };

        // Act
        const result = sut.build(stubContext);

        // Asset
        expect(result).toBe(createdType);
    });

    test("should on 'from' throw ReferenceError if decorated builder is referencing itself (simple property)", () => {
        // Arrange
        const type = uuid();
        const builder: TypeBuilder<object> = {
            type,
            build: context => context.from({ property: type })
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);

        // Act and assert
        expect(() => sut.build(null))
            .toThrowError(new ReferenceError(`Ups! It looks like builder for type '${type}' is referencing itself`));
    });

    test("should on 'from' throw ReferenceError if decorated builder is referencing itself (nested property)", () => {
        // Arrange
        const type = uuid();
        const builder: TypeBuilder<object> = {
            type,
            build: context => context.from({ property: { property: type } })
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);

        // Act and assert
        expect(() => sut.build(null))
            .toThrowError(new ReferenceError(`Ups! It looks like builder for type '${type}' is referencing itself`));
    });

    test("should on 'from' throw ReferenceError if decorated builder is referencing itself (array value)", () => {
        // Arrange
        const type = uuid();
        const builder: TypeBuilder<object> = {
            type,
            build: context => context.from({ property: [type] })
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);

        // Act and assert
        expect(() => sut.build(null))
            .toThrowError(new ReferenceError(`Ups! It looks like builder for type '${type}' is referencing itself`));
    });

    test("should on 'from' call context of decorated builder if there is no self-reference", () => {
        // Arrange
        const template = { property: uuid() };
        const createdType = { property: uuid() };
        const builder: TypeBuilder<object> = {
            type: uuid(),
            build: context => context.from(template)
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);
        const fromStubFunction = (t: object) => t === template ? createdType : undefined as any;
        const stubContext: FixtureContext = {
            build: () => undefined,
            create: () => undefined,
            createMany: () => undefined,
            from: fromStubFunction
        };

        // Act
        const result = sut.build(stubContext);

        // Assert
        expect(result).toBe(createdType);
    });

    test('should throw ReferenceError if decorated builder is referencing itself via alias', () => {
        // Arrange
        const alias = uuid();
        const builder: TypeBuilder<string> = {
            type: uuid(),
            aliases: [alias],
            build: context => context.create(alias)
        };
        const sut = new NonSelfReferencingTypeBuilderDecorator(builder);

        // Act and assert
        expect(() => sut.build(null))
            .toThrowError(new ReferenceError(`Ups! It looks like builder for type '${alias}' is referencing itself`));
    });
});
