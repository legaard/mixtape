import { isObject, ensure } from '../utils';

describe('Utils', () => {
    test('should return true for object type', () => {
        const type = {};
        expect(isObject(type)).toBeTruthy();
    });

    test('should return false for non-object types', () => {
        const types: any[] = [
            'string',
            true,
            1337,
            () => {},
            [],
            null,
            undefined,
            Symbol('symbol')
        ];

        types.forEach(t => expect(isObject(t)).toBeFalsy());
    });

    test('should throw error when predicate is false', () => {
        // Arrange, act and assert
        const message = 'some random message';
        expect(() => ensure(() => false, message)).toThrow(Error);
        expect(() => ensure(() => false, message)).toThrow(message);
    });

    test('should throw specific error type when predicate is false', () => {
        // Arrange, act and assert
        const message = 'some random message';
        expect(() => ensure(() => false, message, RangeError)).toThrow(RangeError);
    });

    test('should not throw error when predicate is true', () => {
        // Arrange, act and assert
        expect(() => ensure(() => true, 'some random message')).not.toThrow();
    });
});
