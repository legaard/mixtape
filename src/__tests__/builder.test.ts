import { v4 as uuid } from 'uuid';

import { Builder } from '../builder';

describe('Builder', () => {
    test('should set type on initialization', () => {
        // Arrange
        const builderName = uuid();

        class TestBuilder extends Builder<undefined> {
            constructor() {
                super(builderName);
            }

            build(): undefined {
                return undefined;
            }
        }

        // Act
        const sut = new TestBuilder();

        // Assert
        expect(sut.type).toBe(builderName);
    });

    test('should add two type aliases to list', () => {
        // Arrange
        const aliasOne = uuid();
        const aliasTwo = uuid();

        class TestBuilder extends Builder<undefined> {
            constructor() {
                super(undefined);
                this.createAlias(aliasOne);
                this.createAlias(aliasTwo);
            }

            build(): undefined {
                return undefined;
            }
        }

        // Act
        const sut = new TestBuilder();

        // Assert
        expect(sut.aliases.length).toBe(2);
        expect(sut.aliases[0]).toBe(aliasOne);
        expect(sut.aliases[1]).toBe(aliasTwo);
    });
});
