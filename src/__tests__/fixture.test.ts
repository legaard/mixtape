import { v4 as uuid } from 'uuid';

import { Fixture, FixtureContext } from '../fixture';
import { TypeBuilder, Builder } from '../builder';
import { Extension } from '../extension';
import { ValueGenerator } from '../generators';

describe('Fixture', () => {
    test('should create simple type', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        const value = uuid();
        sut.extensions.add({
            type,
            build: () => value
        });

        // Act
        const createdType = sut.create<string>(type);

        // Assert
        expect(createdType).toBe(value);
    });

    test('should throw error when no builder is added for type', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();

        // Act and assert
        expect(() => sut.create<string>(type))
            .toThrowError(new Error(`No builder defined for type or alias '${type}'`));
    });

    test('should create composite type (assertable values)', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.extensions.add(new FullNameBuilder());
        sut.extensions.add(new AgeBuilder());
        sut.extensions.add(new GenderBuilder());
        sut.extensions.add(new ContactInformationBuilder());
        sut.extensions.add(new AddressBuilder());
        sut.extensions.add(new PersonBuilder());

        // Act
        const createdType = sut.create<Person>('Person');

        // Assert
        expect(createdType.fullName.firstName).toBe('Marty');
        expect(createdType.fullName.lastName).toBe('McFly');
        expect(createdType.age).toBe(17);
        expect(createdType.gender).toBe('MALE');
        expect(createdType.contactInformation.mail).toBe('marty@bttf.now');
        expect(createdType.contactInformation.phoneNumber).toBe('(852) 998-8296');
        expect(createdType.contactInformation.address.country).toBe('USA');
        expect(createdType.contactInformation.address.street).toBe('9303 Lyon Drive');
        expect(createdType.contactInformation.address.zipCode).toBe(95420);
    });

    test('should create composite types (random values)', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.extensions.add(new CardTypeBuilder());
        sut.extensions.add(new CardNumberBuilder());
        sut.extensions.add(new MaskedCardNumberBuilder());
        sut.extensions.add(new CardBuilder());

        // Act
        const cardOne = sut.create<Card>('Card');
        const cardTwo = sut.create<Card>('Card');

        // Assert
        expect(cardOne.cardNumber.value).not.toBe(cardTwo.cardNumber.value);
        expect(cardOne.cardType).not.toBe(cardTwo.cardType);
        expect(cardOne.maskedCardNumber).not.toBe(cardTwo.maskedCardNumber);
    });

    test('should create type from alias', () => {
         // Arrange
        const sut = new Fixture(null);
        sut.extensions.add(new CardTypeBuilder());
        sut.extensions.add(new CardNumberBuilder());
        sut.extensions.add(new MaskedCardNumberBuilder());
        sut.extensions.add(new CardBuilder());

        // Act
        const cardDigitsOne = sut.create<CardNumber>('CardDigits');
        const cardDigitsTwo = sut.create<CardNumber>('CardDigits');

        // Assert
        expect(cardDigitsOne).not.toEqual(cardDigitsTwo);
    });

    test('should freeze simple type', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        sut.extensions.add({
            type,
            build: () => uuid()
        });

        // Act
        sut.freeze(type);
        const arrayOfTypes = Array(5).fill(undefined).map(() => sut.create<string>(type));
        const referenceType = arrayOfTypes[0];

        // Assert
        arrayOfTypes.forEach(v => expect(v).toBe(referenceType));
    });

    test('should freeze composite type', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.extensions.add(new CardTypeBuilder());
        sut.extensions.add(new CardNumberBuilder());
        sut.extensions.add(new MaskedCardNumberBuilder());
        sut.extensions.add(new CardBuilder());

        // Act
        sut.freeze('Card');
        const cardOne = sut.create<Card>('Card');
        const cardTwo = sut.create<Card>('Card');

        // Assert
        expect(cardOne).toEqual(cardTwo);
    });

    test('should freeze value (only) for alias', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.extensions.add(new CardTypeBuilder());
        sut.extensions.add(new CardNumberBuilder());
        sut.extensions.add(new MaskedCardNumberBuilder());
        sut.extensions.add(new CardBuilder());

        // Act
        sut.freeze('CardDigits');
        const cardDigitsOne = sut.create<CardNumber>('CardDigits');
        const cardDigitsTwo = sut.create<CardNumber>('CardDigits');
        const cardNumberOne = sut.create<CardNumber>('CardNumber');
        const cardNumberTwo = sut.create<CardNumber>('CardNumber');

        // Assert
        expect(cardDigitsOne).toEqual(cardDigitsTwo);
        expect(cardNumberOne).not.toEqual(cardNumberTwo);
    });

    test('should deep clone for frozen values', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.extensions.add(new CardTypeBuilder());
        sut.extensions.add(new CardNumberBuilder());
        sut.extensions.add(new MaskedCardNumberBuilder());
        sut.extensions.add(new CardBuilder());

        // Act
        sut.freeze('Card');
        const cardOne = sut.create<Card>('Card');
        const cardTwo = sut.create<Card>('Card');
        cardOne.cardNumber.value = uuid();

        // Assert
        expect(cardOne.cardNumber.value).not.toBe(cardTwo.cardNumber.value);
    });

    test("should be idempotent when calling 'freeze'", () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        sut.extensions.add({
            type,
            build: () => uuid()
        });

        // Act
        sut.freeze(type);
        const firstValue = sut.create<string>(type);
        sut.freeze(type);
        const secondValue = sut.create<string>(type);

        // Assert
        expect(firstValue).toBe(secondValue);
    });

    test('should freeze and reset', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.extensions.add(new CardTypeBuilder());
        sut.extensions.add(new CardNumberBuilder());
        sut.extensions.add(new MaskedCardNumberBuilder());
        sut.extensions.add(new CardBuilder());

        // Act
        sut.freeze('Card');
        sut.reset();
        const cardOne = sut.create<Card>('Card');
        const cardTwo = sut.create<Card>('Card');

        // Assert
        expect(cardOne).not.toEqual(cardTwo);
    });

    test("should throw if no builder exists when calling 'freeze'", () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();

        // Act and assert
        expect(() => sut.freeze(type))
            .toThrowError(new ReferenceError(`No builder defined for type or alias '${type}'`));
    });

    test('should use type with specific value', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        sut.extensions.add({
            type,
            build: () => uuid()
        });

        // Act
        const typeToUse = uuid();
        sut.use<string>(type, typeToUse);
        const arrayOfTypes = Array(10).fill(undefined).map(() => sut.create<string>(type));

        // Assert
        arrayOfTypes.forEach(v => expect(v).toBe(typeToUse));
    });

    test('should use and reset', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.extensions.add(new CardTypeBuilder());
        sut.extensions.add(new CardNumberBuilder());
        sut.extensions.add(new MaskedCardNumberBuilder());
        sut.extensions.add(new CardBuilder());

        // Act
        const cardOne = sut.create<Card>('Card');
        sut.use('Card', cardOne);
        sut.reset();
        const cardTwo = sut.create<Card>('Card');

        // Assert
        expect(cardOne).not.toEqual(cardTwo);
    });

    test('should add builders from Extension', () => {
        // Arrange
        const sut = new Fixture(null);
        const extension = new Extension();
        extension.add(new FullNameBuilder());
        extension.add(new AgeBuilder());
        extension.add(new GenderBuilder());
        extension.add(new ContactInformationBuilder());
        extension.add(new AddressBuilder());
        extension.add(new PersonBuilder());

        // Act
        sut.extend(extension);
        const createdType = sut.create<Person>('Person');

        // Assert
        expect(Object.keys(createdType).every(k => createdType[k] !== undefined)).toBeTruthy();
    });

    test('should add builders from multiple Extensions', () => {
        // Arrange
        const sut = new Fixture(null);
        const extensionOne = new Extension();
        const extensionTwo = new Extension();
        extensionOne.add(new FullNameBuilder());
        extensionOne.add(new AgeBuilder());
        extensionOne.add(new GenderBuilder());
        extensionTwo.add(new ContactInformationBuilder());
        extensionTwo.add(new AddressBuilder());
        extensionTwo.add(new PersonBuilder());

        // Act
        sut.extend(extensionOne).extend(extensionTwo);
        const createdType = sut.create<Person>('Person');

        // Assert
        expect(Object.keys(createdType).every(k => createdType[k] !== undefined)).toBeTruthy();
    });

    test('should build type with custom values', () => {
        // Arrange
        const sut = new Fixture(null);
        const newMail = uuid();
        const newStreet = uuid();
        sut.extensions.add(new ContactInformationBuilder());
        sut.extensions.add(new AddressBuilder());

        // Act
        const createdType = sut
            .build<ContactInformation>('ContactInformation')
            .with('mail', () => newMail)
            .with('address', a => ({ ...a, street: newStreet}))
            .create();

        // Assert
        expect(createdType.mail).toBe(newMail);
        expect(createdType.phoneNumber).toBe('(852) 998-8296');
        expect(createdType.address.country).toBe('USA');
        expect(createdType.address.street).toBe(newStreet);
        expect(createdType.address.zipCode).toBe(95420);
    });

    test('should build object from template', () => {
        // Arrange
        const sut = new Fixture({
            generate: () => 1
        });
        sut.extensions.add(new AgeBuilder());
        sut.extensions.add(new GenderBuilder());
        sut.extensions.add(new ContactInformationBuilder());
        sut.extensions.add(new AddressBuilder());
        const template = {
            gender: 'Gender',
            contactInfo: 'ContactInformation',
            livedIn: ['Address'],
            currentAge: 'Age'
        };

        // Act
        const customObject: any = sut.from(template).create();

        // Assert
        expect(customObject).toHaveProperty('gender');
        expect(typeof customObject.gender).toBe('string');

        expect(customObject).toHaveProperty('contactInfo');
        expect(typeof customObject.contactInfo).toBe('object');

        expect(customObject).toHaveProperty('livedIn');
        expect(customObject.livedIn instanceof Array).toBeTruthy();

        expect(customObject).toHaveProperty('currentAge');
        expect(typeof customObject.currentAge).toBe('number');
    });

    test('should create a list of types with a specific size', () => {
        // Arrange
        const size = 42;
        const sut = new Fixture(null);
        const type = uuid();
        const value = uuid();
        const createFunctionStub = (t: string) => t === type ? value : undefined;
        sut.create = createFunctionStub as any;

        // Act
        const list = sut.createMany<string>(type, size);

        // Assert
        expect(list.length).toBe(size);
        expect(list.every(v => v === value)).toBeTruthy();
    });

    test('should create a list of types with a random size (using the value generator)', () => {
        // Arrange
        const size = 10;
        const valueGeneratorStub: ValueGenerator<number> = {
            generate: () => size
        };
        const createFunctionStub = (t: string) => t === type ? value : undefined;
        const sut = new Fixture(valueGeneratorStub);
        const type = uuid();
        const value = uuid();
        sut.create = createFunctionStub as any;

        // Act
        const list = sut.createMany<string>(type);

        // Assert
        expect(list.length).toBe(size);
        expect(list.every(v => v === value)).toBeTruthy();
    });

    test('should create list of types with fixed size', () => {
        // Arrange
        const size = 5;
        const sut = new Fixture(null);
        const value = uuid();
        sut.create = () => value as any;

        // Act
        const typeList = sut.createMany<string>(undefined, size);

        // Assert
        expect(typeList.length).toBe(size);
        expect(typeList.every(v => v === value)).toBeTruthy();
    });

    test('should add decorators to internal extension', () => {
        // Arrange
        const decoratorMock = jest.fn();

        // Act
        const sut = new Fixture(null, [decoratorMock as any]);
        sut.extensions.add({
            type: uuid(),
            build: () => undefined
        });

        // Assert
        expect(decoratorMock).toBeCalledTimes(1);
    });
});

