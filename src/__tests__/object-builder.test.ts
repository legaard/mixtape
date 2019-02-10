import * as uuid from 'uuid';

import { FixtureContext } from '../fixture';
import ObjectBuilder from '../object-builder';

describe('ObjectBuilder', () => {
    test('should throw TypeError if template is not an object', () => {
        // Arrange, act and assert
        expect(() => new ObjectBuilder(uuid() as unknown as object, {} as FixtureContext)).toThrow(TypeError);
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
        const sut = new ObjectBuilder(template, context);

        // Act
        const object: any = sut.create();

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
        const sut = new ObjectBuilder(template, context);

        // Act
        const object: any = sut.create();

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
        const sut = new ObjectBuilder(template, context);

        // Act
        const object: any = sut.create();

        // Assert
        expect(object).toHaveProperty('array');
        expect(Array.isArray(object.array)).toBeTruthy();
    });

    test("should call and use value from fixture context for type 'string'", () => {
        // Arrange
        const createType = uuid();
        const createValue = uuid();
        const mockCreateFunction = jest.fn(() => createValue);
        const context: FixtureContext = {
            create: mockCreateFunction as any,
            build: undefined,
            createMany: undefined,
            from: undefined
        };
        const template = {
            simpleProperty: createType,
        };

        // Act
        const sut = new ObjectBuilder(template, context);
        const object: any = sut.create();

        // Assert
        expect(object.simpleProperty).toBe(createValue);
        expect(mockCreateFunction).toHaveBeenCalledTimes(1);
        expect(mockCreateFunction).toBeCalledWith(createType);
    });

    test("should call and use value from fixture context for type 'array'", () => {
        // Arrange
        const createManyType = uuid();
        const createManyValue = uuid();
        const mockCreateManyFunction = jest.fn(() => [createManyValue]);
        const context: FixtureContext = {
            create: undefined,
            build: undefined,
            createMany: mockCreateManyFunction as any,
            from: undefined
        };
        const template = {
            array: [createManyType]
        };

        // Act
        const sut = new ObjectBuilder(template, context);
        const object: any = sut.create();

        // Assert
        expect(object.array[0]).toBe(createManyValue);
        expect(mockCreateManyFunction).toHaveBeenCalledTimes(1);
        expect(mockCreateManyFunction).toBeCalledWith(createManyType);
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

        // Act
        const sut = new ObjectBuilder(template, context);
        const object: any = sut.create();

        // Assert
        expect(object).toHaveProperty('simpleProperty');
        expect(typeof object.simpleProperty).toBe('string');

        expect(object).toHaveProperty('array');
        expect(Array.isArray(object.array)).toBeTruthy();

        expect(object).toHaveProperty('nestedObject');
        expect(typeof object.nestedObject).toBe('object');

        expect(object.nestedObject).toHaveProperty('simpleProperty');
        expect(typeof object.nestedObject.simpleProperty).toBe('string');

        expect(object.nestedObject).toHaveProperty('nestedObject');
        expect(typeof object.nestedObject.nestedObject).toBe('object');

        expect(object.nestedObject.nestedObject).toHaveProperty('simpleProperty');
        expect(typeof object.nestedObject.nestedObject.simpleProperty).toBe('string');

        expect(object.nestedObject.nestedObject).toHaveProperty('array');
        expect(Array.isArray(object.nestedObject.nestedObject.array)).toBeTruthy();
    });

    test('should return object with no properties when template is empty', () => {
        // Arrange and act
        const sut = new ObjectBuilder({}, {} as FixtureContext);
        const object: any = sut.create();

        // Assert
        expect(Object.keys(object).keys.length).toBe(0);
    });

    test('should throw Error when array contains no elements', () => {
        // Arrange
        const template = {
            array: []
        };
        const sut = new ObjectBuilder(template, {} as FixtureContext);

        // Act and assert
        expect(() => sut.create()).toThrow(Error);
    });

    test('should throw Error when array contains more than one element', () => {
        // Arrange
        const template = {
            array: [uuid(), uuid()]
        };
        const sut = new ObjectBuilder(template, {} as FixtureContext);

        // Act and assert
        expect(() => sut.create()).toThrow(Error);
    });

    test('should throw Error if template contains an unsupport property value', () => {
        // Arrange
        const template = {
            value: 12
        };
        const sut = new ObjectBuilder(template, {} as FixtureContext);

        // Act and assert
        expect(() => sut.create()).toThrow(Error);
    });
});
