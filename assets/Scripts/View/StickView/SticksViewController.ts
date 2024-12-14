import Stick from "../../Game/Stick/Stick";
import SticksController from "../../Game/Stick/SticksController";
import StickView from "./StickView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SticksViewController extends cc.Component {

    private paltformsList: StickView[] = [];
    
    @property(cc.Prefab)
    stickViewPrefab: cc.Prefab = null;

    @property(cc.Node)
    sticksFolder: cc.Node = null;

    @property({
        min: 0.01,
        max: 0.99
    })
    bottomIndentPercent = 0.15;

    private _currentFieldSize: cc.Size = null;

    public updateFieldSize(size: cc.Size){
        this._currentFieldSize = size;
        this.paltformsList.forEach(stickView => {
            stickView.fieldSize = size;
        });
    }

    protected onLoad(): void {
        if (this.stickViewPrefab === null || this.sticksFolder === null){
            throw new Error("links missing");
        }
    }

    public init(base: SticksController){
        base.stickCreated.on((base: Stick) => this.Createstick(base))
    }

    Createstick(base: Stick){
        let stick = cc.instantiate(this.stickViewPrefab);
        this.sticksFolder.addChild(stick);
        let view = stick.getComponent(StickView);
        view.fieldSize = this._currentFieldSize;
        view.bottomIndentPercent = this.bottomIndentPercent;
        view.init(base);
        this.paltformsList.push(view);
    }
}
