import { IObjectPool } from "./IObjectPool";
import { IPoolable } from "./IPoolable";

export class ObjectPool<T extends IPoolable> implements IObjectPool<T>{
    private pool: T[] = [];
    private factory: () => T;

    constructor(factory: () => T, size: number = 0) {
        this.factory = factory;
        this.expandPool(size)
    }

    get(): T {
        if (this.pool.length > 0) {
            const obj = this.pool.pop();
            return obj;
        }
        const newObj = this.factory();
        return newObj;
    }

    release(obj: T): void {
        obj.reset();
        this.pool.push(obj);
    }

    size(): number {
        return this.pool.length;
    }

    expandPool(size: number): void {
        for (let i = 0; i < size; i++) {
            this.pool.push(this.factory());
        }
    }
}
