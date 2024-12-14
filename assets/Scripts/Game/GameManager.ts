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

    private _controllers: ControllerStack = {
        platformsController: new PlatformsController(),
        sticksController: new SticksController(),
    }
    public get controllers(): ControllerStack {
        return this._controllers
    }

    public GameStart(){
        this._controllers.platformsController.reset();
        this._controllers.sticksController.startStickPosition = this._controllers.platformsController.platformEnd;
        this._controllers.sticksController.reset();
    }

    onTouchStart(){
        this._controllers.sticksController.startGrowing();
    }

    onTouchEnd(){
        let stickLength = this._controllers.sticksController.stopGrowing();
        let winDistRange = this._controllers.platformsController.winDistRange;
        if (stickLength >= winDistRange[0] && stickLength <= winDistRange[1]){
            this.step();
        }
        else {
            this.GameStart();
        }
    }

    step() {
        this._controllers.platformsController.step();
        this._controllers.sticksController.startStickPosition = this._controllers.platformsController.platformEnd;
        this._controllers.sticksController.step();
    }
}