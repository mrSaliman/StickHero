import { IPoolable } from "./IPoolable";

export interface IObjectPool<T extends IPoolable> {
    get(): T;
    release(obj: T): void;
    size(): number;
    expandPool(size: number): void;
}
