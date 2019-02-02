export function isObject(value: any): boolean {
    return typeof value === 'object' &&
           !Array.isArray(value) &&
           value !== null;
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
