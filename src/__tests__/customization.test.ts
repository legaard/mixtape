import * as uuid from 'uuid/v4';

import Customization from '../customization';

describe('Customization', () => {
    test('should be able to add builder', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();

        // Act
        sut.add({
            typeName: builderName,
            build: () => undefined
        });

        // Assert
        expect(sut.builders[0].typeName).toBe(builderName);
        expect(sut.builders.length).toBe(1);
    })
    
    test('should be able to remove builder', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();

        // Act
        sut.add({
            typeName: builderName,
            build: () => undefined
        });
        sut.remove(builderName);

        // Assert
        expect(sut.builders.length).toBe(0);
    })

    test('should overwrite existing builders for type', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();
        const createdValue = uuid();

        // Act
        sut.add({
            typeName: builderName,
            build: () => undefined
        });
        sut.add({
            typeName: builderName,
            build: () => createdValue
        });

        // Assert
        expect(sut.builders[0].typeName).toBe(builderName);
        expect(sut.builders.length).toBe(1);
        expect(sut.builders[0].build(undefined)).toBe(createdValue);
    })

    test('should be able to call remove for builder that does not exist', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();

        // Act
        sut.remove(builderName);

        // Assert
        expect(sut.builders.length).toBe(0);
    })

    test('should be able to add more than one builder', () => {
        // Arrange
        const sut = new Customization();
        const numberOfBuilders = Math.floor((Math.random() * 10) + 1);

        // Act
        for(let i = 0; i < numberOfBuilders; i++) {
            sut.add({
                typeName: uuid(),
                build: () => undefined
            });
        }
        
        // Assert
        expect(sut.builders.length).toBe(numberOfBuilders);
    })
})