import { createInjector, Fixture, PrimitiveType, Extension } from '..';
import { TypeBuilder } from '../builder';

const userType = 'User';
const addressType = 'Address';
const userBuilder: TypeBuilder<any> = {
    type: userType,
    build: context => {
        return {
            firstName: context.create(PrimitiveType.string),
            secondName: context.create(PrimitiveType.string),
            address: context.create(addressType),
            isValidated: context.create(PrimitiveType.boolean)
        };
    }
};
const addressBuilder: TypeBuilder<any> = {
    type: addressType,
    build: context => {
        return {
            street: context.create(PrimitiveType.string),
            number: context.create(PrimitiveType.number),
            zipcode: context.create(PrimitiveType.number),
            country: context.create(PrimitiveType.string)
        };
    }
};
const userExtension = new Extension();
userExtension.add(userBuilder);
userExtension.add(addressBuilder);
const withFixture = createInjector(() => new Fixture().extend(userExtension));

describe('Mixtape', () => {
    // Create simple type(s)

    // Create custom type(s)

    // Freeze

    // Use
    test('should be able to freeze type', withFixture(fixture => {
        // Arrange and act
        fixture.freeze(PrimitiveType.string);
        const [firstNumber, secondNumber] = fixture.createMany(PrimitiveType.number, 2);
        const [firstString, secondString] = fixture.createMany(PrimitiveType.string, 2);

        // Assert
        expect(firstNumber).not.toBe(secondNumber);
        expect(firstString).toBe(secondString);
    }));

    test('should create injector that handles async code', withFixture(async fixture => {
        // Arrange
        const echo = (value, delay) => new Promise(resolve => setTimeout(() => resolve(value), delay));
        const valueToEcho = fixture.create(PrimitiveType.string);
        const timeToDelay = fixture.create(PrimitiveType.number);

        // Act
        const result = await echo(valueToEcho, timeToDelay);

        // Assert
        expect(result).toBe(valueToEcho);
    }));

    // Custom build type

    // From template
});
