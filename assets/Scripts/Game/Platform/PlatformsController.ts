import Delegate from "../../Libs/Delegate/Delegate";
import IObjectPool from "../../Libs/ObjectPool/IObjectPool";
import ObjectPool from "../../Libs/ObjectPool/ObjectPool";
import RandUtil from "../../Libs/RandUtil/RandUtil";
import Platform from "./Platform";

export default class PlatformsController {
    private startPlatformWidth: number = 0.1;
    private platformSizeRange: [number, number] = [0.05, 0.4];
    private nextDistanseRange: [number, number] = [0.05, 1];
    private movingLeftTime = 0.2;
    
    private currentPlatforms: Platform[] = [];
    
    private _platformCreated = new Delegate<[Platform]>();
    public get platformCreated() {
        return this._platformCreated;
    }

    public get winDistRange(): [number, number] {
        let current = this.currentPlatforms[0];
        let next = this.currentPlatforms[1];
        let dist = next.position.x - current.position.x;
        return [dist - (next.width / 2 + current.width / 2), dist + next.width / 2 - current.width / 2]
    }

    private _currentDistance: number = 0;
    public get currentDistance(): number {
        return this._currentDistance;
    }

    public get platformEnd() : number {
        return this.currentPlatforms[0].width / 2;
    }

    private pool: IObjectPool<Platform> = new ObjectPool<Platform>(() => {
        let platform = new Platform;
        this._platformCreated.emit(platform);
        return platform;
    });

    public reset(): cc.Tween<Platform> {
        this.currentPlatforms.forEach(platform => {
            this.pool.release(platform);
        });
        this.currentPlatforms = [];
        this.currentPlatforms.push(this.pool.get());
        this.currentPlatforms.push(this.pool.get());
        this.configStartPlatform(this.currentPlatforms[0]);
        return this.configNextPlatform(this.currentPlatforms[1], this.currentPlatforms[0]);
    }

    private configStartPlatform(platform: Platform){
        platform.setAllData(this.startPlatformWidth, cc.Vec2.ZERO, true);
    }
    
    private configNextPlatform(next: Platform, prev: Platform): cc.Tween<Platform> {
        let newWidth = RandUtil.getRandomNumber(
            this.platformSizeRange[0], 
            this.platformSizeRange[1] - prev.width / 2
        );
        next.width = newWidth;
        next.isVisible = true;
        this._currentDistance = RandUtil.getRandomNumber(
            this.nextDistanseRange[0] +
            prev.width / 2 +
            newWidth / 2, 
            this.nextDistanseRange[1] - newWidth / 2
        );
        return cc.tween(next)
            .to(this.movingLeftTime, {position: new cc.Vec2(this._currentDistance, 0)})
    }

    public step(): cc.Tween<Platform>[] {
        let last = this.currentPlatforms.shift()
        let next = this.pool.get();
        let start = this.currentPlatforms[0];
        this.currentPlatforms.push(next);
        
        return [
            cc.tween(start)
                .to(this.movingLeftTime, {position: cc.Vec2.ZERO}),
            this.configNextPlatform(next, start),
            cc.tween(last)
                .to(this.movingLeftTime, {position: new cc.Vec2(-this._currentDistance, 0)})
                .call(() => {
                    this.pool.release(last);
                })
        ]
    }
}