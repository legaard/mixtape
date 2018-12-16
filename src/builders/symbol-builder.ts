import { ValueGenerator } from '../generators/value-generator';
import { TypeBuilder } from '../type-builder';
import { PrimitiveType } from '../primitive-type';

export class SymbolBuilder implements TypeBuilder<symbol> {
    type: string = PrimitiveType.symbol;
    private _generator: ValueGenerator<string>;

    constructor(generator: ValueGenerator<string>) {
        this._generator = generator;
    }

    build(): symbol {
        return Symbol(this._generator.generate());
    }
}
