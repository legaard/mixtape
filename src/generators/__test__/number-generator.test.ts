import NumberGenerator from '../number-generator';

describe('NumberGenerator', () => {
    test('should generate random number', () => {
        // Arrange
        const sut = new NumberGenerator(1, 10);

        // Act
        const randomValues = Array(10).fill(undefined).map(() => sut.generate());

        // Assert
        expect(randomValues.every(v => v >= 1 || v <= 10)).toBeTruthy();
    });

    test('should throw if minimum value is smaller than 0', () => {
        // Arrange, act and assert
        expect(() => new NumberGenerator(-1, 1))
            .toThrowError('Minimum value must be larger than 0 and maximum larger than 1');
    });

    test('should throw if maximum value is smaller than 1', () => {
        // Arrange, act and assert
        expect(() => new NumberGenerator(0, 0))
            .toThrowError('Minimum value must be larger than 0 and maximum larger than 1');
    });

    test('should throw if minimum is larger than maximum', () => {
        // Arrange, act and assert
        expect(() => new NumberGenerator(3, 2)).toThrowError('Minimum value must be smaller than maximum value');
    });
});