/**
 * Test data
 */
//#region interfaces for test
interface Person {
    fullName: FullName;
    age: number;
    gender: string;
    contactInformation: ContactInformation;
}

interface FullName {
    firstName: string;
    lastName: string;
}

interface ContactInformation {
    phoneNumber: string;
    mail: string;
    address: Address;
}

interface Address {
    country: string;
    street: string;
    zipCode: number;
}

interface Card {
    cardNumber: CardNumber;
    cardType: string;
    maskedCardNumber: string;
}

interface CardNumber {
    value: string;
}
//#endregion

//#region builders for test
class PersonBuilder implements TypeBuilder<Person> {
    type: string = 'Person';

    build(context: FixtureContext): Person {
        return {
            fullName: context.create<FullName>('FullName'),
            age: context.create<number>('Age'),
            gender: context.create<string>('Gender'),
            contactInformation: context.create<ContactInformation>('ContactInformation')
        };
    }
}

class FullNameBuilder implements TypeBuilder<FullName> {
    type: string = 'FullName';

    build(): FullName {
        return {
            firstName: 'Marty',
            lastName: 'McFly'
        };
    }
}

class GenderBuilder implements TypeBuilder<string> {
    type: string = 'Gender';

    build(): string {
        return 'MALE';
    }
}

class AgeBuilder implements TypeBuilder<number> {
    type: string = 'Age';

