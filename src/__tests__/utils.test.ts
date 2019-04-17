import { isObject, isArray, ensure } from '../utils';

describe('Utils', () => {
    test("'isObject' should return true for objects", () => {
        expect(isObject({})).toBeTruthy();
        expect(isObject(new Object())).toBeTruthy();
    });

    test.each(['string', true, 1337, () => {}, [], null, undefined, Symbol('symbol')])
        ("'isObject' should return false for %p", (a: any) => expect(isObject(a)).toBeFalsy());

    test("'isArray' should return true for arrays", () => {
        expect(isArray([])).toBeTruthy();
        expect(isArray(new Array())).toBeTruthy();
    });

    test.each(['string', true, 1337, () => {}, {}, null, undefined, Symbol('symbol')])
        ("'isArray' should return false for %p", (a: any) => expect(isArray(a)).toBeFalsy());

    test("'expect' should throw error when predicate is false", () => {
        // Arrange, act and assert
        const message = 'some random message';
        expect(() => ensure(() => false, message)).toThrow(Error);
        expect(() => ensure(() => false, message)).toThrow(message);
    });

    test("'expect' should throw specific error type when predicate is false", () => {
        // Arrange, act and assert
        const message = 'some random message';
        expect(() => ensure(() => false, message, RangeError)).toThrow(RangeError);
    });

    test("'expect' should not throw error when predicate is true", () => {
        // Arrange, act and assert
        expect(() => ensure(() => true, 'some random message')).not.toThrow();
    });
});
