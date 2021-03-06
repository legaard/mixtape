import { v4 as uuid } from 'uuid';

import { StringBuilder } from '../string-builder';

describe('StringBuilder', () => {
    test('should generate strings', () => {
        // Arrange
        const value = uuid();
        const sut = new StringBuilder({
            generate: () => value
        });

        // Act and assert
        expect(sut.build()).toBe(value);
        expect(typeof sut.build() === 'string').toBeTruthy();
    });

    test("should have correct value of property 'type'", () => {
        // Arrange
        const sut = new StringBuilder(null);

        // Act and assert
        expect(sut.type).toBe('string');
    });
});
