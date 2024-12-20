import Platform from "./Platform";
import RandUtil from "../../Libs/RandUtil/RandUtil";
import BaseController from "../BaseController";

export enum FitResult {
    Lose,
    Win,
    Perfect
}

export default class PlatformsController extends BaseController<Platform> {
    private startPlatformWidth: number = 0.2;
    private platformSizeRange: [number, number] = [0.1, 0.5];
    private nextDistanceRange: [number, number] = [0.2, 1];
    private spawningPlatformTime: number = 0.2;
    private _currentDistance: number = 0;
    private perfectWidth: number = 0.02;

    constructor() {
        super(() => new Platform());
    }

    public get current(): Platform {
        return this.currentObjects[0];
    }

    public get next(): Platform {
        return this.currentObjects[1];
    }

    public get winDistRange(): [number, number] {
        const current = this.current;
        const next = this.next;
        const dist = this._currentDistance;
        return [dist - (next.width / 2 + current.width / 2), dist + next.width / 2 - current.width / 2];
    }

    public showPlusOne(){
        let platform = this.next;
        platform.showPlusOne = true;
        cc.tween(platform)
            .tag(1)
            .delay(1)
            .call(() => {
                platform.showPlusOne = false;
            })
            .start();
    }


    public fitToWin(length: number): FitResult{
        const current = this.current;
        const next = this.next;
        const dist = next.position.x - current.position.x;
        const range = this.winDistRange;
        if (length >= range[0] && length <= range[1]){
            const perfectRange = [dist - current.width / 2 - this.perfectWidth / 2, dist - current.width / 2 + this.perfectWidth / 2];
            if (length >= perfectRange[0] && length <= perfectRange[1]){
                return FitResult.Perfect;
            }
            return FitResult.Win;
        }
        else {
            return FitResult.Lose;
        }
    }
    
    public resetWithPosition(startPos: number): cc.Tween<Platform> {
        super.reset();
        const current = this.getNextObject();
        const next = this.getNextObject();
        this.configStartPlatform(current, startPos);
        return this.configNextPlatform(next, current);
    }

    public reset(): cc.Tween<Platform> {
        super.reset();
        const current = this.getNextObject();
        const next = this.getNextObject();
        this.configStartPlatform(current);
        return this.configNextPlatform(next, current);
    }

    public step(): cc.Tween<Platform>[] {
        let last = this.currentObjects.shift()
        const next = this.getNextObject();
        const start = this.current;
        return [
            this.configNextPlatform(next, start),
            cc.tween(this.currentObjects[0])
                .delay(this.spawningPlatformTime)
                .call(() => {
                    this.pool.release(last);
                }),
        ];
    }

    private configStartPlatform(platform: Platform, startPos = 0): void {
        platform.setAllData(
            this.startPlatformWidth, 
            cc.v2(startPos == 0 ? this.startPlatformWidth / 2: startPos, 0), 
            true, 
            this.perfectWidth,
            false,
            false
        );
    }

    private configNextPlatform(next: Platform, prev: Platform): cc.Tween<Platform> {
        const newWidth = RandUtil.getRandomNumber(
            this.platformSizeRange[0],
            this.platformSizeRange[1] - prev.width
        );
        this._currentDistance = RandUtil.getRandomNumber(
            this.nextDistanceRange[0] + prev.width / 2 + newWidth / 2,
            this.nextDistanceRange[1] - newWidth / 2 - prev.width / 2
        );
        next.setAllData(
            newWidth, 
            cc.v2(1 + prev.position.x + next.width, 0), 
            true, 
            this.perfectWidth,
            true,
            false
        )

        return cc.tween(next)
            .to(this.spawningPlatformTime, { position: cc.v2(this._currentDistance + prev.position.x, 0) });
    }
}
