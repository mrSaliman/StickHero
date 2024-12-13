import { Platform } from "../../Game/Platform/Platform";
import { PlatformsController } from "../../Game/Platform/PlatformsController";
import PlatformView from "./PlatformView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformsViewController extends cc.Component {
    private paltformsList: PlatformView[] = [];

    @property(cc.Prefab)
    platformViewPrefab: cc.Prefab = null;

    @property(cc.Node)
    platformsFolder: cc.Node = null;

    @property({
        min: 0.01,
        max: 0.99
    })
    bottomIndentPercent = 0.15;

    private _currentFieldSize: cc.Size = null;

    public updateFieldSize(size: cc.Size){
        this._currentFieldSize = size;
        this.paltformsList.forEach(platformView => {
            platformView.fieldSize = size;
        });
    }

    protected onLoad(): void {
        if (this.platformViewPrefab === null || this.platformsFolder === null){
            throw new Error("links missing");
        }
    }

    public init(base: PlatformsController){
        base.platformCreated.on((base: Platform) => this.CreatePlatform(base))
    }

    CreatePlatform(base: Platform){
        let platform = cc.instantiate(this.platformViewPrefab);
        this.platformsFolder.addChild(platform);
        let view = platform.getComponent(PlatformView);
        view.bottomIndentPercent = this.bottomIndentPercent;
        view.fieldSize = this._currentFieldSize;
        view.init(base);
        this.paltformsList.push(view);
    }
}
