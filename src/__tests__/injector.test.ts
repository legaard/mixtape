import { createInjector } from '../injector';
import { Fixture } from '../index';

describe('createInjector (synchronous)', () => {
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
        const mockTestFunc = jest.fn();
        const sut = createInjector(() => fixture);

        // Act
        sut(mockTestFunc)();

        // Assert
        expect(mockTestFunc).toHaveBeenCalledTimes(1);
        expect(mockTestFunc).toHaveBeenCalledWith(fixture);
    });

    test("should call 'reset' on fixture returned by the constructor function", () => {
        // Arrange
        const resetMockFunction = jest.fn();
        const sut = createInjector(() => ({ reset: resetMockFunction as any }) as Fixture);

        // Act
        sut(() => {})();

        // Assert
        expect(resetMockFunction).toHaveBeenCalledTimes(1);
    });

    test('should execute test function before resetting fixture', () => {
        // Arrange
        const mockFunction = jest.fn();
        const fixture = { reset: mockFunction as any } as Fixture;
        const sut = createInjector(() => fixture);

        // Act
        sut(mockFunction)();

        // Assert
        expect(mockFunction).toHaveBeenCalledTimes(2);
        expect(mockFunction).toHaveBeenNthCalledWith(1, fixture);
        expect(mockFunction).toHaveBeenNthCalledWith(2);
    });
});

describe('createInjector (asynchronous)', () => {
    test('should call constructor function', async () => {
        // Arrange
        const mockConstructorFunction = jest.fn(() => ({ reset: () => {} }) as Fixture);
        const sut = createInjector(mockConstructorFunction);

        // Act
        await sut(() => Promise.resolve())();

        // Assert
        expect(mockConstructorFunction).toHaveBeenCalledTimes(1);
    });

    test('should call test function with fixture as parameter', async () => {
        // Arrange
        const fixture = { reset: () => {} } as Fixture;
        const mockTestFunc = jest.fn(() => Promise.resolve());
        const sut = createInjector(() => fixture);

        // Act
        await sut(mockTestFunc)();

        // Assert
        expect(mockTestFunc).toHaveBeenCalledTimes(1);
        expect(mockTestFunc).toHaveBeenCalledWith(fixture);
    });

    test("should call 'reset' on fixture returned by the constructor function", async () => {
        // Arrange
        const resetMockFunction = jest.fn();
        const sut = createInjector(() => ({ reset: resetMockFunction as any }) as Fixture);

        // Act
        await sut(() => Promise.resolve())();

        // Assert
        expect(resetMockFunction).toHaveBeenCalledTimes(1);
    });

    test('should execute test function before resetting fixture', async () => {
        // Arrange
        const mockFunction = jest.fn()
            .mockImplementationOnce(() => Promise.resolve())
            .mockImplementationOnce(() => {});
        const fixture = { reset: mockFunction as any } as Fixture;
        const sut = createInjector(() => fixture);

        // Act
        await sut(mockFunction)();

        // Assert
        expect(mockFunction).toHaveBeenCalledTimes(2);
        expect(mockFunction).toHaveBeenNthCalledWith(1, fixture);
        expect(mockFunction).toHaveBeenNthCalledWith(2);
    });
});
