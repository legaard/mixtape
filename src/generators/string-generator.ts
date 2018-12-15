import * as uuid from 'uuid/v4';

import ValueGenerator from './value-generator';

export default class StringGenerator implements ValueGenerator<string> {
    generate(): string {
        return uuid();
    }
}
