import { TypeBuilder } from '../type-builder';
import ValueGenerator from '../generators/value-generator';

export default class StringBuilder implements TypeBuilder<string> {
    typeName: string = 'string';
    private _generator: ValueGenerator<string>;

    constructor(generator: ValueGenerator<string>) {        
        this._generator = generator;
    }

    create(): string {
        return this._generator.generate();
    }
}