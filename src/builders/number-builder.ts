import { TypeBuilder } from '../type-builder';
import Generator from '../generators/generator';

export default class NumberBuilder implements TypeBuilder<number> {
    typeName: string = 'number';
    private _generator: Generator<number>;

    constructor(generator: Generator<number>) {
        this._generator = generator;
    }

    create(): number {
        return this._generator.generate();
    }
}