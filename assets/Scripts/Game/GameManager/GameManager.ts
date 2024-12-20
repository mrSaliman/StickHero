import UserInput from "../../Input/UserInput"
import CollectableView from "../../View/CollectableView/CollectableView";
import CameraController from "../Camera/CameraController";
import Collectable from "../Collectable/Collectable";
import CollectablesController from "../Collectable/CollectablesController";
import ParallaxController from "../Parallax/ParallaxController";
import PlatformsController, { FitResult } from "../Platform/PlatformsController"
import PlayerController, { PlayerState } from "../Player/PlayerController";
import SticksController from "../Stick/SticksController";
import GameStateManager from "./GameStateManager";
import InputHandler from "./InputHandler";
import ScoreManager from "./ScoreManager";

export type ControllerStack = {
    platformsController: PlatformsController,
    sticksController: SticksController,
    playerController: PlayerController,
    cameraController: CameraController,
    parallaxController: ParallaxController,
    collectablesController: CollectablesController
}

export enum GameState {
    Prepare,
    Game,
    Loss
}

export default class GameManager {
    private _stateManager = new GameStateManager();
    public get stateManager() {
        return this._stateManager;
    }
    private _scoreManager = new ScoreManager();
    public get scoreManager() {
        return this._scoreManager;
    }
    private _inputHandler: InputHandler;
    public get inputHandler(): InputHandler {
        return this._inputHandler;
    }
    private _controllers: ControllerStack;
    public get controllers(): ControllerStack {
        return this._controllers;
    }

    constructor(input: UserInput, cameraNode: cc.Node, moveModifier: number, parallaxSize: number) {
        this._controllers = {
            platformsController: new PlatformsController(),
            sticksController: new SticksController(),
            playerController: new PlayerController(),
            cameraController: new CameraController(cameraNode, moveModifier),
            parallaxController: new ParallaxController(parallaxSize),
            collectablesController: new CollectablesController()
        };

        this._inputHandler = new InputHandler(
            this.controllers.sticksController,
            (stickLength) => this.handleStickInput(stickLength),
            () => this.handleFlipInput()
        );

        input.TouchStarted.on(() => this.inputHandler.onTouchStart());
        input.TouchEnded.on(() => this.inputHandler.onTouchEnd());
    }

    private startTweens: cc.Tween[] = [];

    public prepare() {
        this.stateManager.currentGameState = GameState.Prepare;
        this.inputHandler.lockStickInput();
        this.startTweens.push(
            this.controllers.platformsController.resetWithPosition(0.5)
                .call(() => {
                    this.inputHandler.unlockStickInput();
                })
        );
        const currentPlatform = this.controllers.platformsController.current;
        this.controllers.sticksController.resetWithPosition(currentPlatform.position.x + currentPlatform.width / 2);
        this.controllers.playerController.resetWithPosition(currentPlatform.position.x, false);
        this.startTweens.push(this._controllers.playerController.getMovementTween(currentPlatform.width / 2, 0.5, true, 1));
        this.controllers.cameraController.reset();
        this.controllers.parallaxController.reset();
        this.startTweens.push(this._controllers.cameraController.move(currentPlatform.position.x - currentPlatform.width / 2));
        this.startTweens = this.startTweens.concat(this._controllers.parallaxController.move(currentPlatform.position.x - currentPlatform.width / 2));
    }

    public start() {
        if (this.stateManager.currentGameState !== GameState.Prepare) return;
        this.stateManager.currentGameState = GameState.Game;
        this.startTweens.forEach(t => {
            t.start();
        });
        this.startTweens = [];
        this.scoreManager.score = 0;
        this.scoreManager.collectableScore = 0;
        this.scoreManager.collectableBuffer = 0;
        this.scoreManager.perfectLabel.content = "PERFECT";
    }

    public restart() {
        if (this.stateManager.currentGameState !== GameState.Loss) return;
        this.stateManager.currentGameState = GameState.Game;

        this.controllers.platformsController.reset().call(() => {
            this.inputHandler.unlockStickInput();
        }).start();

        const currentPlatform = this.controllers.platformsController.current;
        this.controllers.sticksController.resetWithPosition(currentPlatform.position.x + currentPlatform.width / 2);
        this.controllers.playerController.resetWithPosition(currentPlatform.position.x + currentPlatform.width / 2, true);
        this.controllers.cameraController.reset();
        this.controllers.parallaxController.reset();
        this.scoreManager.score = 0;
        this.scoreManager.collectableScore = 0;
        this.scoreManager.collectableBuffer = 0;
    }

