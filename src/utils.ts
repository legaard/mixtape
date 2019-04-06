export function isObject(value: any): value is object {
    return typeof value === 'object' &&
           !(value instanceof Array) &&
           value !== null;
}

export function isArray(value: any): value is unknown[] {
    return value instanceof Array;
}

export function ensure<T extends Error>(
    predicate: () => boolean,
    errorMessage: string,
    errorType?: new (message: string) => T) {
    if (!predicate()) {
        if (!!errorType) {
            throw new errorType(errorMessage);
        } else {
            throw new Error(errorMessage);
        }
    }
}
