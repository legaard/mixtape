import { Fixture, PrimitiveType } from '../index';

describe('Exported Fixture', () => {
    test('should have all primitive type builders', () => {
        // Arrange
        const sut = new Fixture();

        // Act and assert
        expect(sut.create<string>(PrimitiveType.string)).not.toBeUndefined();
        expect(sut.create<number>(PrimitiveType.number)).not.toBeUndefined();
        expect(sut.create<boolean>(PrimitiveType.boolean)).not.toBeUndefined();
        expect(sut.create<null>(PrimitiveType.null)).toBeNull();
        expect(sut.create<undefined>(PrimitiveType.undefined)).toBeUndefined();
        expect(sut.create<symbol>(PrimitiveType.symbol)).not.toBeUndefined();
    });
});
