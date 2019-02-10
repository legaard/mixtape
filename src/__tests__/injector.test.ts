import { createInjector } from '../injector';
import { Fixture } from '../';

describe('createInjector', () => {
    test('should call constructor function', () => {
        // Arrange
        const mockConstructorFunction = jest.fn(() => ({ reset: () => {} }) as Fixture);
        const sut = createInjector(mockConstructorFunction);

        // Act
        sut(() => {})();

        // Assert
        expect(mockConstructorFunction).toHaveBeenCalledTimes(1);
    });

    test('should call test function with fixture as parameter', () => {
        // Arrange
        const fixture = { reset: () => {} } as Fixture;
        const mockTestFunc = jest.fn(() => {});
        const sut = createInjector(() => fixture);

        // Act
        sut(mockTestFunc)();

        // Assert
        expect(mockTestFunc).toHaveBeenCalledTimes(1);
        expect(mockTestFunc).toHaveBeenCalledWith(fixture);
    });

    test("should call 'reset' on fixture from constructor function", () => {
        // Arrange
        const resetMockFunction = jest.fn();
        const sut = createInjector(() => ({ reset: resetMockFunction as any }) as Fixture);

        // Act
        sut(() => {})();

        // Assert
        expect(resetMockFunction).toHaveBeenCalledTimes(1);
    });
});
