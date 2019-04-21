import * as uuid from 'uuid/v4';

import { Fixture, FixtureContext } from '../fixture';
import { TypeBuilder, Builder } from '../builder';
import { Customization } from '../customization';
import { ValueGenerator } from '../generators';

describe('Fixture', () => {
    test('should create simple type', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        const value = uuid();
        sut.customizations.add({
            type,
            build: () => {
                return value;
            }
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
        expect(() => sut.create<string>(type)).toThrowError(`No builder defined for type or alias '${type}'`);
    });

    test('should create composite type (assertable values)', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.customizations.add(new FullNameBuilder());
        sut.customizations.add(new AgeBuilder());
        sut.customizations.add(new GenderBuilder());
        sut.customizations.add(new ContactInformationBuilder());
        sut.customizations.add(new AddressBuilder());
        sut.customizations.add(new PersonBuilder());

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
        sut.customizations.add(new CardTypeBuilder());
        sut.customizations.add(new CardNumberBuilder());
        sut.customizations.add(new CardBuilder());

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
         sut.customizations.add(new CardTypeBuilder());
         sut.customizations.add(new CardNumberBuilder());
         sut.customizations.add(new CardBuilder());

         // Act
         const maskedCardNumberOne = sut.create<string>('MaskedCardNumber');
         const maskedCardNumberTwo = sut.create<string>('MaskedCardNumber');

         // Assert
         expect(maskedCardNumberOne).not.toEqual(maskedCardNumberTwo);
    });

    test('should freeze simple type', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        sut.customizations.add({
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
        sut.customizations.add(new CardTypeBuilder());
        sut.customizations.add(new CardNumberBuilder());
        sut.customizations.add(new CardBuilder());

        // Act
        sut.freeze('Card');
        const cardOne = sut.create<Card>('Card');
        const cardTwo = sut.create<Card>('Card');

        // Assert
        expect(cardOne).toBe(cardTwo);
    });

    test("should be idempotent when calling 'freeze'", () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        sut.customizations.add({
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

    test('should freeze value for alias', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.customizations.add(new CardTypeBuilder());
        sut.customizations.add(new CardNumberBuilder());
        sut.customizations.add(new CardBuilder());

        // Act
        sut.freeze('MaskedCardNumber');
        const cardOne = sut.create<Card>('Card');
        const cardTwo = sut.create<Card>('Card');

        // Assert
        expect(cardOne.cardNumber.value).not.toBe(cardTwo.cardNumber.value);
        expect(cardOne.cardType).not.toBe(cardTwo.cardType);
        expect(cardOne.maskedCardNumber).toBe(cardTwo.maskedCardNumber);
    });

    test('should make frozen objects immutable', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.customizations.add(new CardTypeBuilder());
        sut.customizations.add(new CardNumberBuilder());
        sut.customizations.add(new CardBuilder());

        // Act
        sut.freeze('Card');
        const card = sut.create<Card>('Card');

        // Assert
        expect(() => card.cardType = 'new value').toThrow();
    });

    test('should freeze and reset', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.customizations.add(new CardTypeBuilder());
        sut.customizations.add(new CardNumberBuilder());
        sut.customizations.add(new CardBuilder());

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
        expect(() => sut.freeze(type)).toThrowError(`No builder defined for type or alias '${type}'`);
        expect(() => sut.freeze(type)).toThrowError(ReferenceError);
    });

    test('should use type with specific value', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        sut.customizations.add({
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
        sut.customizations.add(new CardTypeBuilder());
        sut.customizations.add(new CardNumberBuilder());
        sut.customizations.add(new CardBuilder());

        // Act
        const cardOne = sut.create<Card>('Card');
        sut.use('Card', cardOne);
        sut.reset();
        const cardTwo = sut.create<Card>('Card');

        // Assert
        expect(cardOne).not.toEqual(cardTwo);
    });

    test('should add builders from customzation', () => {
        // Arrange
        const sut = new Fixture(null);
        const customization = new Customization();
        customization.add(new FullNameBuilder());
        customization.add(new AgeBuilder());
        customization.add(new GenderBuilder());
        customization.add(new ContactInformationBuilder());
        customization.add(new AddressBuilder());
        customization.add(new PersonBuilder());

        // Act
        sut.customize(customization);
        const createdType = sut.create<Person>('Person');

        // Assert
        expect(Object.keys(createdType).every(k => createdType[k] !== undefined)).toBeTruthy();
    });

    test('should add builders from multiple customzations', () => {
        // Arrange
        const sut = new Fixture(null);
        const customizationOne = new Customization();
        const customizationTwo = new Customization();
        customizationOne.add(new FullNameBuilder());
        customizationOne.add(new AgeBuilder());
        customizationOne.add(new GenderBuilder());
        customizationTwo.add(new ContactInformationBuilder());
        customizationTwo.add(new AddressBuilder());
        customizationTwo.add(new PersonBuilder());

        // Act
        sut.customize(customizationOne).customize(customizationTwo);
        const createdType = sut.create<Person>('Person');

        // Assert
        expect(Object.keys(createdType).every(k => createdType[k] !== undefined)).toBeTruthy();
    });

    test('should build type with custom values', () => {
        // Arrange
        const sut = new Fixture(null);
        const newMail = uuid();
        const newStreet = uuid();
        sut.customizations.add(new ContactInformationBuilder());
        sut.customizations.add(new AddressBuilder());

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
        sut.customizations.add(new AgeBuilder());
        sut.customizations.add(new GenderBuilder());
        sut.customizations.add(new ContactInformationBuilder());
        sut.customizations.add(new AddressBuilder());
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

class CardBuilder extends Builder<Card> {
    constructor() {
        super('Card');
        this.createAlias('MaskedCardNumber', 'CardNumber');
    }

    build(context: FixtureContext): Card {
        return {
            cardType: context.create<string>('CardType'),
            cardNumber: context.create<CardNumber>('CardNumber'),
            maskedCardNumber: this.createMaskedCardNumber(context)
        };
    }

    private createMaskedCardNumber(context: FixtureContext): string {
        const cardNumber = context.create<CardNumber>('MaskedCardNumber');
        const prefix = cardNumber.value.substring(0, 6);
        const postfix = cardNumber.value.substring(cardNumber.value.length - 4, cardNumber.value.length);

        return `${prefix}XXXXXX${postfix}`;
    }
}

class CardTypeBuilder implements TypeBuilder<string> {
    type: string = 'CardType';

    build(): string {
        return uuid();
    }
}

class CardNumberBuilder implements TypeBuilder<CardNumber> {
    type: string = 'CardNumber';

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
//#endregion
