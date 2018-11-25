import * as uuid from 'uuid/v4';

import Generator from './generator';

export default class StringGenerator implements Generator<string> {
    generate(): string {
        return uuid();
    }
}