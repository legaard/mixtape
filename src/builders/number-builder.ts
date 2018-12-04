import { TypeBuilder } from '../type-builder';
import ValueGenerator from '../generators/value-generator';

export default class NumberBuilder implements TypeBuilder<number> {
    type: string = 'number';
    private _generator: ValueGenerator<number>;

    constructor(generator: ValueGenerator<number>) {
        this._generator = generator;
    }

    build(): number {
        return this._generator.generate();
    }
}