import Stick from "../../Game/Stick/Stick";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StickView extends cc.Component {

    private _fieldSize: cc.Size = null;
        public set fieldSize(value: cc.Size) {
            this._fieldSize = value;
        }
        private _bottomIndentPercent: number = 10;
        public set bottomIndentPercent(value: number) {
            this._bottomIndentPercent = value;
        }
        private base: Stick = null;
    
        init(base: Stick){
            this.base = base;
            this.base.dataChanged.on(() => this.onOriginDataChanged());
            this.onOriginDataChanged();
        }

    onOriginDataChanged(){
        if (this.base === null || this._fieldSize === null){
            throw new Error("base fields are not defined");
        }
        this.node.width = this.base.length * this._fieldSize.width;
        this.node.setPosition(
            this.base.position.x * this._fieldSize.width, 
            this._bottomIndentPercent * this._fieldSize.height);
        this.node.active = this.base.isVisible;
    }
}
