import * as uuid from 'uuid/v4';

import { Extension } from '../extension';
import { TypeBuilder } from '../builder';

describe('Extension', () => {
    test("should add builder to the 'builders' property", () => {
        // Arrange
        const sut = new Extension();
        const builderType = uuid();
        const dummyBuilder: TypeBuilder<any> = {
            type: builderType,
            build: undefined
        };

        // Act
        sut.add(dummyBuilder);

        // Assert
        expect(sut.builders.length).toBe(1);
        expect(sut.builders[0]).toEqual(dummyBuilder);
    });

    test("should add multiple builders to the 'builders' property", () => {
        // Arrange
        const sut = new Extension();
        const numberOfBuilders = Math.floor((Math.random() * 10) + 1);

        // Act
        for (let i = 0; i < numberOfBuilders; i++) {
            sut.add({
                type: uuid(),
                build: undefined
            });
        }

        // Assert
        expect(sut.builders.length).toBe(numberOfBuilders);
    });

    test('should add builder with no aliases', () => {
        // Arrange
        const sut = new Extension();
        const builderType = uuid();
        const dummyBuilder: TypeBuilder<any> = {
            type: builderType,
            build: undefined
        };

        // Act
        sut.add(dummyBuilder);
        const builderFromType = sut.get(builderType);

        // Assert
        expect(builderFromType).toEqual(dummyBuilder);
    });

    test('should add builder with aliases', () => {
        // Arrange
        const sut = new Extension();
        const builderType = uuid();
        const builderTypeAlias = uuid();
        const dummyBuilder: TypeBuilder<any> = {
            aliases: [builderTypeAlias],
            type: builderType,
            build: undefined
        };

        // Act
        sut.add(dummyBuilder);
        const builderFromType = sut.get(builderType);
        const builderFromAlias = sut.get(builderTypeAlias);

        // Assert
        expect(builderFromType).toEqual(dummyBuilder);
        expect(builderFromAlias).toEqual(dummyBuilder);
    });

    test("should return 'undefined' when no type or alias exist for builder", () => {
        // Arrange
        const sut = new Extension();
        sut.add({
            aliases: [uuid()],
            type: uuid(),
            build: undefined
        });

        // Act
        const builder = sut.get(uuid());

        // Assert
        expect(builder).toBeUndefined();
    });

    test('should remove builder and associated alias', () => {
        // Arrange
        const sut = new Extension();
        const builderType = uuid();
        const builderTypeAlias = uuid();
        sut.add({
            aliases: [builderTypeAlias],
            type: builderType,
            build: undefined
        });

        // Act
        sut.remove(builderType);
        const builderFromType = sut.get(builderType);
        const builderFromAlias = sut.get(builderTypeAlias);

        // Assert
        expect(builderFromType).toBeUndefined();
        expect(builderFromAlias).toBeUndefined();
    });

    test('should do nothing when trying to remove builder using alias', () => {
        // Arrange
        const sut = new Extension();
        const builderType = uuid();
        const builderTypeAlias = uuid();
        const dummyBuilder: TypeBuilder<any> = {
            aliases: [builderTypeAlias],
            type: builderType,
            build: undefined
        };
        sut.add(dummyBuilder);

        // Act
        sut.remove(builderTypeAlias);
        const builderFromType = sut.get(builderType);
        const builderFromAlias = sut.get(builderTypeAlias);

        // Assert
        expect(builderFromType).not.toBeUndefined();
        expect(builderFromAlias).not.toBeUndefined();
    });

    test('should throw Error if builder for same type already exists', () => {
        // Arrange
        const sut = new Extension();
        const builderType = uuid();
        sut.add({
            type: builderType,
            build: undefined
        });

        // Act and assert
        expect(() => sut.add({type: builderType, build: undefined}))
            .toThrowError(new Error(`Builder for type '${builderType}' already exists`));
    });

    test('should throw Error if builder for same alias already exists', () => {
        // Arrange
        const sut = new Extension();
        const alias = uuid();
        const typeForExistingBuilder = uuid();
        sut.add({
            aliases: [uuid(), alias],
            type: typeForExistingBuilder,
            build: undefined
        });

        // Act and assert
        expect(() => sut.add({type: uuid(), aliases: [alias], build: undefined}))
            .toThrowError(new Error(`Builder for type '${typeForExistingBuilder}' also contains alias '${alias}'`));
    });

    test('should remove for builder that does not exist', () => {
        // Arrange
        const sut = new Extension();
        const builderName = uuid();

        // Act
        sut.remove(builderName);

        // Assert
        expect(sut.builders.length).toBe(0);
    });

    test('should clear added builders', () => {
        // Arrange
        const sut = new Extension();
        const numberOfBuilders = Math.floor((Math.random() * 10) + 1);
        for (let i = 0; i < numberOfBuilders; i++) {
            sut.add({
                type: uuid(),
                aliases: [uuid()],
                build: undefined
            });
        }

        // Act
        sut.clear();

        // Assert
        expect(sut.builders.length).toBe(0);
    });
});
