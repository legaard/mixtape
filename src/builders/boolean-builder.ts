import { TypeBuilder } from '../builder';
import { PrimitiveType } from '../primitive-type';

export class BooleanBuilder implements TypeBuilder<boolean> {
    type: string = PrimitiveType.boolean;

    build(): boolean {
        return true;
    }
}
