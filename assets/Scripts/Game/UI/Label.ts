import BaseObject from "../BaseObject";

export default class Label extends BaseObject {
    private _content: string = "";
    public get content(): string {
        return this._content;
    }
    public set content(value: string) {
        this._content = value;
        this._dataChanged.emit();
    }

    private _opacity: number = 0;
    public get opacity(): number {
        return this._opacity;
    }
    public set opacity(value: number) {
        this._opacity = value;
        this._dataChanged.emit();
    }

    reset() {
        this._content = "";
        this._opacity = 0;
        this._dataChanged.emit();
    }
}