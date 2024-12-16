import Platform from "../../Game/Platform/Platform";
import BaseView from "../BaseView";

const { ccclass } = cc._decorator;

@ccclass
export default class PlatformView extends BaseView<Platform> {
    protected onOriginDataChanged() {
        if (this.base === null || this._fieldSize === null) {
            throw new Error("Base or fieldSize is not defined");
        }
        this.node.width = this.base.width * this._fieldSize.width;
        this.node.height = this._fieldSize.height * this._bottomIndentPercent;
        this.node.setPosition(this.base.position.x * this._fieldSize.width, 0);
        this.node.active = this.base.isVisible;
    }
}
