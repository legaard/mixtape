/**
 * Generic interface for a value generator
 * @interface
 */
export interface ValueGenerator<T> {
    generate(): T;
}
