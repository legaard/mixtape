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
