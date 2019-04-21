import { createInjector } from '../injector';
import { Fixture } from '../index';

describe('createInjector (synchronous)', () => {
    test('should call constructor function', () => {
        // Arrange
        const constructorFunctionMock = jest.fn(() => ({ reset: () => {} }) as Fixture);
        const sut = createInjector(constructorFunctionMock);

        // Act
        sut(() => {})();

        // Assert
        expect(constructorFunctionMock).toHaveBeenCalledTimes(1);
    });

    test('should call test function with fixture as parameter', () => {
        // Arrange
        const fixture = { reset: () => {} } as Fixture;
        const testFunctionMock = jest.fn();
        const sut = createInjector(() => fixture);

        // Act
        sut(testFunctionMock)();

        // Assert
        expect(testFunctionMock).toHaveBeenCalledTimes(1);
        expect(testFunctionMock).toHaveBeenCalledWith(fixture);
    });

    test("should call 'reset' on fixture returned by the constructor function", () => {
        // Arrange
        const resetFunctionMock = jest.fn();
        const sut = createInjector(() => ({ reset: resetFunctionMock as any }) as Fixture);

        // Act
        sut(() => {})();

        // Assert
        expect(resetFunctionMock).toHaveBeenCalledTimes(1);
    });

    test('should execute test function before resetting fixture', () => {
        // Arrange
        const resetAndTestFunctionMock = jest.fn();
        const fixture = { reset: resetAndTestFunctionMock as any } as Fixture;
        const sut = createInjector(() => fixture);

        // Act
        sut(resetAndTestFunctionMock)();

        // Assert
        expect(resetAndTestFunctionMock).toHaveBeenCalledTimes(2);
        expect(resetAndTestFunctionMock).toHaveBeenNthCalledWith(1, fixture);
        expect(resetAndTestFunctionMock).toHaveBeenNthCalledWith(2);
    });
});

describe('createInjector (asynchronous)', () => {
    test('should call constructor function', async () => {
        // Arrange
        const constructorFunctionMock = jest.fn(() => ({ reset: () => {} }) as Fixture);
        const sut = createInjector(constructorFunctionMock);

        // Act
        await sut(() => Promise.resolve())();

        // Assert
        expect(constructorFunctionMock).toHaveBeenCalledTimes(1);
    });

    test('should call test function with fixture as parameter', async () => {
        // Arrange
        const fixture = { reset: () => {} } as Fixture;
        const testFunctionMock = jest.fn().mockReturnValue(Promise.resolve());
        const sut = createInjector(() => fixture);

        // Act
        await sut(testFunctionMock)();

        // Assert
        expect(testFunctionMock).toHaveBeenCalledTimes(1);
        expect(testFunctionMock).toHaveBeenCalledWith(fixture);
    });

    test("should call 'reset' on fixture returned by the constructor function", async () => {
        // Arrange
        const resetFunctionMock = jest.fn();
        const sut = createInjector(() => ({ reset: resetFunctionMock as any }) as Fixture);

        // Act
        await sut(() => Promise.resolve())();

        // Assert
        expect(resetFunctionMock).toHaveBeenCalledTimes(1);
    });

    test('should execute test function before resetting fixture', async () => {
        // Arrange
        const resetAndTestFunctionMock = jest.fn().mockReturnValueOnce(Promise.resolve());
        const fixture = { reset: resetAndTestFunctionMock as any } as Fixture;
        const sut = createInjector(() => fixture);

        // Act
        await sut(resetAndTestFunctionMock)();

        // Assert
        expect(resetAndTestFunctionMock).toHaveBeenCalledTimes(2);
        expect(resetAndTestFunctionMock).toHaveBeenNthCalledWith(1, fixture);
        expect(resetAndTestFunctionMock).toHaveBeenNthCalledWith(2);
    });
});
