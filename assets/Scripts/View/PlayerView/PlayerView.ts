import Player from "../../Game/Player/Player";
import BaseView from "../BaseView";

const { ccclass } = cc._decorator;

@ccclass
export default class PlayerView extends BaseView<Player> {
    protected onOriginDataChanged() {
        if (this.base === null || this._fieldSize === null) {
            throw new Error("Base or fieldSize is not defined");
        }
        if (this.base.isMirrored === (this.node.scaleY > 0)) {
            this.node.scaleY *= -1;
        }
        this.node.width = this.base.width * this._fieldSize.width;
        this.node.setPosition(
            this.base.position.x * this._fieldSize.width,
            (this._bottomIndentPercent + this.base.position.y) * this._fieldSize.height
        );
        this.node.active = this.base.isVisible;
    }
}