    build(): number {
        return 17;
    }
}

class ContactInformationBuilder implements TypeBuilder<ContactInformation> {
    type: string = 'ContactInformation';

    build(context: FixtureContext): ContactInformation {
        return {
            mail: 'marty@bttf.now',
            phoneNumber: '(852) 998-8296',
            address: context.create<Address>('Address')
        };
    }
}

class AddressBuilder implements TypeBuilder<Address> {
    type: string = 'Address';

    build(): Address {
        return {
            country: 'USA',
            street: '9303 Lyon Drive',
            zipCode: 95420
        };
    }
}

class CardBuilder implements TypeBuilder<Card> {
    type: string = 'Card';

    build(context: FixtureContext): Card {
        return {
            cardType: context.create<string>('CardType'),
            cardNumber: context.create<CardNumber>('CardNumber'),
            maskedCardNumber: context.create('MaskedCardNumber')
        };
    }
}

class CardTypeBuilder implements TypeBuilder<string> {
    type: string = 'CardType';

    build(): string {
        return uuid();
    }
}

class CardNumberBuilder extends Builder<CardNumber> {
    constructor() {
        super('CardNumber');
        this.createAlias('CardDigits');
    }

    build(): CardNumber {
        return {
            value: this.generateRandomNumber()
        };
    }

    private generateRandomNumber(): string {
        let cardNumber = '';

        for (let i = 0; i < 15; i++) {
            cardNumber += Math.floor((Math.random() * 9) + 1);
        }

        return cardNumber;
    }
}

class MaskedCardNumberBuilder implements TypeBuilder<string> {
    type: string = 'MaskedCardNumber';

    build(context: FixtureContext): string {
        const cardNumber = context.create<CardNumber>('CardNumber');
        const prefix = cardNumber.value.substring(0, 6);
        const postfix = cardNumber.value.substring(cardNumber.value.length - 4, cardNumber.value.length);

        return `${prefix}XXXXXX${postfix}`;
    }
}
//#endregion
