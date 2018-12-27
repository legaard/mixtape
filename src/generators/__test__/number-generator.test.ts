import { NumberGenerator } from '../number-generator';

describe('NumberGenerator', () => {
    test('should generate random number (without offset)', () => {
        // Arrange
        const lower = 0;
        const upper = 25;
        const sut = new NumberGenerator(lower, upper);

        // Act
        const sortedRandomValues = Array(500)
            .fill(undefined)
            .map(() => sut.generate());

        // Assert
        expect(sortedRandomValues.find(n => n === lower)).not.toBeUndefined();
        expect(sortedRandomValues.find(n => n === upper)).not.toBeUndefined();
        expect(sortedRandomValues.every(n => n >= lower && n <= upper)).toBeTruthy();
    });

    test('should generate random number (with offset)', () => {
         // Arrange
         const lower = 25;
         const upper = 50;
         const sut = new NumberGenerator(lower, upper);

         // Act
         const sortedRandomValues = Array(500)
            .fill(undefined)
            .map(() => sut.generate());

         // Assert
         expect(sortedRandomValues.find(n => n === lower)).not.toBeUndefined();
         expect(sortedRandomValues.find(n => n === upper)).not.toBeUndefined();
         expect(sortedRandomValues.every(n => n >= lower && n <= upper)).toBeTruthy();
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
