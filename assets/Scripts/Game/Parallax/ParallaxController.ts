import BaseController from "../BaseController";
import Parallax from "./Parallax";

export default class ParallaxController extends BaseController<Parallax> {

    private moveCameraTime = 0.2;
    private parallaxSize: number = 0;
    private depthModifier = 0.9

    constructor(parallaxSize: number) {
        super(() => new Parallax());
        this.parallaxSize = parallaxSize;
    }

    public reset(): void {
        this.currentObjects.forEach(element => {
            element.reset();
        });
        if (this.currentObjects.length === 0){
            for (let i = 0; i < this.parallaxSize; i++) {
                this.getNextObject();
            }
        }
        this.currentObjects.forEach(element => {
            this.setupParallaxPart(element);
        });
    }

    public step(distance: number): cc.Tween<Parallax>[] {
        let tweenArr: cc.Tween<Parallax>[] = []
        let modifier = this.depthModifier;
        for (let i = 0; i < this.parallaxSize; i++) {
            tweenArr.push(cc.tween(this.currentObjects[i])
                .by(this.moveCameraTime, {position: cc.v2(distance * modifier, 0)}))
            
            this.currentObjects[i].width += distance - distance * modifier;
            modifier *= this.depthModifier;
        }
        return tweenArr;
    }

    private setupParallaxPart(parallax: Parallax): void {
        parallax.position = cc.v2();
        parallax.width = 1;
        parallax.isVisible = true;
    }
}
