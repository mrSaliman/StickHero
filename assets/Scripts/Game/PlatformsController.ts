import { IObjectPool } from "../Libs/ObjectPool/IObjectPool";
import { ObjectPool } from "../Libs/ObjectPool/ObjectPool";

class PlatformsContriller {
    constructor() {
        
    }

    private pool: IObjectPool<Platform> = new ObjectPool<Platform>(() => {return new Platform}, 3);
    private platformQueue: IQueue<Platform> = new Queue<Platform>;

    
}