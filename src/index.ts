
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
 * Class used for setting up and generating random test data.
 * The class has a set of build-in types which can be created but
 * it can easily be customized by adding new type builders.
 * @extends BaseFixture
 */
export class Fixture extends BaseFixture {
    /**
     * Create a new `Fixture`
     */
    constructor() {
        super(new NumberGenerator(5, 25));

        this.extensions.add(new StringBuilder(new StringGenerator()));
        this.extensions.add(new NumberBuilder(new NumberGenerator(1, 250)));
        this.extensions.add(new BooleanBuilder());
        this.extensions.add(new NullBuilder());
        this.extensions.add(new UndefinedBuilder());
        this.extensions.add(new SymbolBuilder(new StringGenerator()));
    }
}

export * from './builder';
export * from './extension';
export * from './primitive-type';
export * from './generators';
export * from './injector';
export { FixtureContext } from './fixture';
