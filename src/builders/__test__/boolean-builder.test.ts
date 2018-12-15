import { BooleanBuilder } from '../boolean-builder';

describe('BooleanBuilder', () => {
    test('should return true', () => {
        // Arrange
        const sut = new BooleanBuilder();

        // Act and assert
        expect(sut.build()).toBeTruthy();
    });

    test('should have correct value of property \'type\'', () => {
        // Arrange
        const sut = new BooleanBuilder();

        // Act and assert
        expect(sut.type).toBe('boolean');
    });
});
