import Delegate from "../../Libs/Delegate/Delegate";
import IObjectPool from "../../Libs/ObjectPool/IObjectPool";
import ObjectPool from "../../Libs/ObjectPool/ObjectPool";

export default class CameraController {
    private moveCameraTime = 0.2;

    private moveModifier = 1; 

    constructor (cameraNode: cc.Node, moveModifier: number){
        this.cameraNode = cameraNode;
        this.moveModifier = moveModifier;
    }

    private cameraNode: cc.Node;

    public reset(): void {
        this.cameraNode.setPosition(cc.v2());
    }

    public move(moveDistance: number): cc.Tween<cc.Node> {
        return cc.tween(this.cameraNode)
            .by(this.moveCameraTime, {position: cc.v3(moveDistance * this.moveModifier, 0, 0)})
    }
}