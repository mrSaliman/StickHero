import UserInput from "../Input/UserInput"
import PlatformsController from "./Platform/PlatformsController"
import SticksController from "./Stick/SticksController";

type ControllerStack = {
    platformsController: PlatformsController,
    sticksController: SticksController,
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
        this._controllers.sticksController.startStickPosition = this._controllers.platformsController.platformEnd;
        this._controllers.sticksController.distToMoveLast = this._controllers.platformsController.currentDistance;
        this._controllers.sticksController.reset();
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
        this._controllers.sticksController.distToMoveLast = this._controllers.platformsController.currentDistance;
        let movePlatformsTween = this._controllers.platformsController.step();
        this._controllers.sticksController.startStickPosition = this._controllers.platformsController.platformEnd;
        let moveSticksTween = this._controllers.sticksController.step();
        
        moveSticksTween
            .start();
        
        movePlatformsTween[0] = movePlatformsTween[0].call(() => {this.inputLocked = false;});
        movePlatformsTween.forEach(tween => {
            tween.start();
        });
    }
}