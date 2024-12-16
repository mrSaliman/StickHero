import BaseObject from "../BaseObject";

export default class Player extends BaseObject {
    private _isMirrored: boolean = false;
    public get isMirrored(): boolean {
        return this._isMirrored;
    }
    public set isMirrored(value: boolean) {
        this._isMirrored = value;
        this._dataChanged.emit();
    }

    reset() {
        this._position = cc.Vec2.ZERO;
        this._isMirrored = false;
        this._isVisible = false;
        this._dataChanged.emit();
    }
}
