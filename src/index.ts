
import { NumberGenerator, StringGenerator } from './generators';
import { Fixture as BaseFixture } from './fixture';
import {
    StringBuilder,
    NumberBuilder,
    BooleanBuilder,
    NullBuilder,
    UndefinedBuilder,
    SymbolBuilder
} from './builders';

/**
 * Class used for setting up and generating test random data.
 * The class has a set of build in types that it can create but
 * it can easily be customized by adding new type builders to it.
 * @extends BaseFixture
 */
export class Fixture extends BaseFixture {
    /**
     * Create a new `Fixture`
     */
    constructor() {
        super(new NumberGenerator(5, 75));

        this.customizations.add(new StringBuilder(new StringGenerator()));
        this.customizations.add(new NumberBuilder(new NumberGenerator(1, 250)));
        this.customizations.add(new BooleanBuilder());
        this.customizations.add(new NullBuilder());
        this.customizations.add(new UndefinedBuilder());
        this.customizations.add(new SymbolBuilder(new StringGenerator()));
    }
}

export * from './builder';
export * from './customization';
export * from './primitive-type';
export * from './generators';
export * from './injector';
export { FixtureContext } from './fixture';
