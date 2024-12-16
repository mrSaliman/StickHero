import Stick from "../../Game/Stick/Stick";
import BaseView from "../BaseView";

const { ccclass } = cc._decorator;

@ccclass
export default class StickView extends BaseView<Stick> {
    protected onOriginDataChanged() {
        if (this.base === null || this._fieldSize === null) {
            throw new Error("Base or fieldSize is not defined");
        }
        this.node.angle = this.base.rotation;
        this.node.width = this.base.length * this._fieldSize.width;
        this.node.setPosition(
            this.base.position.x * this._fieldSize.width,
            this._bottomIndentPercent * this._fieldSize.height
        );
        this.node.active = this.base.isVisible;
    }
}

