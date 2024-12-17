import Parallax from "../../Game/Parallax/Parallax";
import BaseView from "../BaseView";

const { ccclass } = cc._decorator;

@ccclass
export default class ParallaxView extends BaseView<Parallax> {

    protected onOriginDataChanged() {
        if (this.base === null || this._fieldSize === null) {
            throw new Error("Base or fieldSize is not defined");
        }
        this.node.width = this.base.width * this._fieldSize.width;
        this.node.setPosition(this.base.position.x * this._fieldSize.width, 0);
        this.node.active = this.base.isVisible;
    }
}

