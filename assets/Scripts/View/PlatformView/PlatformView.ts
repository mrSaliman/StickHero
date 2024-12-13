import { Platform } from "../../Game/Platform/Platform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformView extends cc.Component {
    

    private _fieldSize: cc.Size = null;
    public set fieldSize(value: cc.Size) {
        this._fieldSize = value;
    }
    private _bottomIndentPercent: number = 10;
    public set bottomIndentPercent(value: number) {
        this._bottomIndentPercent = value;
    }
    private base: Platform = null;

    init(base: Platform){
        this.base = base;
        this.base.dataChanged.on(() => this.onOriginDataChanged());
        this.onOriginDataChanged();
    }

    onOriginDataChanged(){
        if (this.base === null || this._fieldSize === null){
            throw new Error("base fields are not defined");
        }
        this.node.width = this.base.width * this._fieldSize.width;
        this.node.height = this._fieldSize.height * this._bottomIndentPercent;
        this.node.setPosition(this.base.position.x * this._fieldSize.width, 0);
        this.node.active = this.base.isVisible;
    }
}
