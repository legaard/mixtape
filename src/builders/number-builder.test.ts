import NumberBuilder from './number-builder';

describe('NumberBuilder', () => {
    test('should generate numbers', () => {
        // Arrange
        const sut = new NumberBuilder();

        // Act
        const createdType = sut.create();        

        // Assert
        expect(typeof(createdType) === 'number').toBeTruthy();
    })

    test('should generate numbers between 1 and 100', () => {
        // Arrange
        const sut = new NumberBuilder();
        const sampleSize = 100;

        // Act and assert
        for(let i = 0; i < sampleSize; i++) {
            const createdType = sut.create();
            expect(createdType >= 1).toBeTruthy();
            expect(createdType <= 100).toBeTruthy();
        }
    })

    test('should have correct value of typeName', () => {
        // Arrange
        const sut = new NumberBuilder();

        // Act and assert
        expect(sut.typeName).toEqual('number');
    }) 
})