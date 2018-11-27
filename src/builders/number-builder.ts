import { TypeBuilder } from '../type-builder';
import ValueGenerator from '../generators/value-generator';

export default class NumberBuilder implements TypeBuilder<number> {
    typeName: string = 'number';
    private _generator: ValueGenerator<number>;

    constructor(generator: ValueGenerator<number>) {
        this._generator = generator;
    }

    create(): number {
        return this._generator.generate();
    }
}