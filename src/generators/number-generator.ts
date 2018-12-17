import { ValueGenerator } from './value-generator';

export class NumberGenerator implements ValueGenerator<number> {
    private readonly _min: number;
    private readonly _max: number;

    constructor(min: number, max: number) {
        this._min = min;
        this._max = max;

        if (this._min < 0) {
            throw new Error('Minimum value cannot be smaller than 0');
        }

        if (this._max < 1) {
            throw new Error('Maximum value cannot be smaller than 1');
        }

        if (this._min >= this._max) {
            throw new Error('Maximum value must be larger than minimum value');
        }
    }

    generate(): number {
        return Math.floor((Math.random() * (this._max + 1)) + this._min);
    }
}
