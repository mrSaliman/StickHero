import Delegate from "../../Libs/Delegate/Delegate";
import IObjectPool from "../../Libs/ObjectPool/IObjectPool";
import ObjectPool from "../../Libs/ObjectPool/ObjectPool";
import Stick from "./Stick";

export default class SticksController {
    private startStickSize: number = 0;
    public startStickPosition: number = 0;
    public distToMoveLast: number = 0;
    movingLeftTime: number = 0.2;
    
    private currentSticks: Stick[] = [];
    private growingStick: Stick;

    private tween: cc.Tween<Stick>;
    
    private _stickCreated = new Delegate<[Stick]>();
    public get stickCreated() {
        return this._stickCreated;
    }

    private pool: IObjectPool<Stick> = new ObjectPool<Stick>(() => {
        let stick = new Stick;
        this._stickCreated.emit(stick);
        return stick;
    });

    public reset(): void {
        this.currentSticks.forEach(stick => {
            this.pool.release(stick);
        });
        this.currentSticks = [];
        this.currentSticks.push(this.pool.get());
        this.setupStick(this.currentSticks[0]);
    }

    public step(): cc.Tween<Stick> {
        this.currentSticks.push(this.pool.get());
        if (this.currentSticks.length > 2) {
            this.pool.release(this.currentSticks.shift());
        }
        this.setupStick(this.currentSticks[1]);
        return cc.tween(this.currentSticks[0])
                    .by(this.movingLeftTime, {position: new cc.Vec2(-this.distToMoveLast, 0)});
    }

    private setupStick(stick: Stick){
        stick.rotation = 90;
        stick.position = new cc.Vec2(this.startStickPosition, 0);
        stick.length = this.startStickSize;
        stick.isVisible = true;

        this.tween = cc.tween(stick)
            .by(2, {length: 1})
            .repeatForever();

        this.growingStick = stick;
    }

    public startGrowing() {
        this.tween.start();
    }

    public stopGrowing(): [number, cc.Tween<Stick>] {
        this.tween.stop();
        let fallingTween = cc.tween(this.growingStick)
            .to(0.5, {rotation: 0}, {easing: 'bounceOut'});
        return [this.growingStick.length, fallingTween];
    }
}