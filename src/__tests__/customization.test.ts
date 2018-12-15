import * as uuid from 'uuid/v4';

import Customization from '../customization';

describe('Customization', () => {
    test('should add builder', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();

        // Act
        sut.add({
            type: builderName,
            build: () => undefined
        });

        // Assert
        expect(sut.builders[0].type).toBe(builderName);
        expect(sut.builders.length).toBe(1);
    });

    test('should remove builder', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();
        sut.add({
            type: builderName,
            build: () => undefined
        });

        // Act
        sut.remove(builderName);

        // Assert
        expect(sut.builders.length).toBe(0);
    });

    test('should overwrite existing builder', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();
        const createdValue = uuid();

        // Act
        sut.add({
            type: builderName,
            build: () => undefined
        });
        sut.add({
            type: builderName,
            build: () => createdValue
        });

        // Assert
        expect(sut.builders[0].type).toBe(builderName);
        expect(sut.builders.length).toBe(1);
        expect(sut.builders[0].build(undefined)).toBe(createdValue);
    });

    test('should remove for builder that does not exist', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();

        // Act
        sut.remove(builderName);

        // Assert
        expect(sut.builders.length).toBe(0);
    });

    test('should add more than one builder', () => {
        // Arrange
        const sut = new Customization();
        const numberOfBuilders = Math.floor((Math.random() * 10) + 1);

        // Act
        for (let i = 0; i < numberOfBuilders; i++) {
            sut.add({
                type: uuid(),
                build: () => undefined
            });
        }

        // Assert
        expect(sut.builders.length).toBe(numberOfBuilders);
    });

    test('should get builder from type', () => {
        // Arrange
        const type = uuid();
        const sut = new Customization();
        sut.add({
            type: uuid(),
            build: () => undefined
        });

        // Act
        sut.add({
            type,
            build: () => undefined
        });
        const builder = sut.get(type);

        // Assert
        expect(builder.type).toBe(type);
    });

    test('should get builder from alias', () => {
        // Arrange
        const type = uuid();
        const aliasName = uuid();
        const sut = new Customization();
        sut.add({
            type,
            build: () => undefined
        });

        // Act
        sut.add({
            type: uuid(),
            aliases: [{ name: aliasName, type }, {name: uuid(), type: uuid()}],
            build: () => undefined
        });
        const builder = sut.get(aliasName);

        // Assert
        expect(builder.type).toBe(type);
    });

    test('should return \'undefined\' when no type or alias exist for builder', () => {
        // Arrange
        const sut = new Customization();
        sut.add({
            type: uuid(),
            build: () => undefined
        });

        // Act
        const builder = sut.get(uuid());

        // Assert
        expect(builder).toBeUndefined();
    });

    test('should return \'undefined\' when no builder exists for alias', () => {
        // Arrange
        const sut = new Customization();
        const name = uuid();
        sut.add({
            type: uuid(),
            aliases: [{name, type: uuid()}],
            build: () => undefined
        });

        // Act
        const builder = sut.get(name);

        // Assert
        expect(builder).toBeUndefined();
    });

    test('should clear added builders', () => {
        // Arrange
        const sut = new Customization();
        const numberOfBuilders = Math.floor((Math.random() * 10) + 1);
        for (let i = 0; i < numberOfBuilders; i++) {
            const type = uuid();
            sut.add({
                type,
                aliases: [{ name: uuid(), type}],
                build: () => undefined
            });
        }

        // Act
        sut.clear();

        // Assert
        expect(sut.builders.length).toBe(0);
    });
});
