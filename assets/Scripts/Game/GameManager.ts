import UserInput from "../Input/UserInput"
import CameraController from "./Camera/CameraController";
import PlatformsController from "./Platform/PlatformsController"
import PlayerController from "./Player/PlayerController";
import SticksController from "./Stick/SticksController";

type ControllerStack = {
    platformsController: PlatformsController,
    sticksController: SticksController,
    playerController: PlayerController,
    cameraController: CameraController,
}

export default class GameManager {
    constructor(input: UserInput, cameraNode: cc.Node, moveModifier: number) {
        input.TouchStarted.on(() => this.onTouchStart());
        input.TouchEnded.on(() => this.onTouchEnd());
        this._controllers.cameraController = new CameraController(cameraNode, moveModifier);
    }

    private inputLocked: boolean = false;
    private inputStarted: boolean = false;

    private _controllers: ControllerStack = {
        platformsController: new PlatformsController(),
        sticksController: new SticksController(),
        playerController: new PlayerController(),
        cameraController: null
    }
    public get controllers(): ControllerStack {
        return this._controllers
    }

    public GameStart(){
        this._controllers.platformsController.reset()
            .call(() => {
                this.inputLocked = false;
            })
            .start();
        
        let currentPlatform = this._controllers.platformsController.current;

        this._controllers.sticksController.resetWithPosition(currentPlatform.position.x + currentPlatform.width / 2);
        this._controllers.playerController.resetWithPosition(currentPlatform.position.x + currentPlatform.width / 2);
        this._controllers.cameraController.reset();
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
                    this._controllers.playerController.getMovementTween(winDistRange[1], 0.5)
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
                    this._controllers.playerController.getMovementTween(stickLength, 0.5)
                    .call(() => {
                        this._controllers.playerController.looseTween
                            .call(() => {
                                this.GameStart();
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
        let currentPlatform = this._controllers.platformsController.current;
        let nextPlatform = this._controllers.platformsController.next;
        this._controllers.cameraController.step(
            currentPlatform.width / 2 + 
            (nextPlatform.position.x - currentPlatform.position.x) - 
            nextPlatform.width / 2
        )
            .start();
        let movePlatformsTween = this._controllers.platformsController.step();
        this._controllers.sticksController.step(nextPlatform.position.x + nextPlatform.width / 2);
        movePlatformsTween[0] = movePlatformsTween[0].call(() => {this.inputLocked = false;});
        movePlatformsTween.forEach(tween => {
            tween.start();
        });
    }
}