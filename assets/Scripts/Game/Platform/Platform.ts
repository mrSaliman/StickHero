import BaseObject from "../BaseObject";

export default class Platform extends BaseObject {
    
    private _perfectWidth: number = 0.01;
    public get perfectWidth(): number {
        return this._perfectWidth;
    }
    public set perfectWidth(value: number) {
        this._perfectWidth = value;
        this._dataChanged.emit();
    }

    private _showPerfectSpot: boolean;
    public get showPerfectSpot(): boolean {
        return this._showPerfectSpot;
    }
    public set showPerfectSpot(value: boolean) {
        this._showPerfectSpot = value;
        this._dataChanged.emit();
    }

    private _showPlusOne: boolean;
    public get showPlusOne(): boolean {
        return this._showPlusOne;
    }
    public set showPlusOne(value: boolean) {
        this._showPlusOne = value;
        this._dataChanged.emit();
    }

    reset(): void {
        this._isVisible = false;
        this._position = new cc.Vec2(1.5, 0);
        this._width = 0;
        this._perfectWidth = 0;
        this._showPerfectSpot = false;
        this._showPlusOne = false;
        this._dataChanged.emit();
    }

    setAllData(width: number, position: cc.Vec2, isVisible: boolean, 
        perfectWidth: number, showPerfectSpot: boolean, showPlusOne: boolean) {
        this._width = width;
        this._showPerfectSpot = showPerfectSpot;
        this._showPlusOne = showPlusOne;
        this._perfectWidth = perfectWidth;
        this._position = position;
        this._isVisible = isVisible;
        this._dataChanged.emit();
    }
}