    private handleStickInput(stickLength: number) {
        const fitResult = this.controllers.platformsController.fitToWin(stickLength);
        const rightPlatformEdge = this.controllers.platformsController.winDistRange[1];

        if (fitResult === FitResult.Lose) {
            this._controllers.sticksController.fallingTween
                .call(() => {
                    this.controllers.playerController.currentState = PlayerState.Running
                    this._controllers.playerController.getMovementTween(
                        stickLength, 
                        0.5, 
                        false,
                        rightPlatformEdge
                    )
                    .call(() => {
                        this.controllers.playerController.currentState = PlayerState.Standing
                        this._controllers.playerController.looseTween
                            .call(() => {
                                this.stateManager.currentGameState = GameState.Loss;
                            })
                            .start();
                        this._controllers.sticksController.fallingTween
                            .start();
                    })
                    .start();
                })
                .start();
        } else {
            this.controllers.sticksController.fallingTween
                .call(() => {
                    if (fitResult === FitResult.Perfect) {
                        this.controllers.platformsController.showPlusOne();
                        this.scoreManager.showPerfect();
                    }
                    this.controllers.playerController.currentState = PlayerState.Running;
                    this.controllers.playerController.getMovementTween(
                        rightPlatformEdge,
                        0.5,
                        false,
                        rightPlatformEdge
                    )
                        .call(() => {
                            this.controllers.playerController.currentState = PlayerState.Standing;
                            this.step();
                            this.scoreManager.score += fitResult === FitResult.Perfect ? 2 : 1;
                            this.scoreManager.collectableScore += this.scoreManager.collectableBuffer;
                            this.scoreManager.collectableBuffer = 0;
                        })
                        .start();
                })
                .start();
        }
    }

    handleFlipInput() {
        if (this.controllers.playerController.currentState === PlayerState.Standing) return;
        const currentPlayer = this.controllers.playerController.currentPlayer;
        const currentPlatform = this._controllers.platformsController.current;
        const nextPlatform = this._controllers.platformsController.next;
        if (currentPlayer.position.x - currentPlayer.width / 2 < currentPlatform.position.x + currentPlatform.width / 2 ||
            currentPlayer.position.x + currentPlayer.width / 2 > nextPlatform.position.x - nextPlatform.width / 2) return;
        currentPlayer.isMirrored = !currentPlayer.isMirrored;
    }

    step() {
        const currentPlatform = this._controllers.platformsController.current;
        const nextPlatform = this._controllers.platformsController.next;
        const cameraMoveDist = currentPlatform.width / 2 + (nextPlatform.position.x - currentPlatform.position.x) - nextPlatform.width / 2;
        this._controllers.cameraController.move(cameraMoveDist)
            .start();

        this._controllers.parallaxController.move(cameraMoveDist).forEach(t => {
            t.start();
        });

        const movePlatformsTween = this._controllers.platformsController.step();
        const distBetween = this._controllers.platformsController.winDistRange[0];

        this._controllers.collectablesController.resetWithSettins(
            [nextPlatform.position.x + nextPlatform.width / 2, 
                nextPlatform.position.x + nextPlatform.width / 2 + distBetween], 
            3
        )

        this._controllers.sticksController.step(nextPlatform.position.x + nextPlatform.width / 2);
        movePlatformsTween[0] = movePlatformsTween[0].call(() => {this.inputHandler.unlockStickInput()});
        movePlatformsTween.forEach(tween => {
            tween.start();
        });
    }

    playerCollisionDetected(other: cc.Collider){
        if (other.node.group === "platform"){
            cc.Tween.stopAll();
            this.controllers.playerController.currentState = PlayerState.Standing
            this._controllers.playerController.looseTween
                .call(() => {
                    this.stateManager.currentGameState = GameState.Loss;
                })
                .start();
            this._controllers.sticksController.fallingTween
                .start();
        }
        else {
            this.controllers.collectablesController.collect(other.node.getComponent(CollectableView).base);
            this.scoreManager.collectableBuffer++;
        }
    }
}