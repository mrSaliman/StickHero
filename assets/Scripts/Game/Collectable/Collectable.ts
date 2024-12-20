import BaseObject from "../BaseObject";

export default class Collectable extends BaseObject {
    private _isMirrored: boolean = false;
    public get isMirrored(): boolean {
        return this._isMirrored;
    }
    public set isMirrored(value: boolean) {
        this._isMirrored = value;
        this._dataChanged.emit();
    }

    reset() {
        this._isMirrored = false;
        this._isVisible = false;
        this._dataChanged.emit();
    }

    setAllData(width: number, position: cc.Vec2, isVisible: boolean, isMirrored: boolean) {
        this._width = width;
        this._isMirrored = isMirrored;
        this._position = position;
        this._isVisible = isVisible;
        this._dataChanged.emit();
    }
}