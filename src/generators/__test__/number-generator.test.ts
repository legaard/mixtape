import { NumberGenerator } from '../number-generator';

describe('NumberGenerator', () => {
    test('should generate random number', () => {
        // Arrange
        const sut = new NumberGenerator(0, 10);

        // Act
        const randomValues = Array(50).fill(undefined).map(() => sut.generate());

        // Assert
        expect(randomValues.every(v => v >= 0 || v <= 10)).toBeTruthy();
    });

    test('should throw if minimum value is smaller than 0', () => {
        // Arrange, act and assert
        expect(() => new NumberGenerator(-1, 1))
            .toThrowError('Minimum value cannot be smaller than 0');
    });

    test('should throw if maximum value is smaller than 1', () => {
        // Arrange, act and assert
        expect(() => new NumberGenerator(0, 0))
            .toThrowError('Maximum value cannot be smaller than 1');
    });

    test('should throw if minimum is larger than maximum', () => {
        // Arrange, act and assert
        expect(() => new NumberGenerator(3, 2))
            .toThrowError('Maximum value must be larger than minimum value');
    });
});
