import SticksController from "../Stick/SticksController";

export default class InputHandler {
    private inputLocked: boolean = false;
    private inputStarted: boolean = false;

    constructor(private sticksController: SticksController, private callback: (stickLength: number) => void) {}

    public lockInput() {
        this.inputLocked = true;
    }

    public unlockInput() {
        this.inputLocked = false;
    }

    public onTouchStart() {
        if (this.inputLocked) return;
        this.sticksController.startGrowing();
        this.inputStarted = true;
    }

    public onTouchEnd() {
        if (this.inputLocked || !this.inputStarted) return;
        this.inputLocked = true;
        this.inputStarted = false;
        const stickLength = this.sticksController.stopGrowing();
        this.callback(stickLength);
    }
}