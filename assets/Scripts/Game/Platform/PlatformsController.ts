import Platform from "./Platform";
import RandUtil from "../../Libs/RandUtil/RandUtil";
import BaseController from "../BaseController";

export default class PlatformsController extends BaseController<Platform> {
    private startPlatformWidth: number = 0.2;
    private platformSizeRange: [number, number] = [0.05, 0.4];
    private nextDistanceRange: [number, number] = [0.05, 1];
    private spawningPlatformTime: number = 0.2;
    private _currentDistance: number = 0;

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
        const dist = next.position.x - current.position.x;
        return [dist - (next.width / 2 + current.width / 2), dist + next.width / 2 - current.width / 2];
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

    private configStartPlatform(platform: Platform): void {
        platform.setAllData(this.startPlatformWidth, cc.v2(this.startPlatformWidth / 2, 0), true);
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
        next.position = cc.v2(1 + prev.position.x + next.width, 0);
        next.width = newWidth;
        next.isVisible = true;

        return cc.tween(next)
            .to(this.spawningPlatformTime, { position: cc.v2(this._currentDistance + prev.position.x, 0) });
    }
}
