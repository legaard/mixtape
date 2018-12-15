import { PrimitiveType } from '../primitive-type';

describe('PrimitiveTypes', () => {
    // Arrange
    const types = ['number', 'string', 'boolean', 'symbol', 'undefined', 'null'];

    test('should have types', () => {
        // Act and sssert
        types.forEach(t => expect(PrimitiveType[t]).toBe(t));
    });

    test('should have tests for all types', () => {
        // Act and sssert
        expect(Object.keys(PrimitiveType).length).toBe(types.length);
    });
});
