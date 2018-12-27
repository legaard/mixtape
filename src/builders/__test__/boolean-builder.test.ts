import { BooleanBuilder } from '../boolean-builder';

describe('BooleanBuilder', () => {
    test('should return random boolean', () => {
        // Arrange
        const sut = new BooleanBuilder();

        // Act
        const bools = Array(100).fill(undefined).map(() => sut.build());

        // Assert
        expect(bools.find(b => b) && !bools.find(b => !b)).toBeTruthy();
    });

    test("should have correct value of property 'type'", () => {
        // Arrange
        const sut = new BooleanBuilder();

        // Act and assert
        expect(sut.type).toBe('boolean');
    });
});
