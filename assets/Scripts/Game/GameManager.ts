import UserInput from "../Input/UserInput"
import { PlatformsController } from "./Platform/PlatformsController"

type ControllerStack = {
    platformsController: PlatformsController,
}

export class GameManager {
    constructor(input: UserInput) {
        input.TouchStarted.on(() => this.onTouchStart());
        input.TouchEnded.on(() => this.onTouchEnd());
    }

    private _controllers: ControllerStack = {
        platformsController: new PlatformsController(),
    }
    public get controllers(): ControllerStack {
        return this._controllers
    }

    public GameStart(){
        this._controllers.platformsController.reset();
    }

    onTouchStart(){
        
    }

    onTouchEnd(){
        this._controllers.platformsController.step();
    }
}