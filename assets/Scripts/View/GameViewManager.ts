import { GameManager } from "../Game/GameManager";
import UserInput from "../Input/UserInput";
import PlatformsViewController from "./PlatformView/PlatformsViewController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameViewManager extends cc.Component {

    private gameManager: GameManager;
    private platformsViewController: PlatformsViewController;

    @property(cc.Node)
    controllersNode: cc.Node = null;

    @property(cc.Node)
    inputNode: cc.Node = null;

    protected onLoad(): void {
        if (this.controllersNode === null || this.inputNode === null){
            throw new Error("links missing");
        }
        
        this.gameManager = new GameManager(this.inputNode.getComponent(UserInput));
        let stack = this.gameManager.controllers;
        this.platformsViewController = this.controllersNode.getComponent(PlatformsViewController);
        this.onWindowChanged();
        this.platformsViewController.init(stack.platformsController);
    }

    private onWindowChanged(){
        let size = new cc.Size(1080, 1920) //cc.view.getCanvasSize();
        this.platformsViewController.updateFieldSize(size);
    }

    protected start(): void {
        this.gameManager.GameStart();
    }

    protected onDestroy(): void {
    }
}
