import { Builder } from '../builder';

export default class NumberBuilder implements Builder<number> {
    typeName: string = 'number';

    create(): number {
        return Math.floor((Math.random() * 100) + 1);
    }
}