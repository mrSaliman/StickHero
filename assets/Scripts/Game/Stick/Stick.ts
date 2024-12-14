import Delegate from "../../Libs/Delegate/Delegate";
import IPoolable from "../../Libs/ObjectPool/IPoolable";

export default class Stick implements IPoolable {
    private _dataChanged = new Delegate();
    public get dataChanged() {
        return this._dataChanged;
    }

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

    private _position: cc.Vec2 = cc.Vec2.ZERO;
    public get position(): cc.Vec2 {
        return this._position;
    }
    public set position(value: cc.Vec2) {
        this._position = value;
        this._dataChanged.emit();
    }

    private _isVisible: boolean = false;
    public get isVisible(): boolean {
        return this._isVisible;
    }
    public set isVisible(value: boolean) {
        this._isVisible = value;
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