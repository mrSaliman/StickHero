import BaseObject from "../BaseObject";

export default class Platform extends BaseObject {
    reset(): void {
        this._isVisible = false;
        this._position = new cc.Vec2(1.5, 0);
        this._width = 0;
        this._dataChanged.emit();
    }

    setAllData(width: number, position: cc.Vec2, isVisible: boolean) {
        this._width = width;
        this._position = position;
        this._isVisible = isVisible;
        this._dataChanged.emit();
    }
}
