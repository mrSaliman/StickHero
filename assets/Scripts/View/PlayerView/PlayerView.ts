import Player from "../../Game/Player/Player";
import BaseView from "../BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PlayerView extends BaseView<Player> {

    @property(cc.BoxCollider)
    collider: cc.BoxCollider = null;

    protected onOriginDataChanged() {
        if (this.base === null || this._fieldSize === null) {
            throw new Error("Base or fieldSize is not defined");
        }
        if (this.base.isMirrored === (this.node.scaleY > 0)) {
            this.node.scaleY *= -1;
        }
        this.node.width = this.base.width * this._fieldSize.width;
        this.collider.size.width = this.node.width;
        this.collider.size.height = this.node.height;
        this.collider.offset.y = this.node.height / 2;
        this.node.setPosition(
            this.base.position.x * this._fieldSize.width,
            (this._bottomIndentPercent + this.base.position.y) * this._fieldSize.height
        );
        this.node.active = this.base.isVisible;
    }
}

