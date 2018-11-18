import * as uuid from 'uuid/v4';

import { Builder } from '../builder';

export default class StringBuilder implements Builder<string> {
    typeName: string = 'string';

    create(): string {
        return uuid();
    }
}