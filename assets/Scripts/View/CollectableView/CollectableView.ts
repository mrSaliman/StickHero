import Collectable from "../../Game/Collectable/Collectable";
import BaseView from "../BaseView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CollectableView extends BaseView<Collectable> {

    @property(cc.BoxCollider)
    collider: cc.BoxCollider = null;

    private spriteRatio: number = 1;

    init(base: Collectable): void {
        this.spriteRatio = this.node.height / this.node.width;
        super.init(base);
    }

    protected onOriginDataChanged() {
        if (!this.base || !this._fieldSize || !this.collider) {
            throw new Error("properties are not defined");
        }
        if (this.base.isMirrored === (this.node.scaleY > 0)) {
            this.node.scaleY *= -1;
        }

        this.node.width = this.base.width * this._fieldSize.width;
        this.node.height = this.node.width * this.spriteRatio;
        this.collider.size.width = this.node.width;
        this.collider.size.height = this.node.height;
        this.collider.offset.y = this.node.height / 2;
        this.node.setPosition(
            this.base.position.x * this._fieldSize.width,
            this._bottomIndentPercent * this._fieldSize.height
        );
        this.node.active = this.base.isVisible;
    }
}

