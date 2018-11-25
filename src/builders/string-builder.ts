import { TypeBuilder } from '../type-builder';
import Generator from '../generators/generator';

export default class StringBuilder implements TypeBuilder<string> {
    typeName: string = 'string';
    private _generator: Generator<string>;

    constructor(generator: Generator<string>) {        
        this._generator = generator;
    }

    create(): string {
        return this._generator.generate();
    }
}