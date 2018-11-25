import Generator from './generator';

export default class NumberGenerator implements Generator<number> {
    private _min: number;
    private _max: number;
    
    constructor(min: number, max: number) {
        this._min = min;
        this._max = max;
    }

    generate(): number {
        return Math.floor((Math.random() * this._max) + this._min);
    }
}