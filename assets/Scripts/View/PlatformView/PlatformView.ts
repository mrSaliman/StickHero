import Platform from "../../Game/Platform/Platform";
import BaseView from "../BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlatformView extends BaseView<Platform> {

    @property(cc.Node)
    perfectNode: cc.Node = null;

    @property(cc.Node)
    plusOneNode: cc.Node = null;

    @property(cc.BoxCollider)
    collider: cc.BoxCollider = null;

    protected onOriginDataChanged() {
        if (!this.base || !this._fieldSize || !this.perfectNode || !this.collider) {
            throw new Error("Base, fieldSize or perfectNode is not defined");
        }
        this.plusOneNode.active = this.base.showPlusOne;
        this.perfectNode.active = this.base.showPerfectSpot;
        this.perfectNode.width = this.base.perfectWidth * this._fieldSize.width;
        this.node.width = this.base.width * this._fieldSize.width;
        this.node.height = this._fieldSize.height * this._bottomIndentPercent;
        this.collider.size.width = this.node.width;
        this.collider.size.height = this.node.height;
        this.collider.offset.y = this.node.height / 2;
        this.node.setPosition(this.base.position.x * this._fieldSize.width, 0);
        this.node.active = this.base.isVisible;
    }
}
