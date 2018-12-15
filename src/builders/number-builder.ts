import ValueGenerator from '../generators/value-generator';
import { TypeBuilder } from '../type-builder';
import { PrimitiveType } from '../primitive-type';

export class NumberBuilder implements TypeBuilder<number> {
    type: string = PrimitiveType.number;
    private _generator: ValueGenerator<number>;

    constructor(generator: ValueGenerator<number>) {
        this._generator = generator;
    }

    build(): number {
        return this._generator.generate();
    }
}