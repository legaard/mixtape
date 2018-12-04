import { TypeBuilder } from '../type-builder';
import ValueGenerator from '../generators/value-generator';

export default class StringBuilder implements TypeBuilder<string> {
    type: string = 'string';
    private _generator: ValueGenerator<string>;

    constructor(generator: ValueGenerator<string>) {        
        this._generator = generator;
    }

    build(): string {
        return this._generator.generate();
    }
}