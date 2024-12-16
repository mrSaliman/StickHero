import BaseController from "../BaseController";
import Stick from "./Stick";

export default class SticksController extends BaseController<Stick> {
    private startStickSize: number = 0;
    private growingStick: Stick;
    private tween: cc.Tween<Stick>;

    constructor() {
        super(() => new Stick());
    }

    public resetWithPosition(stickPosition: number): void {
        super.reset(); // Вызов базового метода reset
        const stick = this.getNextObject();
        this.setupStick(stick, stickPosition);
    }

    public step(stickPosition: number): void {
        const stick = this.getNextObject();
        if (this.currentObjects.length > 2) {
            this.releaseOldestObject();
        }
        this.setupStick(stick, stickPosition);
    }

    private setupStick(stick: Stick, stickPosition: number): void {
        stick.rotation = 90;
        stick.position = new cc.Vec2(stickPosition, 0);
        stick.length = this.startStickSize;
        stick.isVisible = true;

        this.tween = cc.tween(stick)
            .by(2, { length: 1 })
            .repeatForever();

        this.growingStick = stick;
    }

    public startGrowing(): void {
        this.tween.start();
    }

    public stopGrowing(): [number, cc.Tween<Stick>] {
        this.tween.stop();
        const fallingTween = cc.tween(this.growingStick)
            .to(0.5, { rotation: 0 }, { easing: "bounceOut" });
        return [this.growingStick.length, fallingTween];
    }
}
