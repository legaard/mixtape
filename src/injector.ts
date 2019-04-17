import { Fixture } from './fixture';

/**
 * Create injector function for tests
 * @param constructorFunc - function used for constructing fixtures
 * @returns function which can be used to inject fixtures in tests
 */
export function createInjector(constructorFunc: () => Fixture) {
    return (testFunc: (fixture: Fixture) => void) => {
        return () => {
            const fixture: Fixture = constructorFunc();

            try {
                testFunc(fixture);
            } finally {
                fixture.reset();
            }
        };
    };
}

/**
 * Create async injector function for tests
 * @param constructorFunc - function used for constructing fixtures
 * @returns function which can be used to inject fixtures in tests
 */
export function createAsyncInjector(constructorFunc: () => Fixture) {
    return (testFunc: (fixture: Fixture) => Promise<void>) => {
        return async () => {
            const fixture: Fixture = constructorFunc();

            try {
                await testFunc(fixture);
            } finally {
                fixture.reset();
            }
        };
    };
}
