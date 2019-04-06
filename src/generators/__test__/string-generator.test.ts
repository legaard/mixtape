import validator from 'validator';

import { StringGenerator } from '../string-generator';

describe('String Generator', () => {
    test('should generate strings (UUID)', () => {
        // Arrange
        const sut = new StringGenerator();

        // Act
        const value = sut.generate();

        // Assert
        expect(typeof value === 'string').toBeTruthy();
        expect(validator.isUUID(value)).toBeTruthy();
    });

    test('should generate random string', () => {
        // Arrange
        const sut = new StringGenerator();

        // Act
        const randomValues = Array(10).fill(undefined).map(() => sut.generate());

        // Assert
        expect(randomValues.every(v => (randomValues.filter(f => f === v).length) === 1)).toBeTruthy();
    });

    test('should generate random string with prefix', () => {
        // Arrange
        const prefix = 'prefix';
        const sut = new StringGenerator(prefix);

        // Act
        const randomValues = Array(10).fill(undefined).map(() => sut.generate());

        // Assert
        expect(randomValues.every(v => v.includes(prefix))).toBeTruthy();
    });
});
