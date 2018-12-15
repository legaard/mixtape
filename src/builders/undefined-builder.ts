import { TypeBuilder } from '../type-builder';
import { PrimitiveType } from '../primitive-type';

export class UndefinedBuilder implements TypeBuilder<undefined> {
    type: string = PrimitiveType.undefined;

    build(): undefined {
        return undefined;
    }
}
