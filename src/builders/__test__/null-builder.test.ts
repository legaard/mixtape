import { NullBuilder } from '../null-builder';

describe('NullBuilder', () => {
    test('should return null', () => {
        // Arrange
        const sut = new NullBuilder();

        // Act and assert
        expect(sut.build()).toBeNull();
    });

    test('should have correct value of property \'type\'', () => {
        // Arrange
        const sut = new NullBuilder();

        // Act and assert
        expect(sut.type).toBe('null');
    });
});
