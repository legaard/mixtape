import { UndefinedBuilder } from '../undefined-builder';

describe('UndefinedBuilder', () => {
    test('should return undefined', () => {
        // Arrange
        const sut = new UndefinedBuilder();

        // Act and assert
        expect(sut.build()).toBeUndefined();
    });

    test("should have correct value of property 'type'", () => {
        // Arrange
        const sut = new UndefinedBuilder();

        // Act and assert
        expect(sut.type).toBe('undefined');
    });
});
