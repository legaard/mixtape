import * as uuid from 'uuid/v4';

import TypeComposer from '../type-composer';
import { FixtureContext } from '../fixture';

describe('TypeComposer', () => {
    test('should use fixture context to create type', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => ({value}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        };
        const sut = new TypeComposer<{value: string}>(type, mockContext);

        // Act
        const createdType = sut.create();

        // Assert
        expect(createdType.value).toBe(value);
        expect(mockCreateFunction.mock.calls.length).toBe(1);
        expect(mockCreateFunction.mock.calls[0][0]).toBe(type);
    });

    test('should throw error when type is not an object', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => value);
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        };

        // Act and assert
        expect(() => new TypeComposer<any>(type, mockContext))
            .toThrowError('TypeComposer can only be used with type \'object\'');
    });

    test('should apply functions to type', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => ({value}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        };
        const sut = new TypeComposer<{value: string}>(type, mockContext);
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
        expect(mockModifierFunctionOne.mock.calls.length).toBe(1);
        expect(mockModifierFunctionTwo.mock.calls.length).toBe(1);
    });

    test('should change value of property on type when using \'with\'', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => ({value}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        };
        const sut = new TypeComposer<{value: string}>(type, mockContext);
        const additionalData = uuid();

        // Act
        const createdType = sut
            .with('value', v => v + additionalData)
            .create();

        // Assert
        expect(createdType.value).toBe(value + additionalData);
    });

    test('should throw error if unknown property is passed to \'with\'', () => {
        // Arrange
        const type = uuid();
        const anotherValue = uuid();
        const mockCreateFunction = jest.fn(() => ({anotherValue}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        };
        const sut = new TypeComposer<{value: string}>(type, mockContext);

        // Act and assert
        expect(() => sut.with('value', v => v)).toThrowError(`Property 'value' does not exist on type '${type}'`);
    });

    test('should change value of property on type when using \'with\'', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const valueToRemove = uuid();
        const mockCreateFunction = jest.fn(() => ({value, valueToRemove}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        };
        const sut = new TypeComposer<{value: string, valueToRemove: string}>(type, mockContext);

        // Act
        const createdType = sut
            .without('valueToRemove')
            .create();

        // Assert
        expect(createdType.value).not.toBeUndefined();
        expect(createdType.valueToRemove).toBeUndefined();
    });
});
