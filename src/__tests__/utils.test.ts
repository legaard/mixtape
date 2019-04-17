import { isObject, isArray, ensure } from '../utils';

describe('Utils', () => {
    test('should return true for object type', () => {
        expect(isObject({})).toBeTruthy();
        expect(isObject(new Object())).toBeTruthy();
    });

    test.each(['string', true, 1337, () => {}, [], null, undefined, Symbol('symbol')])
        ("'isObject' should return false for %p", (a: any) => expect(isObject(a)).toBeFalsy());

    test('should return true for array ', () => {
        expect(isArray([])).toBeTruthy();
        expect(isArray(new Array())).toBeTruthy();
    });

    test.each(['string', true, 1337, () => {}, {}, null, undefined, Symbol('symbol')])
        ("'isArray' should return false for %p", (a: any) => expect(isArray(a)).toBeFalsy());

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
