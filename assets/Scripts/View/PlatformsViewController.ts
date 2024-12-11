import { PlatformsController } from "../Game/PlatformsController";
import PlatformView from "./PlatformView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlatformsViewController extends cc.Component {
    private paltformsList: PlatformView[] = [];

    @property(cc.Prefab)
    platformViewPrefab: cc.Prefab = null;

    @property (cc.Node)
    platformsFolder: cc.Node = null;

    protected onLoad(): void {
        if (this.platformViewPrefab === null || this.platformsFolder === null){
            throw new Error("links missing");
        }
    }

    public init(base: PlatformsController){
        base.platformCreated.on(this.CreatePlatform)
    }

    CreatePlatform(base: Platform){
        let platform = cc.instantiate(this.platformViewPrefab);
        this.platformsFolder.addChild(platform);
        let view = platform.getComponent(PlatformView);
        view.init(base);
        this.paltformsList.push(view);
    }
}
