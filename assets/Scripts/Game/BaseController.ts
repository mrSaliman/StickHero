import Delegate from "../Libs/Delegate/Delegate";
import IObjectPool from "../Libs/ObjectPool/IObjectPool";
import IPoolable from "../Libs/ObjectPool/IPoolable";
import ObjectPool from "../Libs/ObjectPool/ObjectPool";


export default class BaseController<T extends IPoolable> {
    private _objectCreated = new Delegate<[T]>();
    public get objectCreated() {
        return this._objectCreated;
    }

    protected pool: IObjectPool<T>;
    protected currentObjects: T[] = [];

    constructor(objectFactory: () => T) {
        this.pool = new ObjectPool<T>(() => {
            const obj = objectFactory();
            this._objectCreated.emit(obj);
            return obj;
        });
    }

    public reset(): void {
        this.currentObjects.forEach(obj => this.pool.release(obj));
        this.currentObjects = [];
    }

    protected getNextObject(): T {
        const obj = this.pool.get();
        this.currentObjects.push(obj);
        return obj;
    }

    protected releaseOldestObject(): void {
        const oldest = this.currentObjects.shift();
        if (oldest) {
            this.pool.release(oldest);
        }
    }
}
