import StringBuilder from './string-builder';

describe('StringBuilder', () => {
    test('should generate strings', () => {
        // Arrange
        const sut = new StringBuilder();

        // Act
        const createdType = sut.create();

        // Assert
        expect(typeof(createdType) === 'string').toBeTruthy();
    })

    test('should generate random strings', () => {
        // Arrange
        const sut = new StringBuilder();

        const stringOne = sut.create();
        const stringTwo = sut.create();

        // Act and assert
        expect(stringOne).not.toEqual(stringTwo);
    })

    test('should have correct value of typeName', () => {
        // Arrange
        const sut = new StringBuilder();

        // Act and assert
        expect(sut.typeName).toEqual('string');
    }) 
})