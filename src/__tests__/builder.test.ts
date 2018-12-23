import { Builder } from '../builder';
import uuid = require('uuid');

describe('Builder', () => {
    test('should set type', () => {
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

    test('should add to type alias to list', () => {
        // Arrange
        const alias = uuid();
        const type = uuid();

        class TestBuilder extends Builder<undefined> {
            constructor() {
                super(undefined);
                this.createAlias(alias, type);
            }
            build(): undefined {
                return undefined;
            }
        }

        // Act
        const sut = new TestBuilder();

        // Assert
        expect(sut.aliases[0].alias).toBe(alias);
        expect(sut.aliases[0].type).toBe(type);
    });
});
