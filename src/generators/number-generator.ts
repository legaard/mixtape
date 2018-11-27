import ValueGenerator from './value-generator';

export default class NumberGenerator implements ValueGenerator<number> {
    private _min: number;
    private _max: number;
    
    constructor(min: number, max: number) {
        this._min = min;
        this._max = max;

        if(this._min < 0 || this._max < 1)
            throw new Error('Minimum value must be larger than 0 and maximum larger than 1');

        if(this._min >= this._max)
            throw new Error('Minimum value must be smaller than maximum value');
    }

    generate(): number {
        return Math.floor((Math.random() * this._max) + this._min);
    }
}