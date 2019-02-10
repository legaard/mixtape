import { TypeBuilder } from '../builder';
import { PrimitiveType } from '../primitive-type';
import { ValueGenerator, NumberGenerator } from '../generators';

export class BooleanBuilder implements TypeBuilder<boolean> {
    type: string = PrimitiveType.boolean;
    _generator: ValueGenerator<number>;

    constructor() {
        this._generator = new NumberGenerator(0, 1);
    }

    build(): boolean {
        return !!this._generator.generate();
    }
}
