import * as uuid from 'uuid/v4';

import Fixture from '../fixture';
import { TypeBuilder } from '../type-builder';
import Customization from '../customization';

describe('Fixture', () => {
    test('should be able to create type for added builder', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        const value = uuid();
        sut.addBuilder({
            typeName: type,
            create: () => {
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
        expect(() => sut.create<string>(type)).toThrowError(`No builder defined for type '${type}'`)
    });

    test('should be able to remove added builder', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        const value = uuid();
        sut.addBuilder({
            typeName: type,
            create: () => value
        });

        // Act and assert
        expect(() => sut.removeBuilder(type)).not.toThrow();
    });

    test('should overwrite existing builder', () => {
        // Arrange
        const sut = new Fixture(null);
        const type = uuid();
        const value = uuid();
        sut.addBuilder({
            typeName: type,
            create: () => undefined
        });

        // Act
        sut.addBuilder({
            typeName: type,
            create: () => value
        });
        const createdType = sut.create<string>(type);

        // Assert
        expect(createdType).toBe(value);
    });

    test('should be able to create composite types', () => {
        // Arrange
        const sut = new Fixture(null);
        sut.addBuilder(new FullNameBuilder());
        sut.addBuilder(new AgeBuilder());
        sut.addBuilder(new GenderBuilder());
        sut.addBuilder(new ContactInformationBuilder());
        sut.addBuilder(new AddressBuilder());
        sut.addBuilder(new PersonBuilder());

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

    test('should be able to add builders from customzation', () => {
        // Arrange
        const sut = new Fixture(null);
        const customization = new Customization();
        customization.addBuilder(new FullNameBuilder());
        customization.addBuilder(new AgeBuilder());
        customization.addBuilder(new GenderBuilder());
        customization.addBuilder(new ContactInformationBuilder());
        customization.addBuilder(new AddressBuilder());
        customization.addBuilder(new PersonBuilder());

        // Act
        sut.addCustomization(customization);
        const createdType = sut.create<Person>('Person');

        // Assert
        expect(Object.keys(createdType).every(k => createdType[k] != undefined)).toBeTruthy();
    });

    test('should build type with custom values', () => {
        // Arrange
        const sut = new Fixture(null);
        const newMail = uuid();
        const newStreet = uuid();
        sut.addBuilder(new ContactInformationBuilder());
        sut.addBuilder(new AddressBuilder());

        // Act
        const createdType = sut
            .build<ContactInformation>('ContactInformation')
            .with(n => n.mail = newMail)
            .with(n => n.address.street = newStreet)
            .create();

        // Assert
        expect(createdType.mail).toBe(newMail);
        expect(createdType.phoneNumber).toBe('(852) 998-8296');
        expect(createdType.address.country).toBe('USA');
        expect(createdType.address.street).toBe(newStreet);
        expect(createdType.address.zipCode).toBe(95420);
    });

    test('should be able to create a list of types with a fixed size', () => {
        // Arrange
        const sut = new Fixture(null);
        const typeName = uuid();
        const value = uuid();
        let counter = 0;
        sut.addBuilder({
            typeName,
            create: () => `${value}${counter++}`
        });
        const size = 5;

        // Act
        const typeList = sut.createList<string>(typeName, size);

        // Assert
        expect(typeList.length).toBe(size);
        expect(typeList.every((v, i) => v == `${value}${i}`)).toBeTruthy();
    });

    test('should be able to create a list of types ', () => {
        // Arrange
        const size = 10;
        const sut = new Fixture({
            generate: () => size
        });
        const typeName = uuid();
        const value = uuid();
        let counter = 0;
        sut.addBuilder({
            typeName,
            create: () => `${value}${counter++}`
        });

        // Act
        const typeList = sut.createList<string>(typeName);

        // Assert
        expect(typeList.length).toBe(size);
        expect(typeList.every((v, i) => v == `${value}${i}`)).toBeTruthy();
    });
});

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
//#endregion

//#region builders for test
class PersonBuilder implements TypeBuilder<Person> {
    typeName: string = 'Person';
    
    create(context: Fixture): Person {
        return {
            fullName: context.create<FullName>('FullName'),
            age: context.create<number>('Age'),
            gender: context.create<string>('Gender'),
            contactInformation: context.create<ContactInformation>('ContactInformation')
        }
    }
}

class FullNameBuilder implements TypeBuilder<FullName> {
    typeName: string = 'FullName'    
    
    create(context: Fixture): FullName {
        return {
            firstName: 'Marty',
            lastName: 'McFly'
        }
    }
}

class GenderBuilder implements TypeBuilder<string> {
    typeName: string = 'Gender'; 
    
    create(context: Fixture): string {
        return 'MALE';
    }
}

class AgeBuilder implements TypeBuilder<number> {
    typeName: string = 'Age'    
    
    create(context: Fixture): number {
        return 17;
    }
}

class ContactInformationBuilder implements TypeBuilder<ContactInformation> {
    typeName: string = 'ContactInformation'    
    
    create(context: Fixture): ContactInformation {
        return {
            mail: 'marty@bttf.now',
            phoneNumber: '(852) 998-8296',
            address: context.create<Address>('Address')
        }
    }
}

class AddressBuilder implements TypeBuilder<Address> {
    typeName: string = 'Address'    
    
    create(context: Fixture): Address {
        return {
            country: 'USA',
            street: '9303 Lyon Drive',
            zipCode: 95420
        }
    }
}
//#endregion 