import { ValueGenerator } from './value-generator';
import { ensure } from '../utils';

export class NumberGenerator implements ValueGenerator<number> {
    private readonly _min: number;
    private readonly _max: number;

    constructor(min: number, max: number) {
        this._min = min;
        this._max = max;

        ensure(() => this._min >= 0, 'Minimum value cannot be smaller than 0', RangeError);
        ensure(() => this._max >= 1, 'Maximum value cannot be smaller than 1', RangeError);
        ensure(() => this._min < this._max, 'Maximum value must be larger than minimum value', RangeError);
    }

    generate(): number {
        return Math.floor(Math.random() * (this._max - this._min + 1) + this._min);
    }
}
