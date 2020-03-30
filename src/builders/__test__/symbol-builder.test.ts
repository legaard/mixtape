import { v4 as uuid } from 'uuid';

import { SymbolBuilder } from '../symbol-builder';

describe('SymbolBuilder', () => {
    test('should generate strings', () => {
        // Arrange
        const value = uuid();
        const sut = new SymbolBuilder({
            generate: () => value
        });

        // Act and assert
        expect(sut.build().toString()).toEqual(Symbol(value).toString());
        expect(typeof sut.build() === 'symbol').toBeTruthy();
    });

    test("should have correct value of property 'type'", () => {
        // Arrange
        const sut = new SymbolBuilder(null);

        // Act and assert
        expect(sut.type).toBe('symbol');
    });
});
