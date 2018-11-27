import * as uuid from 'uuid/v4';

import CustomizableType from '../customizable-type';
import { FixtureContext } from '../fixture';

describe('Customizable Type', () => {
    test('should use fixture context to create type', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => value);
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        }
        const sut = new CustomizableType<string>(type, mockContext);

        // Act
        const createdType = sut.create();

        // Assert
        expect(createdType).toBe(value);
        expect(mockCreateFunction.mock.calls.length).toBe(1);
        expect(mockCreateFunction.mock.calls[0][0]).toBe(type);
    })

    test('should apply functions to type created by the fixture context', () => {
        // Arrange
        const type = uuid();
        const value = uuid();
        const mockCreateFunction = jest.fn(() => ({name: value}));
        const mockContext: FixtureContext = {
            build: () => undefined,
            createMany: () => undefined,
            create: mockCreateFunction
        }
        const sut = new CustomizableType<{name: string}>(type, mockContext);
        const updatedValue = uuid();
        const mockModifierFunctionOne = jest.fn(() => uuid());
        const mockModifierFunctionTwo = jest.fn(m => m.name = updatedValue);
        
        // Act
        const createdType = sut
            .with(mockModifierFunctionOne)
            .with(mockModifierFunctionTwo)
            .create();

        // Assert
        expect(createdType.name).toBe(updatedValue);
        expect(mockModifierFunctionOne.mock.calls.length).toBe(1);
        expect(mockModifierFunctionTwo.mock.calls.length).toBe(1);
    })
})