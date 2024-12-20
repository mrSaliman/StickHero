export default abstract class BaseView<T> extends cc.Component {
    protected _fieldSize: cc.Size = null;
    public set fieldSize(value: cc.Size) {
        this._fieldSize = value;
    }

    protected _bottomIndentPercent: number = 10;
    public set bottomIndentPercent(value: number) {
        this._bottomIndentPercent = value;
    }

    private _base: T = null;
    public get base(): T {
        return this._base;
    }

    init(base: T) {
        this._base = base;
        (this.base as any).dataChanged.on(() => this.onOriginDataChanged());
        this.onOriginDataChanged();
    }

    protected abstract onOriginDataChanged(): void;
}
