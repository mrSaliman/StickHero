import UserInput from "../Input/UserInput"
import Delegate from "../Libs/Delegate/Delegate";
import CameraController from "./Camera/CameraController";
import ParallaxController from "./Parallax/ParallaxController";
import PlatformsController from "./Platform/PlatformsController"
import PlayerController from "./Player/PlayerController";
import SticksController from "./Stick/SticksController";
import Label from "./UI/Label";

export type ControllerStack = {
    platformsController: PlatformsController,
    sticksController: SticksController,
    playerController: PlayerController,
    cameraController: CameraController,
    parallaxController: ParallaxController
}

export enum GameState {
    Prepare,
    Game,
    Loss
}

export default class GameManager {
    constructor(input: UserInput, cameraNode: cc.Node, moveModifier: number, parallaxSize: number) {
        input.TouchStarted.on(() => this.onTouchStart());
        input.TouchEnded.on(() => this.onTouchEnd());
        this._controllers.cameraController = new CameraController(cameraNode, moveModifier);
        this._controllers.parallaxController = new ParallaxController(parallaxSize);
    }

    private inputLocked: boolean = false;
    private inputStarted: boolean = false;

    private _currentGameState: GameState = GameState.Prepare;
    public get currentGameState(): GameState {
        return this._currentGameState;
    }
    public set currentGameState(value: GameState) {
        this._currentGameState = value;
        this._stateChanged.emit();
    }

    private _currentScoreLabel = new Label();
    public get currentScoreLabel() {
        return this._currentScoreLabel;
    }

    private _score: number = 0;
    public get score(): number {
        return this._score;
    }
    public set score(value: number) {
        this._score = value;
        this._currentScoreLabel.content = value.toString();
    }

    private _stateChanged = new Delegate();
    public get stateChanged() {
        return this._stateChanged;
    }

    private _controllers: ControllerStack = {
        platformsController: new PlatformsController(),
        sticksController: new SticksController(),
        playerController: new PlayerController(),
        cameraController: null,
        parallaxController: null,
    }
    public get controllers(): ControllerStack {
        return this._controllers
    }

    private startTweens: cc.Tween[] = [];

    public prepare() {
        this.currentGameState = GameState.Prepare;
        this.inputLocked = true;
        this.startTweens.push(
            this._controllers.platformsController.resetWithPosition(0.5)
            .call(() => {
                this.inputLocked = false;
            })
        );
        let currentPlatform = this._controllers.platformsController.current;

        this._controllers.sticksController.resetWithPosition(currentPlatform.position.x + currentPlatform.width / 2);
        this._controllers.playerController.resetWithPosition(currentPlatform.position.x, false);
        this.startTweens.push(this._controllers.playerController.getMovementTween(currentPlatform.width / 2, 0.5, true));
        this._controllers.cameraController.reset();
        this._controllers.parallaxController.reset();
        this.startTweens.push(this._controllers.cameraController.move(currentPlatform.position.x - currentPlatform.width / 2));
        this.startTweens.concat(this._controllers.parallaxController.move(currentPlatform.position.x - currentPlatform.width / 2));
    }

    public start() {
        if (this.currentGameState !== GameState.Prepare) return;
        this.currentGameState = GameState.Game;
        this.startTweens.forEach(t => {
            t.start();
        });
        this.startTweens = [];
        this.score = 0;
    }

    public restart(){
        if (this.currentGameState !== GameState.Loss) return;
        this.currentGameState = GameState.Game;
        this._controllers.platformsController.reset()
            .call(() => {
                this.inputLocked = false;
            })
            .start();
        
        let currentPlatform = this._controllers.platformsController.current;

        this._controllers.sticksController.resetWithPosition(currentPlatform.position.x + currentPlatform.width / 2);
        this._controllers.playerController.resetWithPosition(currentPlatform.position.x + currentPlatform.width / 2, true);
        this._controllers.cameraController.reset();
        this._controllers.parallaxController.reset();
        this.score = 0;
    }

    onTouchStart(){
        if (this.inputLocked) return;
        this._controllers.sticksController.startGrowing();
        this.inputStarted = true;
    }

    onTouchEnd(){
        if (this.inputLocked || !this.inputStarted) return;
        this.inputLocked = true;
        this.inputStarted = false;
        let stickLength = this._controllers.sticksController.stopGrowing();
        let winDistRange = this._controllers.platformsController.winDistRange;
        if (stickLength >= winDistRange[0] && stickLength <= winDistRange[1]){
            this._controllers.sticksController.fallingTween
                .call(() => {
                    this._controllers.playerController.getMovementTween(winDistRange[1], 0.5, false)
                    .call(() => {
                        this.step();
                    })
                    .start();
                })
                .start();
        }
        else {
            this._controllers.sticksController.fallingTween
                .call(() => {
                    this._controllers.playerController.getMovementTween(stickLength, 0.5, false)
                    .call(() => {
                        this._controllers.playerController.looseTween
                            .call(() => {
                                this.currentGameState = GameState.Loss;
                            })
                            .start();
                        this._controllers.sticksController.fallingTween
                            .start();
                    })
                    .start();
                })
                .start();
        }
    }

    step() {
        this.score++;
        let currentPlatform = this._controllers.platformsController.current;
        let nextPlatform = this._controllers.platformsController.next;
        let cameraMoveDist = currentPlatform.width / 2 + (nextPlatform.position.x - currentPlatform.position.x) - nextPlatform.width / 2;
        this._controllers.cameraController.move(cameraMoveDist)
            .start();

        this._controllers.parallaxController.move(cameraMoveDist).forEach(t => {
            t.start();
        });

        let movePlatformsTween = this._controllers.platformsController.step();
        this._controllers.sticksController.step(nextPlatform.position.x + nextPlatform.width / 2);
        movePlatformsTween[0] = movePlatformsTween[0].call(() => {this.inputLocked = false;});
        movePlatformsTween.forEach(tween => {
            tween.start();
        });
    }
}