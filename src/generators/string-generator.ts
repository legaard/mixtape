import * as uuid from 'uuid/v4';

import { ValueGenerator } from './value-generator';

/**
 * The class makes it easy to generate random strings.
 * Strings generated by this class are UUIDs.
 * @implements {ValueGenerator}
 */
export class StringGenerator implements ValueGenerator<string> {
    private readonly _prefix: string;

    /**
     * Create a new `StringGenerator`
     * @param prefix - prefix for all generated strings (optional)
     */
    constructor(prefix?: string) {
        this._prefix = !prefix ? '' : prefix;
    }

    /**
     * Create string with random value
     * @returns string
     */
    generate(): string {
        return `${this._prefix}${uuid()}`;
    }
}
