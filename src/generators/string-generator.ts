import * as uuid from 'uuid/v4';

import { ValueGenerator } from './value-generator';

export class StringGenerator implements ValueGenerator<string> {
    private readonly _prefix: string;

    constructor(prefix?: string) {
        this._prefix = !prefix ? '' : prefix;
    }

    generate(): string {
        return `${this._prefix}${uuid()}`;
    }
}
