import Platform from "../../Game/Platform/Platform";
import BaseView from "../BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlatformView extends BaseView<Platform> {

    @property(cc.Node)
    perfectNode: cc.Node = null;

    @property(cc.Node)
    plusOneNode: cc.Node = null;

    protected onOriginDataChanged() {
        if (this.base === null || this._fieldSize === null || this.perfectNode === null) {
            throw new Error("Base, fieldSize or perfectNode is not defined");
        }
        this.plusOneNode.active = this.base.showPlusOne;
        this.perfectNode.active = this.base.showPerfectSpot;
        this.perfectNode.width = this.base.perfectWidth * this._fieldSize.width;
        this.node.width = this.base.width * this._fieldSize.width;
        this.node.height = this._fieldSize.height * this._bottomIndentPercent;
        this.node.setPosition(this.base.position.x * this._fieldSize.width, 0);
        this.node.active = this.base.isVisible;
    }
}
