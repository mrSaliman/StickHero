import GameManager, { GameState } from "../Game/GameManager/GameManager";
import UserInput from "../Input/UserInput";
import PlatformsViewController from "./PlatformView/PlatformsViewController";
import SticksViewController from "./StickView/SticksViewController";
import PlayerViewController from './PlayerView/PlayerViewController';
import ParallaxViewController from './Background/ParallaxViewController';
import UIController from "./UI/UIController";
import GameStateManager from "../Game/GameManager/GameStateManager";
import CollectablesViewController from "./CollectableView/CollectablesViewController";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameViewManager extends cc.Component {

    private gameManager: GameManager;
    private platformsViewController: PlatformsViewController;
    private sticksViewController: SticksViewController;
    private playerViewController: PlayerViewController;
    private parallaxViewController: ParallaxViewController;
    private collectablesViewController: CollectablesViewController;
    private stateManager: GameStateManager;

    @property(cc.Node)
    controllersNode: cc.Node = null;

    @property(UserInput)
    input: UserInput = null;

    @property(cc.Node)
    cameraNode: cc.Node = null

    @property(UIController)
    uiController: UIController = null;

    protected onLoad(): void {
        this.validateProperties();
        this.initializeControllers();
        this.initializeUI();
    }

    protected start(): void {
        this.gameManager.prepare();
        this.uiController.enableStartUI();
    }

    public startGameButtonPressed(): void {
        if (this.stateManager.currentGameState !== GameState.Prepare) return;
        this.uiController.disableStartUI();
        this.uiController.enableGameUI();
        this.gameManager.start();
    }

    public restartGameButtonPressed(): void {
        if (this.stateManager.currentGameState !== GameState.Loss) return;
        this.uiController.disableLoseUI();
        this.uiController.enableGameUI();
        this.gameManager.restart();
    }

    public homeButtonPressed(): void {
        if (this.stateManager.currentGameState !== GameState.Loss) return;
        this.uiController.disableLoseUI();
        this.uiController.enableStartUI();
        this.gameManager.prepare();
    }

    private validateProperties(): void {
        if (!this.controllersNode || !this.input || !this.cameraNode || !this.uiController) {
            throw new Error("Links missing");
        }
    }

    private initializeControllers(): void {
        this.platformsViewController = this.getController(PlatformsViewController);
        this.sticksViewController = this.getController(SticksViewController);
        this.playerViewController = this.getController(PlayerViewController);
        this.parallaxViewController = this.getController(ParallaxViewController);
        this.collectablesViewController = this.getController(CollectablesViewController);

        this.updateWindowSize();
        const parallaxSize = this.parallaxViewController.loadParallaxNodes();
        this.gameManager = new GameManager(this.input, this.cameraNode, cc.view.getDesignResolutionSize().width, parallaxSize);

        const stack = this.gameManager.controllers;
        this.stateManager = this.gameManager.stateManager;
        this.stateManager.stateChanged.on(() => this.onStateChanged());

        this.platformsViewController.init(stack.platformsController);
        this.sticksViewController.init(stack.sticksController);
        this.playerViewController.init(stack.playerController);
        this.playerViewController.contactCallback = (other: cc.Collider) => this.gameManager.playerCollisionDetected(other);
        this.parallaxViewController.init(stack.parallaxController);
        this.collectablesViewController.init(stack.collectablesController);
    }

    private initializeUI(): void {
        this.uiController.initScoreLabel(this.gameManager.scoreManager.scoreLabel);
        this.uiController.initPerfectLabel(this.gameManager.scoreManager.perfectLabel);
        this.uiController.initCollectableLabel(this.gameManager.scoreManager.collectableLabel)
    }

    private getController<T>(controllerType: new (...args: any[]) => T): T {
        return this.controllersNode.getComponent(controllerType);
    }

    private updateWindowSize(): void {
        const designSize = cc.view.getDesignResolutionSize();
        this.platformsViewController.updateFieldSize(designSize);
        this.sticksViewController.updateFieldSize(designSize);
        this.playerViewController.updateFieldSize(designSize);
        this.collectablesViewController.updateFieldSize(designSize);

        const windowSize = cc.view.getCanvasSize();
        const parallaxSize = cc.size(designSize.width, (windowSize.height / windowSize.width) * designSize.width);
        this.parallaxViewController.currentScreenSize = windowSize;
        this.parallaxViewController.updateFieldSize(designSize);
    }

    private onStateChanged(): void {
        if (this.stateManager.currentGameState === GameState.Loss) {
            this.uiController.disableGameUI();
            this.uiController.enableLoseUI();
        }
    }

    protected onDestroy(): void {
        this.stateManager.stateChanged.off(() => this.onStateChanged());
    }
}
