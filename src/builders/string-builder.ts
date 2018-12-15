import ValueGenerator from '../generators/value-generator';
import { TypeBuilder } from '../type-builder';
import { PrimitiveType } from '../primitive-type';

export class StringBuilder implements TypeBuilder<string> {
    type: string = PrimitiveType.string;
    private _generator: ValueGenerator<string>;

    constructor(generator: ValueGenerator<string>) {
        this._generator = generator;
    }

    build(): string {
        return this._generator.generate();
    }
}
