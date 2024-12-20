import SticksController from "../Stick/SticksController";

export default class InputHandler {
    private stickInputLocked: boolean = false;
    private stickInputStarted: boolean = false;

    constructor(private sticksController: SticksController, private stickCallback: (stickLength: number) => void, private flipCallback: () => void) {}

    public lockStickInput() {
        this.stickInputLocked = true;
    }

    public unlockStickInput() {
        this.stickInputLocked = false;
    }

    public onTouchStart() {
        if (this.stickInputLocked) {
            this.flipCallback();
        }
        else {
            this.sticksController.startGrowing();
            this.stickInputStarted = true;
        }
    }

    public onTouchEnd() {
        if (this.stickInputLocked || !this.stickInputStarted) return;
        this.stickInputLocked = true;
        this.stickInputStarted = false;
        const stickLength = this.sticksController.stopGrowing();
        this.stickCallback(stickLength);
    }
}