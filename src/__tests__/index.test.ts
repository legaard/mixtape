import * as index from '../index';

describe('index', () => {
    test('should export things correctly', () => {
        // Arrange, act and assert
        expect(index).toMatchSnapshot();
    });

    test('should configure exported Fixture', () => {
        // Arrange
        const { Fixture } = index;
        const sut = new Fixture();

        // Act and assert
        expect(sut).toMatchSnapshot();
    });
});
