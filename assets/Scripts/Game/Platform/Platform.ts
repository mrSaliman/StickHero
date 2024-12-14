import Delegate from "../../Libs/Delegate/Delegate";
import IPoolable from "../../Libs/ObjectPool/IPoolable";

export default class Platform implements IPoolable {
    private _width: number = 0;
    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
        this._dataChanged.emit();
    }
    private _position: cc.Vec2 = new cc.Vec2(1.5, 0);
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
    
    private _dataChanged = new Delegate();
    public get dataChanged() {
        return this._dataChanged;
    }

    reset(): void {
        this._isVisible = false;
        this._position = new cc.Vec2(1.5, 0);
        this._width = 0;
        this._dataChanged.emit();
    }

    setAllData(width: number, position: cc.Vec2, isVisible: boolean){
        this._width = width;
        this._position = position;
        this._isVisible = isVisible;
        this._dataChanged.emit();
    }
}