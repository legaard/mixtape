import * as uuid from 'uuid/v4';

import Customization from './customization';

describe('Customization', () => {
    test('should be able to add builder', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();

        // Act
        sut.addBuilder({
            typeName: builderName,
            create: () => undefined
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
        sut.addBuilder({
            typeName: builderName,
            create: () => undefined
        });
        sut.removeBuilder(builderName);

        // Assert
        expect(sut.builders.length).toBe(0);
    })

    test('should overwrite existing builders for type', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();
        const createdValue = uuid();

        // Act
        sut.addBuilder({
            typeName: builderName,
            create: () => undefined
        });
        sut.addBuilder({
            typeName: builderName,
            create: () => createdValue
        });

        // Assert
        expect(sut.builders[0].typeName).toBe(builderName);
        expect(sut.builders.length).toBe(1);
        expect(sut.builders[0].create(undefined)).toBe(createdValue);
    })

    test('should be able to call remove for builder that does not exist', () => {
        // Arrange
        const sut = new Customization();
        const builderName = uuid();

        // Act
        sut.removeBuilder(builderName);

        // Assert
        expect(sut.builders.length).toBe(0);
    })

    test('should be able to add more than one builder', () => {
        // Arrange
        const sut = new Customization();
        const numberOfBuilders = Math.floor((Math.random() * 10) + 1);

        // Act
        for(let i = 0; i < numberOfBuilders; i++) {
            sut.addBuilder({
                typeName: uuid(),
                create: () => undefined
            });
        }
        
        // Assert
        expect(sut.builders.length).toBe(numberOfBuilders);
    })
})