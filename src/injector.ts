import { Fixture } from './fixture';

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
