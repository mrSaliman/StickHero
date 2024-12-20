import RandUtil from "../../Libs/RandUtil/RandUtil";
import BaseController from "../BaseController";
import Collectable from "./Collectable";


export default class CollectablesController extends BaseController<Collectable> {

    private collectableWidth = 0.05;

    constructor() {
        super(() => new Collectable());
    }

    public resetWithSettins(distRange: [number, number], maxAmount: number): void {
        super.reset();
        const collectablesAmount = RandUtil.getRandomInteger(
            0,
            Math.min(
                maxAmount, 
                ((distRange[1] - this.collectableWidth / 2) - 
                (distRange[0] + this.collectableWidth / 2)) / 
                this.collectableWidth
            )
        );
        const positions = RandUtil.distributeRandomNumbers(
            collectablesAmount, 
            distRange[0] + this.collectableWidth / 2, 
            distRange[1] - this.collectableWidth / 2, 
            this.collectableWidth
        );
        positions.forEach(position => {
            this.setupCollectabe(this.getNextObject(), position);
        });
    }

    private setupCollectabe(collectable: Collectable, position: number): void {
        collectable.position = cc.v2(position, 0);
        collectable.isMirrored = RandUtil.getRandomInteger(0, 1) === 0 ? false : true;
        collectable.isVisible = true;
        collectable.setAllData(this.collectableWidth, cc.v2(position, 0), true, RandUtil.getRandomInteger(0, 1) === 0 ? false : true)
    }
}