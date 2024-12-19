import GameManager, { GameState } from "../Game/GameManager";
import UserInput from "../Input/UserInput";
import PlatformsViewController from "./PlatformView/PlatformsViewController";
import SticksViewController from "./StickView/SticksViewController";
import PlayerViewController from './PlayerView/PlayerViewController';
import ParallaxViewController from './Background/ParallaxViewController';
import UIController from "./UI/UIController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameViewManager extends cc.Component {

    private gameManager: GameManager;
    private platformsViewController: PlatformsViewController;
    private sticksViewController: SticksViewController;
    private playerViewController: PlayerViewController;
    private parallaxViewController: ParallaxViewController;

    @property(cc.Node)
    controllersNode: cc.Node = null;

    @property(UserInput)
    input: UserInput = null;

    @property(cc.Node)
    cameraNode: cc.Node = null

    @property(UIController)
    uiController: UIController = null;


    protected onLoad(): void {
        if (this.controllersNode === null || this.input === null || this.cameraNode === null || this.uiController === null){
            throw new Error("links missing");
        }

        this.platformsViewController = this.controllersNode.getComponent(PlatformsViewController);
        this.sticksViewController = this.controllersNode.getComponent(SticksViewController);
        this.playerViewController = this.controllersNode.getComponent(PlayerViewController);
        this.parallaxViewController = this.controllersNode.getComponent(ParallaxViewController);

        this.updateWindowSize();
        let parallaxSize = this.parallaxViewController.loadParallaxNodes();
        
        this.gameManager = new GameManager(this.input, this.cameraNode, cc.view.getDesignResolutionSize().width, parallaxSize);
        let stack = this.gameManager.controllers;

        this.gameManager.stateChanged.on(() => this.onStateChanged());

        this.platformsViewController.init(stack.platformsController);
        this.sticksViewController.init(stack.sticksController);
        this.playerViewController.init(stack.playerController);
        this.parallaxViewController.init(stack.parallaxController);

        this.uiController.initScoreLabel(this.gameManager.currentScoreLabel);
        this.uiController.initPerfectLabel(this.gameManager.currentPerfectLabel);
    }

    protected start(): void {
        this.gameManager.prepare();
        this.uiController.enableStartUI();
    }

    private updateWindowSize(){
        let designSize = cc.view.getDesignResolutionSize();
        this.platformsViewController.updateFieldSize(designSize);
        this.sticksViewController.updateFieldSize(designSize);
        this.playerViewController.updateFieldSize(designSize);
        let windowSize = cc.view.getCanvasSize();
        let parallaxSize = cc.size(designSize.width, (windowSize.height / windowSize.width) * designSize.width);
        this.parallaxViewController.updateFieldSize(parallaxSize);
    }

    public startGameButtonPressed(): void {
        if (this.gameManager.currentGameState !== GameState.Prepare) return;
        this.uiController.disableStartUI();
        this.uiController.enableGameUI();
        this.gameManager.start();
    }

    public restartGameButtonPressed(){
        if (this.gameManager.currentGameState !== GameState.Loss) return;
        this.uiController.disableLoseUI();
        this.uiController.enableGameUI();
        this.gameManager.restart();
    }

    public homeButtonPressed(): void {
        if (this.gameManager.currentGameState !== GameState.Loss) return;
        this.uiController.disableLoseUI();
        this.uiController.enableStartUI();
        this.gameManager.prepare();
    }

    private onStateChanged() {
        if (this.gameManager.currentGameState === GameState.Loss){
            this.uiController.disableGameUI();
            this.uiController.enableLoseUI();
        }
    }

    protected onDestroy(): void {
        this.gameManager.stateChanged.off(() => this.onStateChanged());
    }

}
