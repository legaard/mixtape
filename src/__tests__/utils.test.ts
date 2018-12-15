import { isObject } from '../utils';

describe('Utils', () => {
    test('should return true for object type', () => {
        const type = {};
        expect(isObject(type)).toBeTruthy();
        expect(isObject(null)).toBeTruthy();
    });

    test('should return false for non-object types', () => {
        const types: any[] = [
            'string',
            true,
            1337,
            () => {},
            undefined,
            Symbol('symbol')
        ];

        types.forEach(t => expect(isObject(t)).toBeFalsy());
    });
});
