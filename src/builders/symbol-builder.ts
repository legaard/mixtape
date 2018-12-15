import ValueGenerator from '../generators/value-generator';
import { TypeBuilder } from '../type-builder';
import { PrimitiveType } from '../primitive-type';

export class SymbolBuilder implements TypeBuilder<Symbol> {
    type: string = PrimitiveType.symbol;
    private _generator: ValueGenerator<string>;

    constructor(generator: ValueGenerator<string>) {        
        this._generator = generator;
    }

    build(): Symbol {
        return Symbol(this._generator.generate());
    }
}