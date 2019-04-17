import { ValueGenerator } from './value-generator';
import { ensure } from '../utils';

/**
 * The class makes it easy to generate random numbers.
 * @implements {ValueGenerator}
 */
export class NumberGenerator implements ValueGenerator<number> {
    private readonly _min: number;
    private readonly _max: number;

    /**
     * Create a new `NumberGenerator`
     * @param min - smallest number to generate
     * @param max - largest number to generate
     */
    constructor(min: number, max: number) {
        this._min = min;
        this._max = max;

        ensure(() => this._min >= 0, 'Minimum value cannot be smaller than 0', RangeError);
        ensure(() => this._max >= 1, 'Maximum value cannot be smaller than 1', RangeError);
        ensure(() => this._min < this._max, 'Maximum value must be larger than minimum value', RangeError);
    }

    /**
     * Generate random number
     * @returns number
     */
    generate(): number {
        return Math.floor(Math.random() * (this._max - this._min + 1) + this._min);
    }
}
