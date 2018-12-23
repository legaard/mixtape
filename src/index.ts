
import { NumberGenerator, StringGenerator } from './generators';
import { Customization } from './customization';
import { Fixture as BaseFixture } from './fixture';
import {
    StringBuilder,
    NumberBuilder,
    BooleanBuilder,
    NullBuilder,
    UndefinedBuilder,
    SymbolBuilder
} from './builders';

export class Fixture extends BaseFixture {
    constructor() {
        super(new NumberGenerator(5, 75));

        const primitiveCustomizaion = new Customization();
        primitiveCustomizaion.add(new StringBuilder(new StringGenerator()));
        primitiveCustomizaion.add(new NumberBuilder(new NumberGenerator(1, 250)));
        primitiveCustomizaion.add(new BooleanBuilder());
        primitiveCustomizaion.add(new NullBuilder());
        primitiveCustomizaion.add(new UndefinedBuilder());
        primitiveCustomizaion.add(new SymbolBuilder(new StringGenerator()));

        this.customize(primitiveCustomizaion);
    }
}

export * from './builder';
export * from './customization';
export * from './primitive-type';
export * from './generators';
export { FixtureContext } from './fixture';
