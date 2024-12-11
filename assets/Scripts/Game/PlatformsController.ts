import { IObjectPool } from "../Libs/ObjectPool/IObjectPool";
import { ObjectPool } from "../Libs/ObjectPool/ObjectPool";

export class PlatformsController {
    private _platformCreated = new Delegate<[Platform]>();

    public get platformCreated() {
        return this._platformCreated;
    }

    private pool: IObjectPool<Platform> = new ObjectPool<Platform>(() => {
        let platform = new Platform;
        this._platformCreated.emit(platform);
        return platform;
    }, 3);
    private platformQueue: IQueue<Platform> = new Queue<Platform>;
    
}
