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
    constructor(input: UserInput) {
        input.TouchStarted.on(() => this.onTouchStart());
        input.TouchEnded.on(() => this.onTouchEnd());
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
        this._controllers.playerController.reset();
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
        let [stickLength, fallingTween] = this._controllers.sticksController.stopGrowing();
        let winDistRange = this._controllers.platformsController.winDistRange;
        if (stickLength >= winDistRange[0] && stickLength <= winDistRange[1]){
            fallingTween
                .call(() => {
                    this.step();
                })
                .start();
        }
        else {
            fallingTween
                .call(() => {
                    this.GameStart();
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