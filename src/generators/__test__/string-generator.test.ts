import StringGenerator from '../string-generator';

describe('String Generator', () => {
    test('should generate random string', () => {
        // Arrange
        const sut = new StringGenerator();

        // Act
        const randomValues = Array(10).fill(undefined).map(() => sut.generate());

        expect(randomValues.every(v => (randomValues.filter(f => f === v).length) === 1)).toBeTruthy();
    })
})