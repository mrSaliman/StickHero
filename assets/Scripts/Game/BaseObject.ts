import Delegate from "../Libs/Delegate/Delegate";
import IPoolable from "../Libs/ObjectPool/IPoolable";

export default abstract class BaseObject implements IPoolable {
    protected _dataChanged = new Delegate();
    public get dataChanged() {
        return this._dataChanged;
    }

    protected _position: cc.Vec2 = cc.Vec2.ZERO;
    public get position(): cc.Vec2 {
        return this._position;
    }
    public set position(value: cc.Vec2) {
        this._position = value;
        this._dataChanged.emit();
    }

    protected _isVisible: boolean = false;
    public get isVisible(): boolean {
        return this._isVisible;
    }
    public set isVisible(value: boolean) {
        this._isVisible = value;
        this._dataChanged.emit();
    }

    protected _width: number = 0;
    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
        this._dataChanged.emit();
    }

    abstract reset(): void;
}
