import { Delegate } from "../../Libs/Delegate/Delegate";
import { IObjectPool } from "../../Libs/ObjectPool/IObjectPool";
import { ObjectPool } from "../../Libs/ObjectPool/ObjectPool";
import { RandUtil } from "../../Libs/RandUtil/RandUtil";
import { Platform } from "./Platform";

export class PlatformsController {
    private _platformCreated = new Delegate<[Platform]>();
    private startPlatformWidth: number = 0.1;
    private platformSizeRange: [number, number] = [0.05, 1];
    private nextDistanseRange: [number, number] = [0.05, 1];

    private currentPlatforms: Platform[] = [];

    public get platformCreated() {
        return this._platformCreated;
    }

    private pool: IObjectPool<Platform> = new ObjectPool<Platform>(() => {
        let platform = new Platform;
        this._platformCreated.emit(platform);
        return platform;
    });

    public reset(): void {
        this.currentPlatforms.forEach(platform => {
            this.pool.release(platform);
        });
        this.currentPlatforms.push(this.pool.get());
        this.currentPlatforms.push(this.pool.get());
        this.configStartPlatform(this.currentPlatforms[0]);
        this.configNextPlatform(this.currentPlatforms[1], this.currentPlatforms[0]);
    }

    private configStartPlatform(platform: Platform){
        platform.setAllData(this.startPlatformWidth, cc.Vec2.ZERO, true);
    }
    
    private configNextPlatform(next: Platform, prev: Platform){
        let newWidth = RandUtil.getRandomNumber(
            this.platformSizeRange[0], 
            this.platformSizeRange[1] - prev.width / 2
        );
        
        next.setAllData(
            newWidth, 
            new cc.Vec2(
                RandUtil.getRandomNumber(
                    this.nextDistanseRange[0] +
                    prev.width / 2 +
                    newWidth / 2, 
                    this.nextDistanseRange[1] - newWidth / 2
                )
                ,
                0), 
            true
        );
    }

    public step(){
        this.pool.release(this.currentPlatforms.shift());
        let next = this.pool.get();
        let start = this.currentPlatforms[0];
        start.position = cc.Vec2.ZERO;
        this.configNextPlatform(next, start);
        this.currentPlatforms.push(next);
    }
}