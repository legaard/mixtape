import * as uuid from 'uuid/v4';

import StringBuilder from '../string-builder';

describe('StringBuilder', () => {
    test('should generate strings', () => {
        // Arrange
        const value = uuid();
        const sut = new StringBuilder({
            generate: () => value
        });

        // Act and assert
        expect(sut.build()).toBe(value);
    })

    test('should have correct value of typeName', () => {
        // Arrange
        const sut = new StringBuilder(null);

        // Act and assert
        expect(sut.typeName).toBe('string');
    })
})
