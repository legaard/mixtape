import * as uuid from 'uuid';

import { FixtureContext } from '../fixture';
import { ValueGenerator } from '../generators';
import ObjectBuilder from '../object-builder';

describe('ObjectBuilder', () => {
    test('should throw TypeError if template is not an object', () => {
        // Arrange, act and assert
        expect(() => new ObjectBuilder(uuid() as unknown as object, null, null)).toThrow(TypeError);
    });

    test('should create flat object', () => {
        // Arrange
        const context: FixtureContext = {
            create: () => uuid() as any,
            build: undefined,
            createMany: undefined,
            from: undefined
        };
        const template = {
            simpleProperty: uuid()
        };
        const sut = new ObjectBuilder(template, context, null);

        // Act
        const object = sut.create();

        // Assert
        expect(object).toHaveProperty('simpleProperty');
        expect(typeof object.simpleProperty).toBe('string');
    });

    test('should create nested object', () => {
        // Arrange
        const context: FixtureContext = {
            create: () => uuid() as any,
            build: undefined,
            createMany: undefined,
            from: undefined
        };
        const template = {
            nestedObject: {
                simpleProperty: uuid()
            }
        };
        const sut = new ObjectBuilder(template, context, null);

        // Act
        const object = sut.create();

        // Assert
        expect(object).toHaveProperty('nestedObject');
        expect(typeof object.nestedObject).toBe('object');
    });

    test('should create object with array', () => {
        // Arrange
        const context: FixtureContext = {
            create: undefined,
            build: undefined,
            createMany: () => [uuid()] as any[],
            from: undefined
        };
        const template = {
            array: [uuid()]
        };
        const sut = new ObjectBuilder(template, context, null);

        // Act
        const object = sut.create();

        // Assert
        expect(object).toHaveProperty('array');
        expect(object.array instanceof Array).toBeTruthy();
    });

    test("should call and use value from fixture context for type 'string'", () => {
        // Arrange
        const createType = uuid();
        const createValue = uuid();
        const createFunctionStub = (t: string) => t === createType ? createValue : undefined;
        const context: FixtureContext = {
            create: createFunctionStub as any,
            build: undefined,
            createMany: undefined,
            from: undefined
        };
        const template = {
            simpleProperty: createType,
        };
        const sut = new ObjectBuilder(template, context, null);

        // Act
        const object = sut.create();

        // Assert
        expect(object.simpleProperty).toBe(createValue);
    });

    test("should call and use value from fixture context for type 'array'", () => {
        // Arrange
        const createManyType = uuid();
        const createManyValue = [uuid(), uuid(), uuid()];
        const createManyFunctionStub = (t: string) => t === createManyType ? createManyValue : undefined;
        const context: FixtureContext = {
            create: undefined,
            build: undefined,
            createMany: createManyFunctionStub as any,
            from: undefined
        };
        const template = {
            array: [createManyType]
        };
        const sut = new ObjectBuilder(template, context, null);

        // Act
        const object = sut.create();

        // Assert
        expect(object.array).toEqual(createManyValue);
    });

    test('should create complex object', () => {
        // Arrange
        const context: FixtureContext = {
            create: () => uuid() as any,
            build: undefined,
            createMany: () => [uuid()] as any[],
            from: undefined
        };
        const template = {
            simpleProperty: uuid(),
            array: [uuid()],
            nestedObject: {
                simpleProperty: uuid(),
                nestedObject: {
                    simpleProperty: uuid(),
                    array: [uuid()],
                }
            }
        };
        const sut = new ObjectBuilder(template, context, null);

        // Act
        const object = sut.create();

        // Assert
        expect(object).toHaveProperty('simpleProperty');
        expect(typeof object.simpleProperty).toBe('string');

        expect(object).toHaveProperty('array');
        expect(object.array instanceof Array).toBeTruthy();

        expect(object).toHaveProperty('nestedObject');
        expect(typeof object.nestedObject).toBe('object');

        expect(object.nestedObject).toHaveProperty('simpleProperty');
        expect(typeof object.nestedObject.simpleProperty).toBe('string');

        expect(object.nestedObject).toHaveProperty('nestedObject');
        expect(typeof object.nestedObject.nestedObject).toBe('object');

        expect(object.nestedObject.nestedObject).toHaveProperty('simpleProperty');
        expect(typeof object.nestedObject.nestedObject.simpleProperty).toBe('string');

        expect(object.nestedObject.nestedObject).toHaveProperty('array');
        expect(object.nestedObject.nestedObject.array instanceof Array).toBeTruthy();
    });

    test('should return object with no properties when template is empty', () => {
        // Arrange and act
        const sut = new ObjectBuilder({}, null, null);
        const object = sut.create();

        // Assert
        expect(Object.keys(object).keys.length).toBe(0);
    });

    test('should throw Error when array contains no elements', () => {
        // Arrange
        const template = {
            array: []
        };
        const sut = new ObjectBuilder(template, null, null);

        // Act and assert
        expect(() => sut.create()).toThrow(Error);
    });

    test('should throw Error when array contains more than one element', () => {
        // Arrange
        const template = {
            array: [uuid(), uuid()]
        };
        const sut = new ObjectBuilder(template, null, null);

        // Act and assert
        expect(() => sut.create()).toThrow(Error);
    });

    test('should throw Error if template contains an unsupport property value', () => {
        // Arrange
        const template = {
            value: 12
        };
        const sut = new ObjectBuilder(template, null, null);

        // Act and assert
        expect(() => sut.create()).toThrow(Error);
    });

    test('should create a list of types with fixed size', () => {
        // Arrange
        const size = 43;
        const value = uuid();
        const sut = new ObjectBuilder({}, null, null);
        sut.create = () => value as any;

        // Act
        const createdTypes = sut.createMany(size);

        // Assert
        expect(createdTypes.length).toBe(size);
        expect(createdTypes.every(v => v as unknown as string === value)).toBeTruthy();
    });

    test('should create a list of types using value generator', () => {
        // Arrange
        const size = 15;
        const value = uuid();
        const valueGenerator: ValueGenerator<number> = {
            generate: () => size
        };
        const sut = new ObjectBuilder({}, null, valueGenerator);
        sut.create = () => value as any;

        // Act
        const createdTypes = sut.createMany();

        // Assert
        expect(createdTypes.length).toBe(size);
        expect(createdTypes.every(v => v as unknown as string  === value)).toBeTruthy();
    });
});
