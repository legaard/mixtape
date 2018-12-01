import NumberBuilder from '../number-builder';

describe('NumberBuilder', () => {
    test('should generate number', () => {
        // Arrange
        const value = 100;
        const sut = new NumberBuilder({
            generate: () => value
        });

        // Act and assert
        expect(sut.build()).toBe(100);
    })

    test('should have correct value of typeName', () => {
        // Arrange
        const sut = new NumberBuilder(null);

        // Act and assert
        expect(sut.typeName).toBe('number');
    }) 
})