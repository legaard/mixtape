import * as uuid from 'uuid/v4';

import TypeComposer from '../type-composer';
import { FixtureContext } from '../fixture';
import { ValueGenerator } from '../generators';

describe('TypeComposer', () => {
    test('should use fixture context to create type', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(t => {
            expect(t).toBe(type);
            return {value};
        });
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: mockCreateFunction as any,
            from: undefined
        };
        const sut = new TypeComposer<{value: string}>(type, mockContext, null);

        // Act
        const createdType = sut.create();

        // Assert
        expect(createdType.value).toBe(value);
    });

    test('should throw error when type is not an object', () => {
        // Arrange
        const type = uuid();
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => uuid() as any,
            from: undefined
        };

        // Act and assert
        expect(() => new TypeComposer<any>(type, mockContext, null).create())
            .toThrowError("TypeComposer can only be used with type 'object'");
        expect(() => new TypeComposer<any>(type, mockContext, null).create())
            .toThrowError(TypeError);
    });

    test('should apply functions to type', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => ({value}) as any,
            from: undefined
        };
        const sut = new TypeComposer<{value: string}>(type, mockContext, null);
        const updatedValue = uuid();
        const mockModifierFunctionOne = jest.fn(() => uuid());
        const mockModifierFunctionTwo = jest.fn(m => m.value = updatedValue);

        // Act
        const createdType = sut
            .do(mockModifierFunctionOne)
            .do(mockModifierFunctionTwo)
            .create();

        // Assert
        expect(createdType.value).toBe(updatedValue);
        expect(mockModifierFunctionOne).toHaveBeenCalledTimes(1);
        expect(mockModifierFunctionTwo).toHaveBeenCalledTimes(1);
    });

    test("should change value of property on type when using 'with' (primitive type)", () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => ({value}) as any,
            from: undefined
        };
        const sut = new TypeComposer<{value: string}>(type, mockContext, null);
        const additionalData = uuid();

        // Act
        const createdType = sut
            .with('value', v => v + additionalData)
            .create();

        // Assert
        expect(createdType.value).toBe(value + additionalData);
    });

    test("should handle boolean value of property correctly on 'with'", () => {
        // Arrange
        const type = uuid();
        const value = false;
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => ({value}) as any,
            from: undefined
        };
        const sut = new TypeComposer<{value: boolean}>(type, mockContext, null);

        // Act
        const createdType = sut
            .with('value', v => !v)
            .create();

        // Assert
        expect(createdType.value).toBeTruthy();
    });

    test("should update value of property on type when using 'with' (object)", () => {
        // Arrange
        const type = uuid();
        const valueOne = uuid();
        const valueTwo = uuid();
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => ({objectValue: { valueOne, valueTwo}}) as any,
            from: undefined
        };
        const sut = new TypeComposer<{objectValue: { valueOne: string, valueTwo: string }}>(
            type,
            mockContext,
            undefined);
        const newValueTwo = uuid();

        // Act
        const createdType = sut
            .with('objectValue', v => ({...v, valueTwo: newValueTwo}))
            .create();

        // Assert
        expect(createdType.objectValue.valueOne).toBe(valueOne);
        expect(createdType.objectValue.valueTwo).toBe(newValueTwo);
    });

    test("should update value of property on type when using 'with' (array)", () => {
        // Arrange
        const type = uuid();
        const valueOne = uuid();
        const valueTwo = uuid();
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => ({values: [valueOne, valueTwo]}) as any,
            from: undefined
        };
        const sut = new TypeComposer<{values: string[]}>(type, mockContext, null);
        const addedValue = uuid();

        // Act
        const createdType = sut
            .with('values', v => [...v, addedValue])
            .create();

        // Assert
        expect(createdType.values.length).toBe(3);
        expect(createdType.values[0]).toBe(valueOne);
        expect(createdType.values[1]).toBe(valueTwo);
        expect(createdType.values[2]).toBe(addedValue);
    });

    test("should throw error if unknown property is passed to 'with'", () => {
        // Arrange
        const type = uuid();
        const anotherValue = uuid();
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => ({anotherValue}) as any,
            from: undefined
        };
        const sut = new TypeComposer<{value: string}>(type, mockContext, null);

        // Act and assert
        expect(() => sut.with('value', v => v).create())
            .toThrowError(`Property 'value' does not exist on type '${type}'`);
        expect(() => sut.with('value', v => v).create())
            .toThrowError(ReferenceError);
    });

    test("should remove property from type on 'without'", () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const valueToRemove = uuid();
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => ({value, valueToRemove}) as any,
            from: undefined
        };
        const sut = new TypeComposer<{value: string, valueToRemove: string}>(type, mockContext, null);

        // Act
        const createdType = sut
            .without('valueToRemove')
            .create();

        // Assert
        expect(createdType.value).not.toBeUndefined();
        expect(createdType.valueToRemove).toBeUndefined();
    });

    test("should do nothing when calling 'without' with unknown property value", () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const valueToRemove = uuid();
        const mockContext: FixtureContext = {
            build: undefined,
            createMany: undefined,
            create: () => ({value, valueToRemove}) as any,
            from: undefined
        };
        const sut = new TypeComposer<{value: string, valueToRemove: string}>(type, mockContext, null);

        // Act
        const createdType = sut
            .without(uuid() as any)
            .create();

        // Assert
        expect(createdType.value).not.toBeUndefined();
        expect(createdType.valueToRemove).not.toBeUndefined();
    });

    test('should create a list of types with fixed size', () => {
        // Arrange
        const size = 31;
        const value = uuid();
        const sut = new TypeComposer<{value: string}>(undefined, null, null);
        sut.create = () => ({value});

        // Act
        const createdTypes = sut.createMany(size);

        // Assert
        expect(createdTypes.length).toBe(size);
        expect(createdTypes.every(o => o.value === value)).toBeTruthy();
    });

    test('should create a list of types using value generator', () => {
        // Arrange
        const size = 23;
        const value = uuid();
        const valueGenerator: ValueGenerator<number> = {
            generate: () => size
        };
        const sut = new TypeComposer<{value: string}>(undefined, null, valueGenerator);
        sut.create = () => ({value});

        // Act
        const createdTypes = sut.createMany();

        // Assert
        expect(createdTypes.length).toBe(size);
        expect(createdTypes.every(o => o.value === value)).toBeTruthy();
    });
});
