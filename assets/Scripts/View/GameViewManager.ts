import CameraController from "../Game/Camera/CameraController";
import GameManager from "../Game/GameManager";
import UserInput from "../Input/UserInput";
import PlatformsViewController from "./PlatformView/PlatformsViewController";
import SticksViewController from "./StickView/SticksViewController";
import PlayerViewController from './PlayerView/PlayerViewController';

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameViewManager extends cc.Component {

    private gameManager: GameManager;
    private platformsViewController: PlatformsViewController;
    private sticksViewController: SticksViewController;
    private playerViewController: PlayerViewController;

    @property(cc.Node)
    controllersNode: cc.Node = null;

    @property(UserInput)
    input: UserInput = null;

    @property(cc.Node)
    cameraNode: cc.Node = null


    protected onLoad(): void {
        if (this.controllersNode === null || this.input === null || this.cameraNode === null){
            throw new Error("links missing");
        }
        
        this.gameManager = new GameManager(this.input, this.cameraNode, cc.view.getDesignResolutionSize().width);
        let stack = this.gameManager.controllers;

        this.platformsViewController = this.controllersNode.getComponent(PlatformsViewController);
        this.sticksViewController = this.controllersNode.getComponent(SticksViewController);
        this.playerViewController = this.controllersNode.getComponent(PlayerViewController);

        this.onWindowChanged();
        this.platformsViewController.init(stack.platformsController);
        this.sticksViewController.init(stack.sticksController);
        this.playerViewController.init(stack.playerController);
    }

    private onWindowChanged(){
        let size = cc.view.getDesignResolutionSize();
        this.platformsViewController.updateFieldSize(size);
        this.sticksViewController.updateFieldSize(size);
        this.playerViewController.updateFieldSize(size);
    }

    protected start(): void {
        this.gameManager.GameStart();
    }

    protected onDestroy(): void {
    }

}
