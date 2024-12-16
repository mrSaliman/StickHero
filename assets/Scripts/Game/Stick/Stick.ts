import BaseObject from "../BaseObject";

export default class Stick extends BaseObject {
    private _length: number = 0;
    public get length(): number {
        return this._length;
    }
    public set length(value: number) {
        this._length = value;
        this._dataChanged.emit();
    }

    private _rotation: number = 0;
    public get rotation(): number {
        return this._rotation;
    }
    public set rotation(value: number) {
        this._rotation = value;
        this._dataChanged.emit();
    }

    reset() {
        this._position = cc.Vec2.ZERO;
        this._rotation = 0;
        this._isVisible = false;
        this._length = 0;
        this._dataChanged.emit();
    }
}
